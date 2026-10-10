import React from 'react';
import {
  Users,
  Bell,
  HeartHandshake,
  Image,
  CreditCard,
  UserCheck,
  Quote,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AdminTab } from '../AdminSidebar';

interface AdminOverviewTabProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onSelectTab }) => {
  const {
    language,
    committee,
    projects,
    notices,
    volunteers,
    donations,
    galleryPhotos,
    programs,
    dignitaryMessages,
  } = useApp();

  const pendingVolunteers = volunteers.filter((v) => v.status === 'pending');
  const pendingDonations = donations.filter((d) => d.status === 'pending');
  const totalVerifiedDonationsAmount = donations
    .filter((d) => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0);

  const stats = [
    {
      title: language === 'bn' ? 'কমিটি সদস্য' : 'Committee Members',
      count: committee.length,
      icon: Users,
      tab: 'committee' as AdminTab,
      color: 'text-[#04345c] bg-[#04345c]/10',
    },
    {
      title: language === 'bn' ? 'চলমান প্রকল্প' : 'Active Projects',
      count: projects.length,
      icon: HeartHandshake,
      tab: 'projects' as AdminTab,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: language === 'bn' ? 'বিজ্ঞপ্তি ও সার্কুলার' : 'Published Notices',
      count: notices.length,
      icon: Bell,
      tab: 'notices' as AdminTab,
      color: 'text-sky-700 bg-sky-50',
    },
    {
      title: language === 'bn' ? 'স্বেচ্ছাসেবী আবেদন' : 'Volunteer Applications',
      count: volunteers.length,
      highlight: pendingVolunteers.length > 0 ? `${pendingVolunteers.length} pending` : undefined,
      icon: UserCheck,
      tab: 'volunteers' as AdminTab,
      color: 'text-amber-700 bg-amber-50',
    },
    {
      title: language === 'bn' ? 'যাচাইকৃত অনুদান' : 'Verified Donations',
      count: `৳${totalVerifiedDonationsAmount.toLocaleString()}`,
      highlight: pendingDonations.length > 0 ? `${pendingDonations.length} to verify` : undefined,
      icon: CreditCard,
      tab: 'donations' as AdminTab,
      color: 'text-rose-700 bg-rose-50',
    },
    {
      title: language === 'bn' ? 'গ্যালারি ফটো' : 'Gallery Photos',
      count: galleryPhotos.length,
      icon: Image,
      tab: 'gallery' as AdminTab,
      color: 'text-indigo-700 bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#04345c] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#bad3e4]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সিস্টেম স্ট্যাটাস: অনলাইন' : 'System Status: Fully Synced'}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {language === 'bn' ? 'স্বাগতম, সেন্ট্রাল অ্যাডমিন' : 'Welcome to JAGREETI Central Admin'}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            {language === 'bn'
              ? 'এখান থেকে আপনি ওয়েবসাইটের প্রতিটি পেজের কনটেন্ট, কমিটি সদস্য, বাণী, নোটিশ, প্রকল্প ও অনুদানের পূর্ণাঙ্গ CRUD নিয়ন্ত্রণ করতে পারেন।'
              : 'Directly manage website pages content, dignitary speeches, committee profiles, circulars, volunteer approvals, and live campaigns.'}
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => onSelectTab('home')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#04345c] font-bold text-xs hover:bg-[#bad3e4] transition shadow-xs"
          >
            {language === 'bn' ? 'হোমপেজ সম্পাদনা' : 'Edit Home Content'}
          </button>
          <button
            onClick={() => onSelectTab('dignitaries')}
            className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 border border-white/20 transition"
          >
            {language === 'bn' ? 'উপদেষ্টার বাণী' : 'Advisor Speeches'}
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onSelectTab(stat.tab)}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#04345c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">{stat.title}</div>
                <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>{stat.count}</span>
                  {stat.highlight && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {stat.highlight}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Pending Tasks & Quick Page Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Action Needed */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'যাচাই ও অনুমোদনের অপেক্ষায়' : 'Pending Actions & Verifications'}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {pendingVolunteers.length + pendingDonations.length} {language === 'bn' ? 'টি বাকি' : 'pending'}
            </span>
          </div>

          <div className="space-y-3">
            {pendingDonations.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    {language === 'bn'
                      ? `${pendingDonations.length} টি নতুন অনুদান ট্রানজেকশন যাচাই করুন`
                      : `${pendingDonations.length} Pending Donation TrxID to verify`}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    {language === 'bn' ? 'রসিদ ও ব্যাংক বিবরণী মিলিয়ে নিন' : 'Match TrxID and acknowledge'}
                  </div>
                </div>
                <button
                  onClick={() => onSelectTab('donations')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
                >
                  {language === 'bn' ? 'যাচাই করুন' : 'Verify'}
                </button>
              </div>
            ) : null}

            {pendingVolunteers.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-sky-900">
                    {language === 'bn'
                      ? `${pendingVolunteers.length} জন নতুন স্বেচ্ছাসেবী আবেদনকারী`
                      : `${pendingVolunteers.length} New Volunteer Applications`}
                  </div>
                  <div className="text-[11px] text-sky-700 mt-0.5">
                    {language === 'bn' ? 'উইং ও যোগাযোগের তথ্য পর্যালোচনা করুন' : 'Review wing preferences & approve'}
                  </div>
                </div>
                <button
                  onClick={() => onSelectTab('volunteers')}
                  className="px-3 py-1.5 rounded-lg bg-[#04345c] text-white font-bold text-xs hover:bg-[#04345c]/90 transition"
                >
                  {language === 'bn' ? 'অনুমোদন দিন' : 'Approve'}
                </button>
              </div>
            ) : null}

            {pendingDonations.length === 0 && pendingVolunteers.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span>{language === 'bn' ? 'সকল আবেদন ও লেনদেন যাচাই সম্পন্ন।' : 'All applications and records are fully up to date.'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Page Content Shortcuts */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            {language === 'bn' ? 'সরাসরি পৃষ্ঠা কনটেন্ট এডিটর' : 'Quick Page Content Editors'}
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'home' as AdminTab, label: language === 'bn' ? 'হোম পেজ' : 'Home Page', icon: '🏠' },
              { id: 'dignitaries' as AdminTab, label: language === 'bn' ? 'উপদেষ্টার বাণী' : 'Dignitary Speeches', icon: '📜' },
              { id: 'about' as AdminTab, label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', icon: 'ℹ️' },
              { id: 'committee' as AdminTab, label: language === 'bn' ? 'কমিটি তালিকা' : 'Committee Members', icon: '👥' },
              { id: 'programs' as AdminTab, label: language === 'bn' ? 'উইং ও কর্মসূচি' : 'Programs & Wings', icon: '🎯' },
              { id: 'projects' as AdminTab, label: language === 'bn' ? 'প্রকল্প ক্যাম্পেইন' : 'Projects / Relief', icon: '🤝' },
              { id: 'gallery' as AdminTab, label: language === 'bn' ? 'ফটো অ্যালবাম' : 'Photo Gallery', icon: '🖼️' },
              { id: 'notices' as AdminTab, label: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notices & Alerts', icon: '📢' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectTab(p.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#04345c] hover:bg-slate-50 text-left transition flex items-center gap-2 text-xs font-semibold text-slate-800"
              >
                <span className="text-base">{p.icon}</span>
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
