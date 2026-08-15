import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, Send, MapPin, X, Heart, Coffee } from 'lucide-react';
import { UserProfile, Match } from '../types';

interface MatchCelebrationModalProps {
  match: Match;
  currentUser: UserProfile;
  onClose: () => void;
  onSendMessage: (matchId: string, text: string) => void;
  onOpenChat: (match: Match) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  match,
  currentUser,
  onClose,
  onSendMessage,
  onOpenChat,
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [icebreakers, setIcebreakers] = useState<Array<{ type: string; text: string; hobby: string }>>([]);
  const [isLoadingIcebreakers, setIsLoadingIcebreakers] = useState(true);

  // Trigger confetti burst on open
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#ec4899', '#f97316', '#38bdf8'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }

    // Fetch AI-generated icebreaker options
    const fetchIcebreakers = async () => {
      try {
        const res = await fetch('/api/ai/icebreaker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetProfile: match.user,
            userProfile: currentUser,
            specificHobby: match.matchedHobby || match.sharedHobbies[0],
          }),
        });
        const data = await res.json();
        if (data.icebreakers) {
          setIcebreakers(data.icebreakers);
        }
      } catch (err) {
        console.error('Error fetching icebreakers:', err);
        setIcebreakers([
          {
            type: 'Curious & Deep',
            text: `Hey ${match.user.name}! I love that we both share a passion for ${match.matchedHobby || 'our hobbies'}. How long have you been at it?`,
            hobby: match.matchedHobby || 'Hobby',
          },
          {
            type: 'Activity & Date Invite',
            text: `Would love to trade notes on ${match.matchedHobby || 'coffee'} over an easy casual meetup sometime!`,
            hobby: match.matchedHobby || 'Meetup',
          },
        ]);
      } finally {
        setIsLoadingIcebreakers(false);
      }
    };

    fetchIcebreakers();
  }, [match]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || customMessage;
    if (!text.trim()) return;
    onSendMessage(match.id, text.trim());
    onOpenChat(match);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Mutual Passion Match</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          It's a Kindred Match!
        </h2>
        <p className="text-stone-300 text-sm max-w-sm mb-6">
          You and <span className="font-semibold text-rose-400">{match.user.name}</span> both share a love for{' '}
          <span className="font-semibold text-amber-300">
            {match.matchedHobby || match.sharedHobbies.join(' & ') || 'similar hobbies'}
          </span>
          .
        </p>

        {/* Connecting Avatars */}
        <div className="flex items-center justify-center -space-x-4 mb-6 relative">
          <div className="relative">
            <img
              src={currentUser.photos[0]?.url}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-stone-900 border-2 border-amber-500 shadow-xl"
            />
            <span className="absolute bottom-0 right-0 p-1 rounded-full bg-amber-500 text-white text-[10px] shadow">
              You
            </span>
          </div>

          {/* Center Heart Icon */}
          <div className="z-10 w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center ring-4 ring-stone-900 shadow-lg animate-bounce">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>

          <div className="relative">
            <img
              src={match.user.photos[0]?.url}
              alt={match.user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-stone-900 border-2 border-rose-500 shadow-xl"
            />
            <span className="absolute bottom-0 left-0 p-1 rounded-full bg-rose-500 text-white text-[10px] shadow">
              {match.user.name.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* AI Icebreaker Quick Select */}
        <div className="w-full space-y-3 mb-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Wingmate Openers (1-Click Send):</span>
            </span>
          </div>

          {isLoadingIcebreakers ? (
            <div className="space-y-2">
              <div className="h-12 bg-stone-800/60 rounded-2xl animate-pulse" />
              <div className="h-12 bg-stone-800/60 rounded-2xl animate-pulse" />
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {icebreakers.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.text)}
                  className="w-full p-3 rounded-2xl bg-stone-800/70 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 text-left transition group flex items-start justify-between space-x-2"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                      {item.type}
                    </span>
                    <p className="text-xs text-stone-200 group-hover:text-white leading-relaxed">
                      "{item.text}"
                    </p>
                  </div>
                  <span className="p-1 rounded-lg bg-stone-700 group-hover:bg-rose-500 text-stone-300 group-hover:text-white transition shrink-0 mt-1">
                    <Send className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Message Input */}
        <div className="w-full flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={`Say something about ${match.matchedHobby || 'their passions'}...`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!customMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-medium text-xs shadow-md hover:opacity-95 disabled:opacity-50 transition flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

        {/* Keep Browsing */}
        <button
          onClick={onClose}
          className="text-xs text-stone-400 hover:text-stone-200 transition py-1"
        >
          Keep browsing profiles
        </button>
      </div>
    </div>
  );
};
