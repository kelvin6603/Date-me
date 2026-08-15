/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoverFeed } from './components/DiscoverFeed';
import { ChatView } from './components/ChatView';
import { HobbyEventsView } from './components/HobbyEventsView';
import { AIWingmateModal } from './components/AIWingmateModal';
import { DateSpotFinderModal } from './components/DateSpotFinderModal';
import { VideoCallModal } from './components/VideoCallModal';
import { MatchCelebrationModal } from './components/MatchCelebrationModal';
import { ProfileEditorModal } from './components/ProfileEditorModal';
import { ReportModal } from './components/ReportModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import {
  CURRENT_USER,
  DISCOVERY_PROFILES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  COMMUNITY_HOBBY_EVENTS,
} from './data/mockProfiles';
import { UserProfile, Match, Message, HobbyEvent } from './types';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'events' | 'wingmate'>('discover');

  // Core App State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kindred_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('kindred_profiles');
    return saved ? JSON.parse(saved) : DISCOVERY_PROFILES;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('kindred_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('kindred_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [events, setEvents] = useState<HobbyEvent[]>(() => {
    const saved = localStorage.getItem('kindred_events');
    return saved ? JSON.parse(saved) : COMMUNITY_HOBBY_EVENTS;
  });

  // Modal & Overlay states
  const [activeCelebrationMatch, setActiveCelebrationMatch] = useState<Match | null>(null);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(INITIAL_MATCHES[0]?.id || null);
  const [activeVideoCallMatch, setActiveVideoCallMatch] = useState<Match | null>(null);
  const [dateSpotModalMatch, setDateSpotModalMatch] = useState<Match | null>(null);
  const [showDateSpotPlanner, setShowDateSpotPlanner] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [reportTargetUser, setReportTargetUser] = useState<UserProfile | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('kindred_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kindred_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('kindred_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('kindred_events', JSON.stringify(events));
  }, [events]);

  // Handle User Like on Discover Card
  const handleLikeProfile = (profile: UserProfile, specificHobby?: string) => {
    const sharedHobbyName = specificHobby || profile.hobbies[0]?.name || 'Specialty Coffee';
    const newMatchId = `match_${profile.id}_${Date.now()}`;

    const newMatch: Match = {
      id: newMatchId,
      user: profile,
      matchedAt: 'Just now',
      matchedHobby: sharedHobbyName,
      sharedHobbies: profile.hobbies.map((h) => h.name),
      unreadCount: 0,
      lastMessage: {
        id: `msg_init_${Date.now()}`,
        matchId: newMatchId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: `Hey ${profile.name.split(' ')[0]}! Excited to connect over ${sharedHobbyName}.`,
        timestamp: 'Just now',
        isRead: false,
      },
    };

    setMatches((prev) => [newMatch, ...prev]);

    // Initialize conversation history
    setMessages((prev) => ({
      ...prev,
      [newMatch.id]: [newMatch.lastMessage!],
    }));

    // Trigger Celebration Modal
    setActiveCelebrationMatch(newMatch);

    // Remove profile from discover feed stack
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  // Handle Pass
  const handlePassProfile = (profile: UserProfile) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  // Handle Superlike
  const handleSuperlikeProfile = (profile: UserProfile) => {
    handleLikeProfile(profile);
  };

  // Handle Sending Messages in Chat
  const handleSendMessage = (
    matchId: string,
    text: string,
    isVoice = false,
    dateDetails?: any
  ) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      isVoiceNote: isVoice,
      isDateInvite: !!dateDetails,
      dateDetails,
    };

    setMessages((prev) => {
      const currentList = prev[matchId] || [];
      return {
        ...prev,
        [matchId]: [...currentList, newMessage],
      };
    });

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              lastMessage: newMessage,
              unreadCount: 0,
            }
          : m
      )
    );
  };

  // Send Date Invite from Google Maps Planner
  const handleSendDateInvite = (
    matchId: string,
    title: string,
    spotName: string,
    spotAddress?: string,
    mapUrl?: string
  ) => {
    handleSendMessage(
      matchId,
      `📅 Proposed a hobby meetup: ${title} at ${spotName}`,
      false,
      {
        title,
        spotName,
        spotAddress,
        spotMapUrl: mapUrl,
        time: 'This Weekend at 2:00 PM',
        hobbyType: title,
        status: 'pending',
      }
    );
  };

  // Toggle Event RSVP
  const handleToggleEventRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const newRsvp = !evt.userRsvp;
          return {
            ...evt,
            userRsvp: newRsvp,
            attendeesCount: newRsvp ? evt.attendeesCount + 1 : evt.attendeesCount - 1,
          };
        }
        return evt;
      })
    );
  };

  // Match from speed dating session
  const handleMatchFromEvent = (attendee: any, eventHobby: string) => {
    const matchedProfile: UserProfile = {
      id: attendee.id,
      name: attendee.name,
      age: attendee.age,
      gender: 'non-binary',
      orientation: 'Queer',
      lookingFor: 'Hobby Partner + Romance',
      verified: attendee.verified || true,
      location: {
        city: 'San Francisco, CA',
        neighborhood: 'Mission District',
        distanceKm: 2.0,
      },
      distanceFuzzing: true,
      bio: `Met at the ${eventHobby} meetup! Passionate about craft, community, and sharing great moments.`,
      occupation: 'Hobbyist & Maker',
      photos: [
        {
          id: `att_${attendee.id}`,
          url: attendee.photo,
          caption: eventHobby,
          hobbyTag: eventHobby,
        },
      ],
      hobbies: [
        {
          id: `h_${eventHobby.toLowerCase()}`,
          name: eventHobby,
          category: 'outdoors',
          icon: '✨',
          skillLevel: 'Dedicated Passion',
        },
      ],
      prompts: [
        {
          id: 'p_event',
          question: 'My ideal first hobby date...',
          answer: `Exploring more around ${eventHobby} followed by great food!`,
        },
      ],
      badges: ['🛡️ Verified Hobbyist', '⚡ Speed Match'],
      activeStatus: 'online',
    };

    handleLikeProfile(matchedProfile, eventHobby);
  };

  // Unmatch
  const handleUnmatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    if (activeChatMatchId === matchId) {
      setActiveChatMatchId(matches.find((m) => m.id !== matchId)?.id || null);
    }
  };

  // Report & Block
  const handleReportUser = (reason: string, details: string, blockUser: boolean) => {
    if (reportTargetUser && blockUser) {
      setProfiles((prev) => prev.filter((p) => p.id !== reportTargetUser.id));
      setMatches((prev) => prev.filter((m) => m.user.id !== reportTargetUser.id));
    }
  };

  const totalUnreadMessages = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0F17] bg-ambient-mesh text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans antialiased">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab === 'matches' ? 'chat' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'chat') setActiveTab('matches');
          else if (tab === 'profile') setShowProfileEditor(true);
          else setActiveTab(tab);
        }}
        unreadCount={totalUnreadMessages}
        currentUser={currentUser}
        onOpenPassport={() => {}}
        onOpenSafety={() => {}}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-start">
        {activeTab === 'discover' && (
          <DiscoverFeed
            profiles={profiles}
            currentUser={currentUser}
            matches={matches}
            onLike={handleLikeProfile}
            onPass={handlePassProfile}
            onSuperlike={handleSuperlikeProfile}
            onSelectMatch={(matchId) => {
              setActiveChatMatchId(matchId);
              setActiveTab('matches');
            }}
            onOpenEvents={() => setActiveTab('events')}
            onOpenDateSpotFinder={(profile) => {
              const fakeMatch: Match = {
                id: `temp_${profile.id}`,
                user: profile,
                matchedAt: 'Now',
                sharedHobbies: profile.hobbies.map((h) => h.name),
                matchedHobby: profile.hobbies[0]?.name,
                unreadCount: 0,
              };
              setDateSpotModalMatch(fakeMatch);
              setShowDateSpotPlanner(true);
            }}
            onStartVideoCall={(profile) => {
              const fakeMatch: Match = {
                id: `temp_${profile.id}`,
                user: profile,
                matchedAt: 'Now',
                sharedHobbies: profile.hobbies.map((h) => h.name),
                matchedHobby: profile.hobbies[0]?.name,
                unreadCount: 0,
              };
              setActiveVideoCallMatch(fakeMatch);
            }}
            onReportProfile={(profile) => setReportTargetUser(profile)}
          />
        )}

        {activeTab === 'matches' && (
          <ChatView
            matches={matches}
            messages={messages}
            activeMatchId={activeChatMatchId}
            setActiveMatchId={setActiveChatMatchId}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onStartVideoCall={(match) => setActiveVideoCallMatch(match)}
            onOpenDateSpotFinder={(match) => {
              setDateSpotModalMatch(match);
              setShowDateSpotPlanner(true);
            }}
            onOpenReportModal={(user) => setReportTargetUser(user)}
            onUnmatch={handleUnmatch}
            onOpenProfile={(user) => {
              // Switch to view user in discover or details
            }}
          />
        )}

        {activeTab === 'events' && (
          <HobbyEventsView
            events={events}
            currentUser={currentUser}
            onToggleRsvp={handleToggleEventRsvp}
            onMatchFromEvent={handleMatchFromEvent}
          />
        )}

        {activeTab === 'wingmate' && (
          <AIWingmateModal
            currentUser={currentUser}
            matches={matches}
            onInsertToChat={(matchId, text) => {
              handleSendMessage(matchId, text);
              setActiveChatMatchId(matchId);
              setActiveTab('matches');
            }}
          />
        )}
      </main>

      {/* Match Celebration Fireworks Modal */}
      {activeCelebrationMatch && (
        <MatchCelebrationModal
          match={activeCelebrationMatch}
          currentUser={currentUser}
          onClose={() => setActiveCelebrationMatch(null)}
          onSendMessage={(matchId, text) => handleSendMessage(matchId, text)}
          onOpenChat={(match) => {
            setActiveChatMatchId(match.id);
            setActiveTab('matches');
          }}
        />
      )}

      {/* Pre-Meet Video Call Modal */}
      {activeVideoCallMatch && (
        <VideoCallModal
          match={activeVideoCallMatch}
          currentUser={currentUser}
          onClose={() => setActiveVideoCallMatch(null)}
          onEndCall={() => setActiveVideoCallMatch(null)}
          onOpenReport={(target) => setReportTargetUser(target)}
        />
      )}

      {/* Google Maps Date Spot Finder Modal */}
      {showDateSpotPlanner && (
        <DateSpotFinderModal
          match={dateSpotModalMatch}
          currentUser={currentUser}
          onClose={() => {
            setShowDateSpotPlanner(false);
            setDateSpotModalMatch(null);
          }}
          onSendDateInvite={handleSendDateInvite}
        />
      )}

      {/* Profile & Live Photo Verification Editor */}
      {showProfileEditor && (
        <ProfileEditorModal
          currentUser={currentUser}
          onSave={(updated) => setCurrentUser(updated)}
          onClose={() => setShowProfileEditor(false)}
        />
      )}

      {/* Confidential Safety Report & Block Modal */}
      {reportTargetUser && (
        <ReportModal
          targetUser={reportTargetUser}
          onClose={() => setReportTargetUser(null)}
          onSubmitReport={handleReportUser}
        />
      )}

      {/* Onboarding Flow (if triggered) */}
      {showOnboarding && (
        <OnboardingFlow
          onComplete={(newProfile) => {
            setCurrentUser(newProfile);
            setShowOnboarding(false);
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

