import React, { useEffect, useState } from 'react';
import { ShieldAlert, ExternalLink, LogOut, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminLogin } from './admin/AdminLogin';
import { AdminSidebar, AdminSectionId } from './admin/AdminSidebar';
import { AdminOverviewTab } from './admin/tabs/AdminOverviewTab';
import { AdminHomeTab } from './admin/tabs/AdminHomeTab';
import { AdminAboutTab } from './admin/tabs/AdminAboutTab';
import { AdminProgramsTab } from './admin/tabs/AdminProgramsTab';
import { AdminProjectsTab } from './admin/tabs/AdminProjectsTab';
import { AdminDignitariesTab } from './admin/tabs/AdminDignitariesTab';
import { AdminCommitteeTab } from './admin/tabs/AdminCommitteeTab';
import { AdminBloodDonorsTab } from './admin/tabs/AdminBloodDonorsTab';
import { AdminGalleryTab } from './admin/tabs/AdminGalleryTab';
import { AdminNoticesTab } from './admin/tabs/AdminNoticesTab';
import { AdminVolunteersTab } from './admin/tabs/AdminVolunteersTab';
import { AdminDonationsTab } from './admin/tabs/AdminDonationsTab';
import { AdminContactTab } from './admin/tabs/AdminContactTab';
import { AdminFirebaseDocsTab } from './admin/tabs/AdminFirebaseDocsTab';
import { auth, onAuthStateChanged, signOut } from '../services/firebaseService';

const ADMIN_AUTH_STORAGE_KEY = 'jagreeti_admin_authenticated_v1';

export const AdminPanelPage: React.FC = () => {
  const {
    language,
    setActivePage,
    programs,
    projects,
    dignitaryMessages,
    committee,
    donors,
    galleryPhotos,
    notices,
    volunteers,
    donations,
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => setIsAuthenticated(Boolean(user)));
  }, []);

  const handleLoginSuccess = () => {
    sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
    localStorage.setItem('jagreeti_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    localStorage.removeItem('jagreeti_admin_auth');
    setIsAuthenticated(false);
    if (auth) void signOut(auth);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingVolunteersCount = volunteers.filter((v) => v.status === 'pending').length;
  const pendingDonationsCount = donations.filter((d) => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f4f8fb] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Admin Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#04345c] text-white flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-5 h-5 text-[#bad3e4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {language === 'bn'
                    ? 'জাগৃতি কেন্দ্রীয় অ্যাডমিন প্যানেল (CMS)'
                    : 'JAGREETI Central Admin Panel (CMS)'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {language === 'bn' ? 'সক্রিয় সেশন' : 'Authenticated'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn'
                  ? 'বাম পাশের সাইডবার ব্যবহার করে ওয়েবসাইটের প্রতিটি পেজের তথ্য, ছবি, ভিডিও, অ্যালবাম ও ক্রম নিয়ন্ত্রণ করুন।'
                  : 'Manage all website pages, Firebase Storage uploads, albums, categories, and priority serialization.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection('schema')}
              className="px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-xs font-bold text-sky-900 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#1e77bd]" />
              <span>{language === 'bn' ? 'ফায়ারবেস স্কিমা ডকস' : 'Firebase Schema Docs'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage('home')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1e77bd]" />
              <span>{language === 'bn' ? 'মূল ওয়েবসাইট দেখুন' : 'View Live Website'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content Area */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <AdminSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            onLogout={handleLogout}
            language={language}
            counts={{
              programs: programs.length,
              projects: projects.length,
              dignitaries: dignitaryMessages.length,
              committee: committee.length,
              bloodDonors: donors.length,
              gallery: galleryPhotos.length,
              notices: notices.length,
              volunteersPending: pendingVolunteersCount,
              donationsPending: pendingDonationsCount,
            }}
          />

          <main className="flex-1 w-full bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7 min-h-[640px]">
            {activeSection === 'overview' && (
              <AdminOverviewTab onSelectTab={(sec) => setActiveSection(sec)} />
            )}
            {activeSection === 'home' && <AdminHomeTab />}
            {activeSection === 'about' && <AdminAboutTab />}
            {activeSection === 'programs' && <AdminProgramsTab />}
            {activeSection === 'projects' && <AdminProjectsTab />}
            {activeSection === 'dignitaries' && <AdminDignitariesTab />}
            {activeSection === 'committee' && <AdminCommitteeTab />}
            {activeSection === 'blood' && <AdminBloodDonorsTab />}
            {activeSection === 'gallery' && <AdminGalleryTab />}
            {activeSection === 'notices' && <AdminNoticesTab />}
            {activeSection === 'volunteers' && <AdminVolunteersTab />}
            {activeSection === 'donations' && <AdminDonationsTab />}
            {activeSection === 'contact' && <AdminContactTab />}
            {activeSection === 'schema' && <AdminFirebaseDocsTab />}
          </main>
        </div>
      </div>
    </div>
  );
};
