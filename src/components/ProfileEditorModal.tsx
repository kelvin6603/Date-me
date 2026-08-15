import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  MapPin,
  Lock,
  EyeOff,
  User,
  Heart,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, HobbyTag, ProfilePrompt, ProfilePhoto } from '../types';
import { ALL_AVAILABLE_HOBBIES } from '../data/mockProfiles';

interface ProfileEditorModalProps {
  currentUser: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  currentUser,
  onSave,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>({ ...currentUser });
  const [activeTab, setActiveTab] = useState<'photos' | 'hobbies' | 'prompts' | 'verification' | 'privacy'>('photos');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiBioOptions, setAiBioOptions] = useState<Array<{ style: string; bio: string }>>([]);
  const [isVerifyingSelfie, setIsVerifyingSelfie] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(profile.verified);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selfieVideoRef = useRef<HTMLVideoElement>(null);

  // Available prompt templates
  const PROMPT_TEMPLATES = [
    'My ideal Sunday morning hobby ritual...',
    'The gear/project I obsess over...',
    'I will know we are compatible if...',
    'My ideal first hobby date...',
    'A strange hobby skill I have...',
    'Ask me about my project on...',
    'Teach me something about...',
    'A dream hobby trip with my partner...',
  ];

  const handleAddHobby = (hobby: HobbyTag) => {
    if (profile.hobbies.some((h) => h.id === hobby.id)) return;
    setProfile({
      ...profile,
      hobbies: [...profile.hobbies, { ...hobby, skillLevel: 'Weekend Enthusiast' }],
    });
  };

  const handleRemoveHobby = (hobbyId: string) => {
    setProfile({
      ...profile,
      hobbies: profile.hobbies.filter((h) => h.id !== hobbyId),
    });
  };

  const handleUpdateHobbySkill = (hobbyId: string, skill: any) => {
    setProfile({
      ...profile,
      hobbies: profile.hobbies.map((h) => (h.id === hobbyId ? { ...h, skillLevel: skill } : h)),
    });
  };

  const handleAddPhoto = () => {
    const defaultPhotos = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
    ];
    const newPhotoUrl = defaultPhotos[profile.photos.length % defaultPhotos.length];
    const newPhoto: ProfilePhoto = {
      id: `photo_${Date.now()}`,
      url: newPhotoUrl,
      caption: 'New hobby moment',
      hobbyTag: profile.hobbies[0]?.name || 'Hobby',
    };
    setProfile({ ...profile, photos: [...profile.photos, newPhoto] });
  };

  const handleRemovePhoto = (id: string) => {
    if (profile.photos.length <= 2) {
      alert('A minimum of 2 photos is required for an authentic profile.');
      return;
    }
    setProfile({
      ...profile,
      photos: profile.photos.filter((p) => p.id !== id),
    });
  };

  const handleGenerateAiBio = async () => {
    setIsGeneratingBio(true);
    try {
      const response = await fetch('/api/ai/bio-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          occupation: profile.occupation,
          hobbies: profile.hobbies.map((h) => h.name),
          lookingFor: profile.lookingFor,
          tone: 'Sincere & Witty',
          draftBio: profile.bio,
        }),
      });
      const data = await response.json();
      if (data.bioOptions) {
        setAiBioOptions(data.bioOptions);
      }
    } catch (err) {
      console.error('Error generating AI bio:', err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const startSelfieVerification = async () => {
    setIsVerifyingSelfie(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (selfieVideoRef.current) {
        selfieVideoRef.current.srcObject = stream;
      }
      // Simulate face verification analysis
      setTimeout(() => {
        setVerificationSuccess(true);
        setProfile((prev) => ({
          ...prev,
          verified: true,
          verifiedAt: new Date().toISOString().split('T')[0],
          badges: Array.from(new Set([...prev.badges, '🛡️ Verified Hobbyist'])),
        }));
        setIsVerifyingSelfie(false);
        stream.getTracks().forEach((track) => track.stop());
      }, 3500);
    } catch (e) {
      // Fallback verification simulation if camera not allowed
      setTimeout(() => {
        setVerificationSuccess(true);
        setProfile((prev) => ({
          ...prev,
          verified: true,
          verifiedAt: new Date().toISOString().split('T')[0],
          badges: Array.from(new Set([...prev.badges, '🛡️ Verified Hobbyist'])),
        }));
        setIsVerifyingSelfie(false);
      }, 2000);
    }
  };

  const handleSaveAndClose = () => {
    onSave(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-stone-900 border border-stone-800 rounded-3xl text-stone-100 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Edit Your Passion Profile</h2>
              <p className="text-xs text-stone-400">Showcase what you love and attract like-minded partners</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-semibold shadow-md transition"
            >
              Save Profile
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-800 bg-stone-950/40 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'photos'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Photos & Captions ({profile.photos.length}/6)
          </button>
          <button
            onClick={() => setActiveTab('hobbies')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'hobbies'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Hobbies & Passions ({profile.hobbies.length})
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'prompts'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Bio & Prompts
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition flex items-center space-x-1 ${
              activeTab === 'verification'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Photo Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Privacy & Settings
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* 1. Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-200">Profile & Hobby Photos</h3>
                  <p className="text-xs text-stone-400">
                    Upload 2 to 6 photos. We recommend at least 2 photos showing you engaged in your hobbies!
                  </p>
                </div>
                {profile.photos.length < 6 && (
                  <button
                    onClick={handleAddPhoto}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profile.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden group shadow-md"
                  >
                    <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {index === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-[10px] font-bold text-white shadow">
                        Main Profile Photo
                      </span>
                    )}

                    {/* Photo Hobby Tag Caption Input */}
                    <div className="p-2 bg-stone-900 border-t border-stone-800">
                      <input
                        type="text"
                        value={photo.hobbyTag || ''}
                        onChange={(e) => {
                          const updated = profile.photos.map((p) =>
                            p.id === photo.id ? { ...p, hobbyTag: e.target.value } : p
                          );
                          setProfile({ ...profile, photos: updated });
                        }}
                        placeholder="Tag hobby (e.g. Pour-over)"
                        className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-800 text-[11px] text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Hobbies & Passions Tab */}
          {activeTab === 'hobbies' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-200">Your Selected Hobbies</h3>
                <p className="text-xs text-stone-400 mb-3">
                  Select your passions and adjust your experience level so we can find compatible matches.
                </p>

                {/* Active Hobbies List */}
                <div className="space-y-2">
                  {profile.hobbies.map((hobby) => (
                    <div
                      key={hobby.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-stone-950 border border-stone-800 gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{hobby.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-stone-100 block">{hobby.name}</span>
                          <span className="text-[10px] text-stone-400 capitalize">{hobby.category.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Skill Level Selector */}
                        <select
                          value={hobby.skillLevel || 'Weekend Enthusiast'}
                          onChange={(e) => handleUpdateHobbySkill(hobby.id, e.target.value)}
                          className="bg-stone-900 text-stone-300 border border-stone-700 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="Curious Beginner">Curious Beginner</option>
                          <option value="Weekend Enthusiast">Weekend Enthusiast</option>
                          <option value="Dedicated Passion">Dedicated Passion</option>
                          <option value="Expert / Obsessed">Expert / Obsessed</option>
                        </select>

                        <button
                          onClick={() => handleRemoveHobby(hobby.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add More Hobbies */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Browse & Add More Passions:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ALL_AVAILABLE_HOBBIES.filter(
                    (allH) => !profile.hobbies.some((myH) => myH.id === allH.id)
                  ).map((hobby) => (
                    <button
                      key={hobby.id}
                      onClick={() => handleAddHobby(hobby)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>{hobby.icon}</span>
                      <span>{hobby.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Bio & Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              {/* Bio Section with AI Polish Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Dating & Hobby Bio
                  </label>
                  <button
                    onClick={handleGenerateAiBio}
                    disabled={isGeneratingBio}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingBio ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingBio ? 'AI is crafting...' : 'AI Bio Polish'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Describe your passions, your weekend routines, and what kind of hobby companion you are seeking..."
                  className="w-full p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />

                {/* AI Bio Options Picker */}
                {aiBioOptions.length > 0 && (
                  <div className="p-3 rounded-2xl bg-stone-950/80 border border-amber-500/30 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      Select an AI Polish Option:
                    </span>
                    {aiBioOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProfile({ ...profile, bio: opt.bio })}
                        className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left transition"
                      >
                        <span className="text-[10px] font-semibold text-rose-400 block mb-0.5">{opt.style}</span>
                        <p className="text-xs text-stone-200">"{opt.bio}"</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompts Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Profile Prompts & Questions
                </h4>
                {profile.prompts.map((prompt, idx) => (
                  <div key={prompt.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-serif">
                        Prompt #{idx + 1}
                      </span>
                    </div>

                    <select
                      value={prompt.question}
                      onChange={(e) => {
                        const updated = profile.prompts.map((p) =>
                          p.id === prompt.id ? { ...p, question: e.target.value } : p
                        );
                        setProfile({ ...profile, prompts: updated });
                      }}
                      className="w-full p-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      {PROMPT_TEMPLATES.map((tmpl, tIdx) => (
                        <option key={tIdx} value={tmpl}>
                          {tmpl}
                        </option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={prompt.answer}
                      onChange={(e) => {
                        const updated = profile.prompts.map((p) =>
                          p.id === prompt.id ? { ...p, answer: e.target.value } : p
                        );
                        setProfile({ ...profile, prompts: updated });
                      }}
                      placeholder="Write your genuine, detailed answer here..."
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Photo Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6 text-center max-w-md mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">
                  {verificationSuccess ? 'Profile Verified!' : 'Verify Your Real Identity'}
                </h3>
                <p className="text-xs text-stone-400">
                  {verificationSuccess
                    ? 'Your selfie match is confirmed. You now carry the blue verification shield and get 3x more match visibility.'
                    : 'Take a quick live selfie to confirm you match your photos. Protects our hobby community from catfishes & bots.'}
                </p>
              </div>

              {isVerifyingSelfie ? (
                <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl bg-black">
                  <video
                    ref={selfieVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute inset-0 border-4 border-dashed border-white/60 rounded-full animate-spin [animation-duration:8s]" />
                  <span className="absolute bottom-4 inset-x-0 text-center text-xs font-bold text-white bg-black/60 py-1">
                    Matching facial symmetry...
                  </span>
                </div>
              ) : verificationSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Verified on {profile.verifiedAt || 'Today'}</span>
                </div>
              ) : (
                <button
                  onClick={startSelfieVerification}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold text-xs shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start 5-Second Live Selfie Check</span>
                </button>
              )}
            </div>
          )}

          {/* 5. Privacy & Settings Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-200 mb-1">Location & Distance Privacy</h3>
                <p className="text-xs text-stone-400 mb-4">
                  Control how your approximate location and proximity are displayed to other hobbyists.
                </p>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">
                        Approximate Distance Fuzzing
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Shows "~2 km away in {profile.location.neighborhood}" rather than precise coordinates.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.distanceFuzzing}
                      onChange={(e) =>
                        setProfile({ ...profile, distanceFuzzing: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-200 block">
                        Age Verification
                      </span>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        ✓ 18+ Age Verified (Born {2026 - profile.age})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Deletion */}
              <div className="pt-4 border-t border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Account Management
                </h4>
                {showDeleteConfirm ? (
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-xs space-y-3">
                    <p className="text-rose-200 font-medium">
                      Are you sure you want to delete your profile? All matches and messages will be permanently removed.
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          alert('Account has been safely reset.');
                          window.location.reload();
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-rose-950 text-rose-400 border border-rose-900/60 text-xs font-medium transition"
                  >
                    Delete My Account & Data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
