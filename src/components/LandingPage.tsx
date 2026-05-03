import React from 'react';
import { motion } from 'motion/react';
import { Shield, Cpu, Globe, ArrowRight, CheckCircle, ChevronRight, Vote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../services/authService';
import { useSettings } from '../contexts/SettingsContext';

const LandingPage: React.FC<{ onOpenLogin: () => void, onOpenProtocol: () => void }> = ({ onOpenLogin, onOpenProtocol }) => {
  const navigate = useNavigate();
  const { t } = useSettings();

  const handleStart = async () => {
    onOpenLogin();
  };

  const handleViewProtocol = () => {
    onOpenProtocol();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden text-center" aria-labelledby="hero-heading">
        <div className="space-y-8 max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Globe size={14} aria-hidden="true" /> Global Protocol v4.0
          </motion.div>
          
          <motion.h1 id="hero-heading" variants={itemVariants} className="text-5xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {t('hero_title')}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handleStart}
              className="group w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              aria-label={`${t('begin_journey')} - Secure Voter Registration`}
            >
              {t('begin_journey')}
              <ArrowRight className="group-hover:translate-x-1 transition-transform rtl:rotate-180" aria-hidden="true" />
            </button>
            <button 
              onClick={handleViewProtocol}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              aria-label="Read Security Protocol Manifesto"
            >
              {t('view_protocol')}
            </button>
          </motion.div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-100 dark:border-blue-900/20 rounded-full opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-200 dark:border-blue-800/20 rounded-full opacity-30 pointer-events-none" />
      </section>

      {/* Stats/Proof Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-800 shadow-inner">
        <div className="p-8 space-y-4 border-r border-slate-200/50 dark:border-slate-800 last:border-0 rtl:border-r-0 rtl:border-l rtl:last:border-0 md:rtl:border-l">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Shield size={24} />
          </div>
          <h3 className="text-2xl font-bold dark:text-white">{t('zero_knowledge')}</h3>
          <p className="text-slate-500 dark:text-slate-400">{t('zero_knowledge_desc')}</p>
        </div>
        <div className="p-8 space-y-4 border-r border-slate-200/50 dark:border-slate-800 last:border-0 rtl:border-r-0 rtl:border-l rtl:last:border-0 md:rtl:border-l">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cpu size={24} />
          </div>
          <h3 className="text-2xl font-bold dark:text-white">{t('ai_clarity')}</h3>
          <p className="text-slate-500 dark:text-slate-400">{t('ai_clarity_desc')}</p>
        </div>
        <div className="p-8 space-y-4 last:border-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold dark:text-white">{t('total_audit')}</h3>
          <p className="text-slate-500 dark:text-slate-400">{t('total_audit_desc')}</p>
        </div>
      </section>

      {/* Voting Journey Timeline */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight dark:text-white">{t('journey_title')}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t('journey_subtitle')}</p>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-24">
            <FeatureStep 
              number="01" 
              title={t('biometric_onboarding')} 
              description={t('biometric_desc')}
              align="right"
            />
            <FeatureStep 
              number="02" 
              title={t('platform_discovery')} 
              description={t('platform_discovery_desc')}
              align="left"
            />
            <FeatureStep 
              number="03" 
              title={t('secure_balloting')} 
              description={t('secure_balloting_desc')}
              align="right"
            />
            <FeatureStep 
              number="04" 
              title={t('vault_verification')} 
              description={t('vault_verification_desc')}
              align="left"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center space-y-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{t('ready_to_lead')}</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">{t('join_millions')}</p>
          <button 
            onClick={handleStart}
            className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-xl hover:bg-blue-500 transition-all shadow-2xl hover:scale-105"
          >
            {t('create_identity')}
          </button>
        </div>
        
        {/* Glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      </section>
    </motion.div>
  );
};

const FeatureStep: React.FC<{ number: string, title: string, description: string, align: 'left' | 'right' }> = ({ number, title, description, align }) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, x: align === 'left' ? -50 : 50 }, visible: { opacity: 1, x: 0 } }}
    className={`flex flex-col md:flex-row items-center gap-12 ${align === 'left' ? 'md:flex-row-reverse' : ''}`}
  >
    <div className="flex-1 text-center md:text-left">
      <div className={`space-y-4 ${align === 'left' ? 'md:text-right' : ''}`}>
        <span className="text-6xl font-black text-slate-200 dark:text-slate-800 block leading-none">{number}</span>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto md:mx-0">{description}</p>
      </div>
    </div>
    <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-blue-600 border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-white z-10 shrink-0 hidden md:flex">
      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
    </div>
    <div className="flex-1 hidden md:block">
      {/* Decorative element or Image placeholder */}
      <div className={`h-40 rounded-3xl bg-slate-100 dark:bg-slate-800 ${align === 'left' ? 'mr-auto' : 'ml-auto'} max-w-sm`} />
    </div>
  </motion.div>
);

export default LandingPage;
