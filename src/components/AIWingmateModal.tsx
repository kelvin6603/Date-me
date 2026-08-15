import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  Lightbulb,
} from 'lucide-react';
import { UserProfile, Match } from '../types';

interface AIWingmateModalProps {
  currentUser: UserProfile;
  matches: Match[];
  onInsertToChat?: (matchId: string, text: string) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const AIWingmateModal: React.FC<AIWingmateModalProps> = ({
  currentUser,
  matches,
  onInsertToChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `👋 Hey ${currentUser.name}! I'm **Cupid's Wingmate**, your dedicated AI dating & passion coach on Kindred.\n\nWhether you need help asking someone on a first bouldering or coffee date, want advice on message banter, or want feedback on your profile prompts, I'm here to help! What's on your mind?`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(matches[0] || null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const PRESET_PROMPTS = [
    `How do I propose an easy, low-pressure first date around our shared hobby?`,
    `Give me 3 witty, charming openers for someone into specialty coffee & film photography.`,
    `What are great questions to ask during a pre-meet video call to check mutual chemistry?`,
    `How can I improve my bio to attract people who love outdoor climbing & board games?`,
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const newHistory: ChatMessage[] = [...messages, { role: 'user', content: textToSend.trim() }];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/wingmate-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          conversationHistory: messages,
          targetMatch: selectedMatch?.user,
          userProfile: currentUser,
        }),
      });

      const data = await response.json();
      setMessages([...newHistory, { role: 'model', content: data.reply || 'Here is some advice on your dating journey!' }]);
    } catch (err) {
      console.error('Error with AI Wingmate:', err);
      setMessages([
        ...newHistory,
        {
          role: 'model',
          content: `Here are 3 key principles for authentic hobby matchmaking:\n1. **Focus on the Craft**: Ask about their favorite gear, techniques, or recent projects.\n2. **Suggest an Activity Date**: Low pressure, high fun (e.g. coffee cupping or casual bouldering).\n3. **Stay Sincere**: Share what genuinely excites you!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini 3.7 Flash</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Dating & Passion Wingmate
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Get personalized banter suggestions, first date blueprints, and advice for authentic connections.
          </p>
        </div>

        {/* Target Match Selector */}
        {matches.length > 0 && (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium pl-1">Target Match:</span>
            <select
              value={selectedMatch?.id || ''}
              onChange={(e) => {
                const found = matches.find((m) => m.id === e.target.value);
                setSelectedMatch(found || null);
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-1 text-xs focus:outline-none focus:border-rose-500"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user.name} ({m.matchedHobby || m.sharedHobbies[0]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[600px] backdrop-blur-xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-none">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';

            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md relative group ${
                    isModel
                      ? 'bg-slate-950/80 text-slate-100 border border-slate-800'
                      : 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white rounded-br-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {isModel && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-amber-300 transition"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Advice</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isModel && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 border border-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Cupid's Wingmate is formulating advice...</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Prompt Buttons */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Try Asking:</span>
          </span>
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask for advice, date proposals, or message reviews..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:opacity-95 disabled:opacity-40 transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Wingmate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
