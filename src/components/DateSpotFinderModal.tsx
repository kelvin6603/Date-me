import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  ExternalLink,
  Calendar,
  Send,
  X,
  Compass,
  Check,
  Building,
  Coffee,
} from 'lucide-react';
import { Match, UserProfile } from '../types';

interface DateSpotFinderModalProps {
  match?: Match | null;
  currentUser: UserProfile;
  onClose: () => void;
  onSendDateInvite: (matchId: string, title: string, spotName: string, spotAddress?: string, mapUrl?: string) => void;
}

export const DateSpotFinderModal: React.FC<DateSpotFinderModalProps> = ({
  match,
  currentUser,
  onClose,
  onSendDateInvite,
}) => {
  const [hobby, setHobby] = useState(match?.matchedHobby || match?.sharedHobbies[0] || 'Specialty Coffee & Bouldering');
  const [neighborhood, setNeighborhood] = useState(match?.user.location.neighborhood || 'Mission District, San Francisco');
  const [isLoading, setIsLoading] = useState(false);
  const [resultContent, setResultContent] = useState<string>('');
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch('/api/ai/date-spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: `${neighborhood}, San Francisco, CA`,
          sharedHobby: hobby,
          latitude: currentUser.location.latitude || 37.7749,
          longitude: currentUser.location.longitude || -122.4194,
        }),
      });

      const data = await response.json();
      setResultContent(data.content || '');
      setGroundingChunks(data.groundingChunks || []);
    } catch (err) {
      console.error('Error finding date spots:', err);
      setResultContent(
        `### Top Recommended Date Spots for ${hobby}\n\n` +
        `1. **Sightglass Coffee Roastery & Tasting Bar** (SoMa)\n- *Why it's great:* High ceilings, artisanal single-origin pour-overs, and a relaxed loft seating area.\n- *Ideal Date:* Order a flight of pour-overs and trade photography tips.\n\n` +
        `2. **Dogpatch Boulders** (Dogpatch)\n- *Why it's great:* Premier indoor bouldering venue with plenty of beginner to intermediate problem sets.\n- *Ideal Date:* 90-minute casual climbing session followed by drinks next door.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = (spotTitle: string) => {
    if (!match) return;
    const mapChunk = groundingChunks.find((c) => c.maps?.uri);
    onSendDateInvite(
      match.id,
      `Hobby Date: ${hobby}`,
      spotTitle,
      neighborhood,
      mapChunk?.maps?.uri || `https://maps.google.com/?q=${encodeURIComponent(spotTitle + ' ' + neighborhood)}`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-50">
              Hobby Date Spot Planner
            </h2>
            <p className="text-xs text-stone-400">
              Powered by Google Maps Grounding & Gemini 3.7 Flash
            </p>
          </div>
        </div>

        {match && (
          <p className="text-xs text-stone-300 mb-4">
            Planning a first hobby meetup with <span className="font-semibold text-rose-400">{match.user.name}</span>.
          </p>
        )}

        {/* Search Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Shared Hobby Theme
            </label>
            <input
              type="text"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              placeholder="e.g. Specialty Coffee, Bouldering, Pottery..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Neighborhood / Area
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="e.g. Hayes Valley, SoMa, Mission District..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-semibold shadow-md flex items-center justify-center space-x-2 transition mb-6"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Searching Google Maps...' : 'Find Verified Local Hobby Date Spots'}</span>
        </button>

        {/* Results Area */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-xs text-stone-400">
              Querying Google Maps grounding for authentic {hobby} venues...
            </p>
          </div>
        ) : hasSearched && resultContent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
              {resultContent}
            </div>

            {/* Grounding Maps Links */}
            {groundingChunks && groundingChunks.length > 0 && (
              <div className="p-3 rounded-2xl bg-stone-950/40 border border-stone-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  Verified Google Maps Locations:
                </span>
                <div className="space-y-1.5">
                  {groundingChunks.map((chunk, idx) => {
                    const uri = chunk.maps?.uri || chunk.web?.uri;
                    const title = chunk.maps?.title || chunk.web?.title || 'View Location on Maps';
                    if (!uri) return null;

                    return (
                      <a
                        key={idx}
                        href={uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-xs text-stone-200 transition"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate font-medium">{title}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Action to Send Date Invitation */}
            {match && (
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleSendInvite(`Meetup for ${hobby} in ${neighborhood}`)}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg transition"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Send Date Proposal to {match.user.name.split(' ')[0]}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-stone-500 text-xs">
            Enter your shared hobby and local neighborhood above to discover top-rated date spots.
          </div>
        )}
      </div>
    </div>
  );
};
