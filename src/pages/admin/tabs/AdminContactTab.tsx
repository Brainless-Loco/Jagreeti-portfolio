import React, { useState } from 'react';
import {
  PhoneCall,
  Save,
  Mail,
  MapPin,
  Globe,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminContactTab: React.FC = () => {
  const { language, siteSettings, updateSiteSettings, showToast } = useApp();

  const [formData, setFormData] = useState({
    contactPhone: siteSettings?.contactPhone || '+880 1744-769331',
    emergencyPhone: siteSettings?.emergencyPhone || '+880 1744-769331',
    contactEmail: siteSettings?.contactEmail || 'jagreeti1968ctg@gmail.com',
    officeAddressBn: siteSettings?.officeAddressBn || 'কলেজ রোড, বাটার মোড় সংলগ্ন, লালমনিরহাট সদর, বাংলাদেশ',
    officeAddressEn: siteSettings?.officeAddressEn || 'College Road, Near Butter More, Lalmonirhat Sadar, Bangladesh',
    facebookUrl: siteSettings?.facebookUrl || 'https://facebook.com/jagreetibd',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast(
      language === 'bn'
        ? 'যোগাযোগ ও অফিসের তথ্য সফলভাবে সংরক্ষিত হয়েছে।'
        : 'Contact and headquarters information updated successfully.',
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#04345c]" />
          <span>{language === 'bn' ? 'যোগাযোগ ও অফিস তথ্য ব্যবস্থাপনা' : 'Contact & Headquarters Info'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'bn'
            ? 'হেডকোয়ার্টার ঠিকানা, জরুরি সহায়তা হটলাইন, অফিসিয়াল ইমেইল ও সোশ্যাল মিডিয়া লিঙ্ক আপডেট করুন।'
            : 'Configure official contact points, emergency helpline, office addresses and social handles.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'কেন্দ্রীয় হটলাইন নম্বর' : 'Primary Hotline Phone'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'জরুরি সহায়তা হেল্পলাইন' : 'Emergency Helpline'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-rose-700 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ফেসবুক পেজ লিঙ্ক' : 'Facebook Page URL'}
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'অফিস ঠিকানা (বাংলা)' : 'Office Address (Bengali)'}
            </label>
            <textarea
              name="officeAddressBn"
              rows={2}
              value={formData.officeAddressBn}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'bn' ? 'অফিস ঠিকানা (English)' : 'Office Address (English)'}
            </label>
            <textarea
              name="officeAddressEn"
              rows={2}
              value={formData.officeAddressEn}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#04345c] hover:bg-[#04345c]/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Contact Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
