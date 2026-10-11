import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle2,
  Award,
  ShieldCheck,
  Send,
  Heart,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VolunteerPage: React.FC = () => {
  const { language, t, currentPalette, showToast, addVolunteer } = useApp();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [institution, setInstitution] = useState<string>('');
  const [district, setDistrict] = useState<string>('Lalmonirhat');
  const [skills, setSkills] = useState<string>('');
  const [motivation, setMotivation] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    addVolunteer({
      fullName,
      email: email || 'volunteer@jagreetibd.org',
      phone,
      bloodGroup,
      institution: institution || 'General Member',
      district,
      skills: skills || 'Community Outreach & Field Support',
      motivation: motivation || 'Dedicated to humanitarian service',
    });

    setSubmitted(true);
    showToast(
      language === 'bn'
        ? 'আপনার স্বেচ্ছাসেবী আবেদনটি সফলভাবে গৃহীত হয়েছে! স্বাগতম জাগৃতি পরিবারে।'
        : 'Welcome to JAGREETI! Your volunteer application has been submitted.',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          {language === 'bn' ? 'তারুণ্যের সমাজসেবা প্ল্যাটফর্ম' : 'Youth Leadership Movement'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 ">
          {t.volunteer.title}
        </h1>
        <p className="text-3xl sm:text-base  text-cyan-400">
          {t.volunteer.subtitle}
        </p>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {t.volunteer.perks.map((perk, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-50"
              style={{ backgroundColor: currentPalette.primary }}
            >
              {i === 0 ? (
                <QrCode className="w-5 h-5" />
              ) : i === 1 ? (
                <Award className="w-5 h-5" />
              ) : i === 2 ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {perk}
            </p>
          </div>
        ))}
      </div>

      {/* Registration Form & Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-2 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {t.volunteer.formTitle}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'bn'
              ? 'নিচের তথ্যগুলো পূরণ করে আমাদের সাথে সমাজসেবায় অংশ নিন।'
              : 'Complete the form below to join our national network of changemakers.'}
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                {language === 'bn' ? 'আবেদন সফল হয়েছে!' : 'Application Approved in Preview!'}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 max-w-md mx-auto">
                {language === 'bn'
                  ? `প্রিয় ${fullName}, আপনার আবেদনটি সফলভাবে সিস্টেমে যুক্ত হয়েছে। আপনি এখন আপনার "ব্যক্তিগত ড্যাশবোর্ড"-এ গিয়ে লক্ষ্য নির্ধারণ ও অগ্রগতি দেখতে পারেন!`
                  : `Dear ${fullName}, welcome! You can now explore your personalized Member Dashboard to set goals and track volunteer achievements.`}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition"
              >
                {language === 'bn' ? 'আরেকটি আবেদন করুন' : 'Submit Another Application'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.bloodNetwork.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.common.email} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.bloodNetwork.phoneNum} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXX-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'আগ্রহের ক্ষেত্র / উইং' : 'Preferred Volunteering Wing'}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-800 text-sm font-semibold text-[#04345c] focus:outline-none focus:ring-2 focus:ring-[#1e77bd] text-slate-100"
                  >
                    {[
                      { id: 'education', bn: 'শিক্ষা ও মেধাবৃত্তি সহায়তা', en: 'Education & Scholarships' },
                      { id: 'relief', bn: 'শীতবস্ত্র ও মানবিক ত্রাণ', en: 'Winter Relief & Humanitarian Aid' },
                      { id: 'health', bn: 'স্বাস্থ্যসেবা ও চিকিৎসা ক্যাম্প', en: 'Free Medical Camps' },
                      { id: 'green', bn: 'সবুজ বাংলাদেশ ও পরিবেশ', en: 'Green Bangladesh & Forestry' },
                      { id: 'skills', bn: 'দক্ষতা উন্নয়ন ও প্রযুক্তি', en: 'Skill Development & Tech' },
                    ].map((wing) => (
                      <option key={wing.id} value={wing.id}>
                        {language === 'bn' ? wing.bn : wing.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.volunteer.institution}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'যেমন: চট্টগ্রাম বিশ্ববিদ্যালয় / কর্মস্থল' : 'College / Workplace'}
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e77bd] text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {language === 'bn' ? 'নিজ জেলা' : 'District'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    placeholder={language === 'bn' ? 'যেমন: চট্টগ্রাম ' : 'e.g. Chittagong'}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e77bd] text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.volunteer.skills}
                </label>
                <input
                  type="text"
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: গ্রাফিক্স ডিজাইন, ফটোগ্রাফি, ত্রাণ বিতরণ, উপস্থাপনা, প্রাথমিক চিকিৎসা'
                      : 'e.g. Graphic Design, Photography, Field Aid, Public Speaking, First Aid'
                  }
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e77bd] text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'কেন আপনি জাগৃতিতে যুক্ত হতে চান?' : 'Why do you want to join?'}
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'আপনার সমাজসেবামূলক আগ্রহ সম্পর্কে সংক্ষেপে লিখুন...'
                      : 'A brief note about your passion for community welfare...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                style={{ backgroundColor: currentPalette.primary }}
              >
                <Send className="w-4 h-4" />
                <span>{t.volunteer.submitApplication}</span>
              </button>
            </form>
          )}
        </div>

        {/* Digital ID Card Preview Column */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: currentPalette.primary }}
                >
                  J
                </div>
                <div>
                  <div className="text-xs font-bold tracking-wider">JAGREETI BD</div>
                  <div className="text-[10px] text-emerald-400 font-mono">VOLUNTEER ID</div>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="py-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Name</div>
                  <div className="text-base font-bold text-white">
                    {fullName || 'You Name Here...'}
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black">
                  {bloodGroup}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">District</span>
                  <span className="font-semibold">{district || 'Chattogram'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Role</span>
                  <span className="text-emerald-400 font-semibold">Active Volunteer</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-500">Jagreeti BD Ideology</div>
                {/* <div className="font-mono text-slate-300">ID: JGT-2026-8942</div> */}
              </div>
              <QrCode className="w-10 h-10 text-white/80" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === 'bn' ? 'ডিজিটাল কার্ডের সুবিধা' : 'Digital Badge Advantages'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'bn'
                ? 'অনুমোদনের পর প্রতিটি স্বেচ্ছাসেবী একটি ভেরিফায়েবল ডিজিটাল কিউআর কোডযুক্ত আইডি কার্ড পান, যা রক্তদান ক্যাম্প ও মাঠপর্যায়ের উদ্যোগে তাৎক্ষণিক পরিচয়পত্র হিসেবে কাজ করে।'
                : 'Approved volunteers gain a cryptographically verifiable QR ID card for quick verification during disaster relief dispatches.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
