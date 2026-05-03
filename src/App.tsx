import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vote, 
  ShieldCheck, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  ChevronRight,
  Fingerprint,
  Cpu,
  Globe,
  Smartphone,
  Loader2,
  User as UserIcon,
  Menu,
  X,
  Lock,
  Info,
  Database,
  History,
  Activity,
  Server,
  Zap,
  Box,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { auth } from './lib/firebase';
import { loginWithGoogle, logout, subscribeToAuth, getUserProfile, loginWithVoterId, loginWithEmail, loginWithCandidateId, signUpWithEmailPassword, loginWithEmailPassword } from './services/authService';
import { UserProfile } from './types';

// Pages - defined below for now or imported
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import Verification from './components/Verification';
import Ballot from './components/Ballot';
import CandidateDetails from './components/CandidateDetails';
import HelpSupport from './components/HelpSupport';

import { useSettings } from './contexts/SettingsContext';
import SettingsPage from './components/Settings';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const { theme, t } = useSettings();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-blue-600"
        >
          <Vote size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-100 font-sans transition-colors duration-500">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-[120px]" />
        </div>

        <Navbar user={user} onOpenLogin={() => setShowLoginModal(true)} onLogout={handleLogout} />

        <main className="relative z-10 pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage onOpenLogin={() => setShowLoginModal(true)} onOpenProtocol={() => setShowProtocolModal(true)} />} />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/assistant" 
                element={<Assistant />} 
              />
              <Route 
                path="/verification" 
                element={user ? <Verification user={user} onVerify={(profile) => setUser(profile)} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/ballot/:id" 
                element={user ? <Ballot user={user} /> : <Navigate to="/" />} 
              />
              <Route 
                path="/candidate/:id" 
                element={<CandidateDetails />} 
              />
              <Route 
                path="/help" 
                element={<HelpSupport />} 
              />
              <Route 
                path="/settings" 
                element={user ? <SettingsPage user={user} onUpdateUser={(u) => setUser(u)} /> : <Navigate to="/" />} 
              />
            </Routes>
          </AnimatePresence>
          <AssistantShortcut />
        </main>

        <AnimatePresence>
          {showLoginModal && (
            <LoginModal 
              onClose={() => setShowLoginModal(false)} 
              onSuccess={(p) => {
                setShowLoginModal(false);
                setUser(p);
              }} 
            />
          )}
          {showProtocolModal && (
            <ProtocolModal onClose={() => setShowProtocolModal(false)} />
          )}
        </AnimatePresence>
        
        <Footer />
      </div>
    </Router>
  );
};

const AssistantShortcut: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/assistant') return null;

  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-[60]"
    >
      <Link 
        to="/assistant"
        className="group relative flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
        <div className="relative w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:-translate-y-1 transition-all duration-500 group-hover:-rotate-6">
          <MessageSquare size={24} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
          <div className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-slate-100 flex items-center gap-2 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            AI Protocol Assistant
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProtocolModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="p-8 md:p-12 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <Cpu size={14} />
                Protocol Architecture v4.0.2
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Security Manifesto</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProtocolCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Zero Knowledge Proofs (ZKP)"
              description="Verify your identity without revealing any personal data. The state knows you are eligible, but not WHO you are."
            />
            <ProtocolCard 
              icon={<Box className="text-blue-500" />}
              title="Immutable Ledger"
              description="Every vote is cryptographically hashed and multi-sig distributed across 14,000 independent global nodes."
            />
            <ProtocolCard 
              icon={<Lock className="text-purple-500" />}
              title="E2EE Balloting"
              description="End-to-end encrypted tunnels ensure your choice is unreadable from the moment of selection until the final tally."
            />
            <ProtocolCard 
              icon={<Activity className="text-amber-500" />}
              title="Real-time Audit"
              description="Publicly verifiable tallying process. Anyone can verify the integrity of the count without breaching voter privacy."
            />
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <Server size={20} className="text-blue-400" />
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight italic text-blue-400">Quantum Governance</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                VoteEase utilizes post-quantum cryptographic primitives to ensure that today's democratic choices remain secure 50 years into the future.
              </p>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  ))}
                </div>
                <span className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest">Active Mainnet: #829,102</span>
              </div>
            </div>
            <Zap className="absolute -bottom-6 -right-6 size-32 text-blue-500/[0.05] group-hover:rotate-12 transition-transform duration-1000" />
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 text-center font-black text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
          >
            Acknowledge Protocol
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProtocolCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:border-blue-100 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-black text-slate-900 dark:text-white mb-2 tracking-tight">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
  </div>
);

