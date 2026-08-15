import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Heart,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Compass,
} from 'lucide-react';
import { UserProfile, HobbyTag } from '../types';
import { ALL_AVAILABLE_HOBBIES } from '../data/mockProfiles';

interface OnboardingFlowProps {
  onComplete: (userProfile: UserProfile) => void;
  onCancel: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(27);
  const [gender, setGender] = useState<'woman' | 'man' | 'non-binary'>('woman');
  const [lookingFor, setLookingFor] = useState<'Long-term & Shared Passions' | 'Hobby Partner + Romance' | 'Casual Dates & Fun' | 'Activity Companion'>('Long-term & Shared Passions');
  const [neighborhood, setNeighborhood] = useState('Mission District');
  const [selectedHobbies, setSelectedHobbies] = useState<HobbyTag[]>([
    ALL_AVAILABLE_HOBBIES[0],
    ALL_AVAILABLE_HOBBIES[1],
  ]);
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('Architect & Roaster');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
  ]);

  const toggleHobby = (hobby: HobbyTag) => {
    if (selectedHobbies.some((h) => h.id === hobby.id)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h.id !== hobby.id));
    } else {
      setSelectedHobbies([...selectedHobbies, { ...hobby, skillLevel: 'Weekend Enthusiast' }]);
    }
  };

  const handleFinish = () => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name || 'Alex Taylor',
      age: Number(age) || 27,
      gender,
      orientation: 'Queer',
      lookingFor,
      verified: true,
      verifiedAt: new Date().toISOString().split('T')[0],
      location: {
        city: 'San Francisco, CA',
        neighborhood,
        distanceKm: 0,
        latitude: 37.7749,
        longitude: -122.4194,
      },
      distanceFuzzing: true,
      bio:
        bio ||
        `Passionate about specialty coffee brewing and weekend bouldering. Looking for someone to trade books, test new roasters, and explore hidden city gems with.`,
      occupation,
      education: 'UC Berkeley',
      photos: photos.map((url, i) => ({
        id: `photo_${i}`,
        url,
        caption: i === 0 ? 'Weekend pour-over routine' : 'Outdoors adventure',
        hobbyTag: selectedHobbies[i % selectedHobbies.length]?.name || 'Hobby',
      })),
      hobbies: selectedHobbies,
      prompts: [
        {
          id: 'prompt_1',
          question: 'My ideal Sunday morning hobby ritual...',
          answer: 'Dialing in a fresh Ethiopian natural process light roast on the V60, then heading out for an early morning photo walk.',
        },
        {
          id: 'prompt_2',
          question: 'I will know we are compatible if...',
          answer: 'You have a passion project or craft you can geek out about for 45 minutes straight.',
        },
      ],
      badges: ['🛡️ Verified Hobbyist', '☕ Coffee Geek', '🧗 Active Climber'],
      activeStatus: 'online',
    };

    onComplete(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col justify-between">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step {step} of 4
            </span>
          </div>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  step >= i ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-stone-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Basic Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white">Let's build your Kindred profile</h2>
            <p className="text-xs text-stone-400">
              Kindred matches people on genuine shared passions, activities, and local community.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Age (18+)
                </label>
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  I identify as
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option>Woman</option>
                  <option>Man</option>
                  <option>Non-binary</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Looking to date
                </label>
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option>Men</option>
                  <option>Women</option>
                  <option>Men & Women</option>
                  <option>Everyone</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Neighborhood / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hayes Valley, San Francisco"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Hobbies & Passions */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white">Select Your Passions & Hobbies</h2>
            <p className="text-xs text-stone-400">
              Choose at least 2 hobbies you love doing or want to explore with a partner.
            </p>

            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
              {ALL_AVAILABLE_HOBBIES.map((hobby) => {
                const isSelected = selectedHobbies.some((h) => h.id === hobby.id);
                return (
                  <button
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{hobby.icon}</span>
                    <span>{hobby.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white">Add Your Photos</h2>
            <p className="text-xs text-stone-400">
              Authentic profiles receive 3x more meaningful hobby connections.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {photos.map((url, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 h-44">
                  <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    {i === 0 ? 'Main Photo' : 'Hobby photo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Bio & AI Touch */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-white">Your Bio & Craft Story</h2>
            <p className="text-xs text-stone-400">
              Tell prospective partners what lights you up and how you like to spend weekends.
            </p>

            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Specialty coffee nerd, casual weekend boulderer, and 35mm film shooter. Looking for someone to wander bookstores with and discover secret cozy date spots."
              className="w-full p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
              <div className="text-xs text-stone-300">
                <span className="font-bold text-amber-300 block">Instant Photo Verification Included</span>
                Your profile will automatically receive the verified member trust badge.
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-6 flex items-center justify-between border-t border-stone-800 mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="text-xs text-stone-500 hover:text-stone-300"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Enter Kindred</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
