import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  Target,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { language, t, currentPalette, committee, siteSettings, setActivePage } = useApp();
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');

  const filteredMembers = (committee || []).filter((m) =>
    selectedTagFilter === 'all' ? true : (m.tags || []).includes(selectedTagFilter)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {language === 'bn' ? 'আমাদের ইতিহাস ও নেতৃত্ব' : 'Heritage & Leadership'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t.about.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.about.subtitle}
        </p>
      </div>

      {/* Story & Background Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.about.historyTitle}
          </h2>
          <p>{language === 'bn' ? (siteSettings?.historyP1Bn || t.about.historyP1) : (siteSettings?.historyP1En || t.about.historyP1)}</p>
          <p>{language === 'bn' ? (siteSettings?.historyP2Bn || t.about.historyP2) : (siteSettings?.historyP2En || t.about.historyP2)}</p>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
            <strong>{language === 'bn' ? 'গঠনতান্ত্রিক অঙ্গীকার:' : 'Constitutional Principle:'}</strong>{' '}
            {language === 'bn'
              ? 'জাগৃতি সম্পূর্ণ অরাজনৈতিক, ধর্ম-বর্ণ নির্বিশেষে মানবিক সেবা এবং তরুণ প্রজন্মের চরিত্র গঠনে অঙ্গীকারবদ্ধ একটি সংগঠন।'
              : 'JAGREETI operates on an uncompromising non-political code of honor, dedicated strictly to humanitarian welfare and ethical youth empowerment.'}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop"
              alt="Youth Team"
              className="w-full h-80 sm:h-96 object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:left-6 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                9+ Years of Service
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'লালমনিরহাট ও সমগ্র বাংলাদেশে' : 'Grassroots Social Impact'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#04345c]/10 text-[#04345c] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#04345c]">
            {language === 'bn' ? 'আমাদের ভিশন (দূরদৃষ্টি)' : 'Our Vision'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'একটি সচেতন, আত্মনির্ভরশীল ও সহানুভূতিশীল মানবিক সমাজ বিনির্মাণ যেখানে কোনো মেধাবী শিক্ষার্থী অর্থাভাবে ঝরে পড়বে না এবং সুবিধাবঞ্চিত প্রতিটি মানুষ মৌলিক মানবিক অধিকার পাবে।'
              : 'To establish an empathetic, enlightened, and self-reliant society where no meritorious student is deprived of education and vulnerable citizens receive grassroots humanitarian care.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#10564f]/10 text-[#10564f] flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#04345c]">
            {language === 'bn' ? 'আমাদের মিশন (উদ্দেশ্য)' : 'Our Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'তারুণ্যের শক্তিকে ইতিবাচক সমাজকল্যাণে সংগঠিত করা, অসচ্ছল শিক্ষার্থীদের শিক্ষাবৃত্তি প্রদান, শীতবস্ত্র বিতরণ, বিনামূল্যে চিকিৎসা ক্যাম্প এবং দুর্যোগে তাৎক্ষণিক ত্রাণ সহায়তা নিশ্চিত করা।'
              : 'Mobilizing youth power for constructive social welfare, disbursing academic stipends, providing winter warmth, hosting free medical diagnostics, and leading environmental preservation.'}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          {t.about.valuesTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.about.values.map((val, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                0{i + 1}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{val.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Committee & Leadership */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900">
            {t.about.committeeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.about.committeeSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTagFilter === 'all'
                  ? 'bg-[#04345c] text-white shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {language === 'bn' ? 'সকল সদস্য (একক তালিকা)' : 'All Members (Unified List)'}
            </button>
            <button
              onClick={() => setSelectedTagFilter('Executive Council')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTagFilter === 'Executive Council'
                  ? 'bg-[#04345c] text-white shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {language === 'bn' ? 'কার্যনির্বাহী ট্যাগ' : 'Executive Council'}
            </button>
            <button
              onClick={() => setSelectedTagFilter('Advisory Board')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedTagFilter === 'Advisory Board'
                  ? 'bg-[#04345c] text-white shadow'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {language === 'bn' ? 'উপদেষ্টা ট্যাগ' : 'Advisory Board'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredMembers.slice(0, 8).map((member) => (
            <div
              key={member.id}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#10564f]">
                    {language === 'bn' ? member.roleBn : member.role}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {language === 'bn' ? member.nameBn : member.name}
                  </h4>
                  {(member.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(member.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-[#04345c] text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 line-clamp-3">
                    {member.bio[language]}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1 hover:text-[#04345c] transition"
                  title="Phone"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1 hover:text-[#04345c] transition"
                  title="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setActivePage('committee')}
            className="px-5 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition cursor-pointer"
          >
            {language === 'bn' ? 'সম্পূর্ণ সদস্য ডিরেক্টরি দেখুন' : 'View Full Leadership Directory'}
          </button>
        </div>
      </div>
    </div>
  );
};
