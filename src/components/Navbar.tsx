import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Heart,
  Globe2,
  Users,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    language,
    toggleLanguage,
    t,
    activePage,
    setActivePage,
    currentPalette,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const mainNavItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'committee', label: language === 'bn' ? 'কমিটি পরিচিতি' : 'About Committee', icon: Users },
    { id: 'programs', label: t.nav.programs },
    { id: 'projects', label: t.nav.projects },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'notices', label: t.nav.notices },
    { id: 'volunteer', label: t.nav.volunteer },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      {/* Top Banner Ticker */}
      <div className="bg-[#04345c] text-slate-200 text-[12px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#bad3e4] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1e77bd] animate-ping inline-block" />
              {language === 'bn' ? 'স্বেচ্ছাসেবা ও মানবিক সহায়তা কেন্দ্র' : 'Voluntary Humanitarian Relief Center'}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-slate-300">
              {language === 'bn'
                ? 'জাগ্রীতি — অরাজনৈতিক সমাজকল্যাণমূলক যুব সংগঠন | লালমনিরহাট'
                : 'JAGREETI — Apolitical Socio-Humanitarian Youth Movement | Bangladesh'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:01744769331"
              className="flex items-center gap-1.5 text-white/90 hover:text-white transition font-mono font-semibold"
            >
              <Phone className="w-3 h-3 text-[#1e77bd]" />
              <span>+880 1744-769331</span>
            </a>
            <span className="text-white/30">•</span>
            <button
              onClick={() => handleNavClick('donate')}
              className="text-[#bad3e4] hover:text-white transition font-bold text-xs"
            >
              {language === 'bn' ? 'অনলাইন অনুদান' : 'Online Donation'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-5 cursor-pointer select-none group"
          >
            <div
              className="rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#04345c]/20 group-hover:scale-105 transition duration-200"
              style={{ backgroundColor: currentPalette.primary }}
            >
              {/* image logo at public/assets/logo.png */}
              <img
                src="/assets/logo.png"
                alt="JAGREETI Logo"
                className="w-10 h-11 md:scale-150 sm:scale-100 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#04345c] font-sans">
                  {language === 'bn' ? 'জাগৃতি' : 'JAGREETI'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden xs:block font-medium">
                {language === 'bn' ? 'তারুণ্য • মানবতা • সেবা' : 'Youth • Humanity • Service'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#04345c] hover:bg-slate-100'
                  }`}
                  style={isActive ? { backgroundColor: currentPalette.primary } : {}}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:border-slate-300 transition shadow-xs"
              title={language === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে পরিবর্তন করুন'}
            >
              <Globe2 className="w-3.5 h-3.5 text-[#10564f]" />
              <span>{language === 'bn' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Donate CTA Button */}
            <button
              onClick={() => handleNavClick('donate')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
              style={{ backgroundColor: currentPalette.accent }}
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{t.nav.donate}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 xl:hidden transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto"
          >
            {/* Quick CTA in Mobile */}
            <div className="mb-3">
              <button
                onClick={() => handleNavClick('donate')}
                className="w-full p-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                style={{ backgroundColor: currentPalette.accent }}
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{t.nav.donate}</span>
              </button>
            </div>

            {/* Nav list */}
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    style={isActive ? { backgroundColor: currentPalette.primary } : {}}
                  >
                    <div className="flex items-center gap-2.5">
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
