import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  Calendar,
  AlertCircle,
  ChevronRight,
  X,
  Share2,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoticeItem } from '../types';

export const NoticesPage: React.FC = () => {
  const { language, currentPalette, notices, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotice, setActiveNotice] = useState<NoticeItem | null>(null);

  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    notices.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, [notices]);

  const filteredNotices = notices.filter(
    (n) => selectedCategory === 'all' || n.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  useEffect(() => {
    const openSharedNotice = () => {
      const page = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (page !== 'notices') return;
      const noticeId = new URLSearchParams(window.location.search).get('notice');
      setActiveNotice(noticeId ? notices.find((notice) => notice.id === noticeId) || null : null);
    };
    openSharedNotice();
    window.addEventListener('popstate', openSharedNotice);
    return () => window.removeEventListener('popstate', openSharedNotice);
  }, [notices]);

  const openNotice = (notice: NoticeItem) => {
    setActiveNotice(notice);
    window.history.pushState({}, '', `/notices?notice=${encodeURIComponent(notice.id)}`);
  };

  const closeNotice = () => {
    setActiveNotice(null);
    window.history.pushState({}, '', '/notices');
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'circular':
        return {
          en: 'Official Circular',
          bn: 'দাপ্তরিক বিজ্ঞপ্তি',
          classes: 'bg-blue-100 text-blue-700',
        };
      case 'event':
        return {
          en: 'Upcoming Event',
          bn: 'আসন্ন কর্মসূচি',
          classes: 'bg-emerald-100 text-emerald-700',
        };
      case 'scholarship':
        return {
          en: 'Scholarship',
          bn: 'মেধাবৃত্তি',
          classes: 'bg-purple-100 text-purple-700',
        };
      case 'meeting':
        return {
          en: 'Meeting Notice',
          bn: 'সভা আহ্বান',
          classes: 'bg-amber-100 text-amber-700',
        };
      default:
        return {
          en: cat,
          bn: cat,
          classes: 'bg-slate-100 text-slate-700',
        };
    }
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${currentPalette.primary}15`,
                color: currentPalette.primary,
              }}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'দাপ্তরিক নোটিশ বোর্ড' : 'Official Notice Board'}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
              <Clock className="w-3.5 h-3.5" />
              {language === 'bn' ? 'তারিখ অনুযায়ী সাজানো' : 'Ordered Chronologically by Date'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {language === 'bn'
              ? 'বিজ্ঞপ্তি, সংবাদ ও সার্কুলার'
              : 'Notices, News & Official Circulars'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {language === 'bn'
              ? 'জাগৃতির সর্বশেষ সিদ্ধান্ত, বৃত্তির আবেদন, সাধারণ সভা এবং জরুরি ঘোষণাসমূহ প্রকাশের তারিখ অনুযায়ী এখানে নিয়মিত হালনাগাদ করা হয়।'
              : 'Stay updated with JAGREETI’s latest announcements, scholarship circulars, and emergency calls ordered by date.'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#04345c] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {language === 'bn' ? 'সকল বিজ্ঞপ্তি' : 'All Notices'}
          </button>
          {dynamicCategories.map((cat) => {
            const badge = getCategoryBadge(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#04345c] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {language === 'bn' ? badge.bn : badge.en}
              </button>
            );
          })}
        </div>

        {/* Notices List (Automatically sorted by Date in AppContext) */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const badge = getCategoryBadge(notice.category);
            return (
              <div
                key={notice.id}
                onClick={() => openNotice(notice)}
                className="group cursor-pointer p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                        <AlertCircle className="w-3 h-3" />
                        {language === 'bn' ? 'জরুরি' : 'URGENT'}
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${badge.classes}`}
                    >
                      {language === 'bn' ? badge.bn : badge.en}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-[#1e77bd]" />
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#04345c] transition-colors">
                    {language === 'bn' ? notice.titleBn : notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {language === 'bn' ? notice.summaryBn : notice.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-[#04345c]">
                  <span>{language === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Notice'}</span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice Modal */}
      {activeNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={closeNotice}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeNotice}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 pr-8">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{activeNotice.date}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {language === 'bn' ? activeNotice.titleBn : activeNotice.title}
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {language === 'bn' ? activeNotice.contentBn : activeNotice.content}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/notices?notice=${encodeURIComponent(activeNotice.id)}`;
                  navigator.clipboard.writeText(shareUrl);
                  showToast(
                    language === 'bn'
                      ? 'নোটিশের লিংক কপি করা হয়েছে!'
                      : 'Notice link copied to clipboard!'
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'শেয়ার করুন' : 'Share Notice'}</span>
              </button>

              <button
                onClick={() => setActiveNotice(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                style={{ backgroundColor: currentPalette.primary }}
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
