import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  Phone,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { VolunteerApplication } from '../../../types';

export const AdminVolunteersTab: React.FC = () => {
  const {
    language,
    volunteers,
    approveVolunteer,
    deleteVolunteer,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<VolunteerApplication | null>(null);

  const handleApprove = (id: string, name: string) => {
    approveVolunteer(id);
    showToast(
      language === 'bn'
        ? `"${name}"-এর স্বেচ্ছাসেবী আবেদন অনুমোদিত হয়েছে। আইডি ইস্যু করা হলো।`
        : `Approved volunteer application for ${name}.`,
      'success'
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(language === 'bn' ? `আবেদনটি সম্পূর্ণ মুছে ফেলতে চান?` : `Delete application for ${name}?`)) {
      deleteVolunteer(id);
      showToast(
        language === 'bn' ? 'আবেদন ডাটাবেজ থেকে মুছে ফেলা হয়েছে' : 'Application deleted',
        'info'
      );
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery) ||
      (v.institution || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.district || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>{language === 'bn' ? 'স্বেচ্ছাসেবী আবেদন ও অনুমোদন' : 'Volunteer Applications & Approvals'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ওয়েবসাইটে জমা পড়া তরুণ স্বেচ্ছাসেবীদের আবেদনপত্র যাচাই, উইং নির্ধারণ ও অনুমোদন দিন।'
              : 'Review submitted volunteer memberships, assign wings, verify and manage applications.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'নাম, ফোন বা জেলা দিয়ে খুঁজুন...' : 'Search by name, phone, district...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#1e77bd] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
            { id: 'pending', label: language === 'bn' ? 'অপেক্ষমাণ' : 'Pending' },
            { id: 'approved', label: language === 'bn' ? 'অনুমোদিত' : 'Approved' },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === status.id
                  ? 'bg-[#04345c] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Volunteers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">আবেদনকারী (Applicant)</th>
                <th className="py-3 px-4">উইং / আগ্রহের ক্ষেত্র</th>
                <th className="py-3 px-4">জেলা ও প্রতিষ্ঠান</th>
                <th className="py-3 px-4">আবেদনের তারিখ</th>
                <th className="py-3 px-4">অবস্থা (Status)</th>
                <th className="py-3 px-4 text-right">কার্যক্রম (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    {language === 'bn' ? 'কোন আবেদন পাওয়া যায়নি' : 'No applications found'}
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{vol.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{vol.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {vol.wing || vol.bloodGroup || 'General Wing'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{vol.district}</div>
                      <div className="text-[11px] text-slate-400">{vol.institution || '—'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {vol.appliedDate || 'Recent'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          vol.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {vol.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApplicant(vol)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                        </button>

                        {vol.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(vol.id, vol.fullName)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 transition cursor-pointer"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(vol.id, vol.fullName)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {language === 'bn' ? 'স্বেচ্ছাসেবী আবেদনপত্রের বিবরণ' : 'Volunteer Applicant Profile'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedApplicant.fullName}</h4>
                  <p className="text-slate-500">{selectedApplicant.email}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    selectedApplicant.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedApplicant.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-0.5">ফোন নম্বর</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-0.5">আগ্রহের উইং</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.wing || selectedApplicant.bloodGroup}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-0.5">জেলা</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.district}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-bold block mb-0.5">প্রতিষ্ঠান</span>
                  <span className="text-slate-800 font-semibold">{selectedApplicant.institution || '—'}</span>
                </div>
              </div>

              {selectedApplicant.skills && (
                <div>
                  <span className="text-slate-500 font-bold block mb-1">দক্ষতা ও অভিজ্ঞতা:</span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    {selectedApplicant.skills}
                  </p>
                </div>
              )}

              {selectedApplicant.motivation && (
                <div>
                  <span className="text-slate-500 font-bold block mb-1">সমাজসেবার প্রেরণা:</span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                    {selectedApplicant.motivation}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                {selectedApplicant.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleApprove(selectedApplicant.id, selectedApplicant.fullName);
                      setSelectedApplicant(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition cursor-pointer"
                  >
                    অনুমোদন দিন (Approve)
                  </button>
                )}
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
