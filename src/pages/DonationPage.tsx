import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Receipt,
  Download,
  Copy,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DonationPage: React.FC = () => {
  const { language, t, currentPalette, addDonation, showToast } = useApp();

  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [selectedCause, setSelectedCause] = useState<string>('General Humanitarian Fund');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Receipt submission state
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [payMethod, setPayMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [submittedReceipt, setSubmittedReceipt] = useState<boolean>(false);

  const causes = [
    'General Humanitarian Fund (সার্বিক মানবকল্যাণ তহবিল)',
    'Pratibha Bikash Merit Scholarship (মেধাবৃত্তি ও শিক্ষা সহায়তা)',
    'Emergency Blood Bank & Health Care (জরুরি রক্তদান ও স্বাস্থ্যসেবা)',
    'Winter Warmth & Disaster Relief (শীতবস্ত্র ও জরুরি ত্রাণ)',
    'Green Earth Tree Plantation (বৃক্ষরোপণ কর্মসূচি)',
  ];

  const impactMetrics: Record<number, { en: string; bn: string }> = {
    500: {
      en: 'Provides essential medical diagnostic tests & screening for 1 critical patient.',
      bn: '১ জন মুমূর্ষু রোগীর রক্তদান স্ক্রিনিং ও প্রাথমিক চিকিৎসা পরীক্ষার খরচ বহন করে।',
    },
    1000: {
      en: 'Supplies 1 high-quality thermal blanket or 1 month student stationery kit.',
      bn: '১টি মানসম্মত উষ্ণ কম্বল অথবা ১ জন শিক্ষার্থীর ১ মাসের শিক্ষা উপকরণ নিশ্চিত করে।',
    },
    2500: {
      en: 'Sponsors 1 month full academic scholarship stipend for a meritorious rural student.',
      bn: '১ জন অসচ্ছল মেধাবী শিক্ষার্থীর ১ মাসের সম্পূর্ণ শিক্ষা উপবৃত্তি নিশ্চিত করে।',
    },
    5000: {
      en: 'Provides emergency food ration baskets for 2 disaster-hit families for 2 weeks.',
      bn: 'দুর্যোগকবলিত ২টি পরিবারের ২ সপ্তাহের প্রয়োজনীয় শুকনো খাদ্য ও বিশুদ্ধ পানি নিশ্চিত করে।',
    },
    10000: {
      en: 'Plants 100 fruit and timber saplings across schools and fragile river embankments.',
      bn: '১০০টি ফলদ ও বনজ বৃক্ষরোপণ এবং পরবর্তী ৩ মাস পরিচর্যার খরচ মেটায়।',
    },
  };

  const currentImpact =
    impactMetrics[selectedAmount] || {
      en: `Creates direct, audited humanitarian relief of ৳${selectedAmount.toLocaleString()} BDT on the ground.`,
      bn: `মাঠপর্যায়ে সরাসরি ৳${selectedAmount.toLocaleString()} টাকার নির্ভরযোগ্য মানবিক সেবায় রূপান্তরিত হয়।`,
    };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    showToast(
      language === 'bn' ? 'অ্যাকাউন্ট নম্বর কপি করা হয়েছে!' : 'Account number copied to clipboard!',
      'info'
    );
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleSubmitTrx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorPhone || !trxId) return;

    addDonation({
      donorName,
      amount: selectedAmount,
      method: payMethod,
      trxId,
      phone: donorPhone,
      cause: selectedCause,
    });

    setSubmittedReceipt(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {language === 'bn' ? 'স্বচ্ছ ও জবাবদিহিতামূলক অনুদান' : 'Transparent & Audited Giving'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {t.donate.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t.donate.subtitle}
        </p>
      </div>

      {/* Interactive Impact Calculator */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.donate.calculatorTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.donate.calculatorDesc}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
            100% Direct Field Distribution
          </span>
        </div>

        {/* Preset Amounts */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            {language === 'bn' ? 'অনুদানের পরিমাণ নির্বাচন করুন (টাকা)' : 'Select Donation Amount (BDT)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[500, 1000, 2500, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-3 rounded-2xl font-black text-sm border-2 transition ${
                  selectedAmount === amt
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                ৳{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              {t.donate.enterAmount}
            </label>
            <input
              type="number"
              min="100"
              step="100"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Dynamic Impact Display Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
          <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-0.5">
              {language === 'bn'
                ? `৳${selectedAmount.toLocaleString()} টাকার বাস্তব মানবিক প্রভাব`
                : `Real Impact of ৳${selectedAmount.toLocaleString()} BDT`}
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed">
              {currentImpact[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Official Payment Channels */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">
          {t.donate.methodsTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* bKash */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300 font-bold text-sm">
                bKash (বিকাশ)
              </span>
              <Smartphone className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Personal / Send Money</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                01744-769331
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? 'বিকাশ অ্যাপ বা *২৪৭# ডায়াল করে "Send Money" করুন। রেফারেন্সে আপনার নাম বা কারণ লিখুন।'
                : 'Send Money via bKash App to 01744-769331. Use your name as reference.'}
            </p>
            <button
              onClick={() => copyToClipboard('01744769331')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedAccount === '01744769331' ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>

          {/* Nagad */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-bold text-sm">
                Nagad (নগদ)
              </span>
              <Smartphone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Personal / Send Money</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                01744-769331
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? 'নগদ অ্যাপ বা *১৬৭# ডায়াল করে সেন্ড মানি করুন। ট্রানজেকশন সফল হলে TrxID সংরক্ষণ করুন।'
                : 'Send Money via Nagad app to 01744-769331 and save the Transaction ID.'}
            </p>
            <button
              onClick={() => copyToClipboard('01744769331')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedAccount === '01744769331' ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>

          {/* Bank Transfer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-sm">
                Bank Transfer
              </span>
              <Building2 className="w-5 h-5 text-sky-600" />
            </div>
            <div className="space-y-0.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
              <div>
                <strong>A/C:</strong> JAGREETI YOUTH FOUNDATION
              </div>
              <div>
                <strong>A/C No:</strong> 204.101.008942
              </div>
              <div>
                <strong>Bank:</strong> Dutch-Bangla Bank (DBBL)
              </div>
              <div>
                <strong>Branch:</strong> Lalmonirhat Branch
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? 'সরাসরি ব্যাংক বা ইন্টারনেট ব্যাংকিং (NPSB/BEFTN) মাধ্যমে অনুদান পাঠানো যায়।'
                : 'Direct online bank deposit via BEFTN/NPSB or any ATM booth.'}
            </p>
            <button
              onClick={() => copyToClipboard('204101008942')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedAccount === '204101008942' ? 'Copied!' : 'Copy Account No'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TrxID Submission & Digital Tax Receipt Generator */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 mx-auto flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.donate.submitReceipt}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn'
              ? 'টাকা পাঠানোর পর নিচের তথ্যগুলো সাবমিট করুন। অ্যাডমিন অবিলম্বে ট্রানজেকশন যাচাই করবে।'
              : 'Submit your donation transaction details to receive a digitally certified donation acknowledgment.'}
          </p>
        </div>

        {submittedReceipt ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              {language === 'bn' ? 'অনুদানের তথ্য সফলভাবে গৃহীত!' : 'Donation Logged Successfully!'}
            </h4>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-left text-xs space-y-1 font-mono">
              <div>Donor: {donorName}</div>
              <div>Amount: ৳{selectedAmount.toLocaleString()} BDT</div>
              <div>Method: {payMethod}</div>
              <div>TrxID: {trxId}</div>
              <div>Cause: {selectedCause}</div>
              <div className="text-emerald-600 font-bold pt-1">Status: Pending Verification</div>
            </div>
            <button
              onClick={() => setSubmittedReceipt(false)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition"
            >
              {language === 'bn' ? 'নতুন রসিদ সাবমিট করুন' : 'Submit Another Record'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTrx} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'আপনার নাম *' : 'Donor Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahir Faisal"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01744-XXXXXX"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'অনুদানের মাধ্যম *' : 'Payment Method *'}
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank">Bank Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.donate.trxId} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BK9X8447LK"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.donate.chooseCause}
              </label>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {causes.map((cause, i) => (
                  <option key={i} value={cause}>
                    {cause}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Receipt className="w-4 h-4" />
              <span>{t.donate.getReceipt}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
