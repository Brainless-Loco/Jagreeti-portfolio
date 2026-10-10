import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Sparkles, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLOR_PALETTES } from '../data/palettes';

export const ColorPaletteModal: React.FC = () => {
  const {
    paletteModalOpen,
    setPaletteModalOpen,
    paletteId,
    setPaletteId,
    language,
    showToast,
  } = useApp();

  if (!paletteModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {language === 'bn' ? 'জাগৃতি কালার প্যালেট প্রস্তাবনা' : 'JAGREETI Color Palette Suggestions'}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    {language === 'bn' ? '৪টি থিম' : '4 Curated Themes'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'bn'
                    ? 'প্রচলিত নীল-বেগুনির বাইরে বাস্তবসম্মত, মানবিক ও আধুনিক নান্দনিকতার জন্য নির্বাচিত প্যালেট।'
                    : 'Crafted alternatives to generic blue-purple gradients, optimized for humanitarian warmth and contrast.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPaletteModalOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Palette Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = paletteId === pal.id;
              return (
                <div
                  key={pal.id}
                  onClick={() => {
                    setPaletteId(pal.id);
                    showToast(
                      language === 'bn'
                        ? `${pal.name.bn} সক্রিয় করা হয়েছে`
                        : `${pal.name.en} theme applied!`,
                      'success'
                    );
                  }}
                  className={`group relative p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      {pal.name[language]}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'সক্রিয়' : 'Active'}
                      </span>
                    )}
                  </div>

                  {/* Color Swatches */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-black/10 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: pal.primary }}
                      title={`Primary: ${pal.primary}`}
                    >
                      P
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-black/10 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: pal.accent }}
                      title={`Accent: ${pal.accent}`}
                    >
                      A
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-black/10 flex items-center justify-center text-[10px] text-slate-700 font-bold"
                      style={{ backgroundColor: pal.bgPage }}
                      title={`Background: ${pal.bgPage}`}
                    >
                      Bg
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm border border-black/10 flex items-center justify-center text-[10px] text-white font-bold"
                      style={{ backgroundColor: pal.textMain }}
                      title={`Text: ${pal.textMain}`}
                    >
                      Tx
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono ml-auto">
                      {pal.primary}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                    {pal.description[language]}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Vibe: </span>
                    {pal.vibe[language]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Design Rationale Footer */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {language === 'bn' ? 'ডিজাইন বিশ্লেষণ ও সুপারিশ' : 'Design Rationales & Tokens'}
            </div>
            {language === 'bn'
              ? 'আমরা ডিফল্ট পুরানো রঙের বাইরে গিয়ে ৩টি উচ্চ-কন্ট্রাস্ট লাইট থিম এবং ১টি মডার্ন ডার্ক থিম প্রস্তুত করেছি। "মরকত জাগৃতি" তারুণ্য ও প্রাকৃতিক আশার জন্য সবচেয়ে মানানসই, আর "রক্তিম সহানুভূতি" রক্তদান নেটওয়ার্কের গুরুত্বকে উজ্জ্বল করে।'
              : 'Instead of generic purplish gradients, we created 3 high-contrast light schemes and 1 sleek dark scheme. Emerald Awakening represents life and green revival, while Crimson Compassion amplifies the vital blood network.'}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setPaletteModalOpen(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm hover:opacity-90 transition"
            >
              {language === 'bn' ? 'প্যালেট পছন্দ করেছি' : 'Done & Continue'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
