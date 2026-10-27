import React from 'react';
import {
  LayoutDashboard,
  Home,
  Info,
  Layers,
  FolderKanban,
  Quote,
  Users,
  Droplets,
  Image as ImageIcon,
  Bell,
  UserCheck,
  CreditCard,
  Phone,
  LogOut,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { Language } from '../../types';

export type AdminSectionId =
  | 'overview'
  | 'home'
  | 'about'
  | 'programs'
  | 'projects'
  | 'dignitaries'
  | 'committee'
  | 'blood'
  | 'gallery'
  | 'notices'
  | 'volunteers'
  | 'donations'
  | 'contact'
  | 'schema';

export type AdminTab = AdminSectionId;

interface AdminSidebarProps {
  activeSection: AdminSectionId;
  onSelectSection: (section: AdminSectionId) => void;
  onLogout: () => void;
  language: Language;
  counts: {
    programs: number;
    projects: number;
    dignitaries: number;
    committee: number;
    bloodDonors: number;
    gallery: number;
    notices: number;
    volunteersPending: number;
    donationsPending: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  onLogout,
  language,
  counts,
}) => {
  const navItems: {
    id: AdminSectionId;
    label: { en: string; bn: string };
    icon: React.FC<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: { en: 'Overview & Summary', bn: 'সারসংক্ষেপ ও ড্যাশবোর্ড' },
      icon: LayoutDashboard,
    },
    {
      id: 'home',
      label: { en: 'Home Page Content', bn: 'হোম পেজ কন্টেন্ট' },
      icon: Home,
    },
    {
      id: 'about',
      label: { en: 'About & History Page', bn: 'পরিচিতি ও ইতিহাস পেজ' },
      icon: Info,
    },
    {
      id: 'dignitaries',
      label: { en: 'Dignitary Speeches', bn: 'বিশিষ্টজনের বাণী ও মন্তব্য' },
      icon: Quote,
      badge: counts.dignitaries,
    },
    {
      id: 'committee',
      label: { en: 'Committee & Leadership', bn: 'কার্যনির্বাহী ও কমিটি' },
      icon: Users,
      badge: counts.committee,
    },
    {
      id: 'programs',
      label: { en: 'Programs & Wings', bn: 'উইং ও কর্মসূচি পেজ' },
      icon: Layers,
      badge: counts.programs,
    },
    {
      id: 'projects',
      label: { en: 'Projects & Operations', bn: 'প্রকল্প ও কার্যক্রম পেজ' },
      icon: FolderKanban,
      badge: counts.projects,
    },
    {
      id: 'gallery',
      label: { en: 'Photo, Video & Albums', bn: 'ফটো, ভিডিও ও অ্যালবাম' },
      icon: ImageIcon,
      badge: counts.gallery,
    },
    {
      id: 'notices',
      label: { en: 'Notices & Circulars', bn: 'বিজ্ঞপ্তি ও সার্কুলার পেজ' },
      icon: Bell,
      badge: counts.notices,
    },
    {
      id: 'blood',
      label: { en: 'Blood Donors Directory', bn: 'রক্তদাতা ডিরেক্টরি পেজ' },
      icon: Droplets,
      badge: counts.bloodDonors,
    },
    {
      id: 'volunteers',
      label: { en: 'Volunteers & Join Page', bn: 'স্বেচ্ছাসেবক ও সদস্য আবেদন' },
      icon: UserCheck,
      badge: counts.volunteersPending,
      badgeColor: counts.volunteersPending > 0 ? 'bg-amber-500 text-slate-950' : undefined,
    },
    {
      id: 'donations',
      label: { en: 'Donations & Audit Page', bn: 'অনুদান ও অডিট হিসাব' },
      icon: CreditCard,
      badge: counts.donationsPending,
      badgeColor: counts.donationsPending > 0 ? 'bg-rose-500 text-white' : undefined,
    },
    {
      id: 'contact',
      label: { en: 'Contact & HQ Info', bn: 'যোগাযোগ ও কার্যালয় তথ্য' },
      icon: Phone,
    },
    {
      id: 'schema',
      label: { en: 'Firebase Schema Docs', bn: 'ফায়ারবেস ডাটাবেস স্কিমা' },
      icon: Database,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-[#04345c] text-white rounded-3xl shadow-xl border border-[#1e77bd]/30 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-white/10 bg-[#032544]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10564f] border border-[#bad3e4]/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#bad3e4]" />
            </div>
            <div>
              <h2 className="font-bold text-2xl tracking-tight text-white">
                {language === 'bn' ? 'জাগৃতি অ্যাডমিন' : 'JAGREETI CMS'}
              </h2>
              <p className="text-[14px] text-[#bad3e4]/80">
                {language === 'bn' ? 'কেন্দ্রীয় কন্টেন্ট ম্যানেজমেন্ট' : 'Full Website Content Control'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1 max-h-[65vh] lg:max-h-none overflow-y-auto">
          <div className="px-3 py-1.5 text-[15px] uppercase tracking-wider text-[#bad3e4]/60">
            {language === 'bn' ? 'সকল পেজ ও ডাটা নেভিগেশন' : 'Pages & Content Navigation'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xlg  transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1e77bd] text-white shadow-md'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#bad3e4]'
                    }`}
                  />
                  <span className="truncate">{item.label[language]}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-[#bad3e4]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Logout Button */}
      <div className="p-4 border-t border-white/10 bg-[#032544]/90 mt-4">
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-lg flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'bn' ? 'লগআউট করুন' : 'Logout from Admin'}</span>
        </button>
      </div>
    </aside>
  );
};
