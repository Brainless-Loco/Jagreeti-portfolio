import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Droplet,
  Search,
  Phone,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  Clock,
  Heart,
  CheckCircle,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BloodDonor } from '../types';

export const BloodNetworkPage: React.FC = () => {
  const { language, t, donors, addDonor, setEmergencySosOpen, currentPalette } = useApp();

  const [searchGroup, setSearchGroup] = useState<string>('All');
  const [searchDistrict, setSearchDistrict] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Registration Form State
  const [regName, setRegName] = useState<string>('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodDonor['bloodGroup']>('O+');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regWhatsapp, setRegWhatsapp] = useState<string>('');
  const [regDistrict, setRegDistrict] = useState<string>('Lalmonirhat');
  const [regUpazila, setRegUpazila] = useState<string>('Lalmonirhat Sadar');
  const [regLastDonated, setRegLastDonated] = useState<string>('2026-05-01');

  // Filter Donors
  const filteredDonors = donors.filter((d) => {
    const matchGroup = searchGroup === 'All' || d.bloodGroup === searchGroup;
    const matchDistrict =
      searchDistrict === 'All' || (d.district || '').toLowerCase() === searchDistrict.toLowerCase();
    const matchAvailable = !availableOnly || d.available;
    const matchKeyword =
      !searchKeyword ||
      (d.name || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (d.nameBn && d.nameBn.includes(searchKeyword)) ||
      (d.upazila || '').toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (d.phone || '').includes(searchKeyword);

    return matchGroup && matchDistrict && matchAvailable && matchKeyword;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    addDonor({
      name: regName,
      nameBn: regName,
      bloodGroup: regBloodGroup,
      phone: regPhone,
      whatsapp: regWhatsapp || regPhone,
      district: regDistrict,
      upazila: regUpazila,
      lastDonationDate: regLastDonated,
      available: true,
      totalDonations: 1,
    });

    setRegName('');
    setRegPhone('');
    setRegWhatsapp('');
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const districts = ['All', 'Lalmonirhat', 'Rangpur', 'Dhaka', 'Chittagong', 'Rajshahi', 'Sylhet', 'Khulna'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-rose-900/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <Droplet className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{language === 'bn' ? '২৪ ঘণ্টা জরুরি রক্ত ব্যাংক' : '24/7 Rapid Emergency Network'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t.bloodNetwork.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.bloodNetwork.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEmergencySosOpen(true)}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>{t.common.emergencySos}</span>
            </button>
            <a
              href="#register-donor"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.bloodNetwork.registerTitle}</span>
            </a>
          </div>
        </div>

        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none">
          <Droplet className="w-80 h-80 fill-rose-500 text-rose-500" />
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t.bloodNetwork.searchTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Blood group selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t.bloodNetwork.bloodGroup}
            </label>
            <select
              value={searchGroup}
              onChange={(e) => setSearchGroup(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg === 'All' ? t.bloodNetwork.allGroups : bg}
                </option>
              ))}
            </select>
          </div>

          {/* District selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t.bloodNetwork.district}
            </label>
            <select
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? t.bloodNetwork.allDistricts : d}
                </option>
              ))}
            </select>
          </div>

          {/* Search keyword */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {language === 'bn' ? 'নাম / ফোন / এলাকা' : 'Name / Phone / Area'}
            </label>
            <input
              type="text"
              placeholder={language === 'bn' ? 'খুঁজুন...' : 'Search...'}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Availability checkbox */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>{t.bloodNetwork.availableOnly}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'খুঁজে পাওয়া রক্তদাতা:' : 'Found Donors:'}{' '}
            <strong className="text-slate-900 dark:text-white">{filteredDonors.length}</strong>
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {donors.filter((d) => d.available).length} {language === 'bn' ? 'জন বর্তমানে প্রস্তুত' : 'Currently Available'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {language === 'bn' ? donor.nameBn || donor.name : donor.name}
                      </h4>
                      {donor.verified && (
                        <ShieldCheck
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          title={t.common.verified}
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {donor.upazila}, {donor.district}
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-lg shadow-xs">
                    {donor.bloodGroup}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    {donor.totalDonations} {language === 'bn' ? 'বার রক্তদান' : 'donations'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {donor.lastDonationDate}
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      donor.available
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        donor.available ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {donor.available
                      ? language === 'bn'
                        ? 'রক্তদানে প্রস্তুত'
                        : 'Available to Donate'
                      : language === 'bn'
                      ? 'বিশ্রামে আছেন'
                      : 'Rest Period'}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${donor.phone}`}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.bloodNetwork.callDonor}</span>
                </a>
                {donor.whatsapp && (
                  <a
                    href={`https://wa.me/${(donor.whatsapp || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 transition"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register As Blood Donor Form */}
      <div
        id="register-donor"
        className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 mx-auto flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {t.bloodNetwork.registerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.bloodNetwork.registerDesc}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম' : 'e.g. Tanvir Ahmed'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.bloodGroup} *
                </label>
                <select
                  value={regBloodGroup}
                  onChange={(e) => setRegBloodGroup(e.target.value as BloodDonor['bloodGroup'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.phoneNum} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01744-XXXXXX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.whatsappNum}
                </label>
                <input
                  type="tel"
                  placeholder="01744-XXXXXX"
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.district} *
                </label>
                <input
                  type="text"
                  required
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.bloodNetwork.upazila} *
                </label>
                <input
                  type="text"
                  required
                  value={regUpazila}
                  onChange={(e) => setRegUpazila(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.bloodNetwork.lastDonated}
              </label>
              <input
                type="date"
                value={regLastDonated}
                onChange={(e) => setRegLastDonated(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.bloodNetwork.submitBtn}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Blood Donation Eligibility Guidelines */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{t.bloodNetwork.eligibilityTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
          {t.bloodNetwork.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
