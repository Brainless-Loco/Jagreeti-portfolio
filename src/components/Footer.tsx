import React from 'react';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Users,
  FileText,
  Bookmark 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, t, setActivePage, currentPalette } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-850 bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Heart className="w-6 h-6 fill-white/30" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                {language === 'bn'
                  ? 'একটি মানবিক পদক্ষেপে বদলে যেতে পারে একটি জীবন'
                  : 'A Single Contribution Can Transform a Deserving Life'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {language === 'bn'
                  ? 'অসচ্ছল শিক্ষার্থীদের শিক্ষাবৃত্তি, শীতবস্ত্র বিতরণ ও বিনামূল্যে চিকিৎসাসেবা কার্যক্রমে অংশ নিন।'
                  : 'Support meritorious student scholarships, winter relief, and free healthcare camps.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActivePage('donate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: currentPalette.accent }}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.nav.donate}</span>
            </button>
            <button
              onClick={() => {
                setActivePage('volunteer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{t.nav.volunteer}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: currentPalette.primary }}
              >
                <Heart className="w-5 h-5 fill-white/20 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tight text-white">
                {language === 'bn' ? 'জাগৃতি' : 'JAGREETI'}
              </span>
            </div>

            <p className="sm:text-sm md:text-lg text-slate-400 leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'জাগৃতি একটি সম্পূর্ণ অরাজনৈতিক, সামাজিক ও মানবিক যুব সংগঠন যা সুবিধাবঞ্চিতদের শিক্ষা, চিকিৎসা সহায়তা, দুর্যোগে ত্রাণ ও পরিবেশ সুরক্ষায় কাজ করে।'
                : 'JAGREETI is an apolitical socio-humanitarian youth voluntary organization dedicated to grassroots education, healthcare support, disaster relief, and environmental preservation.'}
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jagreeti Building, Hathazari College Gate, Fatika, Hathazari Pourashova, Hathazari, Chittagong</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">+880-1819-620432</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>jagreeti1968ctg@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-lg font-bold uppercase tracking-wider mb-4">
              {language === 'bn' ? 'মূল নেভিগেশন' : 'Navigation'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'committee', label: t.nav.committee },
                { id: 'programs', label: t.nav.programs },
                { id: 'projects', label: t.nav.projects },
                { id: 'notices', label: t.nav.notices },
                { id: 'gallery', label: t.nav.gallery },
                { id: 'volunteer', label: t.nav.volunteer },
                { id: 'contact', label: t.nav.contact },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActivePage(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 text-[15px] transition flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Administrative / Portals / Miscellaneous */}
          <div>
            <h5 className="text-white text-lg font-bold uppercase tracking-wider mb-4">
              {language === 'bn' ? 'প্রশাসনিক ও সেবা' : 'Administration & System'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActivePage('committee');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 text-[15px] transition flex items-center gap-1.5 text-slate-300 font-medium"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? 'কার্যকরী সংসদ' : 'Executive Committee'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('notices');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 text-[15px] transition flex items-center gap-1.5 text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.nav.notices}</span>
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => {
                    setActivePage('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5 text-slate-300"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.nav.admin}</span>
                </button>
              </li> */}
            </ul>
            
            <h5 className="text-white text-lg font-bold uppercase tracking-wider mt-5 mb-3">
              {language === 'bn' ? 'বিবিধ' : 'Miscellaneous'}
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActivePage('magazine');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 text-[15px] transition flex items-center gap-1.5 text-slate-300 font-medium"
                >
                  {/* magazine or book related icon */}

                  <Bookmark className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'bn' ? 'জাগৃতি ম্যাগাজিন' : 'JAGREETI Magazine'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Financial Integrity */}
          <div>
            <h5 className="text-white text-lg font-bold uppercase tracking-wider mb-4">
              {language === 'bn' ? 'স্বচ্ছতা ও দায়বদ্ধতা' : 'Trust & Governance'}
            </h5>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Audited Giving</span>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'সকল অনুদানের বিবরণ ডিজিটাল রসিদের মাধ্যমে নিশ্চিত করা হয়। সংগঠনের নিজস্ব কোনো বাণিজ্যিক লক্ষ্য নেই।'
                  : 'Every taka received is verified through digital transaction verification and matched to verifiable field distributions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 mb-0 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} JAGREETI (জাগৃতি) Foundation. All Rights Reserved.
          </div>
          {/* Developed by Brainless Loco */}
          <div className="flex items-center gap-1.5">
            <span>Developed by</span>
            <a  href="https://github.com/Brainless-Loco" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition font-bold">
              Brainless Loco
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'সামাজিক, সাংস্কৃতিক ও ক্রীড়া প্রতিষ্ঠান' : 'Social, Cultural & Sports Organization'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
