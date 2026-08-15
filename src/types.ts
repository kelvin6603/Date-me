export interface HobbyTag {
  id: string;
  name: string;
  category: 'outdoors' | 'arts_crafts' | 'food_drink' | 'gaming_tech' | 'music_culture' | 'fitness_sports';
  icon: string;
  skillLevel?: 'Curious Beginner' | 'Weekend Enthusiast' | 'Dedicated Passion' | 'Expert / Obsessed';
  experienceYears?: number;
  blurb?: string;
}

export interface ProfilePrompt {
  id: string;
  question: string;
  answer: string;
  hobbyTag?: string;
}

export interface ProfilePhoto {
  id: string;
  url: string;
  caption?: string;
  hobbyTag?: string;
  isMain?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'woman' | 'man' | 'non-binary' | 'everyone';
  orientation: string;
  location: {
    neighborhood: string;
    city: string;
    distanceKm: number;
    latitude?: number;
    longitude?: number;
  };
  distanceFuzzing: boolean; // Hide exact distance for privacy
  bio: string;
  lookingFor: 'Long-term & Shared Passions' | 'Hobby Partner + Romance' | 'Casual Dates & Fun' | 'Activity Companion';
  occupation: string;
  education?: string;
  photos: ProfilePhoto[];
  prompts: ProfilePrompt[];
  hobbies: HobbyTag[];
  verified: boolean;
  verificationSelfieUrl?: string;
  verifiedAt?: string;
  badges: string[];
  activeStatus: 'online' | 'active_today' | 'recently_active';
  instagramHandle?: string;
  spotifyTopArtist?: string;
}

export interface DiscoveryPreferences {
  ageRange: [number, number];
  maxDistanceKm: number;
  genderPreference: ('woman' | 'man' | 'non-binary')[];
  selectedHobbyCategories: string[];
  selectedHobbies: string[];
  lookingForFilter: string[];
  verifiedOnly: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isVoiceNote?: boolean;
  voiceDuration?: number; // seconds
  isDateInvite?: boolean;
  dateDetails?: {
    title: string;
    spotName: string;
    spotAddress?: string;
    spotMapUrl?: string;
    time: string;
    hobbyType: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  isRead?: boolean;
  readAt?: string;
  isLiked?: boolean;
}

export interface Match {
  id: string;
  user: UserProfile;
  matchedAt: string;
  matchedHobby?: string;
  sharedHobbies: string[];
  lastMessage?: Message;
  unreadCount: number;
  isSuperLiked?: boolean;
}

export interface HobbyEvent {
  id: string;
  title: string;
  category: 'outdoors' | 'arts_crafts' | 'food_drink' | 'gaming_tech' | 'music_culture' | 'fitness_sports';
  hobby: string;
  date: string;
  time: string;
  locationName: string;
  neighborhood: string;
  address: string;
  description: string;
  attendeesCount: number;
  attendees: Array<{
    id: string;
    name: string;
    age: number;
    photo: string;
    verified: boolean;
  }>;
  userRsvp: boolean;
  speedDatingSession?: {
    active: boolean;
    roundsCount: number;
    currentRoundTimeSec: number;
  };
  image: string;
  mapUrl?: string;
}

export interface ReportTicket {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'action_taken';
}

export interface DateSpotSuggestion {
  title: string;
  category: string;
  neighborhood: string;
  description: string;
  mapsUri?: string;
  address?: string;
  vibe: string;
  recommendedHobbyDate: string;
}
