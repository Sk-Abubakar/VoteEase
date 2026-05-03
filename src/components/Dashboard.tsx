import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Vote, 
  History, 
  ArrowRight, 
  Bell, 
  Smartphone,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Fingerprint,
  Cpu,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserProfile, Election } from '../types';
import { getElections, seedDemoData } from '../services/electionService';
import { useSettings } from '../contexts/SettingsContext';

import CandidateDashboard from './CandidateDashboard';

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useSettings();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ensure demo data is there
        await seedDemoData();
        const list = await getElections();
        setElections(list);
      } catch (err) {
        console.error(err);
        setError("Failed to synchronize with the blockchain nodes. Please retry.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredElections = elections.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || e.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const activeElections = filteredElections.filter(e => e.status === 'active');
  const upcomingElections = filteredElections.filter(e => e.status === 'upcoming');

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-inner">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 uppercase">System Sync Error</h2>
          <p className="text-slate-500 max-w-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl"
        >
          Re-initialize Vault
        </button>
      </div>
    );
  }

  // If user is a candidate, show the candidate dashboard
  if (user.role === 'candidate') {
    return <CandidateDashboard user={user} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Verification Banner */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Identity Ledger Active
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mb-6">
              {t('vault')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
              {t('citizen')} <span className="text-slate-900 dark:text-white font-bold">{user.displayName}</span>, your biometric data is protected by the Global Voting Protocol.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8 relative z-10">
             <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
               <Fingerprint size={20} className="text-blue-500" />
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</span>
                 <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user.uid.slice(0, 16).toUpperCase()}</span>
               </div>
             </div>
             <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
               <ShieldCheck size={20} className="text-emerald-500" />
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Security Level</span>
                 <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Tier {user.isVerified ? 'Gold' : 'Basic'}</span>
               </div>
             </div>
          </div>
          <ShieldCheck className="absolute -bottom-12 -right-12 text-slate-50/80 dark:text-white/5 size-72 pointer-events-none -rotate-12" />
        </div>

        <div className={`p-8 rounded-[3rem] border shadow-xl flex flex-col justify-between relative overflow-hidden transition-all ${
          user.isVerified 
            ? 'bg-emerald-500 text-white border-emerald-400' 
            : 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
        }`}>
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${
              user.isVerified ? 'bg-white/20 backdrop-blur-md' : 'bg-white dark:bg-slate-800'
            }`}>
              {user.isVerified ? <ShieldCheck size={32} /> : <ShieldAlert size={32} className="text-amber-600 dark:text-amber-400" />}
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight leading-tight">
                {user.isVerified ? 'Verification Complete' : 'Verification Required'}
              </h3>
              <p className={`text-sm font-medium mt-2 leading-relaxed ${user.isVerified ? 'text-emerald-100' : 'text-amber-700 dark:text-amber-400'}`}>
                {user.isVerified 
                  ? 'Your identity is synchronized across all 14,000 global verification nodes.' 
                  : 'Link your global credentials to unlock immutable voting rights.'}
              </p>
            </div>
          </div>
          {!user.isVerified && (
            <Link 
              to="/verification" 
              className="mt-6 flex items-center justify-between w-full bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl text-amber-900 dark:text-amber-100 font-bold hover:bg-amber-50 dark:hover:bg-slate-700 shadow-lg group transition-all"
            >
              {t('start_verification')}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {user.isVerified && (
            <div className="mt-6 flex items-center gap-2 text-emerald-100 font-black text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-100 animate-pulse" />
              Node Sync: 100%
            </div>
          )}
        </div>
      </section>
      
      {/* Election Timeline Section */}
      <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter">Election Lifecycle</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Global milestones and protocol deadlines for active cycles.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
            <Clock size={14} /> Synchronized with GMT
          </div>
        </div>

        <div className="relative pt-10 pb-4 overflow-x-auto no-scrollbar">
          <div className="min-w-[800px] relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                className="h-full bg-blue-600"
               />
            </div>

            {/* Timeline Points */}
            <div className="relative flex justify-between">
              {elections.slice(0, 3).map((election, idx) => (
                <React.Fragment key={election.id}>
                  <TimelinePoint 
                    icon={<Target size={16} />}
                    label="Registration"
                    date={new Date(election.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    status="completed"
                    isActive={true}
                  />
                  <TimelinePoint 
                    icon={<ShieldCheck size={16} />}
                    label="Verification Cutoff"
                    date={new Date(election.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    status="current"
                    isActive={true}
                  />
                  <TimelinePoint 
                    icon={<Vote size={16} />}
                    label="Voting Open"
                    date={new Date(election.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    status="upcoming"
                    isActive={false}
                  />
                  <TimelinePoint 
                    icon={<Cpu size={16} />}
                    label="Tally Process"
                    date={new Date(election.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    status="upcoming"
                    isActive={false}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Elections */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-1">
                <h2 className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter">{t('live_ballots')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Protocol-registered events requiring your immediate action.</p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                     <Bell size={18} />
                   </div>
                   <input 
                     type="text"
                     id="election-search"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search elections..."
                     aria-label="Search available elections"
                     className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                   />
                </div>
                <div className="bg-slate-900 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeElections.length} Active
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array(2).fill(0).map((_, i) => (
                  <div key={i} className="h-64 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm" />
                ))
              ) : activeElections.length > 0 ? (
                activeElections.map(election => (
                  <ElectionCard key={election.id} election={election} user={user} />
                ))
              ) : (
                <div className="col-span-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center text-slate-200 dark:text-slate-500 mx-auto shadow-md">
                    <Vote size={40} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-sm">No Active Cycles</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">Awaiting next sequence from Global Node Hub.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-1">
              <h2 className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter">{t('history')}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Verified cryptographic receipts for past participation.</p>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {user.votedElections.length > 0 ? (
                user.votedElections.map((id) => (
                  <HistoryItem key={id} electionId={id} />
                ))
              ) : (
                <div className="p-16 text-center space-y-4">
                  <History size={48} className="mx-auto text-slate-200 dark:text-slate-700" />
                  <p className="text-slate-400 text-sm font-black uppercase tracking-widest">No Record History Available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Meta */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          <div className="bg-slate-900 dark:bg-blue-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <TrendingUp size={28} className="text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">{t('stats')}</h3>
                <div className="text-5xl font-black tracking-tighter text-white">78.4<span className="text-xl text-blue-100/30">%</span></div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Verified participation rate across the 2026 Sovereign Block.</p>
              </div>
              
              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>Protocol Health</span>
                    <span className="text-emerald-400">Optimal</span>
                  </div>
                  <div className="flex gap-1.5 h-1.5">
                    {Array(10).fill(0).map((_, i) => (
                      <div key={i} className={`flex-1 rounded-full ${i < 9 ? 'bg-emerald-400' : 'bg-white/10'} transition-all`} />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Nodes</p>
                      <p className="text-lg font-black tracking-tight text-white">14.2K</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Block</p>
                      <p className="text-lg font-black tracking-tight text-white">#829K</p>
                   </div>
                </div>
              </div>
            </div>
            <Cpu className="absolute -bottom-16 -right-16 size-64 text-white/[0.02] group-hover:rotate-45 transition-transform duration-[3s] pointer-events-none" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
             <div className="flex items-center gap-3 px-2">
               <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <Bell size={20} />
               </div>
               <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">{t('directives')}</h3>
             </div>
             <div className="space-y-6">
               <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-3 hover:border-blue-200 transition-colors cursor-pointer">
                 <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Core Patch v2.4</p>
                   <span className="w-2 h-2 rounded-full bg-blue-500" />
                 </div>
                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold">Encrypted node synchronization complete. Zero-knowledge proofs active.</p>
               </div>
               <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-3 hover:border-slate-200 transition-colors cursor-pointer">
                 <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hash Migration</p>
                   <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                 </div>
                 <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold">Legacy ID hashes rotating in 14 cycles. Verify your backup shards.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ElectionCard: React.FC<{ election: Election, user: UserProfile }> = React.memo(({ election, user }) => {
  const hasVoted = user.votedElections.includes(election.id);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(election.endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) return "Ended";
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${days}d ${hours}h left`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 3600000);
    return () => clearInterval(timer);
  }, [election.endDate]);

  // Mock turnout data for visualization
  const turnoutPercent = 64; 
  
  return (
    <div className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transition-all space-y-6 flex flex-col justify-between relative overflow-hidden">
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <Vote size={28} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {election.category}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100 dark:border-amber-800">
              <History size={12} />
              {timeLeft}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
            {election.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-medium">
            {election.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>Voter Turnout</span>
            <span className="text-blue-600 dark:text-blue-400">{turnoutPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${turnoutPercent}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            />
          </div>
        </div>

        <Link 
          to={hasVoted ? '#' : `/ballot/${election.id}`}
          className={`w-full py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2 transition-all ${
            hasVoted 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default border border-emerald-100 dark:border-emerald-800' 
              : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 shadow-xl'
          }`}
        >
          {hasVoted ? (
            <>
              <ShieldCheck size={20} />
              Vote Immutable
            </>
          ) : (
            <>
              Secure Balloting
              <ChevronRight size={20} />
            </>
          )}
        </Link>
      </div>

      {/* Decorative background logo */}
      <Vote className="absolute -bottom-6 -right-6 text-slate-50 dark:text-white/5 opacity-[0.03] size-48 pointer-events-none" />
    </div>
  );
});

const HistoryItem: React.FC<{ electionId: string }> = ({ electionId }) => {
  const [election, setElection] = useState<Election | null>(null);

  useEffect(() => {
    const fetchElection = async () => {
      const all = await getElections();
      const match = all.find(e => e.id === electionId);
      if (match) setElection(match);
    };
    fetchElection();
  }, [electionId]);

  return (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest leading-none mb-1">
            {election?.title || electionId}
          </p>
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-bold border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded uppercase">Receipt Verified</span>
          </div>
        </div>
      </div>
      <button className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group-hover:translate-x-1">
        <ExternalLink size={18} />
      </button>
    </div>
  );
};

const CheckItem: React.FC<{ label: string, completed: boolean }> = ({ label, completed }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
      completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-slate-200'
    }`}>
      {completed && <ShieldCheck size={12} strokeWidth={4} />}
    </div>
    <span className={`text-sm font-medium ${completed ? 'text-slate-800' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

export default Dashboard;

const TimelinePoint: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  date: string, 
  status: 'completed' | 'current' | 'upcoming',
  isActive: boolean
}> = React.memo(({ icon, label, date, status, isActive }) => (
  <div className="flex flex-col items-center gap-6 relative z-10 w-48">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
      status === 'completed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' :
      status === 'current' ? 'bg-white dark:bg-slate-900 border-4 border-blue-600 text-blue-600 scale-110 shadow-2xl' :
      'bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400'
    }`}>
      {icon}
    </div>
    <div className="text-center space-y-1">
      <p className={`text-[10px] font-black uppercase tracking-widest ${
        isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'
      }`}>{label}</p>
      <p className="text-[10px] font-bold text-slate-400/80">{date}</p>
    </div>
    {status === 'current' && (
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-bounce">
        Active Node
      </div>
    )}
  </div>
));
