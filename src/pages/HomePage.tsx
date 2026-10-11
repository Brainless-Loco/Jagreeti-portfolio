import React, { useState, useRef } from 'react';
import {
  Heart,
  Droplets,
  Users,
  BookOpen,
  TreePine,
  ArrowRight,
  MapPin,
  Calendar,
  Bell,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Award,
  HandHeart,
  Quote,
  X,
  Youtube,
  Camera,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useApp } from '../context/AppContext';
import { DignitaryMessage } from '../types';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '../services/firebaseStorageService';

export const HomePage: React.FC = () => {
  const {
    language,
    setActivePage,
    currentPalette,
    projects,
    notices,
    donors,
    dignitaryMessages,
    programs,
    galleryPhotos,
    galleryAlbums,
    siteSettings,
  } = useApp();

  const [selectedMessage, setSelectedMessage] = useState<DignitaryMessage | null>(null);

  // Lightweight scroll-driven parallax references
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Subtle GPU-friendly parallax transforms
  const heroImageY = useTransform(heroScroll, [0, 1], ['0%', '14%']);
  const heroFloatingBadgeY = useTransform(heroScroll, [0, 1], ['0px', '-28px']);
  const heroBgOrbY = useTransform(heroScroll, [0, 1], ['0px', '65px']);

  const parallaxBannerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: bannerScroll } = useScroll({
    target: parallaxBannerRef,
    offset: ['start end', 'end start'],
  });
  const bannerBgY = useTransform(bannerScroll, [0, 1], ['-12%', '12%']);

  const urgentNotices = (notices || []).filter((n) => n.isUrgent);
  const availableDonorsCount = (donors || []).filter((d) => d.available ?? d.isAvailable).length;
  const formatCount = (value: number | undefined, locale = 'en-US') =>
    value === undefined || value === null ? '' : `${value.toLocaleString(locale)}+`;

  const impactStats = [
    {
      icon: Users,
      valueEn: formatCount(siteSettings?.beneficiariesCount),
      valueBn: formatCount(siteSettings?.beneficiariesCount, 'bn-BD'),
      labelEn: 'Lives Impacted Directly',
      labelBn: 'সরাসরি উপকৃত মানুষ',
    },
    {
      icon: Droplets,
      valueEn: formatCount(siteSettings?.bloodBagsArrangedCount),
      valueBn: formatCount(siteSettings?.bloodBagsArrangedCount, 'bn-BD'),
      labelEn: 'Bags of Blood Arranged',
      labelBn: 'ব্যাগ রক্তের ব্যবস্থা সম্পন্ন',
    },
    {
      icon: BookOpen,
      valueEn: formatCount(siteSettings?.scholarshipStudentsCount),
      valueBn: formatCount(siteSettings?.scholarshipStudentsCount, 'bn-BD'),
      labelEn: 'Students Supported',
      labelBn: 'শিক্ষার্থীকে বৃত্তি ও উপকরণ',
    },
    {
      icon: TreePine,
      valueEn: formatCount(siteSettings?.treesPlantedCount),
      valueBn: formatCount(siteSettings?.treesPlantedCount, 'bn-BD'),
      labelEn: 'Saplings Planted',
      labelBn: 'বৃক্ষরোপণ ও সবুজায়ন',
    },
  ];

  // Featured video or gallery media for Home preview
  const featuredVideosAndPhotos = galleryPhotos.slice(0, 3);

  return (
    <div className="space-y-20 pb-16 overflow-x-hidden">
      {/* Urgent Notice Ticker */}
      {urgentNotices.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-amber-900 truncate">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shrink-0">
                <Bell className="w-3 h-3" />
                {language === 'bn' ? 'জরুরি বিজ্ঞপ্তি' : 'URGENT'}
              </span>
              <span className="truncate">
                {language === 'bn' ? urgentNotices[0].titleBn : urgentNotices[0].title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('notices')}
              className="text-xs font-bold text-amber-800 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'bn' ? 'বিস্তারিত' : 'Read More'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PARALLAX HERO SECTION */}
      <section ref={heroRef} className="relative pt-4 sm:pt-8 overflow-hidden">
        {/* Parallax Ambient Background Glow */}
        <motion.div
          style={{ y: heroBgOrbY }}
          className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#bad3e4]/35 blur-3xl -z-10 will-change-transform"
        />
        <motion.div
          style={{ y: heroFloatingBadgeY }}
          className="pointer-events-none absolute top-40 -left-20 w-80 h-80 rounded-full bg-[#10564f]/10 blur-3xl -z-10 will-change-transform"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0.92, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6"
            >
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border"
                style={{
                  backgroundColor: `${currentPalette.primary}12`,
                  borderColor: `${currentPalette.primary}30`,
                  color: currentPalette.primary,
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn'
                    ? siteSettings?.tickerTextBn || ''
                    : siteSettings?.tickerTextEn || ''}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {language === 'bn' ? (
                  <span>{siteSettings?.heroHeadlineBn || ''}</span>
                ) : (
                  <span>{siteSettings?.heroHeadlineEn || ''}</span>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {language === 'bn'
                  ? siteSettings?.heroSubheadlineBn
                  : siteSettings?.heroSubheadlineEn}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePage('donate')}
                  className="px-6 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base shadow-xl hover:opacity-95 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    backgroundColor: currentPalette.primary,
                    boxShadow: `0 12px 30px -8px ${currentPalette.primary}65`,
                  }}
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>
                    {language === 'bn'
                      ? 'মানবতার তহবিলে অনুদান দিন'
                      : 'Donate to Humanitarian Fund'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage('blood-network')}
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Droplets className="w-5 h-5" />
                  <span>
                    {language === 'bn' ? 'জরুরি রক্তদাতা খুঁজুন' : 'Find Blood Donor'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage('volunteer')}
                  className="px-5 py-3.5 rounded-2xl bg-white text-slate-800 border border-slate-200/80 hover:border-slate-300 font-semibold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {language === 'bn' ? 'স্বেচ্ছাসেবক হোন' : 'Become a Volunteer'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/70 max-w-lg">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: currentPalette.primary }}
                  />
                  <span>
                    {language === 'bn' ? '১০০% স্বচ্ছ তহবিল হিসাব' : '100% Transparent Audit'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: currentPalette.primary }}
                  />
                  <span>
                    {language === 'bn'
                      ? `${availableDonorsCount}+ সক্রিয় রক্তদাতা`
                      : `${availableDonorsCount}+ Active Blood Donors`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: currentPalette.primary }}
                  />
                  <span>
                    {language === 'bn' ? '২৪/৭ জরুরি সাড়া' : '24/7 Emergency Response'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Parallax Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 sm:aspect-4/3 lg:aspect-4/5">
                <motion.img
                  style={{ y: heroImageY, scale: 1.08 }}
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                  alt="JAGREETI Volunteers in Action"
                  className="w-full h-full object-cover will-change-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: currentPalette.primary }}
                  >
                    {language === 'bn' ? 'মাঠপর্যায়ের কার্যক্রম' : 'Field Action 2025'}
                  </span>
                  <h3 className="text-xl font-bold leading-snug">
                    {language === 'bn'
                      ? 'বানভাসি ও দুর্গত মানুষের দুয়ারে জাগৃতির স্বেচ্ছাসেবক দল'
                      : 'JAGREETI Volunteers Delivering Emergency Aid to Remote Families'}
                  </h3>
                </div>
              </div>

              {/* Parallax Floating Card */}
              <motion.div
                style={{ y: heroFloatingBadgeY }}
                className="hidden sm:flex absolute bottom-55 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-200/80 items-center gap-3.5 will-change-transform"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: currentPalette.primary }}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'নিবন্ধিত স্বেচ্ছাসেবক' : 'Registered Volunteers'}
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {language === 'bn'
                      ? formatCount(siteSettings?.volunteersCount, 'bn-BD') + ' তরুণ সদস্য'
                      : formatCount(siteSettings?.volunteersCount) + ' Youths'}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS SECTION (With Smooth Viewport Reveal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {impactStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0.9, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${currentPalette.primary}15`,
                    color: currentPalette.primary,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {language === 'bn' ? stat.valueBn : stat.valueEn}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                    {language === 'bn' ? stat.labelBn : stat.labelEn}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DIGNITARY & LEADER SPEECHES (Sorted by Priority) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: currentPalette.primary }}
            >
              <Quote className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'বিশিষ্টজনের বাণী ও শুভেচ্ছা বার্তা'
                  : 'Words of Inspiration & Endorsements'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'জাগৃতি সম্পর্কে বিশিষ্টজন ও নেতৃত্বের মন্তব্য'
                : 'Messages from Dignitaries & Leadership'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            {language === 'bn'
              ? 'যেকোনো বার্তায় ক্লিক করে সম্পূর্ণ বক্তব্য ও বাণী বিস্তারিত পড়ুন।'
              : 'Click on any message card below to read the full speech and endorsement.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dignitaryMessages.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0.9, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              onClick={() => setSelectedMessage(item)}
              className="group cursor-pointer rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden hover:-translate-y-1"
            >
              <div
                className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:scale-125 transition-transform"
                style={{ backgroundColor: currentPalette.primary }}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.image}
                    alt={language === 'bn' ? item.nameBn : item.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {language === 'bn' ? item.nameBn : item.name}
                    </h3>
                    <p
                      className="text-[11px] font-semibold leading-tight mt-0.5 line-clamp-2"
                      style={{ color: currentPalette.primary }}
                    >
                      {language === 'bn'
                        ? item.designationBn || item.roleBn || item.designation
                        : item.designation || item.role}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <h4 className="text-xs font-bold text-slate-800 mb-1.5 line-clamp-1">
                    “{language === 'bn' ? item.titleBn : item.title}”
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {language === 'bn'
                      ? item.quoteBn || item.fullMessageBn || item.messageBn
                      : item.quote || item.fullMessage || item.message}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 text-[11px]">
                  {language === 'bn'
                    ? item.academicBackgroundBn || item.academicBackground || 'অফিসিয়াল বাণী'
                    : item.academicBackground || 'Official Endorsement'}
                </span>
                <span
                  className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  style={{ color: currentPalette.primary }}
                >
                  <span>{language === 'bn' ? 'পূর্ণ বাণী পড়ুন' : 'Read Full Speech'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CORE PROGRAMS / WINGS SECTION (Dynamic & Sorted by Priority) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: currentPalette.primary }}
            >
              <HandHeart className="w-4 h-4" />
              <span>{language === 'bn' ? 'আমাদের কর্মপরিধি' : 'Our Core Focus Areas'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'বহুমুখী মানবিক ও সামাজিক কর্মসূচি'
                : 'Comprehensive Community Welfare Wings'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('programs')}
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline cursor-pointer self-start md:self-auto"
            style={{ color: currentPalette.primary }}
          >
            <span>{language === 'bn' ? 'সকল কর্মসূচি দেখুন' : 'Explore All Programs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 6).map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0.9, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  {prog.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#04345c]/90 text-white">
                      {prog.category}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 shadow-xs">
                    {language === 'bn' ? prog.impactBn || prog.impact : prog.impact}
                  </span>
                </div>

                <div className="p-6 space-y-2.5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'bn' ? prog.titleBn : prog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {language === 'bn' ? prog.descBn : prog.desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-5 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePage('programs')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#04345c] group-hover:underline cursor-pointer"
                >
                  <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Learn More'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LIGHTWEIGHT PARALLAX HUMANITARIAN VISION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={parallaxBannerRef}
          className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center justify-center p-8 sm:p-14 text-center text-white shadow-xl"
        >
          <motion.img
            style={{ y: bannerBgY, scale: 1.15 }}
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80"
            alt="Humanitarian Vision"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04345c]/92 via-[#04345c]/80 to-[#10564f]/88" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[#bad3e4] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'bn' ? 'আমাদের অঙ্গীকার' : 'Our Humanitarian Pledge'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              {language === 'bn'
                ? '“ক্ষুধা, দারিদ্র্য ও অশিক্ষামুক্ত এক আলোকিত সমাজ বিনির্মাণে তারুণ্যের সম্মিলিত জাগরণই আমাদের শক্তি।”'
                : '“Empowering youth to build a compassionate, resilient, and equitable Bangladesh where no family is left behind.”'}
            </h2>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActivePage('committee')}
                className="px-5 py-2.5 rounded-xl bg-white text-[#04345c] font-bold text-xs sm:text-sm hover:bg-slate-100 transition cursor-pointer"
              >
                {language === 'bn' ? 'আমাদের নেতৃত্ব ও টিম দেখুন' : 'Meet Our Leadership Directory'}
              </button>
              <button
                type="button"
                onClick={() => setActivePage('gallery')}
                className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                {language === 'bn' ? 'ফটো ও ভিডিও পোর্টফোলিও' : 'View Photo & Video Portfolio'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY BLOOD BANK HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-rose-200" />
                <span>
                  {language === 'bn' ? 'জাগৃতি ব্লাড ব্যাংক ও ডোনার সেল' : 'JAGREETI Blood Donor Network'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                {language === 'bn'
                  ? 'জরুরি মুহূর্তে রক্তের প্রয়োজন? কিংবা স্বেচ্ছায় রক্তদান করতে চান?'
                  : 'Need Emergency Blood or Want to Save a Life Today?'}
              </h2>
              <p className="text-rose-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? 'আমাদের যাচাইকৃত রক্তদাতা ডাটাবেজ থেকে আপনার রক্তের গ্রুপ ও এলাকা অনুযায়ী সরাসরি ডোনারের সাথে যোগাযোগ করুন অথবা নতুন রক্তদাতা হিসেবে নিবন্ধন করুন।'
                  : 'Search our verified directory of active blood donors by blood group and district, or register yourself as a lifesaving donor.'}
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => setActivePage('blood-network')}
                className="w-full py-3.5 px-6 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-sm sm:text-base text-center shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Droplets className="w-5 h-5 fill-current" />
                <span>{language === 'bn' ? 'রক্তদাতা ডিরেক্টরি দেখুন' : 'Search Blood Donors'}</span>
              </button>
              <a
                href={siteSettings?.contactPhone ? `tel:${siteSettings.contactPhone}` : undefined}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-950/40 hover:bg-rose-950/60 border border-white/20 text-white font-semibold text-sm text-center transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? `হটলাইন: ${siteSettings?.contactPhone || ''}`
                    : `Blood Hotline: ${siteSettings?.contactPhone || ''}`}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SECTION (Sorted by Priority) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: currentPalette.primary }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'সাম্প্রতিক ও চলমান প্রকল্প' : 'Featured Projects'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn' ? 'মাঠপর্যায়ে আমাদের কাজের প্রতিফলন' : 'Our Impact on the Ground'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActivePage('projects')}
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline cursor-pointer self-start md:self-auto"
            style={{ color: currentPalette.primary }}
          >
            <span>{language === 'bn' ? 'সবগুলো প্রকল্প দেখুন' : 'View All Projects'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={language === 'bn' ? project.titleBn : project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentPalette.primary }}
                    >
                      {language === 'bn' ? project.categoryBn : project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {language === 'bn' ? project.locationBn : project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {language === 'bn' ? project.dateBn : project.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                    {language === 'bn' ? project.titleBn : project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {language === 'bn' ? project.descriptionBn : project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {language === 'bn' ? 'উপকারভোগী: ' : 'Impact: '}
                  <strong style={{ color: currentPalette.primary }}>
                    {language === 'bn' ? project.beneficiariesBn : project.beneficiaries}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActivePage('projects')}
                  className="font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  style={{ color: currentPalette.primary }}
                >
                  <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PORTFOLIO: ALBUMS, PHOTOS & YOUTUBE VIDEOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10564f]">
              <Camera className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'ফটো অ্যালবাম ও ভিডিও ডকুমেন্টারি'
                  : 'Photo Albums & Video Portfolio'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'কাজের মুহূর্ত ও ডকুমেন্টারি গ্যালারি'
                : 'Visual Stories & Field Documentaries'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('gallery')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#04345c] hover:underline cursor-pointer self-start md:self-auto"
          >
            <span>
              {language === 'bn'
                ? `সম্পূর্ণ গ্যালারি ও ${galleryAlbums.length}টি অ্যালবাম দেখুন`
                : `View All Albums (${galleryAlbums.length}) & Media`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVideosAndPhotos.map((item) => {
            const isVideo = item.mediaType === 'video';
            const isYT =
              isVideo &&
              (item.videoSource === 'youtube' || (item.videoUrl && isYouTubeUrl(item.videoUrl)));

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  {isVideo && item.videoUrl && isYT ? (
                    <iframe
                      src={getYouTubeEmbedUrl(item.videoUrl)}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isVideo && item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.image}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isVideo ? 'bg-rose-600 text-white' : 'bg-[#04345c]/90 text-white'
                      }`}
                    >
                      {isVideo ? <Youtube className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                      {isVideo ? 'Video' : language === 'bn' ? item.categoryBn : item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {language === 'bn' ? item.titleBn : item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePage('gallery')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#04345c] shrink-0 cursor-pointer"
                  >
                    {language === 'bn' ? 'গ্যালারি' : 'Gallery'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dignitary Speech Full Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={selectedMessage.image}
                alt={selectedMessage.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-100 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-center sm:text-left">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-1.5"
                  style={{ backgroundColor: currentPalette.primary }}
                >
                  {language === 'bn'
                    ? selectedMessage.designationBn || selectedMessage.roleBn || selectedMessage.designation
                    : selectedMessage.designation || selectedMessage.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {language === 'bn' ? selectedMessage.nameBn : selectedMessage.name}
                </h3>
                {(selectedMessage.academicBackground || selectedMessage.academicBackgroundBn) && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'bn'
                      ? selectedMessage.academicBackgroundBn || selectedMessage.academicBackground
                      : selectedMessage.academicBackground}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 shrink-0" style={{ color: currentPalette.primary }} />
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? selectedMessage.titleBn : selectedMessage.title}
                </h4>
              </div>
              {(selectedMessage.quote || selectedMessage.quoteBn) && (
                <blockquote className="text-xs sm:text-sm italic font-semibold text-[#04345c] border-l-4 border-[#1e77bd] pl-3 py-1">
                  “{language === 'bn' ? selectedMessage.quoteBn || selectedMessage.quote : selectedMessage.quote}”
                </blockquote>
              )}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {language === 'bn'
                  ? selectedMessage.fullMessageBn || selectedMessage.messageBn || selectedMessage.quoteBn
                  : selectedMessage.fullMessage || selectedMessage.message || selectedMessage.quote}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer"
                style={{ backgroundColor: currentPalette.primary }}
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
