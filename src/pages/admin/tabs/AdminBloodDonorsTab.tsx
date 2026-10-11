import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Trash2,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { BloodGroup } from '../../../types';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AdminBloodDonorsTab: React.FC = () => {
  const { language, donors, addDonor, toggleDonorAvailability, deleteDonor, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    bloodGroup: 'O+' as BloodGroup,
    location: '',
    locationBn: '',
    phone: '',
    lastDonated: '3 months ago',
    lastDonatedBn: '৩ মাস আগে',
    available: true,
    totalDonations: 1,
  });

  const filteredDonors = donors.filter((d) => {
    const matchesGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const q = searchQuery.toLowerCase();
    const loc = d.location || d.upazila || d.district || '';
    const matchesSearch =
      !q ||
      (d.name || '').toLowerCase().includes(q) ||
      (d.nameBn || '').toLowerCase().includes(q) ||
      loc.toLowerCase().includes(q) ||
      (d.phone || '').includes(q);
    return matchesGroup && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    addDonor({
      name: formData.name.trim(),
      nameBn: formData.nameBn.trim() || formData.name.trim(),
      bloodGroup: formData.bloodGroup,
      district: 'Lalmonirhat',
      upazila: formData.location.trim() || 'Lalmonirhat Sadar',
      location: formData.location.trim() || 'Lalmonirhat Sadar',
      locationBn: formData.locationBn.trim() || formData.location.trim() || 'হাটহাজারী',
      phone: formData.phone.trim(),
      lastDonationDate: new Date().toISOString().slice(0, 10),
      lastDonated: formData.lastDonated.trim() || 'Ready to donate',
      lastDonatedBn: formData.lastDonatedBn.trim() || 'রক্তদানে প্রস্তুত',
      available: formData.available,
      totalDonations: Number(formData.totalDonations) || 1,
    });

    setFormData({
      name: '',
      nameBn: '',
      bloodGroup: 'O+',
      location: '',
      locationBn: '',
      phone: '',
      lastDonated: '3 months ago',
      lastDonatedBn: '৩ মাস আগে',
      available: true,
      totalDonations: 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Droplets className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? 'ফায়ারবেস কালেকশন: blood_donors'
                : 'Firestore Collection: blood_donors'}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {language === 'bn'
              ? 'জরুরি রক্তদাতা ডিরেক্টরি ব্যবস্থাপনা'
              : 'Emergency Blood Donors Directory'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'রক্তদাতাদের প্রাপ্যতা পরিবর্তন করুন, নতুন রক্তদাতা যুক্ত করুন বা তালিকা হালনাগাদ করুন।'
              : 'Manage verified blood donors, toggle readiness status, or add new emergency donors.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>
            {isAdding
              ? language === 'bn'
                ? 'বাতিল করুন'
                : 'Cancel'
              : language === 'bn'
              ? 'নতুন রক্তদাতা যুক্ত করুন'
              : 'Add Blood Donor'}
          </span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-900">
            {language === 'bn' ? 'নতুন রক্তদাতার তথ্য দিন' : 'Register New Blood Donor'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Donor Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Tanvir Hasan"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রক্তদাতার নাম (বাংলা)
              </label>
              <input
                type="text"
                value={formData.nameBn}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                placeholder="যেমন: তানভীর হাসান"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Blood Group *
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-rose-700"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 17XX-XXXXXX"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location (English)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="College Road, Lalmonirhat"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অবস্থান (বাংলা)
              </label>
              <input
                type="text"
                value={formData.locationBn}
                onChange={(e) => setFormData({ ...formData, locationBn: e.target.value })}
                placeholder="হাটহাজারী"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
            >
              {language === 'bn' ? 'রক্তদাতা সংরক্ষণ করুন' : 'Save Blood Donor'}
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'নাম, ঠিকানা বা ফোন নম্বর দিয়ে খুঁজুন...'
                : 'Search donor by name, location or phone...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#04345c]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedGroup === 'ALL'
                ? 'bg-[#04345c] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'সকল' : 'All'} ({donors.length})
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => setSelectedGroup(bg)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedGroup === bg
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Donors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-4 hover:shadow-xs transition"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                {donor.bloodGroup}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-slate-900 truncate">
                  {language === 'bn' ? donor.nameBn : donor.name}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {language === 'bn' ? donor.locationBn : donor.location}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {donor.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleDonorAvailability(donor.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  donor.available
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {donor.available ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'প্রস্তুত' : 'Available'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অপ্রস্তুত' : 'Unavailable'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteDonor(donor.id);
                  showToast(
                    language === 'bn' ? 'রক্তদাতা মুছে ফেলা হয়েছে' : 'Donor removed',
                    'info'
                  );
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Delete Donor"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
