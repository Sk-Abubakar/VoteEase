import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { 
  ChevronLeft, 
  Globe, 
  Cpu, 
  MessageSquare, 
  TrendingUp, 
  Award,
  BookOpen,
  Share2,
  ThumbsUp,
  BarChart3,
  X,
  Scale,
  Zap,
  Target,
  Shield,
  Lightbulb
} from 'lucide-react';

interface VisionPoint {
  id: string;
  title: string;
  impact: string;
  initiative: string;
  icon: React.ReactNode;
}

const VISION_DATA: Record<string, VisionPoint[]> = {
  'helena-vance': [
    {
      id: 'v1',
      title: 'Green Infrastructure',
      impact: '30% Reduction in Urban Carbon',
      initiative: 'Global Solar Grid Integration',
      icon: <Globe className="text-emerald-500" />
    },
    {
      id: 'v2',
      title: 'AI Transparency',
      impact: 'Public Trust Audit Score: 95/100',
      initiative: 'OpenSource Neural Governance',
      icon: <Shield className="text-blue-500" />
    },
    {
      id: 'v3',
      title: 'Ocean Restoration',
      impact: 'Coral Reef Recovery +15%',
      initiative: 'Autonomous Bio-Monitoring Transponders',
      icon: <Award className="text-cyan-500" />
    }
  ],
  'marcus-thorne': [
    {
      id: 'v4',
      title: 'Mars Colonization',
      impact: '3-Planet Redundancy Layer',
      initiative: 'Orbital Elevator Prototype v1',
      icon: <Zap className="text-orange-500" />
    },
    {
      id: 'v5',
      title: 'Digital UBI',
      impact: 'Zero Poverty for Network Nodes',
      initiative: 'Algorithmic Wealth Distribution Protocol',
      icon: <Cpu className="text-indigo-500" />
    },
    {
      id: 'v6',
      title: 'Neural Augmentation',
      impact: 'Individual Compute Capacity x10',
      initiative: 'Neural-Link Public Tier Beta',
      icon: <Lightbulb className="text-amber-500" />
    }
  ]
};

