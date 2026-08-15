import React from 'react';
import { Flame, MessageCircle, Calendar, Sparkles, User, ShieldCheck, Heart, Crown } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'discover' | 'chat' | 'events' | 'wingmate' | 'profile';
  setActiveTab: (tab: 'discover' | 'chat' | 'events' | 'wingmate' | 'profile') => void;
  unreadCount: number;
  currentUser: UserProfile;
  onOpenPassport: () => void;
  onOpenSafety: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  currentUser,
  onOpenPassport,
  onOpenSafety,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Identity */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => setActiveTab('discover')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  KINDRED
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Curated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Hobby-Driven Matchmaking
              </p>
            </div>
          </div>

          {/* Centered Segmented Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`relative flex items-center space-x-2 px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connections</span>
              {unreadCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Meetups & Sparks</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('wingmate')}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === 'wingmate'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Wingmate</span>
            </button>
          </nav>

          {/* Right Action Tools & Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPassport}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              title="Kindred Plus Membership"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Kindred Plus</span>
            </button>

            <button
              onClick={onOpenSafety}
              className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title="Safety & Trust Center"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition ${
                activeTab === 'profile'
                  ? 'border-rose-500 bg-slate-900 shadow-sm'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5">
                <img
                  src={currentUser.photos[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Navigation Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-slate-950/90 backdrop-blur-2xl border border-slate-800/90 rounded-full px-5 py-2.5 shadow-2xl shadow-black/80">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'discover' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px]">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`relative flex flex-col items-center space-y-1 transition ${
              activeTab === 'chat' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px]">Matches</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'events' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Events</span>
          </button>

          <button
            onClick={() => setActiveTab('wingmate')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'wingmate' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px]">AI Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 transition ${
              activeTab === 'profile' ? 'text-rose-400 font-bold scale-105' : 'text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
