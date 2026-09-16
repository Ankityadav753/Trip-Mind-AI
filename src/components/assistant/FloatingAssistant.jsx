import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, CheckCircle2, ArrowRight, CornerDownLeft, Loader2, Bot, User } from 'lucide-react';
import { askAssistant } from '../../services/travelPlannerService';
import { useToast } from '../../hooks/useToast';

const QUICK_PROMPTS = [
  'Make Day 2 less hectic',
  'Make Day 1 cheaper',
  'Add rooftop evening drinks to Day 3',
  'Swap afternoon for local food market'
];

export default function FloatingAssistant({ trip, onApplyDayChanges }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Hello! I'm your TripMind AI Assistant. You can ask me to modify any day in your ${trip?.destination || 'trip'} itinerary—like "Make Day 2 less hectic", "Add more food stops", or "Make it cheaper". I'll draft the changes for your approval.`,
      proposal: null
    }
  ]);
  const messagesEndRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async (userText) => {
    const textToSend = (userText || inputMessage).trim();
    if (!textToSend || isThinking) return;

    // Add user message
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const response = await askAssistant(textToSend, trip);
      if (response.success) {
        const aiMsg = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: response.explanation,
          proposal: {
            actionDescription: response.actionDescription,
            targetDayNumber: response.targetDayNumber,
            proposedDay: response.proposedDay,
            isApplied: false
          }
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-ai-err-${Date.now()}`,
            sender: 'ai',
            text: response.message || "I couldn't process that adjustment. Try specifying a day like 'Make Day 1 cheaper'."
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Encountered an issue processing your request. Please try again."
        }
      ]);
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
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-teal/20 text-brand-teal font-semibold">
                    Interactive
                  </span>
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
            {messages.map((msg, idx) => (
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
                  {msg.proposal && (
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
            ))}

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
