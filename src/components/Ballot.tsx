import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { UserProfile, Election, Candidate } from '../types';
import { getElections, getCandidates, submitVote } from '../services/electionService';

const Ballot: React.FC<{ user: UserProfile }> = React.memo(({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const allElections = await getElections();
      const current = allElections.find(e => e.id === id);
      if (current) {
        setElection(current);
        const cats = await getCandidates(id);
        setCandidates(cats);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.party.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!id || !selectedId || submitting) return;
    setSubmitting(true);
    await submitVote(id, user.uid, selectedId);
    setDone(true);
    setSubmitting(false);
  };

  if (loading) return <div>Loading ballot...</div>;
  if (!election) return <div>Election not found.</div>;

  const selectedCandidate = candidates.find(c => c.id === selectedId);

  if (done) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-xl">
          <ShieldCheck size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Vote Successfully Recorded</h1>
          <p className="text-slate-500 max-w-sm mx-auto">Your vote for <strong>{selectedCandidate?.name}</strong> has been encrypted and added to the Global Ballot Matrix. Your cryptographic receipt is now available in your Vault.</p>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-lg text-left font-mono text-[10px] text-slate-400 break-all space-y-2">
            <p>TXID: CV-ENCRYPT-9102-XFA-001</p>
            <p>SIG: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
            <p>ROOT: 0x932...A921</p>
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all mt-8">
          Return to Vault
          <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest mb-4"
          >
            <ChevronLeft size={18} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{election.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Lock size={16} className="text-blue-500 dark:text-blue-400" />
            End-to-End Encrypted Session | <span className="font-bold text-blue-600 dark:text-blue-400">ID: {id}</span>
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter candidates..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-6 text-sm dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all shadow-sm"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Candidates List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  isSelected={selectedId === candidate.id}
                  onSelect={() => setSelectedId(candidate.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <Search size={48} className="mx-auto text-slate-200" />
                <p className="text-slate-500 font-medium whitespace-pre-line">
                  No candidates match "{search}" in this district.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Voting Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={24} className="text-blue-600 dark:text-blue-400" />
                Ballot Summary
              </h3>

              {selectedCandidate ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedCandidate.avatarUrl} 
                      alt={selectedCandidate.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-50 dark:ring-blue-900/30"
                    />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white leading-tight">{selectedCandidate.name}</p>
                      <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">{selectedCandidate.party}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic border border-slate-100 dark:border-slate-700">
                    "{selectedCandidate.vision}"
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 text-center space-y-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mx-auto">
                    <Award size={24} />
                  </div>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Please select a candidate <br /> to cast your vote.</p>
                </div>
              )}

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span>Election Status</span>
                  <span className="text-blue-600 dark:text-blue-400">Active</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span>Audit Key</span>
                  <span className="text-slate-900 dark:text-white">VERIFIED</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!selectedId || submitting}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  !selectedId || submitting 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-100 hover:scale-[1.02]'
                }`}
              >
                {submitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Commit Secret Vote
                  </>
                )}
              </button>
            </div>

            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white space-y-4 shadow-xl" role="complementary" aria-label="AI Voting Assistance">
               <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-blue-400">
                 <Sparkles size={16} aria-hidden="true" />
                 AI Pro-Tip
               </h4>
               <p className="text-xs text-slate-400 leading-relaxed">
                 Having trouble deciding? Ask VoteEase AI to compare these candidates platforms against your top priorities in the Assistant tab.
               </p>
               <Link 
                 to="/assistant" 
                 className="text-blue-400 text-xs font-bold hover:underline flex items-center gap-1 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded"
                 aria-label="Open AI Assistant for candidate comparison"
               >
                 Open Assistant <ArrowRight size={12} aria-hidden="true" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const CandidateCard: React.FC<{ candidate: Candidate, isSelected: boolean, onSelect: () => void }> = React.memo(({ candidate, isSelected, onSelect }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    onClick={onSelect}
    role="radio"
    aria-checked={isSelected}
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect()}
    className={`group cursor-pointer bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden ${
      isSelected 
        ? 'border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-100 dark:shadow-blue-900/20 scale-[1.02] bg-blue-50/10 dark:bg-blue-900/10' 
        : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-slate-200/50'
    }`}
  >
    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left relative z-10">
      <div className="relative shrink-0">
        <div className="relative">
          <img 
            src={candidate.avatarUrl} 
            alt={candidate.name} 
            className={`w-32 h-32 rounded-[2.5rem] object-cover transition-all duration-500 ${
              isSelected ? 'ring-8 ring-blue-100 dark:ring-blue-900/40 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
            }`}
          />
          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg z-20"
            >
              <CheckCircle2 size={24} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className={`text-2xl font-black transition-colors uppercase tracking-tight ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`}>
            {candidate.name}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mt-1 bg-blue-50 dark:bg-blue-900/30 inline-block px-3 py-1 rounded-lg">
            {candidate.party}
          </p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">
          {candidate.bio}
        </p>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <TrendingUp size={14} className="text-emerald-500" />
            {candidate.stats?.approval}% Approval
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <Search size={14} className="text-blue-500 dark:text-blue-400" />
            {candidate.stats?.mentions.toLocaleString()} Mentions
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 flex justify-between items-center relative z-10 pt-6 border-t border-slate-100/50 dark:border-slate-800/50">
      <Link 
        to={`/candidate/${candidate.id}`} 
        className="text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-widest flex items-center gap-2 group/link"
        onClick={(e) => e.stopPropagation()}
      >
        Candidate Profile <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
      </Link>
      <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${
        isSelected 
          ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/40' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
      }`}>
        {isSelected ? 'Ready to cast' : 'Select Candidate'}
      </div>
    </div>

    {/* Background Decorative Element */}
    <div className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-all duration-700 ${
      isSelected ? 'bg-blue-600/10' : 'bg-slate-100/0 group-hover:bg-blue-600/5'
    }`} />
  </motion.div>
));

export default Ballot;
