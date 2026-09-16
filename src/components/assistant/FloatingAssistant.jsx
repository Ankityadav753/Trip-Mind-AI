import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, CheckCircle2, ArrowRight, CornerDownLeft, Loader2, Bot, User, Cloud } from 'lucide-react';
import { askAssistant } from '../../services/travelPlannerService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useSavedTrips } from '../../hooks/useLocalStorage';
import { isUuid } from '../../services/tripService';
import {
  getOrCreateChatSession,
  saveChatMessage,
  loadTripChatHistory,
  saveLocalChatHistory
} from '../../services/chatService';

const QUICK_PROMPTS = [
  'Make Day 2 less hectic',
  'Make Day 1 cheaper',
  'Add rooftop evening drinks to Day 3',
  'Swap afternoon for local food market'
];

function getInitialGreeting(trip) {
  return {
    id: 'm-init',
    sender: 'ai',
    text: `Hello! I'm your TripMind AI Assistant. You can ask me to modify any day in your ${trip?.destination || 'trip'} itinerary—like "Make Day 2 less hectic", "Add more food stops", or "Make it cheaper". I'll draft the changes for your approval.`,
    proposal: null
  };
}

export default function FloatingAssistant({ trip, onApplyDayChanges }) {
  const { user } = useAuth();
  const { saveTrip } = useSavedTrips();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [messages, setMessages] = useState(() => [getInitialGreeting(trip)]);

  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  // Load chat history from Supabase (or localStorage fallback) when trip or user changes
  useEffect(() => {
    let isCancelled = false;

    async function initChatHistory() {
      setIsLoadingHistory(true);
      try {
        const { session, messages: loadedMessages, isCloud } = await loadTripChatHistory(trip?.id, user?.id);
        if (isCancelled) return;

        if (session) {
          setSessionId(session.id);
        } else {
          setSessionId(null);
        }
        setIsCloudSynced(isCloud);

        if (loadedMessages && loadedMessages.length > 0) {
          setMessages(loadedMessages);
        } else {
          setMessages([getInitialGreeting(trip)]);
        }
      } catch (err) {
        console.warn('TripMind AI: Chat history load error:', err);
        if (!isCancelled) {
          setMessages([getInitialGreeting(trip)]);
          setIsCloudSynced(false);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingHistory(false);
        }
      }
    }

    initChatHistory();

    return () => {
      isCancelled = true;
    };
  }, [trip?.id, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (userText) => {
    const textToSend = (userText || inputMessage).trim();
    if (!textToSend || isThinking) return;

    // Optimistically show user message in UI
    const tempUserMsgId = `m-usr-${Date.now()}`;
    const userMsg = {
      id: tempUserMsgId,
      sender: 'user',
      text: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    let activeSessionId = sessionId;

    // If authenticated, sync message to Supabase
    if (user?.id) {
      try {
        let currentTripId = trip?.id;

        // Ensure trip exists in Supabase public.trips
        if (!isUuid(currentTripId) && trip) {
          try {
            const savedTrip = await saveTrip(trip);
            if (savedTrip?.id) {
              currentTripId = savedTrip.id;
            }
          } catch (tripSaveErr) {
            console.warn('TripMind AI: Auto-save trip before chat warning:', tripSaveErr);
          }
        }

        if (isUuid(currentTripId)) {
          if (!activeSessionId) {
            const session = await getOrCreateChatSession(currentTripId, user.id);
            if (session) {
              activeSessionId = session.id;
              setSessionId(session.id);
              setIsCloudSynced(true);
            }
          }

          if (activeSessionId) {
            const savedMsg = await saveChatMessage(activeSessionId, {
              sender: 'user',
              text: textToSend
            });
            if (savedMsg?.id) {
              setMessages((prev) =>
                prev.map((m) => (m.id === tempUserMsgId ? savedMsg : m))
              );
            }
          }
        }
      } catch (cloudErr) {
        console.warn('TripMind AI: Cloud chat user message sync warning:', cloudErr);
      }
    } else {
      // Local fallback for unauthenticated users
      saveLocalChatHistory(trip?.id, [...messages, userMsg]);
    }

    try {
      const response = await askAssistant(textToSend, trip);
      if (response.success) {
        const aiMsgData = {
          sender: 'ai',
          text: response.explanation,
          proposal: response.proposedDay
            ? {
                actionDescription: response.actionDescription,
                targetDayNumber: response.targetDayNumber,
                proposedDay: response.proposedDay,
                isApplied: false
              }
            : null
        };

        if (user?.id && activeSessionId) {
          try {
            const savedAi = await saveChatMessage(activeSessionId, aiMsgData);
            if (savedAi) {
              setMessages((prev) => [...prev, savedAi]);
              return;
            }
          } catch (cloudAiErr) {
            console.warn('TripMind AI: Cloud chat AI response sync warning:', cloudAiErr);
          }
        }

        // Fallback in-memory/local update
        const localAiMsg = {
          id: `m-ai-${Date.now()}`,
          ...aiMsgData
        };
        setMessages((prev) => {
          const updated = [...prev, localAiMsg];
          if (!user?.id) saveLocalChatHistory(trip?.id, updated);
          return updated;
        });
      } else {
        const errMsgData = {
          sender: 'ai',
          text: response.message || "I couldn't process that adjustment. Try specifying a day like 'Make Day 1 cheaper'."
        };

        if (user?.id && activeSessionId) {
          try {
            const savedErr = await saveChatMessage(activeSessionId, errMsgData);
            if (savedErr) {
              setMessages((prev) => [...prev, savedErr]);
              return;
            }
          } catch (e) {
            console.warn(e);
          }
        }

        const localErrMsg = {
          id: `m-ai-err-${Date.now()}`,
          ...errMsgData
        };
        setMessages((prev) => {
          const updated = [...prev, localErrMsg];
          if (!user?.id) saveLocalChatHistory(trip?.id, updated);
          return updated;
        });
      }
    } catch (err) {
      const genericErrMsg = {
        id: `m-ai-err-${Date.now()}`,
        sender: 'ai',
        text: "Encountered an issue processing your request. Please try again."
      };
      setMessages((prev) => {
        const updated = [...prev, genericErrMsg];
        if (!user?.id) saveLocalChatHistory(trip?.id, updated);
        return updated;
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleApply = (msgIndex, proposal) => {
    if (!proposal || proposal.isApplied) return;

    onApplyDayChanges(proposal.targetDayNumber, proposal.proposedDay);

    // Mark applied in message
    setMessages((prev) => {
      const updated = [...prev];
      if (updated[msgIndex]?.proposal) {
        updated[msgIndex].proposal.isApplied = true;
      }
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Changes Applied!',
      message: `Day ${proposal.targetDayNumber} itinerary updated according to your AI request.`
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 text-white font-bold text-sm shadow-glow-teal hover:opacity-95 active:scale-95 transition-all"
          aria-label="Open Ask TripMind AI Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">Ask TripMind AI</span>
          <span className="sm:hidden">AI Assistant</span>
        </button>
      </div>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[520px] bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
          role="dialog"
          aria-label="Ask TripMind AI Chat"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 text-white flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-sky to-brand-teal flex items-center justify-center text-white shadow-glow-teal">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  <span>Ask TripMind AI</span>
                  {isCloudSynced ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                      <Cloud className="w-2.5 h-2.5" />
                      <span>Synced</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-teal/20 text-brand-teal font-semibold">
                      Interactive
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-300">
                  Refine & customize with natural language
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                <Loader2 className="w-5 h-5 animate-spin text-brand-teal" />
                <span className="text-[11px]">Loading chat history...</span>
              </div>
            ) : (
              messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-brand-teal text-white rounded-br-xs'
                      : 'bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-navy-800 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Proposed Changes Interactive Box */}
                  {msg.proposal && msg.proposal.proposedDay && (
                    <div className="mt-3 p-3 rounded-xl bg-white dark:bg-navy-900 border border-brand-teal/30 space-y-2">
                      <div className="text-[11px] font-bold text-brand-teal flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{msg.proposal.actionDescription}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {msg.proposal.proposedDay.activities?.length} Activities scheduled for Day {msg.proposal.targetDayNumber}
                      </div>

                      {msg.proposal.isApplied ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px] pt-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Applied to Itinerary!</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(idx, msg.proposal)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-brand-sky via-brand-teal to-teal-500 hover:opacity-95 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Apply Changes to Day {msg.proposal.targetDayNumber}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )))}

            {isThinking && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="italic">TripMind is reorganizing stops...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-navy-950/80 border-t border-slate-100 dark:border-navy-800/80 flex items-center gap-1.5 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isThinking}
                className="whitespace-nowrap text-[10px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-navy-900 hover:bg-brand-teal/15 hover:text-brand-teal text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g. Make Day 2 less hectic..."
              disabled={isThinking}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="p-2 rounded-xl bg-brand-teal text-white hover:opacity-90 disabled:opacity-40 transition-opacity shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
