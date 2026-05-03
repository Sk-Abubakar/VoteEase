import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Target,
  Globe,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Edit3,
  Save,
  Wand2,
  BrainCircuit,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile, Candidate, Election } from '../types';
import { getElections, getCandidates, updateCandidateProfile } from '../services/electionService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';

type ActiveTab = 'overview' | 'manifesto' | 'strategy';

const CandidateDashboard: React.FC<{ user: UserProfile }> = React.memo(({ user }) => {
  const [myCandidateProfiles, setMyCandidateProfiles] = useState<Candidate[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Candidate>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allElections = await getElections();
        setElections(allElections);
        
        const candidates: Candidate[] = [];
        for (const election of allElections) {
            const list = await getCandidates(election.id);
            const match = list.find(c => c.name.toLowerCase().includes(user.displayName.toLowerCase()) || (user.role === 'candidate' && c.id === 'marcus-thorne'));
            if (match) candidates.push(match);
        }
        
        if (candidates.length === 0 && user.role === 'candidate') {
            const demoCandidates = await getCandidates('presidential-2026');
            if (demoCandidates.length > 0) candidates.push(demoCandidates[1]);
        }
        
        setMyCandidateProfiles(candidates);
        if (candidates[0]) {
          setEditData({
            bio: candidates[0].bio,
            platform: candidates[0].platform,
            vision: candidates[0].vision
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const primaryProfile = myCandidateProfiles[0];

  const handleSaveProfile = async () => {
    if (!primaryProfile) return;
    setIsSaving(true);
    try {
      await updateCandidateProfile(primaryProfile.electionId, primaryProfile.id, editData);
      setIsEditing(false);
      // Refresh local state
      setMyCandidateProfiles(prev => [{ ...prev[0], ...editData }, ...prev.slice(1)]);
    } catch (err: any) {
      console.error("Failed to save candidate profile:", err);
      alert("Failed to broadcast manifesto: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  // Mock data for charts
  const sentimentData = [
    { name: 'Mon', value: 45 }, { name: 'Tue', value: 52 }, { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 }, { name: 'Fri', value: 58 }, { name: 'Sat', value: 63 }, { name: 'Sun', value: 68 },
  ];

  const demographicData = [
    { group: '18-24', support: 75, color: '#3B82F6' },
    { group: '25-34', support: 62, color: '#6366F1' },
    { group: '35-44', support: 55, color: '#8B5CF6' },
    { group: '45-54', support: 42, color: '#A855F7' },
    { group: '55+', support: 38, color: '#D946EF' },
  ];

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Command Interface...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Header */}
      <section className="bg-slate-950 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /> Global Campaign Hub
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                  Candidate <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">HQ Protocol</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-xl text-lg">
                  Integrity Verified. Welcome, <span className="text-white">{user.displayName}</span>. Managing election instance: <span className="text-blue-400">{elections[0]?.title}</span>.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Adviser" className="opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-blue-600 text-[10px] font-black flex items-center justify-center ring-1 ring-white/10">+24</div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all"
            >
                <Settings size={20} />
            </motion.button>
          </div>
        </div>

        {/* Dynamic Wave Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#3B82F6_0%,transparent_50%)]" />
          <svg className="absolute bottom-0 w-full h-32 text-blue-500/20" preserveAspectRatio="none" viewBox="0 0 1440 120">
            <path fill="currentColor" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 w-fit mx-auto sticky top-4 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 shadow-2xl">
        {[
          { id: 'overview', label: 'Campaign Pulse', icon: <Zap size={16} /> },
          { id: 'manifesto', label: 'Manifesto Hub', icon: <Edit3 size={16} /> },
          { id: 'strategy', label: 'AI Strategy', icon: <BrainCircuit size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={<Users className="text-blue-500" />} 
                    label="Protocol Reach" 
                    value="1.4M" 
                    trend="+18%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={<TrendingUp className="text-emerald-500" />} 
                    label="Engagement Velocity" 
                    value="72.4%" 
                    trend="+5.1%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={<MessageSquare className="text-indigo-500" />} 
                    label="Global Sentiment" 
                    value="Positve" 
                    trend="84%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={<Award className="text-amber-500" />} 
                    label="Alignment Rank" 
                    value="#1" 
                    trend="Leader" 
                    isNeutral={true} 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Insight Chart */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trust Ledger Momentum</h3>
                      <p className="text-sm font-medium text-slate-500">Real-time aggregate of verified identity interactions.</p>
                    </div>
                    <div className="flex items-center gap-3 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <button className="px-4 py-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Live Feed</button>
                      <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Historical</button>
                    </div>
                  </div>

                  <div className="h-80 -ml-10 -mr-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentData}>
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#94a3b8" />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
                            itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          strokeWidth={6} 
                          dot={{ r: 6, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }} 
                          activeDot={{ r: 10, fill: '#1E40AF' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricMiniCard label="Daily Growth" value="+2.4k" icon={<BarChart3 size={16} />} />
                    <MetricMiniCard label="Voter Stability" value="98.2%" icon={<Globe size={16} />} />
                    <MetricMiniCard label="AI Conviction" value="Extremely High" icon={<Sparkles size={16} />} />
                  </div>
                </div>

                {/* Side Content */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Demographic Bias</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demographicData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="group" type="category" fontSize={10} axisLine={false} tickLine={false} width={60} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                          <Bar dataKey="support" radius={[0, 12, 12, 0]} barSize={24}>
                            {demographicData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                        Notice: Underperforming in the 55+ age group. AI recommends emphasizing stability and ledger transparency.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-[3.5rem] p-10 text-white space-y-6 relative overflow-hidden group shadow-2xl shadow-blue-500/20">
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Wand2 size={24} />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Strategy Unlock</h3>
                      <p className="text-blue-100 text-sm font-medium leading-relaxed">
                        We\'ve detected a shift in voter priorities regarding Space Colonization.
                      </p>
                      <button 
                        onClick={() => setActiveTab('strategy')}
                        className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                      >
                        Run Expansion Simulation
                      </button>
                    </div>
                    <Zap className="absolute -bottom-10 -right-10 size-40 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifesto' && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-12 md:p-16 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl">
                        <Save size={24} />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Voter Manifesto</h2>
                    </div>
                    <p className="text-slate-500 font-medium ml-1">Your core digital values, cryptographically signed upon publication.</p>
                  </div>
                  
                  <div className="flex gap-4">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all font-sans"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Broadcast to Ledger
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                      >
                        <Edit3 size={14} /> Edit Campaign Details
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-2 space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Target size={14} className="text-blue-500" /> Platform Foundation
                        </label>
                        {isEditing ? (
                          <input 
                            value={editData.platform || ''}
                            onChange={(e) => setEditData({...editData, platform: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            placeholder="Platform Title..."
                          />
                        ) : (
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase leading-tight italic">
                            "{primaryProfile?.platform}"
                          </h3>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Globe size={14} className="text-blue-500" /> Executive Bio
                        </label>
                        {isEditing ? (
                          <textarea 
                            value={editData.bio || ''}
                            onChange={(e) => setEditData({...editData, bio: e.target.value})}
                            rows={6}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-8 text-slate-600 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all leading-relaxed font-medium"
                            placeholder="Campaign Biography..."
                          />
                        ) : (
                          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                            {primaryProfile?.bio}
                          </p>
                        )}
                      </div>
                   </div>

                   <div className="space-y-8">
                     <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-200 dark:border-slate-700 space-y-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Vision</label>
                        {isEditing ? (
                          <textarea 
                            value={editData.vision || ''}
                            onChange={(e) => setEditData({...editData, vision: e.target.value})}
                            rows={4}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold text-slate-600 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                            placeholder="The Vision Statement..."
                          />
                        ) : (
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-relaxed uppercase italic">
                            "{primaryProfile?.vision}"
                          </p>
                        )}
                        <div className="pt-4 flex items-center gap-2 text-blue-600">
                          <Info size={16} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Publicly Indexed Field</span>
                        </div>
                     </div>
                     
                     <div className="p-8 bg-indigo-600 rounded-[3rem] text-white space-y-4">
                        <h4 className="text-xl font-bold tracking-tight">AI Audit Status</h4>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/20 w-fit px-3 py-1 rounded-full">
                          <CheckCircle className="text-indigo-200" size={14} /> Passed Confidence Test
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed">Your platform has no detected internal contradictions based on previous statements.</p>
                     </div>
                   </div>
                </div>

                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Advisor Controls */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[3.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6">
                      <div className="w-16 h-16 rounded-[2rem] bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center">
                        <BrainCircuit size={32} className="text-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black uppercase tracking-tighter">AI Stratos-5</h3>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Autonomous Governance & Campaign Optimization Interface.</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Processing Capacity</span>
                          <span className="text-blue-400">98%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-blue-500" />
                        </div>
                      </div>
                      <button className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                         Request Deep Analysis <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-[4s]">
                       <Sparkles size={120} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Key Opportunities</h4>
                    <div className="space-y-4">
                       <OpportunityItem label="Target 18-24s in Mega-City 1" reward="+4% Shift" color="blue" />
                       <OpportunityItem label="Pivot: Digital Sovereignty" reward="+7% Shift" color="emerald" />
                       <OpportunityItem label="Clarify Health Protocols" reward="Risk Reduc." color="amber" />
                    </div>
                  </div>
                </div>

                {/* Analysis Feed */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-10 md:p-14 shadow-sm space-y-12">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                          <TrendingUp size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Insights</h3>
                      </div>

                      <div className="space-y-6">
                        <InsightCard 
                          type="success"
                          title="Engagement Peak Detected"
                          desc="Your recent post on 'Verified Identity Ownership' resulted in a 42% spike in trust-ledger interactions among independent voters. Highly recommended to maintain this narrative."
                        />
                        <InsightCard 
                          type="warning"
                          title="Policy Consistency Gap"
                          desc="AI analysis detected a 12% probability of contradiction between your current Space Colonization vision and your 2024 budget statements. A corrective clarification is suggested."
                        />
                        <InsightCard 
                          type="info"
                          title="Demographic Migration"
                          desc="A significant portion of your supporters are migrating towards candidates with more aggressive 'Carbon Ledger' policies. Consider integrating a stronger environmental stance."
                        />
                      </div>

                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                             {[1, 2, 3, 4].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 overflow-hidden">
                                  <img src={`https://i.pravatar.cc/50?img=${i + 20}`} alt="avatar" />
                               </div>
                             ))}
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified by 4 Global Strategist Nodes</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend?: string, isPositive?: boolean, isNeutral?: boolean }> = React.memo(({ icon, label, value, trend, isPositive, isNeutral }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="w-14 h-14 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <div className="flex items-end gap-3">
             <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
             <span className={`text-[10px] font-black uppercase tracking-widest mb-1 px-2 py-0.5 rounded-lg ${
                 isNeutral ? 'bg-slate-100 text-slate-500' : 
                 isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
             }`}>
                {trend}
             </span>
        </div>
    </div>
  </div>
));

const MetricMiniCard: React.FC<{ label: string, value: string, icon: React.ReactNode }> = React.memo(({ label, value, icon }) => (
  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <h4 className="font-bold text-slate-900 dark:text-white text-lg">{value}</h4>
    </div>
    <div className="text-blue-600 opacity-50">{icon}</div>
  </div>
));

const OpportunityItem: React.FC<{ label: string, reward: string, color: string }> = React.memo(({ label, reward, color }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color === 'blue' ? 'bg-blue-600' : color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-500 transition-colors">{label}</span>
    </div>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{reward}</span>
  </div>
));

const InsightCard: React.FC<{ type: 'success' | 'warning' | 'info', title: string, desc: string }> = React.memo(({ type, title, desc }) => (
  <div className={`p-8 rounded-[2.5rem] border flex gap-6 ${
    type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' : 
    type === 'warning' ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20' :
    'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
  }`}>
    <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
      type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
      type === 'warning' ? 'bg-amber-100 text-amber-600' :
      'bg-blue-100 text-blue-600'
    }`}>
      {type === 'success' ? <TrendingUp size={20} /> : type === 'warning' ? <ShieldAlert size={20} /> : <Info size={20} />}
    </div>
    <div className="space-y-2">
      <h4 className={`font-black text-sm uppercase tracking-widest ${
         type === 'success' ? 'text-emerald-900 dark:text-emerald-400' : 
         type === 'warning' ? 'text-amber-900 dark:text-amber-400' :
         'text-blue-900 dark:text-blue-400'
      }`}>{title}</h4>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
));

const ShieldAlert: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const CheckCircle: React.FC<{ size?: number, className?: string }> = ({ size = 20, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const Loader2: React.FC<{ className?: string, size?: number }> = ({ className, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default CandidateDashboard;
