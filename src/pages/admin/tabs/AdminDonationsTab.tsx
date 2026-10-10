import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';

export const AdminDonationsTab: React.FC = () => {
  const {
    language,
    donations,
    addDonation,
    verifyDonation,
    deleteDonation,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    donorName: '',
    amount: 1000,
    cause: 'Winter Relief',
    method: 'bKash' as 'bKash' | 'Nagad' | 'Rocket' | 'Bank',
    trxId: '',
    phone: '',
    status: 'verified' as 'verified' | 'pending',
  });

  const totalVerified = donations
    .filter((d) => d.status === 'verified')
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingCount = donations.filter((d) => d.status === 'pending').length;

  const handleVerify = (id: string, trx: string) => {
    verifyDonation(id);
    showToast(
      language === 'bn'
        ? `ট্রানজেকশন #${trx} সফলভাবে যাচাই ও অডিট সম্পন্ন হয়েছে।`
        : `Transaction #${trx} verified successfully.`,
      'success'
    );
  };

  const handleDelete = (id: string, trx: string) => {
    if (window.confirm(language === 'bn' ? `ট্রানজেকশন #${trx} মুছে ফেলতে চান?` : `Delete transaction #${trx}?`)) {
      deleteDonation(id);
      showToast(
        language === 'bn' ? 'অনুদানের তথ্য মুছে ফেলা হয়েছে' : 'Donation record deleted',
        'info'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    if (formData.cause) {
      addCustomCategory('donationCauses', formData.cause);
    }

    addDonation({
      donorName: formData.donorName || 'Well Wisher',
      amount: Number(formData.amount),
      cause: formData.cause || 'General Relief',
      method: formData.method,
      trxId: formData.trxId || `TXN-${Date.now().toString().slice(-6)}`,
      phone: formData.phone || '',
    });

    showToast(
      language === 'bn' ? 'নতুন অনুদান সফলভাবে অন্তর্ভুক্ত হয়েছে' : 'Donation entry recorded in donations collection',
      'success'
    );
    setIsCreating(false);
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.trxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-600" />
              <span>{language === 'bn' ? 'অনুদানের হিসাব ও নিরীক্ষা (Audit)' : 'Donations & Financial Transparency'}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              donations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'বিকাশ, নগদ, রকেট ও ব্যাংক অনুদানের ট্রানজেকশন আইডি (TrxID) যাচাই ও অডিট পরিচালনা করুন।'
              : 'Audit incoming donor transactions, verify bKash/Nagad TrxIDs, and manage ledger entries.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'ম্যানুয়াল এন্ট্রি যোগ করুন' : 'Record Manual Donation'}</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-800">মোট নিরীক্ষিত তহবিল</div>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              ৳{totalVerified.toLocaleString()}
            </div>
          </div>
          <FileCheck className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800">যাচাইয়ের অপেক্ষায়</div>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {pendingCount} {language === 'bn' ? 'টি লেনদেন' : 'Records'}
            </div>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'দাতা, TrxID বা খাত দিয়ে খুঁজুন...' : 'Search by donor, TrxID, cause...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-[#1e77bd] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'pending', 'verified'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#04345c] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">দাতার নাম (Donor)</th>
                <th className="py-3 px-4">পরিমাণ (Amount)</th>
                <th className="py-3 px-4">পদ্ধতি ও TrxID</th>
                <th className="py-3 px-4">তহবিল খাত (Cause)</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {d.donorName}
                    {d.phone && <span className="block text-[10px] text-slate-400 font-normal">{d.phone}</span>}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                    ৳{d.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{d.method}</span>
                    <span className="block font-mono text-[11px] text-slate-400">{d.trxId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{d.cause}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {d.status !== 'verified' && (
                        <button
                          onClick={() => handleVerify(d.id, d.trxId)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>যাচাই</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(d.id, d.trxId)}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <h3 className="font-bold text-base">ম্যানুয়াল অনুদান এন্ট্রি</h3>
              <button onClick={() => setIsCreating(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">দাতার নাম</label>
                <input
                  type="text"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  placeholder="যেমন: ড. রফিকুল ইসলাম"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অনুদানের পরিমাণ (৳) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পদ্ধতি</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <CategoryAutocomplete
                label={language === 'bn' ? 'তহবিল খাত (Auto-complete / Add New Cause)' : 'Donation Cause (Auto-complete / Add New)'}
                value={formData.cause}
                onChange={(val) => setFormData({ ...formData, cause: val })}
                options={customCategories.donationCauses}
                onAddNewOption={(newCause) => addCustomCategory('donationCauses', newCause)}
                placeholder="Type or select donation cause..."
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                <input
                  type="text"
                  value={formData.trxId}
                  onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                  placeholder="যেমন: 9M48LKPQ1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04345c] text-white font-bold hover:bg-[#04345c]/90 cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
