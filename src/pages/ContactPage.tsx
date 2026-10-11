import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { language, t, currentPalette, siteSettings, showToast } = useApp();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitted(true);
    showToast(
      language === 'bn'
        ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।'
        : 'Your message has been sent successfully. Our team will get back to you shortly.',
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Connect & Collaborate'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 ">
          {t.contact.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Main Grid: Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'যোগাযোগের ঠিকানা' : 'Central Secretariat'}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate- font-semibold">
                    {t.contact.headOffice}
                  </strong>
                  <span>
                    {language === 'bn' ? siteSettings?.officeAddressBn || '' : siteSettings?.officeAddressEn || ''}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white font-semibold">
                    {t.contact.hotline}
                  </strong>
                  <a
                    href={siteSettings?.contactPhone ? `tel:${siteSettings.contactPhone}` : undefined}
                    className="hover:underline"
                  >
                    {siteSettings?.contactPhone || ''}
                  </a>
                  <div className="text-[11px] text-slate-400">
                    {language === 'bn' ? '২৪ ঘণ্টা জরুরি রক্ত হেল্পলাইন' : '24/7 Emergency Blood Assistance'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white font-semibold">
                    {t.common.email}
                  </strong>
                  <a
                    href={siteSettings?.contactEmail ? `mailto:${siteSettings.contactEmail}` : undefined}
                    className="hover:underline"
                  >
                    {siteSettings?.contactEmail || 'jagreeti1968ctg@gmail.com'}
                  </a>
                  <div className="text-[11px] text-slate-400">Official inquiries & partnerships</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-white font-semibold">
                    {language === 'bn' ? 'কার্যনির্বাহী সময়' : 'Office Hours'}
                  </strong>
                  <span>Sunday - Thursday: 9:00 AM - 8:00 PM</span>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    (Blood Emergency SOS 24/7 Open)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                {language === 'bn' ? 'সামাজিক যোগাযোগ মাধ্যম' : 'Follow Our Campaigns'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={siteSettings?.facebookUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/8801744769331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href="https://pbtsbd.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition"
                  title="Inspiration PBTS BD"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form Column */}
        <div className="lg:col-span-2 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {t.contact.sendMessage}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'bn'
              ? 'যেকোনো অনুসন্ধান, মতামত বা পরামর্শের জন্য আমাদের বার্তা পাঠান।'
              : 'Have feedback, questions, or wish to sponsor a humanitarian program? Reach out to us.'}
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                {language === 'bn' ? 'বার্তাটি পাঠানো হয়েছে!' : 'Message Received!'}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 max-w-md mx-auto">
                {language === 'bn'
                  ? `ধন্যবাদ ${name}! আপনার বার্তাটি কেন্দ্রীয় যোগাযোগ ডেস্কে নথিভুক্ত হয়েছে। ২৪ ঘণ্টার মধ্যে ফিরতি ইমেইল বা ফোনে যোগাযোগ করা হবে।`
                  : `Thank you ${name}! Your inquiry is logged with our central secretariat. We will respond within 24 hours.`}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition"
              >
                {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.contact.nameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.bloodNetwork.phoneNum}
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXX-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.contact.subjectLabel}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Educational Scholarship or Partnership"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.contact.messageLabel} *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={
                    language === 'bn'
                      ? 'আপনার বক্তব্য বিস্তারিতভাবে লিখুন...'
                      : 'Write your message here...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                style={{ backgroundColor: currentPalette.primary }}
              >
                <Send className="w-4 h-4" />
                <span>{t.contact.sendBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
