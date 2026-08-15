import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  X,
  Star,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Send,
  LayoutGrid,
  Layers,
  Zap,
  CheckCircle2,
  Video,
  Calendar,
  Flag,
  MessageCircle,
} from 'lucide-react';
import { UserProfile, Match } from '../types';

interface DiscoverFeedProps {
  profiles: UserProfile[];
  currentUser: UserProfile;
  matches?: Match[];
  onLike: (profile: UserProfile, specificHobby?: string) => void;
  onPass: (profile: UserProfile) => void;
  onSuperlike: (profile: UserProfile) => void;
  onSelectMatch?: (matchId: string) => void;
  onOpenEvents?: () => void;
  onOpenDateSpotFinder?: (profile: UserProfile) => void;
  onStartVideoCall?: (profile: UserProfile) => void;
  onReportProfile?: (profile: UserProfile) => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  profiles,
  currentUser,
  matches = [],
  onLike,
  onPass,
  onSuperlike,
  onSelectMatch,
  onOpenEvents,
  onOpenDateSpotFinder,
  onStartVideoCall,
  onReportProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [selectedHobbyFilter, setSelectedHobbyFilter] = useState<string>('all');
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);

  // Icebreaker modal state
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);
  const [activeIcebreakerProfile, setActiveIcebreakerProfile] = useState<UserProfile | null>(null);
  const [icebreakerText, setIcebreakerText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Filter profiles based on selected hobby category
  const filteredProfiles = profiles.filter((p) => {
    if (selectedHobbyFilter === 'all') return true;
    return p.hobbies.some((h) => h.category === selectedHobbyFilter || h.id === selectedHobbyFilter);
  });

  const currentProfile = filteredProfiles[currentIndex];

  // Reset photo index when current profile changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (!currentProfile) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleLike();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSuperlike();
      } else if (e.key === ' ') {
        e.preventDefault();
        nextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentProfile, photoIndex]);

  const handleLike = (specificHobby?: string) => {
    if (!currentProfile) return;
    onLike(currentProfile, specificHobby);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = () => {
    if (!currentProfile) return;
    onPass(currentProfile);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSuperlike = () => {
    if (!currentProfile) return;
    onSuperlike(currentProfile);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextPhoto = () => {
    if (!currentProfile) return;
    if (photoIndex < currentProfile.photos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const prevPhoto = () => {
    if (!currentProfile) return;
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    } else {
      setPhotoIndex(currentProfile.photos.length - 1);
    }
  };

  const triggerBoost = () => {
    setIsBoostActive(true);
    setBoostTimer(30);
    const interval = setInterval(() => {
      setBoostTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBoostActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const openIcebreaker = (profile: UserProfile, hobbyHint?: string) => {
    setActiveIcebreakerProfile(profile);
    const targetHobby = hobbyHint || profile.hobbies[0]?.name || 'shared passions';
    setIcebreakerText(`Hey ${profile.name.split(' ')[0]}! I saw your interest in ${targetHobby}—what got you started with it?`);
    setShowIcebreakerModal(true);
  };

  const generateSmartOpener = async () => {
    if (!activeIcebreakerProfile) return;
    setIsGeneratingAi(true);
    try {
      const topHobby = activeIcebreakerProfile.hobbies[0]?.name || 'Specialty Coffee';
      const promptQ = activeIcebreakerProfile.prompts[0]?.question || 'ideal weekend';
      const openers = [
        `Hey ${activeIcebreakerProfile.name.split(' ')[0]}! I noticed you enjoy ${topHobby}. Do you have a favorite local spot around ${activeIcebreakerProfile.location.neighborhood}?`,
        `Your prompt about "${promptQ}" caught my eye! What's been your favorite milestone with it recently?`,
        `Hi ${activeIcebreakerProfile.name.split(' ')[0]}! Always great to meet a fellow ${topHobby} enthusiast. Are you free to grab coffee and chat about it sometime this week?`,
      ];
      const randomOpener = openers[Math.floor(Math.random() * openers.length)];
      setIcebreakerText(randomOpener);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const sendIcebreakerAndConnect = () => {
    if (!activeIcebreakerProfile) return;
    onLike(activeIcebreakerProfile, activeIcebreakerProfile.hobbies[0]?.name);
    setShowIcebreakerModal(false);
    if (currentProfile?.id === activeIcebreakerProfile.id) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const getSharedHobbies = (target: UserProfile) => {
    const userHobbyNames = currentUser.hobbies.map((h) => h.name.toLowerCase());
    return target.hobbies.filter((h) =>
      userHobbyNames.some((u) => u.includes(h.name.toLowerCase()) || h.name.toLowerCase().includes(u))
    );
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Category Pills & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Professional Category Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { setSelectedHobbyFilter('all'); setCurrentIndex(0); }}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedHobbyFilter === 'all'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ✦ All Passions
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('food_drink'); setCurrentIndex(0); }}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedHobbyFilter === 'food_drink'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ☕ Specialty Coffee & Dining
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('outdoors'); setCurrentIndex(0); }}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedHobbyFilter === 'outdoors'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            🧗 Bouldering & Outdoors
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('arts_crafts'); setCurrentIndex(0); }}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedHobbyFilter === 'arts_crafts'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            📷 35mm & Ceramics
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('music_culture'); setCurrentIndex(0); }}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedHobbyFilter === 'music_culture'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            📻 Vinyl & Culture
          </button>
        </div>

        {/* View Mode & Boost Action */}
        <div className="flex items-center space-x-2.5 self-end md:self-auto">
          {/* Boost Button */}
          <button
            onClick={triggerBoost}
            disabled={isBoostActive}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
              isBoostActive
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
                : 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>{isBoostActive ? `Boost Active (${boostTimer}s)` : 'Spark Boost'}</span>
          </button>

          {/* Segmented View Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                viewMode === 'card'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full Profile Showcase"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Card Deck</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Catalog Directory"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Discover Showcase */}
      {filteredProfiles.length === 0 || currentIndex >= filteredProfiles.length ? (
        /* Empty Deck State */
        <div className="min-h-[520px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 border border-slate-800/80 rounded-[32px] shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">You've explored all local hobbyists</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Expand your hobby filters, check upcoming community group meetups, or restart discovery deck.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { setCurrentIndex(0); setSelectedHobbyFilter('all'); }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs shadow-xl shadow-rose-500/25 hover:opacity-95 transition"
            >
              Restart Discovery Deck
            </button>
            {onOpenEvents && (
              <button
                onClick={onOpenEvents}
                className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              >
                Browse Hobby Meetups
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'card' ? (
        /* Unified Profile Card Experience */
        <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
          {/* Main Integrated Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-[36px] overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Top Large Photo Carousel Banner */}
            <div className="relative h-[440px] sm:h-[520px] bg-slate-950 group">
              <img
                src={currentProfile.photos[photoIndex]?.url || currentProfile.photos[0]?.url}
                alt={currentProfile.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/30 to-black/40" />

              {/* Photo Progress Indicators */}
              <div className="absolute top-5 inset-x-6 flex items-center justify-between z-20">
                <div className="flex space-x-1.5 flex-1 max-w-xs">
                  {currentProfile.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        idx === photoIndex
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-md'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Badges & Report */}
                <div className="flex items-center space-x-2">
                  {currentProfile.verified && (
                    <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-sky-400 border border-sky-500/30 text-xs font-semibold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Verified Hobbyist</span>
                    </span>
                  )}
                  {onReportProfile && (
                    <button
                      onClick={() => onReportProfile(currentProfile)}
                      className="p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
                      title="Safety & Report"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Left / Right Photo Arrows */}
              <button
                onClick={prevPhoto}
                className="absolute inset-y-0 left-0 w-20 z-15 flex items-center justify-start pl-4 opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <span className="p-2.5 rounded-full bg-slate-950/75 text-white backdrop-blur-md border border-slate-700 shadow-lg hover:scale-110 transition">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              </button>
              <button
                onClick={nextPhoto}
                className="absolute inset-y-0 right-0 w-20 z-15 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <span className="p-2.5 rounded-full bg-slate-950/75 text-white backdrop-blur-md border border-slate-700 shadow-lg hover:scale-110 transition">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </button>

              {/* Identity & Header Overlay on photo */}
              <div className="absolute bottom-5 inset-x-6 sm:inset-x-8 z-20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                  <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
                    Active Nearby
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    • {currentProfile.location.neighborhood} (~{currentProfile.location.distanceKm} km away)
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {currentProfile.name}, <span className="text-slate-300 font-medium">{currentProfile.age}</span>
                  </h1>
                  <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    {getSharedHobbies(currentProfile).length > 0 ? '94% Passion Match' : '88% Match'}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 font-medium mt-1">
                  {currentProfile.occupation} • {currentProfile.gender} ({currentProfile.orientation})
                </p>
              </div>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Bio Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About Me
                </h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Passions & Shared Crafts */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Passions & Activities
                  </h3>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    Tap a hobby to spark a tailored opener
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {currentProfile.hobbies.map((hobby) => (
                    <button
                      key={hobby.id}
                      onClick={() => openIcebreaker(currentProfile, hobby.name)}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-rose-500/10 rounded-2xl border border-slate-800 hover:border-rose-500/40 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center space-x-2 cursor-pointer shadow-sm group"
                    >
                      <span className="text-base">{hobby.icon}</span>
                      <span>{hobby.name}</span>
                      {hobby.skillLevel && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                          {hobby.skillLevel}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Story / Prompt Q&A Cards */}
              {currentProfile.prompts && currentProfile.prompts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Conversation Prompts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentProfile.prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 flex flex-col justify-between space-y-2 shadow-inner"
                      >
                        <div>
                          <p className="text-xs font-bold text-amber-300 mb-1">
                            "{prompt.question}"
                          </p>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {prompt.answer}
                          </p>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => openIcebreaker(currentProfile, prompt.question)}
                            className="flex items-center space-x-1 text-xs font-bold text-rose-400 hover:underline"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Spark Reply</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Spot & Pre-Meet Shortcuts */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {onOpenDateSpotFinder && (
                    <button
                      onClick={() => onOpenDateSpotFinder(currentProfile)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-semibold transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Find Local Date Spots</span>
                    </button>
                  )}
                  {onStartVideoCall && (
                    <button
                      onClick={() => onStartVideoCall(currentProfile)}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-800 text-xs font-semibold transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>10-Min Pre-Meet Video</span>
                    </button>
                  )}
                </div>

                {onOpenEvents && (
                  <button
                    onClick={onOpenEvents}
                    className="flex items-center space-x-1.5 text-xs text-amber-300 font-semibold hover:underline"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>See community meetups in {currentProfile.location.neighborhood}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Action Controls Dock */}
          <div className="flex items-center justify-center space-x-4 py-2">
            <button
              onClick={handleRewind}
              disabled={currentIndex === 0}
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition shadow-lg ${
                currentIndex > 0
                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700 active:scale-95'
                  : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
              title="Undo last swipe"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handlePass}
              className="w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-xl active:scale-90 transition-transform"
              title="Pass (Left Arrow)"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={() => openIcebreaker(currentProfile)}
              className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              title="Spark AI Opener"
            >
              <Sparkles className="w-6 h-6" />
            </button>

            <button
              onClick={handleSuperlike}
              className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 flex items-center justify-center shadow-xl active:scale-90 transition-transform"
              title="Super Spark (Up Arrow)"
            >
              <Star className="w-6 h-6 fill-sky-400/20" />
            </button>

            <button
              onClick={() => handleLike()}
              className="w-18 h-18 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-rose-500/30 hover:opacity-95 active:scale-90 transition-transform"
              title="Connect (Right Arrow)"
            >
              <Heart className="w-9 h-9 fill-white" />
            </button>
          </div>
        </div>
      ) : (
        /* Catalog Directory Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-slate-900 rounded-[28px] border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col group"
            >
              <div className="relative h-64 bg-slate-950">
                <img
                  src={profile.photos[0]?.url}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {profile.verified && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-sky-400 text-[10px] font-bold border border-sky-500/30 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 inset-x-4">
                  <h3 className="text-xl font-bold text-white">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {profile.location.neighborhood} • {profile.occupation}
                  </p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2">
                  {profile.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {profile.hobbies.slice(0, 3).map((h) => (
                    <span
                      key={h.id}
                      className="px-2.5 py-1 rounded-xl bg-slate-950/60 text-slate-200 text-[11px] font-semibold border border-slate-800"
                    >
                      {h.icon} {h.name}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => openIcebreaker(profile)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spark Opener</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPass(profile)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="Pass"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLike(profile)}
                      className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-md hover:opacity-95 transition"
                      title="Connect"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Passion Icebreaker Modal */}
      {showIcebreakerModal && activeIcebreakerProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 rounded-[32px] border border-slate-800 w-full max-w-lg p-6 sm:p-8 shadow-2xl relative flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Spark Opener for {activeIcebreakerProfile.name.split(' ')[0]}
                  </h3>
                  <p className="text-xs text-slate-400">Contextual hobby icebreaker message</p>
                </div>
              </div>
              <button
                onClick={() => setShowIcebreakerModal(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Message Prompt
                </label>
                <button
                  onClick={generateSmartOpener}
                  disabled={isGeneratingAi}
                  className="flex items-center space-x-1 text-xs text-rose-400 hover:underline font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isGeneratingAi ? 'Generating...' : 'AI Rewrite'}</span>
                </button>
              </div>
              <textarea
                value={icebreakerText}
                onChange={(e) => setIcebreakerText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                placeholder="Type your authentic hobby greeting..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowIcebreakerModal(false)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={sendIcebreakerAndConnect}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-rose-500/25 hover:opacity-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send & Connect</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