const Navbar: React.FC<{ user: UserProfile | null, onOpenLogin: () => void, onLogout: () => void }> = ({ user, onOpenLogin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { t, theme, setTheme } = useSettings();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-sm py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Vote size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">VoteEase</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Global Protocol</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/40 dark:bg-slate-800/40 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-700/40 backdrop-blur-sm">
            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label={t('dashboard')} active={!!user} onOpenLogin={onOpenLogin} current={location.pathname === '/dashboard'} />
            <NavLink to="/assistant" icon={<MessageSquare size={18} />} label="Assistant" current={location.pathname === '/assistant'} />
            <NavLink to="/verification" icon={<ShieldCheck size={18} />} label={t('verification_status')} active={!!user} onOpenLogin={onOpenLogin} current={location.pathname === '/verification'} />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 transition-all shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 20, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {user ? (
              <div className="relative group">
                <div 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 px-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer hover:border-blue-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full rounded-xl object-cover" /> : <UserIcon size={18} />}
                  </div>
                  <div className="hidden sm:flex flex-col items-end px-2">
                    <div className="flex items-center gap-1.5 leading-none">
                      {user.uid.startsWith('mock-') && (
                        <span className="text-[6px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Demo</span>
                      )}
                      <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Voter</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">{user.displayName}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {(isUserMenuOpen || false) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl p-2 z-[60]"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('profile')}</p>
                         <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                      </div>
                      <Link to="/settings" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">
                        <Settings size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">{t('settings')}</span>
                      </Link>
                      <Link to="/help" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">
                        <HelpCircle size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">{t('help_support')}</span>
                      </Link>
                      <button 
                        onClick={() => onLogout()}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all mt-1"
                      >
                        <LogOut size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">{t('logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="hidden sm:block px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 border border-white/10"
              >
                Secure Access
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-900 border border-slate-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Vault" active={!!user} onOpenLogin={onOpenLogin} current={location.pathname === '/dashboard'} />
                  <NavLink to="/assistant" icon={<MessageSquare size={20} />} label="Assistant" current={location.pathname === '/assistant'} />
                  <NavLink to="/verification" icon={<ShieldCheck size={20} />} label="Verification" active={!!user} onOpenLogin={onOpenLogin} current={location.pathname === '/verification'} />
                </div>
                {!user && (
                  <button 
                    onClick={onOpenLogin}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em]"
                  >
                    Enter Secure Access
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

interface LoginModalProps {
  onClose: () => void;
  onSuccess: (p: UserProfile) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const [method, setMethod] = useState<'options' | 'email_pass' | 'voter_id'>('options');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'voter' | 'candidate'>('voter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useSettings();

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const p = await loginWithGoogle();
      if (p) onSuccess(p);
      else setError(t('login_failed'));
    } catch (e: any) {
      setError(e.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let p: UserProfile | null = null;
      if (method === 'email_pass') {
        if (isSignUp) {
          if (!termsAccepted) {
            throw new Error('You must accept the Terms and Conditions to create an account.');
          }
          if (!email || !password || !name || !voterId) {
            throw new Error('All fields are required.');
          }
          p = await signUpWithEmailPassword(email, password, name, voterId.toUpperCase());
        } else {
          if (!email || !password) {
            throw new Error('Email and password are required.');
          }
          p = await loginWithEmailPassword(email, password);
        }
      } else if (method === 'voter_id') {
        const value = voterId.trim();
        if (!value) throw new Error('ID is required.');
        if (role === 'candidate') p = await loginWithCandidateId(value);
        else p = await loginWithVoterId(value);
      }
      
      if (p) onSuccess(p);
      else setError(t('login_failed'));
    } catch (err: any) {
      setError(err.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-inner mb-4">
               {role === 'voter' ? <ShieldCheck size={32} /> : <UserIcon size={32} />}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {method === 'options' ? (role === 'voter' ? t('login_voter') : "Candidate Access") : (isSignUp ? "Create Account" : "Access Vault")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {isSignUp ? "Establish your decentralized identity" : t('auth_vector')}
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setRole('voter'); setError(null); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                role === 'voter' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Voter
            </button>
            <button 
              onClick={() => { setRole('candidate'); setError(null); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                role === 'candidate' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Candidate
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-xs font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {method === 'options' ? (
              <motion.div 
                key="options" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-4"
              >
                <button 
                  onClick={() => { setMethod('email_pass'); setIsSignUp(true); }}
                  className="w-full p-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex flex-col items-center gap-2 group"
                >
                  <span className="text-lg">Create Secure Account</span>
                  <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">Proper identity establishment</span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 tracking-[0.3em]"><span className="bg-white dark:bg-slate-900 px-3">REGISTERED?</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setMethod('email_pass'); setIsSignUp(false); }} className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all border border-slate-50 dark:border-slate-600">
                      <Fingerprint size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Vault Login</span>
                  </button>
                  <button onClick={() => setMethod('voter_id')} className="flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all border border-slate-50 dark:border-slate-600">
                      <Cpu size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Quick Access</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleGoogle} 
                    className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-transparent"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </motion.div>
            ) : method === 'email_pass' ? (
              <motion.form 
                key="email_pass"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {isSignUp && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Legal Name</label>
                      <input 
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 text-slate-800 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Voter ID Hash</label>
                      <input 
                        required
                        type="text"
                        value={voterId}
                        onChange={(e) => setVoterId(e.target.value)}
                        placeholder="ABC123456789"
                        className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 text-slate-800 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-medium"
                      />
                    </div>
                    
                    <div className="flex items-start gap-3 px-2 pt-2 pb-1">
                      <div className="relative flex items-center h-5">
                        <input 
                          id="terms"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-4 h-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded focus:ring-blue-500 text-blue-600 transition-all cursor-pointer"
                        />
                      </div>
                      <label htmlFor="terms" className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed cursor-pointer select-none">
                        I acknowledge the <span className="text-blue-600 font-bold hover:underline">Decentralized Governance Protocol</span> and accept all terms regarding identity immutability and biometric verification.
                      </label>
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@clearvote.local"
                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 text-slate-800 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Cryptographic Password</label>
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 text-slate-800 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-medium"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : (isSignUp ? "Begin Registration" : "Authorize Access")}
                </button>
                <div className="flex justify-between items-center px-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => { setMethod('options'); setError(null); }}
                    className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors"
                  >
                    {isSignUp ? "Already have a vault?" : "Need a vault?"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="voter_id"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                    {role === 'candidate' ? 'Candidate Hash' : 'Digital Voter ID'}
                  </label>
                  <input 
                    autoFocus
                    required
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder={role === 'candidate' ? 'CAND-7392-...' : 'ABC123456789'}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 text-slate-800 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all font-medium"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : t('request_validation')}
                </button>
                <button 
                  type="button"
                  disabled={loading}
                  onClick={() => { setMethod('options'); setVoterId(''); setError(null); }}
                  className="w-full text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest pt-2"
                >
                  {t('switch_method')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             {t('security_notice')}
           </p>
        </div>
      </motion.div>
    </div>
  );
};

const LoginOption: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, primary?: boolean }> = ({ icon, label, onClick, primary }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl flex items-center gap-4 border transition-all ${
      primary 
        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-100 hover:bg-blue-500' 
        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
    }`}
  >
    <div className={`shrink-0 ${primary ? 'text-blue-100' : 'text-slate-400'}`}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    <ChevronRight size={16} className="ml-auto opacity-30" />
  </button>
);

const NavLink: React.FC<{ 
  to: string, 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onOpenLogin?: () => void,
  current?: boolean
}> = ({ to, icon, label, active = true, onOpenLogin, current = false }) => {
  const content = (
    <>
      {icon}
      <span className="tracking-tight">{label}</span>
    </>
  );

  const baseStyles = "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 uppercase tracking-tighter";
  
  if (!active && onOpenLogin) {
    return (
      <button 
        onClick={(e) => {
          e.preventDefault();
          onOpenLogin();
        }}
        className={`${baseStyles} text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className={`${baseStyles} ${
        current 
          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700' 
          : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
      }`}
    >
      {content}
    </Link>
  );
};

const Footer: React.FC = () => {
  const { t } = useSettings();
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 mt-20 pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Vote className="text-blue-600 dark:text-blue-400" size={24} />
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">VoteEase</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Redefining global democracy through end-to-end encryption, AI-driven transparency, and uncompromising accessibility.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">Protocol</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Encryption Matrix</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Voter Rights</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">System Integrity</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-800 dark:text-slate-200 uppercase text-xs tracking-widest">Support</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/assistant" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Assistant</Link></li>
            <li><Link to="/help" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('help_support')}</Link></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Transparency Hub</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        <span>© 2026 VoteEase Protocol. All Rights Reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Transparency Report</a>
        </div>
      </div>
    </footer>
  );
};

export default App;
