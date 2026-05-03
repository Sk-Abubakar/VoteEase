import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Moon, 
  Sun, 
  Languages, 
  Check, 
  Camera, 
  Mail, 
  FileText,
  Save,
  Palette,
  Settings as SettingsIcon,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { UserProfile } from '../types';
import { updateUserProfile } from '../services/authService';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const { theme, setTheme, language, setLanguage, t } = useSettings();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const updates = { displayName, email, bio, avatarUrl };
    try {
      if (!user.uid.startsWith('mock-')) {
        await updateUserProfile(user.uid, updates);
      }
      onUpdateUser({ ...user, ...updates });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      // In mock mode we already updated local state, but for real users we show error
      if (!user.uid.startsWith('mock-')) {
        alert("Failed to save changes: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleSwitch = async (newRole: 'voter' | 'candidate') => {
    setIsSaving(true);
    try {
      if (!user.uid.startsWith('mock-')) {
        await updateUserProfile(user.uid, { role: newRole });
      }
      onUpdateUser({ ...user, role: newRole });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to update role:", err);
      if (!user.uid.startsWith('mock-')) {
        alert("Role transition failed: " + (err.message || "Unknown error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('settings')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('preferences')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('edit_profile')}</h2>
            </div>

            {user.uid.startsWith('mock-') && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-600 dark:text-amber-500">
                <ShieldAlert size={20} className="shrink-0" />
                <p className="text-xs font-semibold">
                  <strong>Local Demo Mode Active:</strong> Your profile changes will not be saved to the global ledger because Anonymous Authentication is disabled in this project's Firebase settings. 
                  <br /><span className="opacity-80">Enable 'Anonymous' sign-in in the Firebase Console to fix this.</span>
                </p>
              </div>
            )}
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex flex-col items-center gap-6 pb-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-900 dark:text-white">{displayName}</h4>
                  <p className="text-xs text-slate-500">{t('role')}: {t(user.role || 'voter')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('full_name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('avatar_url')}</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('bio')}</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-6 text-slate-400" size={18} />
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-6 text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <span className="animate-spin text-lg">...</span> : <Save size={18} />}
                  {t('save')}
                </button>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest"
                  >
                    <Check size={16} />
                    Profile Synchronized
                  </motion.div>
                )}
              </div>
            </form>
          </section>

          {/* Role Transformation Section */}
          <section className="bg-slate-900 dark:bg-blue-950 p-8 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 backdrop-blur-md">
                   <Zap size={24} className="text-blue-400" />
                </div>
                <div>
                   <h2 className="text-xl font-bold italic">Protocol Role Transition</h2>
                   <p className="text-xs text-slate-400 font-medium">Switch your identity role within the VoteEase ecosystem for testing.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleRoleSwitch('voter')}
                  disabled={user.role === 'voter' || isSaving}
                  className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${
                    user.role === 'voter' || !user.role
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-widest">Global Citizen</h3>
                    {(user.role === 'voter' || !user.role) && <Check size={14} className="text-blue-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Access personal balloting, verification vaults, and historical receipts.</p>
                </button>

                <button 
                  onClick={() => handleRoleSwitch('candidate')}
                  disabled={user.role === 'candidate' || isSaving}
                  className={`p-6 rounded-2xl border transition-all text-left space-y-2 ${
                    user.role === 'candidate' 
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xs uppercase tracking-widest">Verified Candidate</h3>
                    {user.role === 'candidate' && <Check size={14} className="text-blue-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Manage your platform, view voter sentiment, and track campaign momentum.</p>
                </button>
              </div>
            </div>
            <ShieldAlert size={120} className="absolute -bottom-10 -right-10 text-white/[0.03] group-hover:rotate-12 transition-transform duration-[3s] pointer-events-none" />
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <Palette className="text-blue-600" size={20} />
              <h3 className="font-bold text-lg">{t('appearance')}</h3>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('theme')}</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Sun size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">{t('light')}</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                    theme === 'dark' ? 'bg-slate-900 shadow-sm text-blue-400' : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <Moon size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">{t('dark')}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('language')}</label>
              <div className="space-y-2">
                {[
                  { code: 'en', name: 'English' },
                  { code: 'ur', name: 'اردو' },
                  { code: 'hi', name: 'हिन्दी' },
                  { code: 'es', name: 'Español' },
                  { code: 'fr', name: 'Français' },
                  { code: 'de', name: 'Deutsch' }
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                      language === lang.code 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Languages size={18} className={language === lang.code ? 'text-blue-600' : 'text-slate-400'} />
                      <span className="text-sm font-bold">{lang.name}</span>
                    </div>
                    {language === lang.code && <Check size={18} />}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-red-50/30 dark:bg-red-900/10 p-8 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert size={20} />
              <h3 className="font-bold text-lg">Danger Zone</h3>
            </div>
            <p className="text-xs text-red-500 font-medium">Once you delete your profile, it cannot be undone. All voting history and biometric hashes will be permanently purged.</p>
            <button 
              id="purge-identity-button"
              disabled={isSaving}
              onClick={async () => {
                if (window.confirm("Are you absolutely sure? This action is irreversible. All voting history and biometric hashes will be permanently purged.")) {
                  setIsSaving(true);
                  try {
                    const { deleteUserProfile } = await import('../services/authService');
                    await deleteUserProfile(user.uid);
                    window.location.href = '/';
                  } catch (err) {
                    console.error(err);
                    alert("Failure during purge protocol. Identity node may still be active.");
                    setIsSaving(false);
                  }
                }
              }}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <span className="animate-spin text-lg">...</span> : <ShieldAlert size={14} />}
              Purge Identity Node
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
