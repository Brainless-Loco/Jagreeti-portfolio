import React, { useState } from 'react';
import {
  Quote,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Hash,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DignitaryMessage } from '../../../types';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';

export const AdminDignitariesTab: React.FC = () => {
  const {
    language,
    dignitaryMessages,
    addDignitaryMessage,
    updateDignitaryMessage,
    deleteDignitaryMessage,
    reorderDignitaryMessage,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [editingItem, setEditingItem] = useState<DignitaryMessage | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<DignitaryMessage>>({
    type: 'chief_advisor',
    priority: dignitaryMessages.length + 1,
    title: 'Message from the Chief Advisor',
    titleBn: 'প্রধান উপদেষ্টার বাণী',
    name: '',
    nameBn: '',
    designation: '',
    designationBn: '',
    academicBackground: '',
    academicBackgroundBn: '',
    image: '',
    storagePath: '',
    quote: '',
    quoteBn: '',
    fullMessage: '',
    fullMessageBn: '',
  });

  const dignitaryRoleOptions = Array.from(
    new Set([
      'chief_advisor',
      'founder',
      'president',
      'secretary',
      'patron',
      ...(customCategories.dignitaryRoles || []),
      ...dignitaryMessages.map((message) => message.type).filter(Boolean),
    ])
  );

  const handleOpenCreate = () => {
    setFormData({
      type: 'chief_advisor',
      priority: dignitaryMessages.length + 1,
      title: 'Message from the Advisor',
      titleBn: 'উপদেষ্টার বাণী',
      name: '',
      nameBn: '',
      designation: '',
      designationBn: '',
      academicBackground: '',
      academicBackgroundBn: '',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      storagePath: '',
      quote: '',
      quoteBn: '',
      fullMessage: '',
      fullMessageBn: '',
    });
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: DignitaryMessage) => {
    setEditingItem(item);
    setFormData({
      ...item,
      priority: item.priority ?? 1,
    });
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameBn && !formData.name) return;

    const payload: Omit<DignitaryMessage, 'id'> = {
      type: formData.type || 'chief_advisor',
      priority: Number(formData.priority) || dignitaryMessages.length + 1,
      title: formData.title || formData.titleBn || 'Official Message',
      titleBn: formData.titleBn || formData.title || 'বাণী',
      name: formData.name || formData.nameBn || '',
      nameBn: formData.nameBn || formData.name || '',
      designation: formData.designation || formData.designationBn || '',
      designationBn: formData.designationBn || formData.designation || '',
      academicBackground: formData.academicBackground || formData.academicBackgroundBn || '',
      academicBackgroundBn: formData.academicBackgroundBn || formData.academicBackground || '',
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      storagePath: formData.storagePath || '',
      quote: formData.quote || formData.quoteBn || '',
      quoteBn: formData.quoteBn || formData.quote || '',
      fullMessage: formData.fullMessage || formData.fullMessageBn || '',
      fullMessageBn: formData.fullMessageBn || formData.fullMessage || '',
    };

    if (editingItem) {
      updateDignitaryMessage(editingItem.id, payload);
      showToast(
        language === 'bn'
          ? 'বাণী সফলভাবে হালনাগাদ করা হয়েছে'
          : 'Dignitary message updated in Firestore collection',
        'success'
      );
      setEditingItem(null);
    } else if (isCreating) {
      addDignitaryMessage(payload);
      showToast(
        language === 'bn'
          ? 'নতুন বাণী সফলভাবে যুক্ত করা হয়েছে'
          : 'New dignitary message saved to Firestore collection',
        'success'
      );
      setIsCreating(false);
    }
    if (formData.type) addCustomCategory('dignitaryRoles', formData.type);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        language === 'bn'
          ? `আপনি কি নিশ্চিত যে "${name}"-এর বাণী মুছে ফেলতে চান?`
          : `Are you sure you want to delete the message for ${name}?`
      )
    ) {
      deleteDignitaryMessage(id);
      showToast(
        language === 'bn' ? 'বাণী মুছে ফেলা হয়েছে' : 'Message deleted successfully',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Quote className="w-5 h-5 text-[#1e77bd]" />
            <span>
              {language === 'bn'
                ? 'প্রধান উপদেষ্টা ও প্রতিষ্ঠাতার বাণী (Dignitary Speeches)'
                : 'Dignitary & Leader Speeches'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ছবি আপলোড (Firebase Storage) অথবা লিঙ্ক প্রদান করুন এবং বাণীর ক্রম (Priority Order) নির্ধারণ করুন।'
              : 'Upload portraits to Firebase Storage or link via URL, and serialize display priority order.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন বাণী যোগ করুন' : 'Add New Speech'}</span>
        </button>
      </div>

      {/* Card Grid of existing Speeches (Sorted by Priority) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dignitaryMessages.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <img
                    src={item.image}
                    alt={item.nameBn || item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#04345c]">
                        #{item.priority ?? idx + 1}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-bold text-[#10564f] truncate">
                        {language === 'bn' ? item.titleBn : item.title}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {language === 'bn' ? item.nameBn : item.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {language === 'bn' ? item.designationBn : item.designation}
                    </p>
                  </div>
                </div>

                {/* Priority Reorder Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderDignitaryMessage(item.id, 'up')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition cursor-pointer"
                    title="Move Up Priority"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === dignitaryMessages.length - 1}
                    onClick={() => reorderDignitaryMessage(item.id, 'down')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-600 transition cursor-pointer"
                    title="Move Down Priority"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quote box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs italic text-slate-700 leading-relaxed">
                "{language === 'bn' ? item.quoteBn : item.quote}"
              </div>

              {/* Snippet */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {language === 'bn' ? item.fullMessageBn : item.fullMessage}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <span className="text-[10px] font-mono text-slate-400">
                {item.storagePath ? 'Firebase Storage' : 'External Image Link'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                  <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.nameBn || item.name)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingItem || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingItem
                    ? language === 'bn'
                      ? 'বাণী সম্পাদনা করুন'
                      : 'Edit Dignitary Speech'
                    : language === 'bn'
                    ? 'নতুন বাণী যুক্ত করুন'
                    : 'Add New Dignitary Speech'}
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
              {/* Row 1: Role Type & Priority Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'পদবী ধরন (Role Key)' : 'Role Type'}
                  value={formData.type || ''}
                  onChange={(value) => setFormData({ ...formData, type: value })}
                  options={dignitaryRoleOptions}
                  onAddOption={(value) => addCustomCategory('dignitaryRoles', value)}
                  placeholder={language === 'bn' ? 'Role Key নির্বাচন বা নতুন লিখুন...' : 'Select or type a role key...'}
                  language={language}
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'বাণীর শিরোনাম (বাংলা)' : 'Speech Heading (Bangla)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'বাণীর শিরোনাম (English)' : 'Speech Heading (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Row 2: Speaker Names & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'বক্তার নাম (বাংলা)' : 'Speaker Name (Bangla)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'বক্তার নাম (English)' : 'Speaker Name (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#10564f]" />
                    <span>{language === 'bn' ? 'সিরিয়াল / প্রায়োরিটি ক্রম' : 'Priority Order (#)'}</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.priority ?? 1}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Row 3: Designations & Academic Background */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'পদবী ও পরিচয় (বাংলা)' : 'Designation (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'পদবী ও পরিচয় (English)' : 'Designation (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'শিক্ষাগত/পেশাগত পটভূমি (বাংলা)' : 'Credentials (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={formData.academicBackgroundBn || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, academicBackgroundBn: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'শিক্ষাগত/পেশাগত পটভূমি (English)' : 'Credentials (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.academicBackground || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, academicBackground: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Dual Photo Upload (Firebase Storage) or Direct URL Link */}
              <MediaUploadField
                label={
                  language === 'bn'
                    ? 'বক্তার পোর্ট্রেট ছবি (আপলোড অথবা লিঙ্ক)'
                    : 'Dignitary Portrait Photo (Upload to Firebase Storage or Link)'
                }
                value={formData.image || ''}
                storagePath={formData.storagePath}
                storageFolder="dignitaries"
                mediaType="image"
                required
                language={language}
                onChange={(url, path) =>
                  setFormData({ ...formData, image: url, storagePath: path })
                }
              />

              {/* Quotes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'স্মারক উক্তি / কোট (বাংলা)' : 'Highlight Quote (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={formData.quoteBn}
                    onChange={(e) => setFormData({ ...formData, quoteBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'স্মারক উক্তি / কোট (English)' : 'Highlight Quote (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              {/* Full Messages */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পূর্ণাঙ্গ বাণী (বাংলা)' : 'Full Speech (Bangla)'} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.fullMessageBn}
                  onChange={(e) => setFormData({ ...formData, fullMessageBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পূর্ণাঙ্গ বাণী (English)' : 'Full Speech (English)'} *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.fullMessage}
                  onChange={(e) => setFormData({ ...formData, fullMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
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
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Speech'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
