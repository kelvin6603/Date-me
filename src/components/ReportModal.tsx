import React, { useState } from 'react';
import { ShieldAlert, X, Check, AlertTriangle, UserX } from 'lucide-react';
import { UserProfile } from '../types';

interface ReportModalProps {
  targetUser: UserProfile;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string, blockUser: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetUser,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('Fake profile / Catfish');
  const [details, setDetails] = useState('');
  const [blockUser, setBlockUser] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const REASONS = [
    'Fake profile / Photos do not match',
    'Harassment or inappropriate message',
    'Commercial spam or self-promotion',
    'Safety concern / Harassment',
    'Underage user',
    'Other reason',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitReport(reason, details, blockUser);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Report {targetUser.name}</h3>
                <p className="text-xs text-stone-400">Your report is 100% anonymous & confidential</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                Reason for report
              </label>
              <div className="space-y-1.5">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      reason === r
                        ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-rose-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserX className="w-4 h-4 text-stone-400" />
                <span className="text-xs text-stone-300">Also block this user permanently</span>
              </div>
              <input
                type="checkbox"
                checked={blockUser}
                onChange={(e) => setBlockUser(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-lg"
            >
              Submit Report & Protect Community
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold">Report Received</h4>
            <p className="text-xs text-stone-400">
              Thank you for keeping Kindred safe. The member has been reported to our moderation team and blocked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
