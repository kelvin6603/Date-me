import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Video,
  MoreVertical,
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Play,
  Pause,
  Heart,
  CheckCheck,
  Calendar,
  ExternalLink,
  ShieldAlert,
  UserX,
  Search,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { Match, Message, UserProfile } from '../types';

interface ChatViewProps {
  matches: Match[];
  messages: Record<string, Message[]>;
  activeMatchId: string | null;
  setActiveMatchId: (matchId: string) => void;
  currentUser: UserProfile;
  onSendMessage: (matchId: string, text: string, isVoice?: boolean, dateDetails?: any) => void;
  onStartVideoCall: (match: Match) => void;
  onOpenDateSpotFinder: (match: Match) => void;
  onOpenReportModal: (targetUser: UserProfile) => void;
  onUnmatch: (matchId: string) => void;
  onOpenProfile: (profile: UserProfile) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  matches,
  messages,
  activeMatchId,
  setActiveMatchId,
  currentUser,
  onSendMessage,
  onStartVideoCall,
  onOpenDateSpotFinder,
  onOpenReportModal,
  onUnmatch,
  onOpenProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  const currentMatch = matches.find((m) => m.id === activeMatchId) || matches[0];
  const activeMessages = (currentMatch ? messages[currentMatch.id] : []) || [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping]);

  // Simulate typing response when user sends a message
  useEffect(() => {
    if (!currentMatch) return;
    const lastMsg = activeMessages[activeMessages.length - 1];
    if (lastMsg && lastMsg.senderId === currentUser.id) {
      const timeout = setTimeout(() => {
        setIsTyping(true);
        const replyTimeout = setTimeout(() => {
          setIsTyping(false);
          const simulatedReplies = [
            `I totally agree! That sounds like such a great plan. When are you free this week?`,
            `Haha absolutely! I was actually just working on that earlier today!`,
            `Yes! Let's definitely do that. I know a wonderful spot near ${currentMatch.user.location.neighborhood} we could check out.`,
            `That's so cool! You have great taste in ${currentMatch.matchedHobby || 'hobbies'} 👌`,
          ];
          const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];
          onSendMessage(currentMatch.id, randomReply);
        }, 3500);
        return () => clearTimeout(replyTimeout);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [activeMessages.length]);

  const handleSend = () => {
    if (!inputText.trim() || !currentMatch) return;
    onSendMessage(currentMatch.id, inputText.trim());
    setInputText('');
    setAiSuggestions([]);
  };

  const handleVoiceRecordToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      clearInterval(recordingTimerRef.current);
      if (recordingSeconds >= 1 && currentMatch) {
        onSendMessage(
          currentMatch.id,
          `Voice note (${recordingSeconds}s)`,
          true,
          undefined
        );
      }
      setRecordingSeconds(0);
    }
  };

  const generateAiReplies = async () => {
    if (!currentMatch) return;
    setIsLoadingAi(true);
    try {
      const lastMatchMessage = [...activeMessages].reverse().find((m) => m.senderId !== currentUser.id);
      const res = await fetch('/api/ai/icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProfile: currentMatch.user,
          userProfile: currentUser,
          specificHobby: currentMatch.matchedHobby,
          specificPrompt: lastMatchMessage ? { question: 'Last message received', answer: lastMatchMessage.text } : undefined,
        }),
      });
      const data = await res.json();
      if (data.icebreakers) {
        setAiSuggestions(data.icebreakers.map((b: any) => b.text));
      }
    } catch (e) {
      setAiSuggestions([
        `That sounds awesome! What's your favorite spot in the neighborhood for that?`,
        `Would love to hear more about your setup! Are you free for a quick coffee date this week?`,
        `Haha no way! I've been wanting to try that for so long!`,
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sharedHobbies.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-6rem)] flex bg-slate-900/90 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl my-2 backdrop-blur-xl">
      {/* Left Sidebar: Connections List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-800 flex flex-col bg-slate-950/70 ${activeMatchId && 'hidden md:flex'}`}>
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Connections</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold border border-rose-500/20">
              {matches.length} Matches
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name or hobby..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
            />
          </div>
        </div>

        {/* New Mutual Sparks Carousel */}
        <div className="p-4 border-b border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
            New Sparks
          </span>
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMatchId(m.id)}
                className="flex flex-col items-center space-y-1 shrink-0 group focus:outline-none"
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full p-0.5 transition ${
                    m.id === currentMatch?.id
                      ? 'bg-gradient-to-tr from-rose-500 to-amber-500 scale-105 shadow-md shadow-rose-500/20'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}>
                    <img
                      src={m.user.photos[0]?.url}
                      alt={m.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {m.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 rounded-full text-white text-[9px] font-black flex items-center justify-center border-2 border-slate-950">
                      {m.unreadCount}
                    </span>
                  )}
                  {m.user.activeStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-300 truncate w-14 text-center">
                  {m.user.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredMatches.map((m) => {
            const isSelected = m.id === currentMatch?.id;
            const lastMsg = m.lastMessage;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMatchId(m.id)}
                className={`w-full p-4 flex items-start space-x-3 text-left transition ${
                  isSelected
                    ? 'bg-slate-900 border-l-4 border-rose-500'
                    : 'hover:bg-slate-900/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={m.user.photos[0]?.url}
                    alt={m.user.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  {m.user.activeStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-white truncate">
                        {m.user.name}
                      </span>
                      {m.user.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {lastMsg ? lastMsg.timestamp : m.matchedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20 truncate">
                      {m.matchedHobby || m.sharedHobbies[0]}
                    </span>
                  </div>

                  <p className={`text-xs truncate ${m.unreadCount > 0 ? 'text-white font-bold' : 'text-slate-400'}`}>
                    {lastMsg ? lastMsg.text : 'Start the conversation!'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      {currentMatch ? (
        <div className={`flex-1 flex flex-col bg-slate-900/95 ${!activeMatchId && 'hidden md:flex'}`}>
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center space-x-3.5">
              <button
                onClick={() => setActiveMatchId('')}
                className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div
                className="relative cursor-pointer"
                onClick={() => onOpenProfile(currentMatch.user)}
              >
                <img
                  src={currentMatch.user.photos[0]?.url}
                  alt={currentMatch.user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
                />
                {currentMatch.user.activeStatus === 'online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
                )}
              </div>

              <div>
                <div
                  className="flex items-center space-x-1.5 cursor-pointer"
                  onClick={() => onOpenProfile(currentMatch.user)}
                >
                  <h3 className="text-sm sm:text-base font-bold text-white hover:text-rose-400 transition">
                    {currentMatch.user.name}, {currentMatch.user.age}
                  </h3>
                  {currentMatch.user.verified && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <span>{currentMatch.user.location.neighborhood}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">{currentMatch.matchedHobby || 'Shared Passion'}</span>
                </p>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center space-x-2">
              {/* Date Spot Finder */}
              <button
                onClick={() => onOpenDateSpotFinder(currentMatch)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                title="Find local hobby date spots"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Date Spot</span>
              </button>

              {/* Pre-Meet Video Call */}
              <button
                onClick={() => onStartVideoCall(currentMatch)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
                title="Start a 10-Minute Pre-Meet Video Call"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Video Call</span>
              </button>

              {/* Options Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showOptionsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-1.5 z-30 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onOpenProfile(currentMatch.user);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-900"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onOpenReportModal(currentMatch.user);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-amber-400 hover:bg-slate-900 flex items-center space-x-2"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onUnmatch(currentMatch.id);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-slate-900 flex items-center space-x-2"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Unmatch</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 scrollbar-none">
            {/* Match Initiation Banner */}
            <div className="text-center py-4 space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-slate-950/60 text-slate-200 text-xs border border-slate-800 font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Connected on {currentMatch.matchedAt}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Both of you are passionate about {currentMatch.sharedHobbies.join(', ')}
              </p>
            </div>

            {/* Message Bubbles */}
            {activeMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-[65%] rounded-2xl p-3.5 shadow-md ${
                      isMine
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-br-none shadow-rose-500/10'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80'
                    }`}
                  >
                    {/* Voice note message type */}
                    {msg.isVoiceNote ? (
                      <div className="flex items-center space-x-3 py-1">
                        <button
                          onClick={() => setPlayingVoiceId(playingVoiceId === msg.id ? null : msg.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isMine ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center space-x-0.5 h-6">
                            {[12, 24, 16, 32, 20, 28, 14, 26, 18, 30, 15, 22].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: `${h}px` }}
                                className={`w-1 rounded-full ${
                                  playingVoiceId === msg.id
                                    ? 'bg-white animate-pulse'
                                    : isMine ? 'bg-white/60' : 'bg-slate-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] opacity-90">{msg.text}</span>
                        </div>
                      </div>
                    ) : msg.isDateInvite && msg.dateDetails ? (
                      /* Date Invite Card */
                      <div className="space-y-2 py-1">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-200">
                          <Calendar className="w-4 h-4" />
                          <span>Hobby Date Invitation</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{msg.dateDetails.title}</h4>
                        <p className="text-xs opacity-95">{msg.dateDetails.spotName}</p>
                        {msg.dateDetails.spotAddress && (
                          <p className="text-[11px] opacity-80">{msg.dateDetails.spotAddress}</p>
                        )}
                        <div className="flex items-center space-x-2 pt-1">
                          {msg.dateDetails.spotMapUrl && (
                            <a
                              href={msg.dateDetails.spotMapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] underline flex items-center space-x-1 font-semibold hover:opacity-90"
                            >
                              <span>View on Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Regular Text Message */
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                  </div>

                  {/* Message Meta / Read status */}
                  <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isMine && (
                      <span className="flex items-center">
                        <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-sky-400' : 'text-slate-500'}`} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
                <img
                  src={currentMatch.user.photos[0]?.url}
                  alt={currentMatch.user.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] text-slate-400">{currentMatch.user.name.split(' ')[0]} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Wingmate Reply Suggestions Bar */}
          {aiSuggestions.length > 0 && (
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Suggestions:</span>
              </span>
              {aiSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(suggestion);
                    setAiSuggestions([]);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 whitespace-nowrap transition"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 space-y-2">
            <div className="flex items-center space-x-2">
              {/* AI Wingmate Helper Button */}
              <button
                onClick={generateAiReplies}
                disabled={isLoadingAi}
                className="p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
                title="AI Wingmate: Suggest clever reply"
              >
                <Sparkles className={`w-4 h-4 ${isLoadingAi && 'animate-spin'}`} />
              </button>

              {/* Date Spot Quick Insert */}
              <button
                onClick={() => onOpenDateSpotFinder(currentMatch)}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Suggest a grounded hobby date location"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
              </button>

              {/* Voice Note Button */}
              <button
                onClick={handleVoiceRecordToggle}
                className={`p-2.5 rounded-2xl border transition ${
                  isRecordingVoice
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
                title={isRecordingVoice ? 'Stop and send voice note' : 'Record voice note'}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              {isRecordingVoice ? (
                <div className="flex-1 px-4 py-2.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center justify-between animate-pulse">
                  <span>Recording voice note... ({recordingSeconds}s)</span>
                  <span className="text-[10px] text-rose-300">Tap mic to send</span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={`Message ${currentMatch.user.name.split(' ')[0]} about ${currentMatch.matchedHobby || 'hobbies'}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                />
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold disabled:opacity-40 transition shadow-lg shadow-rose-500/25 hover:opacity-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-8 text-slate-400">
          <p>Select a connection to start chatting.</p>
        </div>
      )}
    </div>
  );
};
