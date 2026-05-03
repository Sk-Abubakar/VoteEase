import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  ExternalLink, 
  ChevronDown, 
  Search,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 transition-all"
      >
        <span className="font-bold text-slate-800 dark:text-slate-200">{question}</span>
        <ChevronDown 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpSupport: React.FC = () => {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How is my vote kept anonymous?",
      answer: "VoteEase uses Zero-Knowledge Proofs (ZKPs) and homomorphic encryption. This means the system can verify you are eligible and that your vote was counted without ever linking your real-world identity to the specific candidate you chose."
    },
    {
      question: "Can I change my vote after casting it?",
      answer: "No. Once a vote is finalized and recorded on the protocol\'s immutable ledger, it cannot be changed. This ensures the integrity of the election result."
    },
    {
      question: "What happens if I lose my biometric access?",
      answer: "Each voter is provided with a cryptographic recovery seed during onboarding. If you lose access to your primary device, you can utilize this seed along with secondary identity verification to regain access to your Voter Vault."
    },
    {
      question: "How does the AI Assistant analyze candidates?",
      answer: "The VoteEase AI aggregates data from verified campaign platforms, legislative history, public statements, and independent fact-checking databases. It identifies contradictions and synthesizes complex policy documents into understandable insights."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest"
        >
          <HelpCircle size={14} /> Center for Transparency
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter"
        >
          How can we help you <br className="hidden md:block" />
          <span className="text-blue-600">navigate democracy?</span>
        </motion.h1>
      </section>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <ShieldCheck />, title: "Verification Guide", desc: "Step-by-step biometric setup.", color: "blue" },
          { icon: <Zap />, title: "Audit Protocol", desc: "Understanding receipt verification.", color: "indigo" },
          { icon: <Globe />, title: "Global Nodes", desc: "Network health and status.", color: "emerald" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${
              item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' :
              item.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' :
              'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'
            }`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-lg dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQs Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Technical FAQs</h2>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-3 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-500 font-medium">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* Support Channels */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 dark:bg-blue-950 p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="p-3 bg-white/10 w-fit rounded-2xl border border-white/10">
              <MessageSquare className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Live Support</h2>
            <p className="text-slate-400 leading-relaxed">
              Connect with our verification officers for real-time assistance with onboarding or protocol errors.
            </p>
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xl">
              Launch Secure Chat
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
             <MessageSquare size={120} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 w-fit rounded-2xl border border-slate-100 dark:border-slate-700">
            <Mail className="text-blue-600" size={24} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Submit a Ticket</h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              For complex issues or legal inquiries, please document your request. Typical response time is &lt;2 hours.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <a href="mailto:support@clearvote.protocol" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                support@clearvote.protocol
              </a>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Available 24/7 Global Access</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;
