import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Copy, Check, Share2, Download, Printer, ExternalLink } from 'lucide-react';
import { getShareableUrl, exportTripAsJSON, triggerPrint } from '../../utils/exportHelpers';
import { useToast } from '../../hooks/useToast';

export default function ShareModal({ isOpen, onClose, trip }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  if (!trip) return null;

  const shareUrl = getShareableUrl(trip);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Link Copied!',
      message: 'Shareable itinerary URL copied to your clipboard.'
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    exportTripAsJSON(trip);
    addToast({
      type: 'success',
      title: 'Itinerary Downloaded',
      message: 'JSON file saved to your device.'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share & Export Itinerary">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Shareable Web Link
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Anyone with this link can view this complete personalized itinerary.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2.5 text-xs font-mono rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-brand-teal text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-navy-800 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Export Options
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadJSON}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 hover:border-brand-teal/50 text-left flex items-center gap-3 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Download JSON</div>
                <div className="text-[11px] text-slate-400">Export structured data file</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                setTimeout(() => triggerPrint(), 300);
              }}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 hover:border-brand-teal/50 text-left flex items-center gap-3 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Print / Save PDF</div>
                <div className="text-[11px] text-slate-400">Clean print-friendly layout</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
