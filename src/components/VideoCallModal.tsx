import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import { Match, UserProfile } from '../types';

interface VideoCallModalProps {
  match: Match;
  currentUser: UserProfile;
  onClose: () => void;
  onEndCall: () => void;
  onOpenReport: (target: UserProfile) => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  match,
  currentUser,
  onClose,
  onEndCall,
  onOpenReport,
}) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeIcebreaker, setActiveIcebreaker] = useState<string>(
    `What got you into ${match.matchedHobby || match.sharedHobbies[0] || 'your favorite hobby'} in the first place?`
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const ICEBREAKER_QUESTIONS = [
    `What's the most gear-obsessed purchase you've made for ${match.matchedHobby || 'your hobby'}?`,
    `If we planned an impromptu Saturday hobby date, what would the first hour look like?`,
    `What's a hobby you've always wanted to try but were intimidated by?`,
    `What is your absolute holy grail coffee, record, or route?`,
    `Tell me about your favorite local neighborhood spot that nobody talks about.`,
  ];

  // Call timer (10 minute limit with countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request user camera stream for self view
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then((s) => {
        stream = s;
        setHasCameraPermission(true);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.warn('Camera/Mic permission not available or denied:', err);
        setHasCameraPermission(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const formatTimer = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const nextIcebreaker = () => {
    const nextQ = ICEBREAKER_QUESTIONS[Math.floor(Math.random() * ICEBREAKER_QUESTIONS.length)];
    setActiveIcebreaker(nextQ);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[750px] bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Top Floating Bar */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
          {/* Match Info & Safety Badge */}
          <div className="flex items-center space-x-2.5 p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-stone-800 pointer-events-auto">
            <img
              src={match.user.photos[0]?.url}
              alt={match.user.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500"
            />
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-white">{match.user.name}</span>
                {match.user.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <span className="text-[10px] text-amber-300">
                Pre-Meet Vibe Check • {match.matchedHobby || 'Shared Passion'}
              </span>
            </div>
          </div>

          {/* Safe Call 10-Min Timer */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-stone-200 text-xs font-semibold pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
            <span className="text-stone-500">/ 10:00</span>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative flex-1 w-full bg-stone-900 overflow-hidden flex items-center justify-center">
          {/* Partner Video Stream */}
          <div className="relative w-full h-full">
            <img
              src={match.user.photos[0]?.url}
              alt={match.user.name}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

            {/* Subtle live indicator on partner stream */}
            <div className="absolute bottom-20 left-4 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-stone-300 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{match.user.name.split(' ')[0]}'s audio is active</span>
            </div>
          </div>

          {/* User Self View PiP Window */}
          <div className="absolute top-16 right-4 w-28 h-40 sm:w-36 sm:h-48 rounded-2xl bg-stone-800 border-2 border-stone-700 shadow-2xl overflow-hidden z-20">
            {hasCameraPermission && !isVideoOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-stone-900 text-stone-400">
                <img
                  src={currentUser.photos[0]?.url}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover mb-1 opacity-70"
                />
                <span className="text-[9px]">Camera {isVideoOff ? 'Off' : 'Preview'}</span>
              </div>
            )}
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white">
              You
            </span>
          </div>

          {/* Interactive Icebreaker Flashcard Overlay */}
          <div className="absolute bottom-20 inset-x-4 max-w-lg mx-auto z-20">
            <div className="p-3 sm:p-4 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-start justify-between space-x-3">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Call Icebreaker Prompt</span>
                </span>
                <p className="text-xs sm:text-sm font-medium text-stone-100 leading-snug">
                  "{activeIcebreaker}"
                </p>
              </div>
              <button
                onClick={nextIcebreaker}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition shrink-0"
                title="Next Icebreaker Question"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-stone-950/90 border-t border-stone-800 z-30 flex items-center justify-center space-x-4 sm:space-x-6">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-3.5 rounded-full border transition ${
              isMicMuted
                ? 'bg-rose-600/20 text-rose-400 border-rose-500'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
            title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-full border transition ${
              isVideoOff
                ? 'bg-rose-600/20 text-rose-400 border-rose-500'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Sound Mute */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-3.5 rounded-full border transition ${
              isAudioMuted
                ? 'bg-rose-600/20 text-rose-400 border-rose-500'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
            title={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              onEndCall();
              onClose();
            }}
            className="px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-rose-950/50 transition active:scale-95"
            title="End Pre-Meet Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">End Vibe Check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
