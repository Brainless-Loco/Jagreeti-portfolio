import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertOctagon, Phone, Share2, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencySOSModal: React.FC = () => {
  const { emergencySosOpen, setEmergencySosOpen, language, donors, showToast } = useApp();
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [patientName, setPatientName] = useState<string>('');
  const [hospital, setHospital] = useState<string>('Lalmonirhat Sadar Hospital');
  const [units, setUnits] = useState<string>('1');
  const [contactNumber, setContactNumber] = useState<string>('01744-769331');
  const [copied, setCopied] = useState<boolean>(false);

  if (!emergencySosOpen) return null;

  const matchingDonors = donors.filter(
    (d) => (bloodGroup === 'Any' || d.bloodGroup === bloodGroup) && d.available
  );

  const emergencyMessage = `🚨 [EMERGENCY BLOOD REQUIRED - JAGREETI / PBTS NETWORK] 🚨
Blood Group: ${bloodGroup}
Patient: ${patientName || 'Critical Patient'}
Units: ${units} Bag(s)
Hospital: ${hospital}
Contact: ${contactNumber}
Please share to save a life! 🩸`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    showToast(
      language === 'bn'
        ? 'জরুরি বার্তা কপি করা হয়েছে! সোশ্যাল মিডিয়ায় শেয়ার করুন।'
        : 'Emergency SOS copied to clipboard!',
      'success'
    );
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-500/40 shadow-2xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-rose-100 dark:border-rose-950">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                  {language === 'bn' ? 'জরুরি রক্তের আবেদন (এসওএস)' : 'Emergency Blood Request (SOS)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {language === 'bn'
                    ? 'মুমূর্ষু রোগীর জন্য তাৎক্ষণিক রক্তদাতা সন্ধান ও ব্রডকাস্ট মেসেজ প্রস্তুতকারক'
                    : 'Instant hospital emergency blood broadcast & matching donor alert'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEmergencySosOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'রক্তের গ্রুপ প্রয়োজন *' : 'Needed Blood Group *'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                {language === 'bn' ? 'প্রয়োজনীয় ব্যাগের সংখ্যা' : 'Units Needed'}
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'রোগীর নাম / সমস্যা' : 'Patient Name / Disease'}
              </label>
              <input
                type="text"
                placeholder={language === 'bn' ? 'যেমন: সড়ক দুর্ঘটনা / সিজার' : 'e.g. Surgery / Accident'}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'হাসপাতাল ও ঠিকানা *' : 'Hospital & Location *'}
              </label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'জরুরি যোগাযোগের ফোন নম্বর *' : 'Emergency Contact Phone *'}
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Quick Broadcast Box */}
          <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                {language === 'bn' ? 'সোশ্যাল মিডিয়া ও হোয়াটসঅ্যাপ বার্তা' : 'Broadcast Message Template'}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-xs px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি করুন' : 'Copy Text')}
              </button>
            </div>
            <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans bg-white dark:bg-slate-900 p-3 rounded-xl border border-rose-100 dark:border-rose-950">
              {emergencyMessage}
            </pre>
          </div>

          {/* Matching Available Donors */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-500" />
                {language === 'bn' ? `বর্তমানে প্রস্তুত ${bloodGroup} রক্তদাতা` : `Available ${bloodGroup} Donors`}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {matchingDonors.length} {language === 'bn' ? 'জন প্রস্তুত' : 'Ready'}
              </span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {matchingDonors.length > 0 ? (
                matchingDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {language === 'bn' ? donor.nameBn || donor.name : donor.name}
                      </span>
                      <div className="text-slate-500 dark:text-slate-400">
                        {donor.upazila}, {donor.district} • {donor.totalDonations} {language === 'bn' ? 'বার রক্ত দিয়েছেন' : 'donations'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${donor.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {donor.phone}
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl text-center text-slate-500 bg-slate-50 dark:bg-slate-800/40 text-xs">
                  {language === 'bn'
                    ? 'এই মুহূর্তে ডেটাবেজে কোনো সরাসরি রক্তদাতা খালি নেই। অনুগ্রহ করে উপরে বার্তাটি ফেসবুক ও হোয়াটসঅ্যাপে শেয়ার করুন।'
                    : 'No instant donors available for this group right now. Please copy and broadcast the message on social networks!'}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              {language === 'bn' ? 'জরুরি হেল্পলাইন: ০১৭৪৪-৭৬৯৩৩১' : 'Central Hotline: 01744-769331'}
            </div>
            <button
              onClick={() => setEmergencySosOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
