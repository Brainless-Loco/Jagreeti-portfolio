import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Hash,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgramsPage: React.FC = () => {
  const { language, currentPalette, programs, setActivePage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(
      (p) => selectedCategory === 'all' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [programs, selectedCategory]);

  return (
    <div className="py-12 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-md font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${currentPalette.primary}15`,
            color: currentPalette.primary,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'আমাদের মূল উইংসমূহ' : 'Our Core Operational Wings'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          {language === 'bn'
            ? 'জাগৃতির বহুমুখী সামাজিক কর্মসূচি'
            : 'Holistic Humanitarian Programs'}
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          {language === 'bn'
            ? 'জাগৃতি শুধুমাত্র জরুরি ত্রাণ বিতরণে সীমাবদ্ধ নয়; আমরা শিক্ষা, স্বাস্থ্য, পরিবেশ এবং স্বাবলম্বীকরণের মাধ্যমে টেকসই সমাজ গঠনে কাজ করছি।'
            : 'JAGREETI goes beyond emergency relief—we focus on long-term community resilience through education, healthcare, climate action, and livelihood programs.'}
        </p>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#04345c] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল কর্মসূচি' : 'All Wings'} ({programs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#10564f] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Programs List (Sorted by Priority) */}
      <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 space-y-12">
        {filteredPrograms.map((prog, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={prog.id}
              className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              <div
                className={`lg:col-span-5 relative min-h-[280px] overflow-hidden bg-slate-100 ${
                  !isEven ? 'lg:order-2' : ''
                }`}
              >
                <img
                  src={prog.image}
                  alt={language === 'bn' ? prog.titleBn : prog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#04345c]/90 text-white text-[10px] font-bold">
                    <Hash className="w-3 h-3 text-[#bad3e4]" />
                    {prog.priority ?? index + 1}
                  </span>
                  {prog.category && (
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#04345c] text-[10px] font-bold">
                      {prog.category}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-sm font-extrabold text-slate-900 shadow-lg">
                  {language === 'bn' ? prog.impactBn || prog.impact : prog.impact}
                </div>
              </div>

              <div
                className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${
                  !isEven ? 'lg:order-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <h2 className="md:text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {language === 'bn' ? prog.titleBn : prog.title}
                  </h2>

                  <p className="text-slate-600 md:text-sm sm:text-base leading-relaxed">
                    {language === 'bn' ? prog.descBn : prog.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {(language === 'bn' ? prog.highlightsBn : prog.highlights)?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 md:text-sm sm:text-sm font-medium text-slate-700"
                      >
                        <CheckCircle2
                          className="w-4 h-4 shrink-0"
                          style={{ color: currentPalette.primary }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActivePage('donate')}
                    className="px-5 py-2.5 rounded-xl text-white md:text-md sm:text-sm font-bold shadow-md hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: currentPalette.primary }}
                  >
                    <span>
                      {language === 'bn'
                        ? 'এই খাতে অনুদান দিন'
                        : 'Sponsor This Program'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePage('volunteer')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm sm:text-sm font-semibold hover:bg-slate-200 transition cursor-pointer"
                  >
                    {language === 'bn' ? 'স্বেচ্ছাসেবক হিসেবে যুক্ত হোন' : 'Join as Volunteer'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
