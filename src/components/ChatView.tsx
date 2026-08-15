import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Video,
  Phone,
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
  Smile,
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
      // Simulate partner reading and typing
      const timeout = setTimeout(() => {
        setIsTyping(true);
        const replyTimeout = setTimeout(() => {
          setIsTyping(false);
          // Generate simulated contextual hobby response
          const simulatedReplies = [
            `I totally agree! That sounds like such a fun plan. When are you free this weekend?`,
            `Haha absolutely! I was actually just working on that earlier today!`,
            `Yes! Let's definitely do that. I know a great spot near ${currentMatch.user.location.neighborhood} we could check out.`,
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
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-5rem)] flex bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-2">
      {/* Left Sidebar: Matches & Conversation list */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-stone-800 flex flex-col bg-stone-950/70 ${activeMatchId && 'hidden md:flex'}`}>
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-100">Messages</h2>
            <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-xs font-semibold">
              {matches.length} Matches
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name or hobby..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* New Passion Matches Carousel */}
        <div className="p-3 border-b border-stone-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2 px-1">
            New Matches
          </span>
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMatchId(m.id)}
                className="flex flex-col items-center space-y-1 shrink-0 group focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={m.user.photos[0]?.url}
                    alt={m.user.name}
                    className={`w-14 h-14 rounded-full object-cover ring-2 transition ${
                      m.id === currentMatch?.id
                        ? 'ring-rose-500 scale-105'
                        : 'ring-stone-700 group-hover:ring-amber-500'
                    }`}
                  />
                  {m.unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-stone-950">
                      {m.unreadCount}
                    </span>
                  )}
                  {m.user.activeStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-950" />
                  )}
                </div>
                <span className="text-[11px] font-medium text-stone-300 truncate w-14 text-center">
                  {m.user.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-800/40">
          {filteredMatches.map((m) => {
            const isSelected = m.id === currentMatch?.id;
            const lastMsg = m.lastMessage;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMatchId(m.id)}
                className={`w-full p-3.5 flex items-start space-x-3 text-left transition ${
                  isSelected
                    ? 'bg-stone-800/80 border-l-4 border-rose-500'
                    : 'hover:bg-stone-900/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={m.user.photos[0]?.url}
                    alt={m.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {m.user.activeStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-stone-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-stone-100 truncate">
                        {m.user.name}
                      </span>
                      {m.user.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {lastMsg ? lastMsg.timestamp : m.matchedAt}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-medium truncate">
                      {m.matchedHobby || m.sharedHobbies[0]}
                    </span>
                  </div>

                  <p className={`text-xs truncate ${m.unreadCount > 0 ? 'text-white font-semibold' : 'text-stone-400'}`}>
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
        <div className={`flex-1 flex flex-col bg-stone-900 ${!activeMatchId && 'hidden md:flex'}`}>
          {/* Chat Header */}
          <div className="p-3.5 px-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/40 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveMatchId('')}
                className="md:hidden p-1 rounded-lg text-stone-400 hover:text-white"
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
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500/50"
                />
                {currentMatch.user.activeStatus === 'online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-stone-900" />
                )}
              </div>

              <div>
                <div
                  className="flex items-center space-x-1.5 cursor-pointer"
                  onClick={() => onOpenProfile(currentMatch.user)}
                >
                  <h3 className="font-serif text-base font-bold text-stone-100 hover:text-rose-400 transition">
                    {currentMatch.user.name}, {currentMatch.user.age}
                  </h3>
                  {currentMatch.user.verified && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  )}
                </div>
                <p className="text-[11px] text-stone-400 flex items-center space-x-1">
                  <span>{currentMatch.user.location.neighborhood}</span>
                  <span>•</span>
                  <span className="text-amber-400">{currentMatch.matchedHobby || 'Shared Passion'}</span>
                </p>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center space-x-2">
              {/* Google Maps Date Spot Finder */}
              <button
                onClick={() => onOpenDateSpotFinder(currentMatch)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition"
                title="Find local hobby date spots with Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Date Spot Planner</span>
              </button>

              {/* Pre-Meet Video Call */}
              <button
                onClick={() => onStartVideoCall(currentMatch)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition"
                title="Start a 10-Minute Pre-Meet Video Call"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Pre-Meet Call</span>
              </button>

              {/* Options Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showOptionsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onOpenProfile(currentMatch.user);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-stone-300 hover:bg-stone-800"
                    >
                      View Full Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onOpenReportModal(currentMatch.user);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-amber-400 hover:bg-stone-800 flex items-center space-x-2"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Report Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowOptionsDropdown(false);
                        onUnmatch(currentMatch.id);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-stone-800 flex items-center space-x-2"
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
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
            {/* Match Initiation Banner */}
            <div className="text-center py-4 space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 text-xs border border-stone-700">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>You matched on {currentMatch.matchedAt}</span>
              </div>
              <p className="text-[11px] text-stone-400">
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
                    className={`max-w-[78%] sm:max-w-[65%] rounded-2xl p-3 shadow-md ${
                      isMine
                        ? 'bg-gradient-to-tr from-rose-600 to-amber-600 text-white rounded-br-none'
                        : 'bg-stone-800 text-stone-100 rounded-bl-none border border-stone-700/80'
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
                                    : isMine ? 'bg-white/60' : 'bg-stone-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] opacity-80">{msg.text}</span>
                        </div>
                      </div>
                    ) : msg.isDateInvite && msg.dateDetails ? (
                      /* Date Invite Card */
                      <div className="space-y-2 py-1">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                          <Calendar className="w-4 h-4" />
                          <span>Hobby Date Invitation</span>
                        </div>
                        <h4 className="font-serif text-sm font-bold">{msg.dateDetails.title}</h4>
                        <p className="text-xs opacity-90">{msg.dateDetails.spotName}</p>
                        {msg.dateDetails.spotAddress && (
                          <p className="text-[11px] opacity-75">{msg.dateDetails.spotAddress}</p>
                        )}
                        <div className="flex items-center space-x-2 pt-1">
                          {msg.dateDetails.spotMapUrl && (
                            <a
                              href={msg.dateDetails.spotMapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] underline flex items-center space-x-1 hover:text-white"
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
                  <div className="flex items-center space-x-1 text-[10px] text-stone-500 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isMine && (
                      <span className="flex items-center">
                        <CheckCheck className={`w-3 h-3 ${msg.isRead ? 'text-sky-400' : 'text-stone-500'}`} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-stone-400 text-xs py-1">
                <img
                  src={currentMatch.user.photos[0]?.url}
                  alt={currentMatch.user.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="p-2.5 rounded-2xl bg-stone-800 border border-stone-700 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] text-stone-400">{currentMatch.user.name.split(' ')[0]} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Wingmate Reply Suggestions Bar */}
          {aiSuggestions.length > 0 && (
            <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
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
                  className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 whitespace-nowrap transition"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-stone-800 bg-stone-950/80 space-y-2">
            <div className="flex items-center space-x-2">
              {/* AI Wingmate Helper Button */}
              <button
                onClick={generateAiReplies}
                disabled={isLoadingAi}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
                title="AI Wingmate: Suggest clever reply"
              >
                <Sparkles className={`w-4 h-4 ${isLoadingAi && 'animate-spin'}`} />
              </button>

              {/* Date Spot Quick Insert */}
              <button
                onClick={() => onOpenDateSpotFinder(currentMatch)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition"
                title="Suggest a grounded hobby date location"
              >
                <MapPin className="w-4 h-4 text-rose-400" />
              </button>

              {/* Voice Note Button */}
              <button
                onClick={handleVoiceRecordToggle}
                className={`p-2 rounded-xl border transition ${
                  isRecordingVoice
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                }`}
                title={isRecordingVoice ? 'Stop and send voice note' : 'Record voice note'}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              {isRecordingVoice ? (
                <div className="flex-1 px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center justify-between animate-pulse">
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
                  className="flex-1 px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
                />
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white disabled:opacity-40 transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-8 text-stone-400">
          <p>Select a match to start chatting.</p>
        </div>
      )}
    </div>
  );
};
