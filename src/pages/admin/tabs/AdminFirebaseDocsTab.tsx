import React, { useState } from 'react';
import {
  Database,
  FolderUp,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  Layers,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminFirebaseDocsTab: React.FC = () => {
  const {
    language,
    siteSettings,
    dignitaryMessages,
    committee,
    committeeGroups,
    programs,
    projects,
    galleryPhotos,
    galleryAlbums,
    notices,
    bloodDonors,
    volunteers,
    donations,
    customCategories,
    showToast,
  } = useApp();

  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    showToast(
      language === 'bn' ? 'ক্লিপবোর্ডে কপি করা হয়েছে' : 'Copied to clipboard',
      'success'
    );
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const handleDownloadSnapshot = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      collections: {
        site_settings: { global_config: siteSettings },
        custom_categories: { global_taxonomy: customCategories },
        dignitary_messages: dignitaryMessages,
        committee_groups: committeeGroups,
        committee_members: committee,
        programs,
        projects,
        gallery_albums: galleryAlbums,
        gallery_media: galleryPhotos,
        notices,
        blood_donors: bloodDonors,
        volunteers,
        donations,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jagreeti-firebase-collections-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const collectionsList = [
    {
      name: 'site_settings',
      count: 1,
      orderRule: 'Singleton doc: global_config',
      storageFolder: 'N/A',
      fields: 'heroBadgeBn, heroTitleBn, aboutStoryBn, totalMembersCount, impactStatsCount, contactPhone, contactEmail, facebookUrl, youtubeUrl',
    },
    {
      name: 'categories',
      count: 1,
      orderRule: 'Singleton doc: global_taxonomy',
      storageFolder: 'N/A',
      fields: 'memberTags[], programCategories[], projectCategories[], galleryCategories[], noticeCategories[], donationCauses[]',
    },
    {
      name: 'dignitary_messages',
      count: dignitaryMessages.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/dignitaries/{timestamp}_{filename}',
      fields: 'id, name, nameBn, role, roleBn, title, titleBn, message, messageBn, image, storagePath, date, priority',
    },
    {
      name: 'committee_groups',
      count: committeeGroups.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'N/A (Optional Grouping)',
      fields: 'id, name, nameBn, description, descriptionBn, priority',
    },
    {
      name: 'committee_members',
      count: committee.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/committee/{timestamp}_{filename}',
      fields: 'id, name, nameBn, role, roleBn, tags[], groupId (optional), priority, image, storagePath, bio, bioBn, phone, email',
    },
    {
      name: 'programs',
      count: programs.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/programs/{timestamp}_{filename}',
      fields: 'id, title, titleBn, desc, descBn, impact, impactBn, category, image, storagePath, highlights[], highlightsBn[], priority',
    },
    {
      name: 'projects',
      count: projects.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/projects/{timestamp}_{filename}',
      fields: 'id, title, titleBn, category, categoryBn, description, descriptionBn, date, location, beneficiaries, budget, status, image, storagePath, priority',
    },
    {
      name: 'gallery_albums',
      count: galleryAlbums.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/gallery/albums/{timestamp}_{filename}',
      fields: 'id, title, titleBn, description, descriptionBn, coverImage, storagePath, category, categoryBn, date, priority',
    },
    {
      name: 'gallery_items',
      count: galleryPhotos.length,
      orderRule: 'orderBy("priority", "asc")',
      storageFolder: 'jagreeti_media/gallery/photos/* & videos/*',
      fields: 'id, title, titleBn, category, categoryBn, date, mediaType ("photo"|"video"), image, videoUrl, videoSource ("upload"|"youtube"|"link"), albumId, showAsSingle, priority',
    },
    {
      name: 'admins',
      count: 0,
      orderRule: 'Document ID equals Firebase Auth UID',
      storageFolder: 'N/A',
      fields: 'email, displayName, role (admin), active, createdAt',
    },
    {
      name: 'notices',
      count: notices.length,
      orderRule: 'orderBy("isUrgent", "desc"), orderBy("date", "desc")',
      storageFolder: 'N/A (Sorted by Date)',
      fields: 'id, title, titleBn, date (YYYY-MM-DD), summary, summaryBn, content, contentBn, category, isUrgent',
    },
    {
      name: 'blood_donors',
      count: bloodDonors.length,
      orderRule: 'Filtered by bloodGroup & isAvailable',
      storageFolder: 'N/A',
      fields: 'id, name, nameBn, bloodGroup, location, locationBn, district, phone, lastDonated, isAvailable, verified',
    },
    {
      name: 'volunteers',
      count: volunteers.length,
      orderRule: 'orderBy("appliedDate", "desc")',
      storageFolder: 'N/A',
      fields: 'id, fullName, phone, email, bloodGroup, district, profession, skills[], motivation, status, appliedDate',
    },
    {
      name: 'donations',
      count: donations.length,
      orderRule: 'orderBy("date", "desc")',
      storageFolder: 'N/A',
      fields: 'id, donorName, amount, cause, method, trxId, date, status, phone',
    },
  ];

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.active == true &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
    match /site_settings/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /categories/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /dignitary_messages/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /committee_groups/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /committee_members/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /programs/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /projects/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /gallery_albums/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /gallery_items/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /notices/{docId} { allow read: if true; allow write: if isAdmin(); }
    match /blood_donors/{docId} { allow read, create: if true; allow update, delete: if isAdmin(); }
    match /volunteers/{docId} { allow read, create: if true; allow update, delete: if isAdmin(); }
    match /donations/{docId} { allow read, create: if true; allow update, delete: if isAdmin(); }
    match /admins/{uid} { allow read, write: if isAdmin() && request.auth.uid == uid; }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#04345c]" />
            <span>
              {language === 'bn'
                ? 'ফায়ারবেস কালেকশন ও স্টোরেজ স্কিমা ডকুমেন্টেশন'
                : 'Firebase Collections & Storage Schema Documentation'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'সকল ডাটাবেস কালেকশন, স্টোরেজ ফোল্ডার পাথ, কম্পোজিট ইনডেক্স এবং সিকিউরিটি রুলসের একক ডকুমেন্টেশন (FIREBASE_SCHEMA_DOCUMENTATION.md)।'
              : 'Complete single-source database schema reference for Firestore collections, Storage paths, priority indexes, and JSON export.'}
          </p>
        </div>

        <button
          onClick={handleDownloadSnapshot}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'bn' ? 'সকল কালেকশন JSON ডাউনলোড' : 'Export All Collections JSON'}</span>
        </button>
      </div>

      {/* Admin authentication setup */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-bold text-amber-950">Admin Portal Login Setup</h3>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          Create the first login at <strong>Firebase Console &gt; Authentication &gt; Users &gt; Add user</strong> with Email/Password enabled.
          Then copy that user&apos;s UID and create <code className="font-mono font-bold">admins/&lt;Auth UID&gt;</code> in Firestore.
          Never store the password in Firestore.
        </p>
        <pre className="p-3 rounded-xl bg-white border border-amber-200 text-[11px] text-slate-800 overflow-x-auto">{`{
  "email": "admin@example.com",
  "displayName": "JAGREETI Administrator",
  "role": "admin",
  "active": true,
  "createdAt": "2026-10-11T00:00:00.000Z"
}`}</pre>
        <p className="text-[11px] text-amber-800">
          The document ID must be the Firebase Auth UID, not the email address. The full step-by-step setup is in FIREBASE_SCHEMA_DOCUMENTATION.md.
        </p>
      </div>

      {/* Storage Architecture Overview */}
      <div className="p-5 rounded-2xl bg-[#04345c] text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderUp className="w-5 h-5 text-[#bad3e4]" />
            <h3 className="text-sm font-bold">Firebase Cloud Storage Bucket Hierarchy</h3>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-lg text-[#bad3e4]">
            gs://&lt;project-id&gt;.appspot.com/jagreeti_media/
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[#bad3e4] block text-[10px] font-sans font-bold uppercase">Dignitary Portraits</span>
            /dignitaries/&#123;ts&#125;_&#123;file&#125;
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[#bad3e4] block text-[10px] font-sans font-bold uppercase">Committee Photos</span>
            /committee/&#123;ts&#125;_&#123;file&#125;
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[#bad3e4] block text-[10px] font-sans font-bold uppercase">Programs & Projects</span>
            /programs/* &amp; /projects/*
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[#bad3e4] block text-[10px] font-sans font-bold uppercase">Gallery Photos, Videos, Albums</span>
            /gallery/photos|videos|albums/*
          </div>
        </div>
      </div>

      {/* Collections Schema Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#10564f]" />
            Firestore Collections Schema (14 Collections)
          </span>
          <span className="text-[11px] text-slate-500">
            Full documentation saved at <code className="font-mono text-[#04345c] font-bold">/FIREBASE_SCHEMA_DOCUMENTATION.md</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Collection Name</th>
                <th className="py-3 px-4">Active Docs</th>
                <th className="py-3 px-4">Ordering / Index Strategy</th>
                <th className="py-3 px-4">Storage Bucket Path</th>
                <th className="py-3 px-4">Document Schema Fields</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collectionsList.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-[#04345c] whitespace-nowrap">
                    {col.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                      {col.count} docs
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 whitespace-nowrap">
                    {col.orderRule}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {col.storageFolder}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600 font-mono">
                    {col.fields}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Rules Block */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">Firestore Security Rules (firestore.rules)</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('rules', firestoreRulesCode)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 cursor-pointer"
          >
            {copiedBlock === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBlock === 'rules' ? 'Copied' : 'Copy Rules'}</span>
          </button>
        </div>
        <pre className="p-4 bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed">
          {firestoreRulesCode}
        </pre>
      </div>
    </div>
  );
};
