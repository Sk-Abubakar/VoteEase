import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Scan, 
  Fingerprint, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Verification: React.FC<{ user: UserProfile, onVerify: (profile: UserProfile) => void }> = ({ user, onVerify }) => {
  const [step, setStep] = useState(user.registrationStatus === 'verified' ? 4 : 1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isVerified: true,
        registrationStatus: 'verified'
      });
      onVerify({ ...user, isVerified: true, registrationStatus: 'verified' });
      setStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-10">
      {/* Stepper */}
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10" />
        <div className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 -z-10 transition-all duration-500" style={{ width: `${(step - 1) * 33.33}%` }} />
        
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-4 font-bold text-sm transition-all duration-300 ${
              step >= s ? 'bg-blue-600 border-white dark:border-slate-900 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
            }`}
          >
            {step > s ? <CheckCircle2 size={18} /> : s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepContent 
            key="id-scan"
            icon={<Scan size={48} />}
            title="Global ID Scan"
            description="Use your camera to securely scan your decentralized national identity card or digital passport."
            onAction={nextStep}
            actionLabel="Start ID Scan"
            loading={loading}
          />
        )}

        {step === 2 && (
          <StepContent 
            key="biometric"
            icon={<Fingerprint size={48} />}
            title="Biometric Link"
            description="Our zero-knowledge protocol will map your unique 3D facial geometry to your voter ID."
            onAction={nextStep}
            actionLabel="Connect Biometrics"
            loading={loading}
          />
        )}

        {step === 3 && (
          <StepContent 
            key="finalize"
            icon={<ShieldCheck size={48} />}
            title="Secure Finalization"
            description="Almost there! We are encrypting your identity with your device's unique hardware security module (HSM)."
            onAction={handleFinalize}
            actionLabel="Verify & Finalize"
            loading={loading}
          />
        )}

        {step === 4 && (
          <motion.div 
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto border-8 border-emerald-50 dark:border-emerald-900/10">
              <ShieldCheck size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Identity Confirmed</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Your identity has been cryptographically linked to the Global Voting Protocol. You are now eligible to cast your vote in all active elections.</p>
            </div>
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Level</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-200">4: Elite Citizen</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DID Key Status</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-200 dark:decoration-emerald-900">Rotation: Active</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
            >
              Back to Voter Vault
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Help Banner */}
      {step < 4 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl text-blue-700 dark:text-blue-400 text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p>This process uses <strong>End-to-End Encryption</strong>. Your raw biometric data never leaves your device's secure enclave.</p>
        </div>
      )}
    </div>
  );
};

const StepContent: React.FC<{ 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  onAction: () => void, 
  actionLabel: string,
  loading?: boolean
}> = ({ icon, title, description, onAction, actionLabel, loading }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-8 relative overflow-hidden"
  >
    <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-inner relative z-10">
      {icon}
    </div>
    
    <div className="space-y-4 relative z-10">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>

    <button 
      onClick={onAction}
      disabled={loading}
      className={`relative z-10 w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
        loading ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-100 dark:shadow-blue-900/20 hover:scale-[1.02]'
      }`}
    >
      {loading ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
      {loading ? 'Processing...' : actionLabel}
    </button>
    
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-blue-600 rounded-full -translate-y-1/2 translate-x-1/2" />
    </div>
  </motion.div>
);

export default Verification;
