import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Hash,
  Tag,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ProgramItem } from '../../../types';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';

export const AdminProgramsTab: React.FC = () => {
  const {
    language,
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    reorderProgram,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    desc: '',
    descBn: '',
    impact: '500+ Families',
    impactBn: '৫০০+ পরিবার',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80',
    storagePath: '',
    highlightsStr: 'Grassroots support, Free community service',
    highlightsBnStr: 'মাঠপর্যায়ে সহায়তা, বিনামূল্যে সেবা প্রদান',
    priority: programs.length + 1,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      titleBn: '',
      desc: '',
      descBn: '',
      impact: '500+ Families',
      impactBn: '৫০০+ পরিবার',
      category: 'Education',
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=80',
      storagePath: '',
      highlightsStr: 'Direct support, Free distribution',
      highlightsBnStr: 'মাঠপর্যায়ে সরাসরি সহায়তা, বিনামূল্যে বিতরণ',
      priority: programs.length + 1,
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: ProgramItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleBn: item.titleBn,
      desc: item.desc,
      descBn: item.descBn,
      impact: item.impact,
      impactBn: item.impactBn || '',
      category: item.category || 'Education',
      image: item.image,
      storagePath: item.storagePath || '',
      highlightsStr: (item.highlights || []).join(', '),
      highlightsBnStr: (item.highlightsBn || []).join(', '),
      priority: item.priority || 1,
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title && !formData.titleBn) return;

    if (formData.category) {
      addCustomCategory('programCategories', formData.category);
    }

    const payload = {
      title: formData.title || formData.titleBn,
      titleBn: formData.titleBn || formData.title,
      desc: formData.desc || formData.descBn,
      descBn: formData.descBn || formData.desc,
      impact: formData.impact,
      impactBn: formData.impactBn,
      category: formData.category || 'Education',
      image: formData.image,
      storagePath: formData.storagePath,
      highlights: formData.highlightsStr.split(',').map((s) => s.trim()).filter(Boolean),
      highlightsBn: formData.highlightsBnStr.split(',').map((s) => s.trim()).filter(Boolean),
      priority: Number(formData.priority) || programs.length + 1,
    };

    if (editingItem) {
      updateProgram(editingItem.id, payload);
      showToast(
        language === 'bn' ? 'কর্মসূচি সফলভাবে হালনাগাদ হয়েছে' : 'Program updated in Firestore collection',
        'success'
      );
      setEditingItem(null);
    } else if (isCreating) {
      addProgram(payload);
      showToast(
        language === 'bn' ? 'নতুন কর্মসূচি সফলভাবে যুক্ত হয়েছে' : 'New program saved to Firestore collection',
        'success'
      );
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে "${name}" কর্মসূচি মুছে ফেলতে চান?` : `Are you sure you want to delete ${name}?`)) {
      deleteProgram(id);
      showToast(
        language === 'bn' ? 'কর্মসূচি মুছে ফেলা হয়েছে' : 'Program deleted successfully',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#10564f]" />
              <span>{language === 'bn' ? 'উইং ও সামাজিক কর্মসূচি ব্যবস্থাপনা' : 'Programs & Core Wings'}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              programs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'উইংসমূহের ছবি আপলোড বা লিঙ্ক যোগ করুন, ক্যাটাগরি তৈরি করুন এবং অগ্রাধিকার ক্রম (Priority Order) নির্ধারণ করুন।'
              : 'Upload cover photos or paste links, manage custom categories with auto-complete, and serialize display order.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন উইং / কর্মসূচি যোগ' : 'Add New Program'}</span>
        </button>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((program, idx) => (
          <div
            key={program.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top Priority Bar */}
              <div className="flex items-center justify-between gap-2 pb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#04345c]/10 text-[#04345c] text-[10px] font-bold">
                  <Hash className="w-3 h-3" />
                  Order #{program.priority ?? idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderProgram(program.id, 'up')}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === programs.length - 1}
                    onClick={() => reorderProgram(program.id, 'down')}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700 transition cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  {program.category && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#04345c]/85 text-white backdrop-blur-xs">
                      {program.category}
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    {language === 'bn' ? program.impactBn || program.impact : program.impact}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'bn' ? program.titleBn : program.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {language === 'bn' ? program.descBn : program.desc}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-1 pt-1">
                {(language === 'bn' ? program.highlightsBn : program.highlights)?.slice(0, 2).map((h, i) => (
                  <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleOpenEdit(program)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
              </button>
              <button
                onClick={() => handleDelete(program.id, program.titleBn || program.title)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingItem
                    ? (language === 'bn' ? 'কর্মসূচি সম্পাদনা' : 'Edit Program')
                    : (language === 'bn' ? 'নতুন কর্মসূচি যুক্ত করুন' : 'Add New Program')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <MediaUploadField
                label={language === 'bn' ? 'কর্মসূচির কভার ছবি (Upload বা Link)' : 'Program Cover Photo (Upload or URL Link)'}
                value={formData.image}
                onChange={(url, meta) =>
                  setFormData({
                    ...formData,
                    image: url,
                    storagePath: meta?.storagePath || formData.storagePath,
                  })
                }
                folder="programs"
                accept="image/*"
                mediaKind="image"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">উইং / কর্মসূচির নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">উইং / কর্মসূচির নাম (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'ক্যাটাগরি (অটোকমপ্লিট / নতুন যোগ করুন)' : 'Program Category (Auto-complete / Add New)'}
                  value={formData.category}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                  options={customCategories.programCategories}
                  onAddNewOption={(newCat) => addCustomCategory('programCategories', newCat)}
                  placeholder="Type or select category..."
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ক্রম / সিরিয়াল নম্বর (Priority Order)' : 'Priority / Display Order'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.descBn}
                  onChange={(e) => setFormData({ ...formData, descBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (English)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রভাব মেট্রিক (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.impactBn}
                    onChange={(e) => setFormData({ ...formData, impactBn: e.target.value })}
                    placeholder="যেমন: ৩০০০+ পরিবার"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রভাব মেট্রিক (English)</label>
                  <input
                    type="text"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    placeholder="e.g. 3,000+ Families"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মূল কার্যক্রম (কমা দিয়ে পৃথক করুন - বাংলা)</label>
                  <input
                    type="text"
                    value={formData.highlightsBnStr}
                    onChange={(e) => setFormData({ ...formData, highlightsBnStr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Highlights (comma separated - English)</label>
                  <input
                    type="text"
                    value={formData.highlightsStr}
                    onChange={(e) => setFormData({ ...formData, highlightsStr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04345c] text-white font-bold hover:bg-[#04345c]/90 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
