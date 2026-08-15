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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('discover')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-50">Kindred</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hobby Match
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">Dating for passionate hobbyists</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-950/60 p-1.5 rounded-2xl border border-stone-800/80">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chats & Matches</span>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Hobby Events</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            <button
              onClick={() => setActiveTab('wingmate')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'wingmate'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Wingmate</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPassport}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              title="Kindred Passport & Perks"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Kindred Plus</span>
            </button>

            <button
              onClick={onOpenSafety}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition"
              title="Safety & Trust Center"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 p-1 pl-2 pr-3 rounded-full border transition ${
                activeTab === 'profile'
                  ? 'border-amber-500 bg-stone-800'
                  : 'border-stone-700 bg-stone-800/70 hover:border-stone-600'
              }`}
            >
              <img
                src={currentUser.photos[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <span className="text-xs font-medium text-stone-200 hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800 px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'discover' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`relative flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'chat' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Chat</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'events' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium">Events</span>
          </button>

          <button
            onClick={() => setActiveTab('wingmate')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'wingmate' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">AI Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 p-2 ${
              activeTab === 'profile' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
