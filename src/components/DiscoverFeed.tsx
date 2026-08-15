import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  X,
  Star,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageSquare,
  LayoutGrid,
  Layers,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, DiscoveryPreferences, HobbyTag } from '../types';

interface DiscoverFeedProps {
  profiles: UserProfile[];
  currentUser: UserProfile;
  preferences: DiscoveryPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<DiscoveryPreferences>>;
  onLike: (profile: UserProfile, isSuperLike?: boolean, icebreakerMessage?: string) => void;
  onPass: (profile: UserProfile) => void;
  onRewind: () => void;
  canRewind: boolean;
  onOpenIcebreakerModal: (profile: UserProfile, promptContext?: { question: string; answer: string }) => void;
  onOpenPreferencesModal: () => void;
  onSelectProfileDetails: (profile: UserProfile) => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({
  profiles,
  currentUser,
  preferences,
  setPreferences,
  onLike,
  onPass,
  onRewind,
  canRewind,
  onOpenIcebreakerModal,
  onOpenPreferencesModal,
  onSelectProfileDetails,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [selectedHobbyFilter, setSelectedHobbyFilter] = useState<string>('all');
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | 'up' | null>(null);

  // Filter profiles based on selected hobby pill
  const filteredProfiles = profiles.filter((p) => {
    if (selectedHobbyFilter === 'all') return true;
    return p.hobbies.some((h) => h.category === selectedHobbyFilter || h.id === selectedHobbyFilter);
  });

  const currentProfile = filteredProfiles[currentIndex];

  // Reset photo index when active profile changes
  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (viewMode !== 'card' || !currentProfile) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleLike();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSuperLike();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSelectProfileDetails(currentProfile);
      } else if (e.key === ' ') {
        e.preventDefault();
        nextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentProfile, viewMode, photoIndex]);

