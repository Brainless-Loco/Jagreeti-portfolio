import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, CheckCircle2, Flame, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminHomeTab: React.FC = () => {
  const { language, siteSettings, updateSiteSettings, showToast, setActivePage } = useApp();

  const [formData, setFormData] = useState({
    heroHeadlineBn: siteSettings?.heroHeadlineBn || '',
    heroHeadlineEn: siteSettings?.heroHeadlineEn || '',
    heroSubheadlineBn: siteSettings?.heroSubheadlineBn || '',
    heroSubheadlineEn: siteSettings?.heroSubheadlineEn || '',
    tickerTextBn: siteSettings?.tickerTextBn || '',
    tickerTextEn: siteSettings?.tickerTextEn || '',
    beneficiariesCount: siteSettings?.beneficiariesCount ?? '',
    volunteersCount: siteSettings?.volunteersCount ?? '',
    treesPlantedCount: siteSettings?.treesPlantedCount ?? '',
    scholarshipStudentsCount: siteSettings?.scholarshipStudentsCount ?? '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...siteSettings }));
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast(
      language === 'bn'
        ? 'হোম পেজের কনটেন্ট ও পরিসংখ্যান সফলভাবে সংরক্ষিত হয়েছে।'
        : 'Home page content and statistics updated successfully.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'হোম পেজ কনটেন্ট ম্যানেজমেন্ট' : 'Home Page Content Management'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'হিরো সেকশনের শিরোনাম, সাবটাইটেল, টিকার ব্যানার ও লাইভ প্রভাব পরিসংখ্যান সম্পাদনা করুন।'
              : 'Edit hero headline, sub-headline, ticker announcements, and public impact counters.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'লাইভ হোম পেজ প্রিভিউ' : 'Preview Live Home'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero Headlines */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Flame className="w-4 h-4 text-[#1e77bd]" />
            <span>{language === 'bn' ? '১. হিরো সেকশন শিরোনাম ও বিবরণ' : '1. Hero Headlines & Introduction'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মূল শিরোনাম (বাংলা)' : 'Hero Title (Bengali)'}
              </label>
              <input
                type="text"
                name="heroHeadlineBn"
                value={formData.heroHeadlineBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-[#04345c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মূল শিরোনাম (ইংরেজি)' : 'Hero Title (English)'}
              </label>
              <input
                type="text"
                name="heroHeadlineEn"
                value={formData.heroHeadlineEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-[#04345c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সাব-শিরোনাম / পরিচিতি (বাংলা)' : 'Subtitle / Tagline (Bengali)'}
              </label>
              <textarea
                name="heroSubheadlineBn"
                rows={3}
                value={formData.heroSubheadlineBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সাব-শিরোনাম / পরিচিতি (ইংরেজি)' : 'Subtitle / Tagline (English)'}
              </label>
              <textarea
                name="heroSubheadlineEn"
                rows={3}
                value={formData.heroSubheadlineEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Ticker Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? '২. টপ হেডার টিকার টেক্সট' : '2. Top Header Announcement Ticker'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'টিকার টেক্সট (বাংলা)' : 'Ticker Text (Bengali)'}
              </label>
              <input
                type="text"
                name="tickerTextBn"
                value={formData.tickerTextBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'টিকার টেক্সট (ইংরেজি)' : 'Ticker Text (English)'}
              </label>
              <input
                type="text"
                name="tickerTextEn"
                value={formData.tickerTextEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Live Verified Impact Counters */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>{language === 'bn' ? '৩. হোম পেজ প্রভাব পরিসংখ্যান (কাউন্টার)' : '3. Live Public Impact Counters'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মোট সেবাগ্রহীতা' : 'Total Beneficiaries'}
              </label>
              <input
                type="number"
                name="beneficiariesCount"
                value={formData.beneficiariesCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সক্রিয় স্বেচ্ছাসেবী' : 'Active Volunteers'}
              </label>
              <input
                type="number"
                name="volunteersCount"
                value={formData.volunteersCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'রোপিত ও সংরক্ষিত বৃক্ষ' : 'Trees Planted'}
              </label>
              <input
                type="number"
                name="treesPlantedCount"
                value={formData.treesPlantedCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মাসিক বৃত্তিপ্রাপ্ত শিক্ষার্থী' : 'Scholarship Students'}
              </label>
              <input
                type="number"
                name="scholarshipStudentsCount"
                value={formData.scholarshipStudentsCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#04345c] hover:bg-[#04345c]/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