const VisionMatrix: React.FC<{ candidateId: string }> = ({ candidateId }) => {
  const points = VISION_DATA[candidateId] || [];
  const [selectedPoint, setSelectedPoint] = useState<VisionPoint | null>(null);
  const { t } = useSettings();

  return (
    <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
          <Target className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('vision_matrix')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">{t('vision_matrix_desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((point) => (
          <motion.button
            key={point.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPoint(selectedPoint?.id === point.id ? null : point)}
            className={`p-6 rounded-[2rem] border-2 transition-all text-left space-y-4 ${
              selectedPoint?.id === point.id 
                ? 'border-blue-600 bg-blue-50/10 dark:bg-blue-900/10 shadow-lg shadow-blue-100/20' 
                : 'border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 hover:border-blue-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
              {point.icon}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">{point.title}</h4>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedPoint ? (
          <motion.div
            key={selectedPoint.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] text-white space-y-6 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Impact Projection</span>
                <p className="text-2xl font-black">{selectedPoint.impact}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Policy Initiative</span>
                <p className="text-lg font-bold text-slate-300">{selectedPoint.initiative}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          <div className="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-center text-slate-400 dark:text-slate-600 font-medium">
            Select a vision point above to explore policy depth.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
import { Candidate } from '../types';
import { getElections, getCandidates } from '../services/electionService';

const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const [compareTarget, setCompareTarget] = useState<Candidate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await getCandidates('presidential-2026');
      setAllCandidates(cats);
      const found = cats.find(c => c.id === id);
      setCandidate(found || null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="py-20 text-center dark:text-white">Decrypting candidate profile...</div>;
  if (!candidate) return <div className="py-20 text-center dark:text-white">Candidate not found.</div>;

  const compareCandidates = allCandidates.filter(c => c.id !== id);

  return (
    <div className="space-y-12 pb-20">
      {/* Back & Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={18} className="rtl:rotate-180" />
          Back
        </button>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95"
          >
            <Scale size={18} />
            Compare
          </button>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden p-8 md:p-16">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left relative z-10">
          <div className="relative">
            <img 
              src={candidate.avatarUrl} 
              alt={candidate.name} 
              className="w-48 h-48 md:w-64 md:h-64 rounded-[3.5rem] object-cover ring-8 ring-blue-50 dark:ring-blue-900/30 shadow-2xl"
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
              Official Candidate
            </div>
          </div>
          
          <div className="flex-1 space-y-6 pt-4">
            <div className="space-y-2">
              <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                {candidate.party}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">{candidate.name}</h1>
            </div>
            
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              {candidate.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Approval Rating</span>
                <div className="flex items-center gap-2">
                   <TrendingUp size={18} className="text-emerald-500" />
                   <span className="text-xl font-bold dark:text-slate-200">{candidate.stats?.approval}%</span>
                </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Global Mentions</span>
                 <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-500" />
                    <span className="text-xl font-bold dark:text-slate-200">{(candidate.stats?.mentions || 0 / 1000).toFixed(1)}K</span>
                 </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Platform ID</span>
                <div className="flex items-center gap-2">
                   <Cpu size={18} className="text-indigo-500" />
                   <span className="text-xl font-bold dark:text-slate-200">SHA-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-50/50 dark:from-blue-900/10 to-transparent pointer-events-none" />
      </section>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
           <Section 
             icon={<Award className="text-blue-600" />} 
             title="The Core Vision" 
             content={candidate.vision || "Developing a new paradigm for governance centered on decentralised resource management and universal knowledge access."} 
           />
           <VisionMatrix candidateId={candidate.id} />
           <Section 
              icon={<BookOpen className="text-indigo-600" />} 
              title="Platform Pillars" 
              content={candidate.platform}
              isPlatform={true}
           />
           <div className="bg-slate-900 dark:bg-black rounded-[3rem] p-12 text-white space-y-6 relative overflow-hidden">
              <h3 className="font-bold text-2xl flex items-center gap-3">
                <MessageSquare className="text-blue-400" />
                AI Content Summary
              </h3>
              <p className="text-slate-300 dark:text-slate-400 leading-relaxed text-sm">
                VoteEase AI has cross-referenced 4,000+ public speeches and voting records. Findings show a 94% consistency rating with the current platform pillars. Main focus areas: Tech Transparency (45%), Sustainable Urbanism (32%), Education Reform (23%).
              </p>
              <button 
                onClick={() => navigate('/assistant')}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 dark:hover:bg-blue-400 transition-all shadow-lg"
              >
                Deep Dive with Assistant
              </button>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
           </div>
        </div>

         {/* Sidebar Data */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Funding Matrix</h3>
              <div className="space-y-4">
                <SourceItem label="Community Micro-donations" percent={68} />
                <SourceItem label="Tech Coalition Foundation" percent={22} />
                <SourceItem label="Global Advisory Grant" percent={10} />
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4">Key Endorsements</h3>
              <div className="space-y-4">
                 <Endorsement icon={<Globe />} org="Global Internet Freedom" />
                 <Endorsement icon={<Award />} org="Planetary Health Alliance" />
                 <Endorsement icon={<Cpu />} org="Neural Standards Group" />
              </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white space-y-4 shadow-xl">
             <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
               <ChevronLeft size={24} className="rotate-180" />
             </div>
             <h4 className="font-bold text-xl uppercase tracking-tighter">Cast Your Vote</h4>
             <p className="text-sm text-blue-100">Ready to commit to this vision? Proceed to the encrypted ballot.</p>
             <button 
                onClick={() => navigate(`/ballot/presidential-2026`)}
                className="w-full py-4 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl"
              >
                Select Candidate
              </button>
           </div>
        </div>
      </div>
      {/* Comparison Modal Overlay */}
      <AnimatePresence>
        {showCompare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompare(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Candidate Comparison</h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Protocol-Neutral Data Matrix</p>
                  </div>
                </div>
                <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={24} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {!compareTarget ? (
                  <div className="space-y-8">
                    <p className="text-center text-slate-500 dark:text-slate-400 font-medium">Select a candidate to compare with <strong>{candidate.name}</strong></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {compareCandidates.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => setCompareTarget(c)}
                          className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-left hover:border-blue-600 dark:hover:border-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-all group"
                        >
                          <img src={c.avatarUrl} alt={c.name} className="w-16 h-16 rounded-2xl object-cover mb-4 ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-100 dark:group-hover:ring-blue-900/30 transition-all" />
                          <h4 className="font-black text-slate-900 dark:text-white leading-tight">{c.name}</h4>
                          <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">{c.party}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex justify-center">
                       <button 
                        onClick={() => setCompareTarget(null)}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                       >
                         ← Back to Selection
                       </button>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      {/* Comparison Columns */}
                      <div className="space-y-12">
                        <ComparisonHead candidate={candidate} />
                        <ComparisonSection icon={<Cpu />} label="Core Platform" value={candidate.platform} />
                        <ComparisonSection icon={<Award />} label="Vision" value={candidate.vision || ''} />
                        <ComparisonSection icon={<TrendingUp />} label="Approval" value={`${candidate.stats?.approval}%`} />
                      </div>

                      <div className="flex flex-col justify-between py-12">
                         <div className="h-px bg-slate-100 dark:bg-slate-800 w-full relative">
                            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 dark:bg-blue-600 border-4 border-white dark:border-slate-900 text-white flex items-center justify-center font-black text-[10px]">VS</div>
                         </div>
                         <div className="h-px bg-slate-100 dark:bg-slate-800 w-full relative">
                            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center"><Cpu size={14} /></div>
                         </div>
                         <div className="h-px bg-slate-100 dark:bg-slate-800 w-full relative">
                            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center"><Award size={14} /></div>
                         </div>
                         <div className="h-px bg-slate-100 dark:bg-slate-800 w-full relative">
                            <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center"><TrendingUp size={14} /></div>
                         </div>
                      </div>

                      <div className="space-y-12">
                        <ComparisonHead candidate={compareTarget} isTarget />
                        <ComparisonSection icon={<Cpu />} label="Core Platform" value={compareTarget.platform} isTarget />
                        <ComparisonSection icon={<Award />} label="Vision" value={compareTarget.vision || ''} isTarget />
                        <ComparisonSection icon={<TrendingUp />} label="Approval" value={`${compareTarget.stats?.approval}%`} isTarget />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <button 
                  onClick={() => setShowCompare(false)}
                  className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl"
                >
                  Close Matrix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComparisonHead: React.FC<{ candidate: Candidate, isTarget?: boolean }> = ({ candidate, isTarget }) => (
  <div className={`space-y-4 ${isTarget ? 'text-right' : ''}`}>
    <img 
      src={candidate.avatarUrl} 
      alt={candidate.name} 
      className={`w-24 h-24 rounded-[2rem] object-cover mx-auto ring-4 ring-slate-100 dark:ring-slate-800 ${isTarget ? 'ml-auto' : 'mr-auto'}`} 
    />
    <div>
      <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">{candidate.name}</h3>
      <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">{candidate.party}</p>
    </div>
  </div>
);

const ComparisonSection: React.FC<{ icon: React.ReactNode, label: string, value: string, isTarget?: boolean }> = ({ icon, label, value, isTarget }) => (
  <div className={`space-y-3 ${isTarget ? 'text-right' : ''}`}>
    <div className={`flex items-center gap-2 text-slate-400 dark:text-slate-500 ${isTarget ? 'flex-row-reverse' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
      {value.length > 100 ? value.substring(0, 100) + '...' : value}
    </p>
  </div>
);

const Section: React.FC<{ icon: React.ReactNode, title: string, content: string, isPlatform?: boolean }> = ({ icon, title, content, isPlatform }) => (
  <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
    <div className="flex items-center gap-4">
       <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
         {icon}
       </div>
       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
    </div>
    <div className={`text-slate-500 dark:text-slate-400 leading-relaxed ${isPlatform ? 'space-y-4' : ''}`}>
       {isPlatform ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.split('. ').map((s, i) => s.length > 5 ? (
              <div key={i} className="flex gap-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-600 mt-2 shrink-0" />
                <p className="text-sm font-medium">{s}.</p>
              </div>
            ) : null)}
         </div>
       ) : (
         <p className="text-lg font-medium">{content}</p>
       )}
    </div>
  </div>
);

const SourceItem: React.FC<{ label: string, percent: number }> = ({ label, percent }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" 
      />
    </div>
  </div>
);

const Endorsement: React.FC<{ icon: React.ReactNode, org: string }> = ({ icon, org }) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
    <div className="text-slate-400 dark:text-slate-500">{icon}</div>
    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{org}</span>
  </div>
);

export default CandidateDetails;
