import React, { useState } from 'react';
import { Info, Save, Eye, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminAboutTab: React.FC = () => {
  const { language, siteSettings, updateSiteSettings, showToast, setActivePage } = useApp();

  const [formData, setFormData] = useState({
    historyP1Bn: siteSettings?.historyP1Bn || '',
    historyP1En: siteSettings?.historyP1En || '',
    historyP2Bn: siteSettings?.historyP2Bn || '',
    historyP2En: siteSettings?.historyP2En || '',
    missionBn: siteSettings?.missionBn || '',
    missionEn: siteSettings?.missionEn || '',
    visionBn: siteSettings?.visionBn || '',
    visionEn: siteSettings?.visionEn || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast(
      language === 'bn'
        ? 'আমাদের পরিচিতি ও লক্ষ্য-উদ্দেশ্য সফলভাবে সংরক্ষিত হয়েছে।'
        : 'About Us content, mission & vision updated successfully.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#10564f]" />
            <span>{language === 'bn' ? 'আমাদের পরিচিতি ও ইতিহাস কনটেন্ট' : 'About Us & Mission Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'সংগঠনের প্রতিষ্ঠার পটভূমি, ইতিহাস এবং গঠনতান্ত্রিক মূলনীতি ও রূপকল্প সম্পাদনা করুন।'
              : 'Edit background narrative, organizational history, constitutional declarations, mission and vision.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActivePage('about');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অ্যাবাউট পেজ দেখুন' : 'Preview About Page'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* History Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-[#04345c]" />
            <span>{language === 'bn' ? '১. ইতিহাস ও প্রতিষ্ঠার পটভূমি' : '1. Heritage & History Narrative'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ইতিহাস পর্ব ০১ (বাংলা)' : 'History Paragraph 1 (Bengali)'}
              </label>
              <textarea
                name="historyP1Bn"
                rows={4}
                value={formData.historyP1Bn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ইতিহাস পর্ব ০১ (English)' : 'History Paragraph 1 (English)'}
              </label>
              <textarea
                name="historyP1En"
                rows={4}
                value={formData.historyP1En}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ইতিহাস পর্ব ০২ (বাংলা)' : 'History Paragraph 2 (Bengali)'}
              </label>
              <textarea
                name="historyP2Bn"
                rows={4}
                value={formData.historyP2Bn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ইতিহাস পর্ব ০২ (English)' : 'History Paragraph 2 (English)'}
              </label>
              <textarea
                name="historyP2En"
                rows={4}
                value={formData.historyP2En}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? '২. লক্ষ্য (Mission) ও রূপকল্প (Vision)' : '2. Mission & Vision Statements'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'আমাদের লক্ষ্য / মিশন (বাংলা)' : 'Mission Statement (Bengali)'}
              </label>
              <textarea
                name="missionBn"
                rows={3}
                value={formData.missionBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'আমাদের লক্ষ্য / মিশন (English)' : 'Mission Statement (English)'}
              </label>
              <textarea
                name="missionEn"
                rows={3}
                value={formData.missionEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'আমাদের রূপকল্প / ভিশন (বাংলা)' : 'Vision Statement (Bengali)'}
              </label>
              <textarea
                name="visionBn"
                rows={3}
                value={formData.visionBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'আমাদের রূপকল্প / ভিশন (English)' : 'Vision Statement (English)'}
              </label>
              <textarea
                name="visionEn"
                rows={3}
                value={formData.visionEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
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
