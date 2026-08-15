import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  Zap,
  Heart,
  X,
} from 'lucide-react';
import { HobbyEvent, UserProfile } from '../types';

interface HobbyEventsViewProps {
  events: HobbyEvent[];
  currentUser: UserProfile;
  onToggleRsvp: (eventId: string) => void;
  onMatchFromEvent: (attendee: any, eventHobby: string) => void;
}

export const HobbyEventsView: React.FC<HobbyEventsViewProps> = ({
  events,
  currentUser,
  onToggleRsvp,
  onMatchFromEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpeedDatingEvent, setActiveSpeedDatingEvent] = useState<HobbyEvent | null>(null);
  const [speedDatingRound, setSpeedDatingRound] = useState(1);
  const [roundSeconds, setRoundSeconds] = useState(180);
  const [speedDatingDone, setSpeedDatingDone] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const startSpeedDating = (event: HobbyEvent) => {
    setActiveSpeedDatingEvent(event);
    setSpeedDatingRound(1);
    setRoundSeconds(180);
    setSpeedDatingDone(false);
  };

  const handleNextSpeedRound = (likedAttendee?: any) => {
    if (likedAttendee && activeSpeedDatingEvent) {
      onMatchFromEvent(likedAttendee, activeSpeedDatingEvent.hobby);
    }

    if (!activeSpeedDatingEvent) return;
    if (speedDatingRound < activeSpeedDatingEvent.attendees.length) {
      setSpeedDatingRound((prev) => prev + 1);
      setRoundSeconds(180);
    } else {
      setSpeedDatingDone(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Hobby Huddles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hobby Meetups & Speed Sparks
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Meet other singles in person through authentic group tastings, bouldering sessions, and maker workshops.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Meetups
          </button>
          <button
            onClick={() => setSelectedCategory('food_drink')}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'food_drink'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ☕ Coffee & Food
          </button>
          <button
            onClick={() => setSelectedCategory('outdoors')}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'outdoors'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            🧗 Bouldering & Outdoors
          </button>
          <button
            onClick={() => setSelectedCategory('arts_crafts')}
            className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'arts_crafts'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            📷 35mm & Ceramics
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900/90 border border-slate-800 rounded-[32px] overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            {/* Event Banner Image */}
            <div className="relative h-52 bg-slate-950">
              <img
                src={evt.image}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
                  {evt.hobby}
                </span>
              </div>

              {evt.speedDatingSession?.active && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-md flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Speed Spark Mini-Rounds</span>
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 inset-x-5">
                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  {evt.title}
                </h3>
              </div>
            </div>

            {/* Event Info Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
                <div className="flex items-center space-x-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">{evt.date}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">{evt.time}</span>
                </div>
                <div className="col-span-2 flex items-center justify-between bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate font-semibold">{evt.locationName} ({evt.neighborhood})</span>
                  </div>
                  {evt.mapUrl && (
                    <a
                      href={evt.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-amber-300 font-semibold hover:underline shrink-0 ml-2 flex items-center space-x-0.5"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              {/* Attendees Roster */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.attendeesCount} Singles Going:</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {evt.attendees.map((att) => (
                    <div key={att.id} className="relative group" title={`${att.name}, ${att.age}`}>
                      <img
                        src={att.photo}
                        alt={att.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 hover:ring-rose-500 transition"
                      />
                      {att.verified && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-sky-400 rounded-full border border-slate-900" />
                      )}
                    </div>
                  ))}
                  <span className="text-xs text-slate-500 font-bold pl-1">
                    +{evt.attendeesCount - evt.attendees.length} more
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {/* RSVP Button */}
                <button
                  onClick={() => onToggleRsvp(evt.id)}
                  className={`w-full sm:flex-1 py-3 px-5 rounded-2xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                    evt.userRsvp
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {evt.userRsvp ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <span>RSVP to Meetup</span>
                  )}
                </button>

                {/* Speed Dating Trigger */}
                {evt.speedDatingSession?.active && (
                  <button
                    onClick={() => startSpeedDating(evt)}
                    className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-1.5 transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Join 3-Min Speed Rounds</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speed Dating Interactive Modal */}
      {activeSpeedDatingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] p-6 sm:p-8 text-slate-100 shadow-2xl overflow-hidden flex flex-col items-center text-center">
            {/* Close */}
            <button
              onClick={() => setActiveSpeedDatingEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!speedDatingDone ? (
              <>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Speed Match Round {speedDatingRound} of {activeSpeedDatingEvent.attendees.length}</span>
                </div>

                <h3 className="text-2xl font-extrabold mb-1 text-white">
                  {activeSpeedDatingEvent.hobby} Speed Match
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  You have 3 minutes to vibe check with each other over your shared passion!
                </p>

                {/* Active Attendee Profile Card */}
                {activeSpeedDatingEvent.attendees[speedDatingRound - 1] && (
                  <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-6 flex flex-col items-center">
                    <img
                      src={activeSpeedDatingEvent.attendees[speedDatingRound - 1].photo}
                      alt={activeSpeedDatingEvent.attendees[speedDatingRound - 1].name}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-rose-500/30 mb-3"
                    />
                    <h4 className="text-lg font-bold text-white">
                      {activeSpeedDatingEvent.attendees[speedDatingRound - 1].name},{' '}
                      {activeSpeedDatingEvent.attendees[speedDatingRound - 1].age}
                    </h4>
                    <span className="text-xs text-amber-300 font-semibold mb-2">
                      Attending {activeSpeedDatingEvent.hobby} Meetup
                    </span>

                    <div className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 mt-2">
                      <span className="font-bold text-rose-400 block mb-1">Round Icebreaker Question:</span>
                      "What is your dream project or next milestone with {activeSpeedDatingEvent.hobby}?"
                    </div>
                  </div>
                )}

                {/* Round Actions */}
                <div className="flex items-center space-x-4 w-full">
                  <button
                    onClick={() => handleNextSpeedRound()}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                  >
                    Next Round (Pass)
                  </button>
                  <button
                    onClick={() =>
                      handleNextSpeedRound(activeSpeedDatingEvent.attendees[speedDatingRound - 1])
                    }
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-1.5 hover:opacity-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Spark & Match!</span>
                  </button>
                </div>
              </>
            ) : (
              /* Session Complete */
              <div className="py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Speed Rounds Complete!</h3>
                <p className="text-xs text-slate-300 max-w-sm mb-6">
                  Any mutual sparks have been added to your Connections tab so you can coordinate meeting at the event!
                </p>
                <button
                  onClick={() => setActiveSpeedDatingEvent(null)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25"
                >
                  Back to Meetups
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
