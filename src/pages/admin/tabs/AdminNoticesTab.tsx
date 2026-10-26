import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  Calendar,
  Clock,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { NoticeItem } from '../../../types';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';
import { removeStorageFile } from '../../../services/firebaseService';
import { uploadMediaToFirebaseStorage } from '../../../services/firebaseStorageService';

export const AdminNoticesTab: React.FC = () => {
  const {
    language,
    notices,
    addNotice,
    updateNotice,
    deleteNotice,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [editingItem, setEditingItem] = useState<NoticeItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');

  const [formData, setFormData] = useState<Partial<NoticeItem>>({
    title: '',
    titleBn: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    summaryBn: '',
    content: '',
    contentBn: '',
    category: 'circular',
    isUrgent: false,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      titleBn: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      summaryBn: '',
      content: '',
      contentBn: '',
      category: 'circular',
      isUrgent: false,
    });
    setAttachmentError('');
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: NoticeItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
    setAttachmentError('');
  };

  const handleAttachmentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !isPdf) {
      setAttachmentError(
        language === 'bn'
          ? 'শুধুমাত্র PDF অথবা JPG ফাইল আপলোড করুন।'
          : 'Only PDF or JPG files can be uploaded.'
      );
      return;
    }

    try {
      setAttachmentError('');
      setUploadingAttachment(true);
      const result = await uploadMediaToFirebaseStorage(file, 'notices');
      setFormData((previous) => ({
        ...previous,
        image: result.url,
        storagePath: result.storagePath,
        attachmentType: isPdf ? 'pdf' : 'image',
        attachmentName: result.fileName,
      }));
    } catch (error) {
      setAttachmentError(
        language === 'bn' ? 'ফাইল আপলোড ব্যর্থ হয়েছে।' : 'The file upload failed. Please try again.'
      );
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title && !formData.titleBn) return;

    if (formData.category) {
      addCustomCategory('noticeCategories', formData.category);
    }

    if (editingItem) {
      updateNotice(editingItem.id, formData);
      if (editingItem.storagePath && editingItem.storagePath !== formData.storagePath) {
        void removeStorageFile(editingItem.storagePath);
      }
      showToast(
        language === 'bn' ? 'বিজ্ঞপ্তি সফলভাবে হালনাগাদ হয়েছে' : 'Notice circular updated in Firestore',
        'success'
      );
      setEditingItem(null);
    } else if (isCreating) {
      addNotice({
        title: formData.title || formData.titleBn || 'Notice',
        titleBn: formData.titleBn || formData.title || 'বিজ্ঞপ্তি',
        date: formData.date || new Date().toISOString().split('T')[0],
        summary: formData.summary || '',
        summaryBn: formData.summaryBn || '',
        content: formData.content || formData.summary || '',
        contentBn: formData.contentBn || formData.summaryBn || '',
        category: formData.category || 'circular',
        isUrgent: Boolean(formData.isUrgent),
      });
      showToast(
        language === 'bn' ? 'নতুন বিজ্ঞপ্তি প্রকাশিত হয়েছে' : 'Notice circular published to notices collection',
        'success'
      );
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" বিজ্ঞপ্তিটি মুছে ফেলতে চান?` : `Are you sure you want to delete ${title}?`)) {
      deleteNotice(id);
      showToast(
        language === 'bn' ? 'বিজ্ঞপ্তি মুছে ফেলা হয়েছে' : 'Notice deleted',
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-600" />
              <span>{language === 'bn' ? 'বিজ্ঞপ্তি ও সার্কুলার ম্যানেজমেন্ট' : 'Notices & Circulars'}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              notices
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
              <Clock className="w-3 h-3" />
              {language === 'bn' ? 'তারিখ অনুযায়ী স্বয়ংক্রিয় ক্রম' : 'Auto-Sorted by Date'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'বিজ্ঞপ্তিসমূহ প্রকাশের তারিখ (Date) ও জরুরি (Urgent) স্ট্যাটাস অনুযায়ী স্বয়ংক্রিয়ভাবে সাজানো থাকে।'
              : 'Notices automatically appear in chronological order by publication date (with Urgent notices pinned first).'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন বিজ্ঞপ্তি প্রকাশ' : 'Publish Notice'}</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {notice.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {language === 'bn' ? 'জরুরি' : 'Urgent'}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase">
                  {notice.category}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#1e77bd]" />
                  {notice.date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? notice.titleBn || notice.title : notice.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {language === 'bn' ? notice.summaryBn || notice.summary : notice.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(notice)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
              </button>
              <button
                onClick={() => handleDelete(notice.id, notice.title)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-700 transition flex items-center gap-1.5 cursor-pointer"
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
          <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#bad3e4]" />
                <h3 className="font-bold text-base">
                  {editingItem
                    ? (language === 'bn' ? 'বিজ্ঞপ্তি সম্পাদনা' : 'Edit Notice')
                    : (language === 'bn' ? 'নতুন বিজ্ঞপ্তি প্রকাশ' : 'Publish Circular')}
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

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিরোনাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিরোনাম (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'ক্যাটাগরি (Auto-complete / Add New)' : 'Category (Auto-complete / Add)'}
                  value={formData.category || 'circular'}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                  options={customCategories.noticeCategories}
                  onAddNewOption={(newCat) => addCustomCategory('noticeCategories', newCat)}
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">তারিখ (Publication Date)</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>{language === 'bn' ? 'জরুরি বিজ্ঞপ্তি' : 'Mark as Urgent'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summaryBn}
                  onChange={(e) => setFormData({ ...formData, summaryBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (English)</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পূর্ণ বিবরণ / কন্টেন্ট (বাংলা)</label>
                <textarea
                  rows={3}
                  value={formData.contentBn}
                  onChange={(e) => setFormData({ ...formData, contentBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পূর্ণ বিবরণ / Content (English)</label>
                <textarea
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-[#1e77bd]" />
                    {language === 'bn' ? 'নোটিশ ফাইল (ঐচ্ছিক)' : 'Notice File (Optional)'}
                  </label>
                  <span className="text-[10px] text-slate-500">PDF or JPG</span>
                </div>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/jpg"
                  onChange={handleAttachmentSelect}
                  disabled={uploadingAttachment}
                  className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#04345c] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#04345c]/90"
                />
                {uploadingAttachment && (
                  <p className="text-xs font-semibold text-[#1e77bd]">
                    {language === 'bn' ? 'ফাইল আপলোড হচ্ছে...' : 'Uploading file...'}
                  </p>
                )}
                {attachmentError && <p className="text-xs font-semibold text-rose-600">{attachmentError}</p>}
                {formData.image && (
                  <div className="rounded-xl border border-slate-200 bg-white p-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {formData.attachmentName || (formData.attachmentType === 'pdf' ? 'PDF attachment' : 'JPG attachment')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '', storagePath: '', attachmentType: undefined, attachmentName: undefined })}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        {language === 'bn' ? 'সরান' : 'Remove'}
                      </button>
                    </div>
                    {formData.attachmentType === 'pdf' ? (
                      <iframe src={formData.image} title="Notice PDF preview" className="w-full h-48 rounded-lg border border-slate-100" />
                    ) : (
                      <img src={formData.image} alt="Notice attachment preview" className="max-h-48 w-full rounded-lg object-contain" />
                    )}
                  </div>
                )}
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
                  <span>{language === 'bn' ? 'বিজ্ঞপ্তি সংরক্ষণ' : 'Save Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
