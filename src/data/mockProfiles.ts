import { UserProfile, Match, HobbyEvent, HobbyTag } from '../types';

export const ALL_AVAILABLE_HOBBIES: HobbyTag[] = [
  // Outdoors & Nature
  { id: 'bouldering', name: 'Bouldering & Climbing', category: 'outdoors', icon: '🧗', skillLevel: 'Weekend Enthusiast' },
  { id: 'trail_running', name: 'Trail Running', category: 'outdoors', icon: '🏃', skillLevel: 'Dedicated Passion' },
  { id: 'backpacking', name: 'Ultralight Backpacking', category: 'outdoors', icon: '⛺', skillLevel: 'Dedicated Passion' },
  { id: 'kayaking', name: 'Kayaking & SUP', category: 'outdoors', icon: '🛶', skillLevel: 'Weekend Enthusiast' },
  { id: 'birding', name: 'Urban Bird Watching', category: 'outdoors', icon: '🦜', skillLevel: 'Curious Beginner' },
  { id: 'surfing', name: 'Surfing & Cold Plunge', category: 'outdoors', icon: '🏄', skillLevel: 'Weekend Enthusiast' },

  // Arts & Crafts
  { id: 'pottery', name: 'Wheel-Thrown Pottery', category: 'arts_crafts', icon: '🏺', skillLevel: 'Weekend Enthusiast' },
  { id: 'film_photo', name: '35mm Film Photography', category: 'arts_crafts', icon: '📷', skillLevel: 'Dedicated Passion' },
  { id: 'woodworking', name: 'Woodworking & Joinery', category: 'arts_crafts', icon: '🪵', skillLevel: 'Weekend Enthusiast' },
  { id: 'painting', name: 'Oil & Gouache Painting', category: 'arts_crafts', icon: '🎨', skillLevel: 'Weekend Enthusiast' },
  { id: 'textiles', name: 'Knitting & Tufting', category: 'arts_crafts', icon: '🧶', skillLevel: 'Weekend Enthusiast' },

  // Food & Drink
  { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Expert / Obsessed' },
  { id: 'sourdough', name: 'Wild Sourdough & Baking', category: 'food_drink', icon: '🍞', skillLevel: 'Dedicated Passion' },
  { id: 'natural_wine', name: 'Natural Wine Tasting', category: 'food_drink', icon: '🍷', skillLevel: 'Weekend Enthusiast' },
  { id: 'fermentation', name: 'Kimchi & Kombucha Fermenting', category: 'food_drink', icon: '🥬', skillLevel: 'Curious Beginner' },
  { id: 'pasta_making', name: 'Handmade Pasta & Cucina', category: 'food_drink', icon: '🍝', skillLevel: 'Dedicated Passion' },

  // Music & Culture
  { id: 'vinyl', name: 'Vinyl Digging & Hi-Fi', category: 'music_culture', icon: '📻', skillLevel: 'Dedicated Passion' },
  { id: 'modular_synth', name: 'Modular Synths & Electronic', category: 'music_culture', icon: '🎹', skillLevel: 'Dedicated Passion' },
  { id: 'indie_gigs', name: 'Local Indie Shows & Basements', category: 'music_culture', icon: '🎸', skillLevel: 'Dedicated Passion' },
  { id: 'book_club', name: 'Literary Fiction & Philosophy', category: 'music_culture', icon: '📚', skillLevel: 'Expert / Obsessed' },
  { id: 'cinema', name: 'A24 & Repertory Cinema', category: 'music_culture', icon: '🎬', skillLevel: 'Dedicated Passion' },

  // Gaming & Tech
  { id: 'board_games', name: 'Euro Board Games & Strategy', category: 'gaming_tech', icon: '🎲', skillLevel: 'Expert / Obsessed' },
  { id: 'ttrpg', name: 'D&D and Indie TTRPGs', category: 'gaming_tech', icon: '🐉', skillLevel: 'Dedicated Passion' },
  { id: 'mechanical_keyboards', name: 'Custom Mechanical Keyboards', category: 'gaming_tech', icon: '⌨️', skillLevel: 'Expert / Obsessed' },
  { id: 'game_dev', name: 'Pixel Art & Indie Game Dev', category: 'gaming_tech', icon: '🕹️', skillLevel: 'Weekend Enthusiast' },

  // Fitness & Movement
  { id: 'bjj', name: 'Brazilian Jiu-Jitsu', category: 'fitness_sports', icon: '🥋', skillLevel: 'Dedicated Passion' },
  { id: 'cycling', name: 'Gravel Biking & Commuting', category: 'fitness_sports', icon: '🚴', skillLevel: 'Dedicated Passion' },
  { id: 'yoga', name: 'Vinyasa Yoga & Breathwork', category: 'fitness_sports', icon: '🧘', skillLevel: 'Weekend Enthusiast' },
  { id: 'bouldering_gym', name: 'Gym Training & Calisthenics', category: 'fitness_sports', icon: '🏋️', skillLevel: 'Weekend Enthusiast' },
];

export const CURRENT_USER: UserProfile = {
  id: 'user_current',
  name: 'Alex Rivera',
  age: 27,
  gender: 'non-binary',
  orientation: 'Queer',
  location: {
    neighborhood: 'Mission District',
    city: 'San Francisco, CA',
    distanceKm: 0,
    latitude: 37.7599,
    longitude: -122.4148,
  },
  distanceFuzzing: true,
  bio: 'Specialty coffee geek by morning, bouldering problem solver by evening. Always seeking someone to explore hidden bookshops, test new pour-over beans, or trade film rolls.',
  lookingFor: 'Long-term & Shared Passions',
  occupation: 'Architectural Designer',
  education: 'UC Berkeley',
  photos: [
    {
      id: 'p_curr_1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Testing a light meter on Portra 400 at Twin Peaks',
      hobbyTag: '35mm Film Photography',
      isMain: true,
    },
    {
      id: 'p_curr_2',
      url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1000&q=80',
      caption: 'Dialing in a washed Ethiopian pour-over (92°C brew)',
      hobbyTag: 'Specialty Coffee & Pour-overs',
    },
    {
      id: 'p_curr_3',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Trying to flash a V5 crimp problem at Mission Cliffs',
      hobbyTag: 'Bouldering & Climbing',
    },
    {
      id: 'p_curr_4',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Weekend flea market vinyl hunt',
      hobbyTag: 'Vinyl Digging & Hi-Fi',
    }
  ],
  prompts: [
    {
      id: 'pr_1',
      question: 'My ideal Sunday morning hobby ritual...',
      answer: 'Grinding a fresh light-roast Gesha coffee, putting on an ambient jazz record, and sketching floor plans or trimming bonsai trees.',
      hobbyTag: 'Specialty Coffee & Pour-overs'
    },
    {
      id: 'pr_2',
      question: 'The gear/project I obsess over...',
      answer: 'My Olympus OM-1 film camera from 1974 and a hand-crafted Fellow Ode grinder with SSP burrs.',
      hobbyTag: '35mm Film Photography'
    },
    {
      id: 'pr_3',
      question: 'I will know we are compatible if...',
      answer: 'You want to do a cooperative board game night like Spirit Island or Wingspan, with hot tea and cozy banter.',
      hobbyTag: 'Euro Board Games & Strategy'
    }
  ],
  hobbies: [
    { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Expert / Obsessed', blurb: 'Kalita Wave & V60 brewer' },
    { id: 'bouldering', name: 'Bouldering & Climbing', category: 'outdoors', icon: '🧗', skillLevel: 'Weekend Enthusiast', blurb: 'Climbing V4-V5 at Mission Cliffs' },
    { id: 'film_photo', name: '35mm Film Photography', category: 'arts_crafts', icon: '📷', skillLevel: 'Dedicated Passion', blurb: 'Olympus OM-1, develops B&W at home' },
    { id: 'board_games', name: 'Euro Board Games & Strategy', category: 'gaming_tech', icon: '🎲', skillLevel: 'Dedicated Passion', blurb: 'Wingspan, Ark Nova & Terraforming Mars' },
    { id: 'vinyl', name: 'Vinyl Digging & Hi-Fi', category: 'music_culture', icon: '📻', skillLevel: 'Weekend Enthusiast', blurb: 'Collecting 70s Japanese jazz fusion' },
  ],
  verified: true,
  verificationSelfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  verifiedAt: '2026-06-12',
  badges: ['🛡️ Verified Hobbyist', '☕ Coffee Guild Member', '🧗 Active Climber'],
  activeStatus: 'online',
  instagramHandle: '@alex.explores.sf',
  spotifyTopArtist: 'Khruangbin',
};

export const DISCOVERY_PROFILES: UserProfile[] = [
  {
    id: 'u_maya',
    name: 'Maya Chen',
    age: 26,
    gender: 'woman',
    orientation: 'Bisexual',
    location: {
      neighborhood: 'Hayes Valley',
      city: 'San Francisco, CA',
      distanceKm: 2.1,
      latitude: 37.7758,
      longitude: -122.4244,
    },
    distanceFuzzing: true,
    bio: 'Ceramicist by weekend, UX designer by weekday. If we match, we are either throwing clay on the wheel, debating cold brew steep ratios, or listening to Japanese City Pop.',
    lookingFor: 'Hobby Partner + Romance',
    occupation: 'Senior Product Designer & Ceramic Artist',
    education: 'Rhode Island School of Design',
    photos: [
      {
        id: 'p_m1',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        caption: 'Glazing my new speckled stoneware collection in the studio',
        hobbyTag: 'Wheel-Thrown Pottery',
        isMain: true,
      },
      {
        id: 'p_m2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
        caption: 'Morning pour-over tasting at Sightglass',
        hobbyTag: 'Specialty Coffee & Pour-overs',
      },
      {
        id: 'p_m3',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=80',
        caption: 'Bouldering top-out at Dogpatch Boulders!',
        hobbyTag: 'Bouldering & Climbing',
      },
      {
        id: 'p_m4',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
        caption: 'Film portrait shot on Canon AE-1',
        hobbyTag: '35mm Film Photography',
      }
    ],
    prompts: [
      {
        id: 'prm_1',
        question: 'My ideal first hobby date...',
        answer: 'Two-person pottery wheel session where we make matching matcha cups, followed by an iced cardamom latte walk around Alamo Square.',
        hobbyTag: 'Wheel-Thrown Pottery'
      },
      {
        id: 'prm_2',
        question: 'A strange hobby skill I have...',
        answer: 'I can identify single-origin coffee origins blindly by aroma (ask me about natural process Ethiopians vs anaerobic Geshas).',
        hobbyTag: 'Specialty Coffee & Pour-overs'
      },
      {
        id: 'prm_3',
        question: 'Teach me something about...',
        answer: 'How you choose your bouldering route beta or your favorite obscure vinyl crate gems.',
        hobbyTag: 'Bouldering & Climbing'
      }
    ],
    hobbies: [
      { id: 'pottery', name: 'Wheel-Thrown Pottery', category: 'arts_crafts', icon: '🏺', skillLevel: 'Expert / Obsessed', blurb: 'Studio resident at Clay by the Bay' },
      { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Dedicated Passion', blurb: 'Home espresso + Chemex nerd' },
      { id: 'bouldering', name: 'Bouldering & Climbing', category: 'outdoors', icon: '🧗', skillLevel: 'Weekend Enthusiast', blurb: 'Climbs V3-V4 at Dogpatch' },
      { id: 'film_photo', name: '35mm Film Photography', category: 'arts_crafts', icon: '📷', skillLevel: 'Weekend Enthusiast', blurb: 'Canon AE-1 & Cinestill 800T' },
    ],
    verified: true,
    verificationSelfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    verifiedAt: '2026-05-18',
    badges: ['🛡️ Verified Hobbyist', '🏺 Studio Potter', '☕ Coffee Geek'],
    activeStatus: 'online',
    instagramHandle: '@mayaceramics',
    spotifyTopArtist: 'Tatsuro Yamashita',
  },
  {
    id: 'u_leo',
    name: 'Leo Thorne',
    age: 29,
    gender: 'man',
    orientation: 'Gay',
    location: {
      neighborhood: 'Bernal Heights',
      city: 'San Francisco, CA',
      distanceKm: 3.8,
      latitude: 37.7441,
      longitude: -122.4162,
    },
    distanceFuzzing: true,
    bio: 'Gravel cyclist, modular synth jammer, and sourdough baker. Always looking for someone to push hill sprints with or nerd out over Eurorack patches over fresh focaccia.',
    lookingFor: 'Long-term & Shared Passions',
    occupation: 'Acoustics & Audio Hardware Engineer',
    education: 'Stanford Sound Lab',
    photos: [
      {
        id: 'p_l1',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Hawkhill summit ride before sunrise in Marin',
        hobbyTag: 'Gravel Biking & Commuting',
        isMain: true,
      },
      {
        id: 'p_l2',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Tuning voltage-controlled filters on my custom modular synth',
        hobbyTag: 'Modular Synths & Electronic',
      },
      {
        id: 'p_l3',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
        caption: '85% hydration sourdough loaf with rosemary & sea salt',
        hobbyTag: 'Wild Sourdough & Baking',
      }
    ],
    prompts: [
      {
        id: 'prl_1',
        question: 'My most prized piece of gear...',
        answer: 'My Moog Mother-32 and a custom titanium gravel bike built from scratch.',
        hobbyTag: 'Modular Synths & Electronic'
      },
      {
        id: 'prl_2',
        question: 'You should message me if...',
        answer: 'You appreciate high-hydration bread, weird ambient drone music, or scenic sunset bike rides across the Golden Gate.',
        hobbyTag: 'Wild Sourdough & Baking'
      }
    ],
    hobbies: [
      { id: 'modular_synth', name: 'Modular Synths & Electronic', category: 'music_culture', icon: '🎹', skillLevel: 'Expert / Obsessed', blurb: 'Builds DIY Eurorack modules' },
      { id: 'cycling', name: 'Gravel Biking & Commuting', category: 'fitness_sports', icon: '🚴', skillLevel: 'Dedicated Passion', blurb: 'Marin Headlands & Headlands 100' },
      { id: 'sourdough', name: 'Wild Sourdough & Baking', category: 'food_drink', icon: '🍞', skillLevel: 'Dedicated Passion', blurb: '4-year-old active starter named Dough-ba' },
    ],
    verified: true,
    badges: ['🛡️ Verified Hobbyist', '🎹 Sound Maker', '🚴 Century Rider'],
    activeStatus: 'active_today',
  },
  {
    id: 'u_elena',
    name: 'Elena Rostova',
    age: 28,
    gender: 'woman',
    orientation: 'Straight',
    location: {
      neighborhood: 'Inner Sunset',
      city: 'San Francisco, CA',
      distanceKm: 4.2,
      latitude: 37.7634,
      longitude: -122.4665,
    },
    distanceFuzzing: true,
    bio: 'Trail runner & ultralight backpacker. Looking for someone who gets excited about 15-mile coastal ridge runs, camp stove gourmet meals, and heavy Euro board games on rainy days.',
    lookingFor: 'Long-term & Shared Passions',
    occupation: 'Environmental Scientist & Flora Researcher',
    education: 'UC Davis Ecology',
    photos: [
      {
        id: 'p_e1',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80',
        caption: 'Dipsea Trail morning mist run through the redwoods',
        hobbyTag: 'Trail Running',
        isMain: true,
      },
      {
        id: 'p_e2',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
        caption: 'Playing Ark Nova with tea & scones',
        hobbyTag: 'Euro Board Games & Strategy',
      },
      {
        id: 'p_e3',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        caption: 'Camp setup at Point Reyes Coast Camp',
        hobbyTag: 'Ultralight Backpacking',
      }
    ],
    prompts: [
      {
        id: 'pre_1',
        question: 'My ideal Sunday hobby ritual...',
        answer: 'Running 12 miles through Marin headlands trails, eating a warm burrito, then playing a 3-hour game of Brass Birmingham.',
        hobbyTag: 'Trail Running'
      },
      {
        id: 'pre_2',
        question: 'I will know we are compatible if...',
        answer: 'You have a favorite trail running shoe brand and don’t mind getting mud on your boots.',
        hobbyTag: 'Ultralight Backpacking'
      }
    ],
    hobbies: [
      { id: 'trail_running', name: 'Trail Running', category: 'outdoors', icon: '🏃', skillLevel: 'Expert / Obsessed', blurb: '50k ultra finisher, loves Marin trails' },
      { id: 'backpacking', name: 'Ultralight Backpacking', category: 'outdoors', icon: '⛺', skillLevel: 'Dedicated Passion', blurb: 'Base weight under 9 lbs' },
      { id: 'board_games', name: 'Euro Board Games & Strategy', category: 'gaming_tech', icon: '🎲', skillLevel: 'Dedicated Passion', blurb: 'Ark Nova, Brass, Root, Scythe' },
      { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Weekend Enthusiast', blurb: 'AeroPress camp coffee maestro' },
    ],
    verified: true,
    badges: ['🛡️ Verified Hobbyist', '🏃 Ultra Runner', '🎲 Board Game Master'],
    activeStatus: 'online',
  },
  {
    id: 'u_sam',
    name: 'Samir Patel',
    age: 30,
    gender: 'man',
    orientation: 'Bisexual',
    location: {
      neighborhood: 'Noe Valley',
      city: 'San Francisco, CA',
      distanceKm: 1.7,
      latitude: 37.7502,
      longitude: -122.4337,
    },
    distanceFuzzing: true,
    bio: 'Analog photography addict, boulderer, and sourdough pizza host. I host monthly backyard pizza & board game nights for passionate makers and thinkers.',
    lookingFor: 'Hobby Partner + Romance',
    occupation: 'Documentary Filmmaker',
    education: 'NYU Tisch Film',
    photos: [
      {
        id: 'p_s1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
        caption: 'Medium format Hasselblad shoot in Big Sur',
        hobbyTag: '35mm Film Photography',
        isMain: true,
      },
      {
        id: 'p_s2',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
        caption: 'Bouldering outdoors at Castle Rock State Park',
        hobbyTag: 'Bouldering & Climbing',
      },
      {
        id: 'p_s3',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
        caption: 'Neapolitan sourdough pizza night fresh from the Ooni oven',
        hobbyTag: 'Handmade Pasta & Cucina',
      }
    ],
    prompts: [
      {
        id: 'prs_1',
        question: 'The gear I obsess over...',
        answer: 'Hasselblad 500C/M and an Ooni Karu 16 wood-fired pizza oven.',
        hobbyTag: '35mm Film Photography'
      },
      {
        id: 'prs_2',
        question: 'Ask me about my project on...',
        answer: 'Preserving vanishing mom-and-pop print shops through medium format analog darkroom prints.',
        hobbyTag: '35mm Film Photography'
      }
    ],
    hobbies: [
      { id: 'film_photo', name: '35mm Film Photography', category: 'arts_crafts', icon: '📷', skillLevel: 'Expert / Obsessed', blurb: 'Darkroom printer, 120mm & 35mm' },
      { id: 'bouldering', name: 'Bouldering & Climbing', category: 'outdoors', icon: '🧗', skillLevel: 'Dedicated Passion', blurb: 'V5 outdoor boulderer at Castle Rock' },
      { id: 'pasta_making', name: 'Handmade Pasta & Cucina', category: 'food_drink', icon: '🍝', skillLevel: 'Dedicated Passion', blurb: 'Neapolitan pizza and agnolotti maker' },
      { id: 'vinyl', name: 'Vinyl Digging & Hi-Fi', category: 'music_culture', icon: '📻', skillLevel: 'Weekend Enthusiast', blurb: 'Soul, Funk & 90s Hip Hop' },
    ],
    verified: true,
    badges: ['🛡️ Verified Hobbyist', '📷 Darkroom Master', '🍕 Master Pizzaiolo'],
    activeStatus: 'active_today',
  },
  {
    id: 'u_chloe',
    name: 'Chloe Lin',
    age: 25,
    gender: 'woman',
    orientation: 'Queer',
    location: {
      neighborhood: 'North Beach',
      city: 'San Francisco, CA',
      distanceKm: 4.8,
      latitude: 37.8000,
      longitude: -122.4100,
    },
    distanceFuzzing: true,
    bio: 'Independent bookstore clerk & indie game developer. Always hunting for out-of-print sci-fi paperbacks, obscure indie tabletop RPGs, and quiet tea rooms.',
    lookingFor: 'Long-term & Shared Passions',
    occupation: 'Bookstore Curator & Game Writer',
    education: 'UC Berkeley English & Game Studies',
    photos: [
      {
        id: 'p_c1',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
        caption: 'Reading Ursula K. Le Guin at City Lights Bookstore',
        hobbyTag: 'Literary Fiction & Philosophy',
        isMain: true,
      },
      {
        id: 'p_c2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
        caption: 'Running a cozy cozy-mystery TTRPG session',
        hobbyTag: 'D&D and Indie TTRPGs',
      },
      {
        id: 'p_c3',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
        caption: 'Custom split mechanical keyboard build with lubed holy pandas',
        hobbyTag: 'Custom Mechanical Keyboards',
      }
    ],
    prompts: [
      {
        id: 'prc_1',
        question: 'My ideal Sunday hobby ritual...',
        answer: 'Browsing flea market book bins, sipping roasted oolong tea, and writing quest dialogue for my pixel-art RPG.',
        hobbyTag: 'Literary Fiction & Philosophy'
      },
      {
        id: 'prc_2',
        question: 'I will know we are compatible if...',
        answer: 'You want to browse City Lights bookstore for 2 hours without rushing, then debate speculative worldbuilding over dumplings.',
        hobbyTag: 'Literary Fiction & Philosophy'
      }
    ],
    hobbies: [
      { id: 'book_club', name: 'Literary Fiction & Philosophy', category: 'music_culture', icon: '📚', skillLevel: 'Expert / Obsessed', blurb: 'Le Guin, Calvino, Murakami & sci-fi' },
      { id: 'ttrpg', name: 'D&D and Indie TTRPGs', category: 'gaming_tech', icon: '🐉', skillLevel: 'Dedicated Passion', blurb: 'Game master for indie narrative RPGs' },
      { id: 'mechanical_keyboards', name: 'Custom Mechanical Keyboards', category: 'gaming_tech', icon: '⌨️', skillLevel: 'Dedicated Passion', blurb: 'Lubed Holy Pandas & Corne split board' },
      { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Weekend Enthusiast', blurb: 'Loves slow matcha and pour-overs' },
    ],
    verified: true,
    badges: ['🛡️ Verified Hobbyist', '📚 Book Guild', '🐉 Dungeon Master'],
    activeStatus: 'online',
  },
  {
    id: 'u_marcus',
    name: 'Marcus Vance',
    age: 31,
    gender: 'man',
    orientation: 'Straight',
    location: {
      neighborhood: 'Potrero Hill',
      city: 'San Francisco, CA',
      distanceKm: 2.9,
      latitude: 37.7590,
      longitude: -122.3990,
    },
    distanceFuzzing: true,
    bio: 'BJJ brown belt, specialty espresso fanatic, and natural wine explorer. Seeking someone with boundless curiosity, high energy for morning workouts, and love for good eats.',
    lookingFor: 'Long-term & Shared Passions',
    occupation: 'Sports Physiotherapist & Movement Coach',
    education: 'USC Physical Therapy',
    photos: [
      {
        id: 'p_mar1',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Morning pull-ups & mobility work on Potrero Hill overview',
        hobbyTag: 'Gym Training & Calisthenics',
        isMain: true,
      },
      {
        id: 'p_mar2',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80',
        caption: 'Pulling a thick Crema shot on a La Marzocco Linea Mini',
        hobbyTag: 'Specialty Coffee & Pour-overs',
      },
      {
        id: 'p_mar3',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
        caption: 'Orange natural wine tasting at Ruby Wine',
        hobbyTag: 'Natural Wine Tasting',
      }
    ],
    prompts: [
      {
        id: 'prmar_1',
        question: 'My most prized piece of gear...',
        answer: 'My Linea Mini espresso machine. It makes mornings feel like an artisan cafe.',
        hobbyTag: 'Specialty Coffee & Pour-overs'
      },
      {
        id: 'prmar_2',
        question: 'A dream hobby trip with my partner...',
        answer: 'A road trip through Northern Italy: morning runs in Tuscany, afternoon natural wine vineyards, and evening handmade pasta making classes.',
        hobbyTag: 'Natural Wine Tasting'
      }
    ],
    hobbies: [
      { id: 'specialty_coffee', name: 'Specialty Coffee & Pour-overs', category: 'food_drink', icon: '☕', skillLevel: 'Expert / Obsessed', blurb: 'Linea Mini home barista' },
      { id: 'natural_wine', name: 'Natural Wine Tasting', category: 'food_drink', icon: '🍷', skillLevel: 'Dedicated Passion', blurb: 'Loves Jura whites & pet-nats' },
      { id: 'bjj', name: 'Brazilian Jiu-Jitsu', category: 'fitness_sports', icon: '🥋', skillLevel: 'Expert / Obsessed', blurb: 'Brown belt, trains 4x weekly' },
      { id: 'bouldering', name: 'Bouldering & Climbing', category: 'outdoors', icon: '🧗', skillLevel: 'Weekend Enthusiast', blurb: 'Loves dynos and overhangs' },
    ],
    verified: true,
    badges: ['🛡️ Verified Hobbyist', '☕ Espresso Geek', '🍷 Sommelier Vibe'],
    activeStatus: 'recently_active',
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_maya',
    user: DISCOVERY_PROFILES[0], // Maya Chen
    matchedAt: 'Yesterday at 7:14 PM',
    matchedHobby: 'Specialty Coffee & Pour-overs',
    sharedHobbies: ['Specialty Coffee & Pour-overs', 'Bouldering & Climbing', '35mm Film Photography'],
    unreadCount: 1,
    isSuperLiked: true,
    lastMessage: {
      id: 'm_last_maya',
      matchId: 'match_maya',
      senderId: 'u_maya',
      senderName: 'Maya Chen',
      text: 'Have you tried the new washed Geisha roast at Linea Caffe? I was just there this morning dialling in my V60! ☕',
      timestamp: '10:42 AM',
      isRead: false,
    }
  },
  {
    id: 'match_sam',
    user: DISCOVERY_PROFILES[3], // Samir Patel
    matchedAt: '3 days ago',
    matchedHobby: '35mm Film Photography',
    sharedHobbies: ['35mm Film Photography', 'Bouldering & Climbing', 'Vinyl Digging & Hi-Fi'],
    unreadCount: 0,
    lastMessage: {
      id: 'm_last_sam',
      matchId: 'match_sam',
      senderId: 'user_current',
      senderName: 'Alex Rivera',
      text: 'That Hasselblad portrait is unreal! What film stock did you develop it with?',
      timestamp: 'Yesterday',
      isRead: true,
      readAt: 'Yesterday at 4:15 PM',
    }
  }
];

export const INITIAL_MESSAGES: Record<string, import('../types').Message[]> = {
  'match_maya': [
    {
      id: 'msg_1',
      matchId: 'match_maya',
      senderId: 'user_current',
      senderName: 'Alex Rivera',
      text: 'Hey Maya! That ceramic matcha cup in your photo is stunning. Did you mix the glaze yourself?',
      timestamp: 'Yesterday at 8:20 PM',
      isRead: true,
      readAt: 'Yesterday at 8:30 PM',
      isLiked: true,
    },
    {
      id: 'msg_2',
      matchId: 'match_maya',
      senderId: 'u_maya',
      senderName: 'Maya Chen',
      text: 'Thank you Alex!! Yes, it’s a custom matte iron-fleck glaze with a touch of cobalt. Took three test firings to get the speckles right!',
      timestamp: 'Yesterday at 8:35 PM',
      isRead: true,
    },
    {
      id: 'msg_3',
      matchId: 'match_maya',
      senderId: 'u_maya',
      senderName: 'Maya Chen',
      text: 'I also noticed you climb at Mission Cliffs! We probably cross paths on the V4 slab problems all the time 🧗‍♀️',
      timestamp: 'Yesterday at 8:36 PM',
      isRead: true,
    },
    {
      id: 'msg_4',
      matchId: 'match_maya',
      senderId: 'u_maya',
      senderName: 'Maya Chen',
      text: 'Have you tried the new washed Geisha roast at Linea Caffe? I was just there this morning dialling in my V60! ☕',
      timestamp: '10:42 AM',
      isRead: false,
    }
  ],
  'match_sam': [
    {
      id: 'msg_s1',
      matchId: 'match_sam',
      senderId: 'u_sam',
      senderName: 'Samir Patel',
      text: 'Hey Alex! Fellow OM-1 shooter! Do you push your Portra or shoot at box speed?',
      timestamp: '3 days ago',
      isRead: true,
    },
    {
      id: 'msg_s2',
      matchId: 'match_sam',
      senderId: 'user_current',
      senderName: 'Alex Rivera',
      text: 'That Hasselblad portrait is unreal! What film stock did you develop it with?',
      timestamp: 'Yesterday at 3:10 PM',
      isRead: true,
      readAt: 'Yesterday at 4:15 PM',
    }
  ]
};

export const COMMUNITY_HOBBY_EVENTS: HobbyEvent[] = [
  {
    id: 'evt_1',
    title: 'Sunday Morning Pour-Over Cupping & Bean Swap',
    category: 'food_drink',
    hobby: 'Specialty Coffee & Pour-overs',
    date: 'Sunday, Aug 24',
    time: '10:00 AM - 12:30 PM',
    locationName: 'Sightglass Coffee Roastery Loft',
    neighborhood: 'SoMa, SF',
    address: '270 7th St, San Francisco, CA',
    description: 'Bring a 50g sample of your favorite recent single-origin roast! We will do a blind cupping flight, taste Geshas & anaerobics, and pair up for friendly coffee banter.',
    attendeesCount: 28,
    attendees: [
      { id: 'u_maya', name: 'Maya Chen', age: 26, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_marcus', name: 'Marcus Vance', age: 31, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_chloe', name: 'Chloe Lin', age: 25, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', verified: true },
    ],
    userRsvp: true,
    speedDatingSession: {
      active: true,
      roundsCount: 5,
      currentRoundTimeSec: 180,
    },
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Sightglass+Coffee+San+Francisco',
  },
  {
    id: 'evt_2',
    title: 'Bouldering & Brews: Sunset Social Climbers',
    category: 'outdoors',
    hobby: 'Bouldering & Climbing',
    date: 'Wednesday, Aug 27',
    time: '6:30 PM - 9:00 PM',
    locationName: 'Dogpatch Boulders & Neighbor Bakeshop',
    neighborhood: 'Dogpatch, SF',
    address: '2570 3rd St, San Francisco, CA',
    description: 'Casual group climb for all levels (V0 to V7+). We work on project beta together with color-coded ribbons, then head to Harmonic Brewing next door for craft beers & ciders.',
    attendeesCount: 34,
    attendees: [
      { id: 'u_maya', name: 'Maya Chen', age: 26, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_sam', name: 'Samir Patel', age: 30, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_marcus', name: 'Marcus Vance', age: 31, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', verified: true },
    ],
    userRsvp: false,
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Dogpatch+Boulders+San+Francisco',
  },
  {
    id: 'evt_3',
    title: 'Golden Gate Park 35mm Analog Photo Walk',
    category: 'arts_crafts',
    hobby: '35mm Film Photography',
    date: 'Saturday, Aug 30',
    time: '4:00 PM - 7:00 PM',
    locationName: 'Conservatory of Flowers & Botanical Garden',
    neighborhood: 'Golden Gate Park, SF',
    address: '100 John F Kennedy Dr, San Francisco, CA',
    description: 'Golden hour walk through the Conservatory of Flowers and Dahlia garden. Swap vintage lenses, shoot portraits for each other, and finish with a cold drink at Park Chalet.',
    attendeesCount: 19,
    attendees: [
      { id: 'u_sam', name: 'Samir Patel', age: 30, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_maya', name: 'Maya Chen', age: 26, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', verified: true },
    ],
    userRsvp: false,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=Conservatory+of+Flowers+San+Francisco',
  },
  {
    id: 'evt_4',
    title: 'Cozy Euro Strategy Board Game & Craft Cider Night',
    category: 'gaming_tech',
    hobby: 'Euro Board Games & Strategy',
    date: 'Friday, Sep 5',
    time: '7:00 PM - 11:00 PM',
    locationName: 'The Game Parlour Board Game Cafe',
    neighborhood: 'Inner Sunset, SF',
    address: '1342 Irving St, San Francisco, CA',
    description: 'Join tables for Ark Nova, Wingspan, Cascadia, and Spirit Island. Friendly teaching for new players. Delicious waffle sandwiches and herbal teas available!',
    attendeesCount: 22,
    attendees: [
      { id: 'u_elena', name: 'Elena Rostova', age: 28, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', verified: true },
      { id: 'u_chloe', name: 'Chloe Lin', age: 25, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', verified: true },
    ],
    userRsvp: true,
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
    mapUrl: 'https://maps.google.com/?q=The+Game+Parlour+San+Francisco',
  }
];
