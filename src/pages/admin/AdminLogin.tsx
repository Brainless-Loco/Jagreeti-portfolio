import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Heart,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { signInAdmin } from '../../services/firebaseService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { language, setActivePage, showToast } = useApp();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);
    try {
      await signInAdmin(username.trim(), password);
      localStorage.setItem('jagreeti_admin_auth', 'true');
      showToast(
        language === 'bn'
          ? 'সফলভাবে অ্যাডমিন প্যানেলে লগইন সম্পন্ন হয়েছে।'
          : 'Welcome back, Administrator! Signed in successfully.',
        'success'
      );
      onLoginSuccess();
    } catch(err) {
      console.error('Admin login failed. Check Firebase admin credentials.');
      console.log(err);
      setError(
        language === 'bn'
          ? 'লগইন ব্যর্থ হয়েছে। Firebase অ্যাডমিন অ্যাকাউন্টের তথ্য যাচাই করুন।'
          : 'Sign-in failed. Check the Firebase admin email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#04345c]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1e77bd]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative z-10"
      >
        {/* Header Ribbon */}
        <div className="bg-[#04345c] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-[#bad3e4]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {language === 'bn' ? 'অ্যাডমিন পোর্টাল লগইন' : 'Admin Portal Login'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {language === 'bn'
                ? 'জাগ্রীতি কেন্দ্রীয় পরিচালনা ও কনটেন্ট নিয়ন্ত্রণ'
                : 'JAGREETI BD Central Governance & Content CMS'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'bn' ? 'ইউজারনেম / ইমেইল' : 'Username / Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <span className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'সুরক্ষিত' : 'Encrypted'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-[#04345c] hover:bg-[#04345c]/90 active:scale-[0.99] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {isLoading
                  ? (language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Credentials...')
                  : (language === 'bn' ? 'লগইন করুন' : 'Sign In to Admin Panel')}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Return to website */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#04345c] font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মূল ওয়েবসাইটে ফিরে যান' : 'Return to Public Website'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