  const handleLike = () => {
    if (!currentProfile) return;
    onLike(currentProfile, false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;
    onLike(currentProfile, true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = () => {
    if (!currentProfile) return;
    onPass(currentProfile);
    setCurrentIndex((prev) => prev + 1);
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

  // Find shared hobbies with current user
  const getSharedHobbies = (target: UserProfile) => {
    const userHobbyNames = currentUser.hobbies.map((h) => h.name.toLowerCase());
    return target.hobbies.filter((h) => userHobbyNames.some((u) => u.includes(h.name.toLowerCase()) || h.name.toLowerCase().includes(u)));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Category Pills & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Hobby Categories Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setSelectedHobbyFilter('all'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'all'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            🔥 All Passions
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('outdoors'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'outdoors'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            🧗 Outdoors & Climbing
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('food_drink'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'food_drink'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            ☕ Coffee & Gastronomy
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('arts_crafts'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'arts_crafts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            📷 35mm & Ceramics
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('music_culture'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'music_culture'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            📻 Vinyl & Indie Books
          </button>
          <button
            onClick={() => { setSelectedHobbyFilter('gaming_tech'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedHobbyFilter === 'gaming_tech'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
            }`}
          >
            🎲 Euro Games & TTRPG
          </button>
        </div>

        {/* View Toggle & Filter Modal Button */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* Boost Button */}
          <button
            onClick={triggerBoost}
            disabled={isBoostActive}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isBoostActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-stone-800/80 text-amber-400 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{isBoostActive ? `Boosted (${boostTimer}s)` : 'Profile Spark'}</span>
          </button>

          {/* Grid / Stack Mode */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'card' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Card Swipe View"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Grid Browse View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Preferences Button */}
          <button
            onClick={onOpenPreferencesModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Discover Feed */}
      {filteredProfiles.length === 0 || currentIndex >= filteredProfiles.length ? (
        /* Empty State */
        <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-stone-900/50 border border-stone-800/80 rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-100 mb-2">You've explored all local hobbyists!</h3>
          <p className="text-sm text-stone-400 max-w-md mb-6">
            Adjust your discovery radius, expand your hobby filters, or check out upcoming community meetups.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { setCurrentIndex(0); setSelectedHobbyFilter('all'); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-medium text-sm shadow-md hover:opacity-95 transition"
            >
              Restart Discovery Deck
            </button>
            <button
              onClick={onOpenPreferencesModal}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-sm transition"
            >
              Expand Search Radius
            </button>
          </div>
        </div>
      ) : viewMode === 'card' ? (
        /* Card Swipe View */
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md h-[620px] select-none">
            {/* Background card preview */}
            {filteredProfiles[currentIndex + 1] && (
              <div className="absolute inset-0 top-3 scale-[0.96] opacity-60 bg-stone-900 rounded-3xl border border-stone-800 shadow-xl pointer-events-none overflow-hidden">
                <img
                  src={filteredProfiles[currentIndex + 1].photos[0]?.url}
                  alt="Next profile"
                  className="w-full h-full object-cover filter blur-[1px]"
                />
              </div>
            )}

            {/* Active Swipe Card */}
            <motion.div
              key={currentProfile.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDrag={(_, info) => {
                if (info.offset.x > 80) setDragDirection('right');
                else if (info.offset.x < -80) setDragDirection('left');
                else setDragDirection(null);
              }}
              onDragEnd={(_, info) => {
                setDragDirection(null);
                if (info.offset.x > 120) {
                  handleLike();
                } else if (info.offset.x < -120) {
                  handlePass();
                }
              }}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-stone-900 rounded-3xl border border-stone-800/90 shadow-2xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
            >
              {/* Photo Display Carousel */}
              <div className="relative w-full h-[380px] bg-stone-950">
                <img
                  src={currentProfile.photos[photoIndex]?.url || currentProfile.photos[0]?.url}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40" />

                {/* Photo indicator bar */}
                <div className="absolute top-3 inset-x-3 flex space-x-1.5 z-20">
                  {currentProfile.photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        idx === photoIndex ? 'bg-white shadow' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Left / Right click zones for photo navigation */}
                <div
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute inset-y-0 left-0 w-1/3 z-10 flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute inset-y-0 right-0 w-1/3 z-10 flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Photo Caption / Hobby Tag Badge */}
                {currentProfile.photos[photoIndex]?.hobbyTag && (
                  <div className="absolute top-6 left-3 z-20">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-medium border border-amber-500/30">
                      <span>🏷️ {currentProfile.photos[photoIndex]?.hobbyTag}</span>
                    </span>
                  </div>
                )}

                {/* Shared Passion Highlight Ribbon */}
                {getSharedHobbies(currentProfile).length > 0 && (
                  <div className="absolute top-6 right-3 z-20">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[11px] font-semibold shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>Shared: {getSharedHobbies(currentProfile)[0].name}</span>
                    </span>
                  </div>
                )}

                {/* Drag Indicator Overlay */}
                {dragDirection === 'right' && (
                  <div className="absolute inset-0 bg-rose-600/30 backdrop-blur-[2px] flex items-center justify-center z-30 pointer-events-none">
                    <div className="px-6 py-2 rounded-2xl bg-rose-600 text-white font-serif text-3xl font-bold border-2 border-white shadow-2xl rotate-12">
                      LIKE
                    </div>
                  </div>
                )}
                {dragDirection === 'left' && (
                  <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center z-30 pointer-events-none">
                    <div className="px-6 py-2 rounded-2xl bg-stone-800 text-stone-300 font-serif text-3xl font-bold border-2 border-stone-500 shadow-2xl -rotate-12">
                      PASS
                    </div>
                  </div>
                )}

                {/* Profile Header on Photo */}
                <div className="absolute bottom-3 inset-x-4 z-20">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                      {currentProfile.name}, {currentProfile.age}
                    </h2>
                    {currentProfile.verified && (
                      <span title="Selfie Verified Real Profile">
                        <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-stone-300 mt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>
                        {currentProfile.location.neighborhood} (~{currentProfile.location.distanceKm} km)
                      </span>
                    </span>
                    <span className="text-stone-500">•</span>
                    <span>{currentProfile.lookingFor}</span>
                  </div>
                </div>
              </div>

              {/* Card Details & Hobbies Section */}
              <div className="flex-1 p-4 overflow-y-auto bg-stone-900 scrollbar-none flex flex-col justify-between space-y-3">
                {/* Bio */}
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  "{currentProfile.bio}"
                </p>

                {/* Hobbies Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Core Passions & Gear
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentProfile.hobbies.map((hobby) => (
                      <span
                        key={hobby.id}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-stone-800 text-stone-200 border border-stone-700 text-[11px] font-medium"
                      >
                        <span>{hobby.icon}</span>
                        <span>{hobby.name}</span>
                        {hobby.skillLevel && (
                          <span className="text-[9px] text-amber-400 ml-1">({hobby.skillLevel})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Prompt with Direct Reply Button */}
                {currentProfile.prompts[0] && (
                  <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif italic text-amber-300/90 text-[11px]">
                        "{currentProfile.prompts[0].question}"
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenIcebreakerModal(currentProfile, currentProfile.prompts[0]);
                        }}
                        className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-semibold transition"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Spark Reply</span>
                      </button>
                    </div>
                    <p className="text-stone-200 text-xs leading-normal">
                      {currentProfile.prompts[0].answer}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Floating Buttons Bar */}
          <div className="flex items-center justify-center space-x-4 mt-6 z-30">
            {/* Rewind */}
            <button
              onClick={onRewind}
              disabled={!canRewind}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition shadow-lg ${
                canRewind
                  ? 'bg-stone-800 hover:bg-stone-700 text-amber-400 border-stone-700 active:scale-95'
                  : 'bg-stone-900/50 text-stone-600 border-stone-800 cursor-not-allowed'
              }`}
              title="Undo last swipe"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Pass (X) */}
            <button
              onClick={handlePass}
              className="w-14 h-14 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 border border-stone-700 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              title="Pass (Left Arrow)"
            >
              <X className="w-7 h-7" />
            </button>

            {/* AI Icebreaker / Spark Opener */}
            <button
              onClick={() => onOpenIcebreakerModal(currentProfile)}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all"
              title="Generate AI Icebreaker"
            >
              <Sparkles className="w-6 h-6" />
            </button>

            {/* Super Like / Star */}
            <button
              onClick={handleSuperLike}
              className="w-12 h-12 rounded-full bg-stone-800 hover:bg-stone-700 text-sky-400 border border-stone-700 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              title="Super Spark (Up Arrow)"
            >
              <Star className="w-6 h-6 fill-sky-400/20" />
            </button>

            {/* Like (Heart) */}
            <button
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-950/40 hover:scale-105 active:scale-90 transition-transform"
              title="Like (Right Arrow)"
            >
              <Heart className="w-8 h-8 fill-white" />
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-[11px] text-stone-500 mt-4 flex items-center space-x-2 hidden sm:flex">
            <span>Shortcut: ← Pass</span>
            <span>•</span>
            <span>→ Like</span>
            <span>•</span>
            <span>↑ Super Like</span>
            <span>•</span>
            <span>Space: Next photo</span>
          </p>
        </div>
      ) : (
        /* Grid Browse Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-lg hover:border-stone-700 transition flex flex-col group"
            >
              <div className="relative h-64 bg-stone-950">
                <img
                  src={profile.photos[0]?.url}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {profile.verified && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-sky-300 text-[10px] font-semibold border border-sky-500/30 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-sky-400" />
                      <span>Verified</span>
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 inset-x-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold text-white">
                      {profile.name}, {profile.age}
                    </h3>
                    <span className="text-xs text-stone-300">
                      {profile.location.neighborhood}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-stone-300 line-clamp-2">
                  {profile.bio}
                </p>

                <div className="flex flex-wrap gap-1">
                  {profile.hobbies.slice(0, 3).map((h) => (
                    <span
                      key={h.id}
                      className="px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 text-[10px] font-medium border border-stone-700"
                    >
                      {h.icon} {h.name}
                    </span>
                  ))}
                  {profile.hobbies.length > 3 && (
                    <span className="px-2 py-0.5 rounded-lg bg-stone-800 text-stone-400 text-[10px]">
                      +{profile.hobbies.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <button
                    onClick={() => onOpenIcebreakerModal(profile)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spark Opener</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPass(profile)}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition"
                      title="Pass"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLike(profile, false)}
                      className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition"
                      title="Like"
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
    </div>
  );
};
