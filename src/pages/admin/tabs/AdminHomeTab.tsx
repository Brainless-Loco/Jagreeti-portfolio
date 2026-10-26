import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, CheckCircle2, Flame, Heart, Sparkles, Timer, Plus, Edit, Trash2, ArrowUp, ArrowDown, X, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { GalleryPhoto } from '../../../types';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';

export const AdminHomeTab: React.FC = () => {
  const {
    language,
    siteSettings,
    updateSiteSettings,
    showToast,
    setActivePage,
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    reorderGalleryPhoto,
  } = useApp();

  const [formData, setFormData] = useState({
    heroHeadlineBn: siteSettings?.heroHeadlineBn || '',
    heroHeadlineEn: siteSettings?.heroHeadlineEn || '',
    heroSubheadlineBn: siteSettings?.heroSubheadlineBn || '',
    heroSubheadlineEn: siteSettings?.heroSubheadlineEn || '',
    tickerTextBn: siteSettings?.tickerTextBn || '',
    tickerTextEn: siteSettings?.tickerTextEn || '',
    heroCarouselIntervalSeconds: siteSettings?.heroCarouselIntervalSeconds ?? 3,
    beneficiariesCount: siteSettings?.beneficiariesCount ?? '',
    bloodBagsArrangedCount: siteSettings?.bloodBagsArrangedCount ?? '',
    volunteersCount: siteSettings?.volunteersCount ?? '',
    treesPlantedCount: siteSettings?.treesPlantedCount ?? '',
    scholarshipStudentsCount: siteSettings?.scholarshipStudentsCount ?? '',
  });
  const [editingCarouselPhoto, setEditingCarouselPhoto] = useState<GalleryPhoto | null>(null);
  const [carouselPhotoForm, setCarouselPhotoForm] = useState({
    image: '',
    storagePath: '',
    title: '',
    titleBn: '',
    subtitle: '',
    subtitleBn: '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...siteSettings }));
  }, [siteSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast(
      language === 'bn'
        ? 'হোম পেজের কনটেন্ট ও পরিসংখ্যান সফলভাবে সংরক্ষিত হয়েছে।'
        : 'Home page content and statistics updated successfully.',
      'success'
    );
  };

  const handleSaveCarouselSettings = () => {
    const interval = Math.max(
      1,
      Math.min(60, Number(formData.heroCarouselIntervalSeconds) || 3)
    );
    setFormData((previous) => ({
      ...previous,
      heroCarouselIntervalSeconds: interval,
    }));
    updateSiteSettings({ heroCarouselIntervalSeconds: interval });
    showToast(
      language === 'bn'
        ? 'ক্যারোসেল সেটিংস Firebase-এ সংরক্ষিত হয়েছে'
        : 'Carousel settings saved to Firebase.',
      'success'
    );
  };

  const carouselPhotos = galleryPhotos.filter(
    (photo) => photo.mediaType !== 'video' && photo.image
  );

  const resetCarouselPhotoForm = () => {
    setEditingCarouselPhoto(null);
    setCarouselPhotoForm({
      image: '',
      storagePath: '',
      title: '',
      titleBn: '',
      subtitle: '',
      subtitleBn: '',
    });
  };

  const handleSaveCarouselPhoto = () => {
    if (!carouselPhotoForm.image) {
      showToast(
        language === 'bn' ? 'প্রথমে একটি ছবি আপলোড করুন' : 'Upload a photo before saving.',
        'error'
      );
      return;
    }

    const sharedPayload: Partial<GalleryPhoto> = {
      image: carouselPhotoForm.image,
      title: carouselPhotoForm.title || '',
      titleBn: carouselPhotoForm.titleBn || '',
      mediaType: 'photo',
      showAsSingle: true,
      storagePath: carouselPhotoForm.storagePath,
      subtitle: carouselPhotoForm.subtitle,
      subtitleBn: carouselPhotoForm.subtitleBn,
    };

    if (editingCarouselPhoto) {
      updateGalleryPhoto(editingCarouselPhoto.id, sharedPayload);
      showToast(language === 'bn' ? 'ক্যারোসেল ছবি হালনাগাদ হয়েছে' : 'Carousel photo updated.', 'success');
    } else {
      addGalleryPhoto({
        image: carouselPhotoForm.image,
        title: carouselPhotoForm.title || carouselPhotoForm.titleBn || '',
        titleBn: carouselPhotoForm.titleBn || carouselPhotoForm.title || '',
        category: 'Home Carousel',
        categoryBn: 'হোম ক্যারোসেল',
        date: new Date().getFullYear().toString(),
        mediaType: 'photo',
        showAsSingle: true,
        priority: galleryPhotos.length + 1,
        storagePath: carouselPhotoForm.storagePath || undefined,
        subtitle: carouselPhotoForm.subtitle || undefined,
        subtitleBn: carouselPhotoForm.subtitleBn || undefined,
      });
      showToast(language === 'bn' ? 'ক্যারোসেল ছবি যুক্ত হয়েছে' : 'Carousel photo added.', 'success');
    }
    resetCarouselPhotoForm();
  };

  const handleEditCarouselPhoto = (photo: GalleryPhoto) => {
    setEditingCarouselPhoto(photo);
    setCarouselPhotoForm({
      image: photo.image,
      storagePath: photo.storagePath || '',
      title: photo.title,
      titleBn: photo.titleBn,
      subtitle: photo.subtitle || photo.caption || '',
      subtitleBn: photo.subtitleBn || photo.captionBn || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'হোম পেজ কনটেন্ট ম্যানেজমেন্ট' : 'Home Page Content Management'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'হিরো সেকশনের শিরোনাম, সাবটাইটেল, টিকার ব্যানার ও লাইভ প্রভাব পরিসংখ্যান সম্পাদনা করুন।'
              : 'Edit hero headline, sub-headline, ticker announcements, and public impact counters.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition self-start sm:self-auto"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'লাইভ হোম পেজ প্রিভিউ' : 'Preview Live Home'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Hero Headlines */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Flame className="w-4 h-4 text-[#1e77bd]" />
            <span>{language === 'bn' ? '১. হিরো সেকশন শিরোনাম ও বিবরণ' : '1. Hero Headlines & Introduction'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মূল শিরোনাম (বাংলা)' : 'Hero Title (Bengali)'}
              </label>
              <input
                type="text"
                name="heroHeadlineBn"
                value={formData.heroHeadlineBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-[#04345c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মূল শিরোনাম (ইংরেজি)' : 'Hero Title (English)'}
              </label>
              <input
                type="text"
                name="heroHeadlineEn"
                value={formData.heroHeadlineEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-[#04345c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সাব-শিরোনাম / পরিচিতি (বাংলা)' : 'Subtitle / Tagline (Bengali)'}
              </label>
              <textarea
                name="heroSubheadlineBn"
                rows={3}
                value={formData.heroSubheadlineBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সাব-শিরোনাম / পরিচিতি (ইংরেজি)' : 'Subtitle / Tagline (English)'}
              </label>
              <textarea
                name="heroSubheadlineEn"
                rows={3}
                value={formData.heroSubheadlineEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Carousel */}
        <div className="min-w-0 overflow-hidden p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ImageIcon className="w-4 h-4 text-[#1e77bd]" />
              <span>{language === 'bn' ? '২. হিরো ফটো ক্যারোসেল' : '2. Hero Photo Carousel'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <Timer className="w-3.5 h-3.5 text-[#1e77bd]" />
                <span>{language === 'bn' ? 'পরিবর্তনের সময় (সেকেন্ড)' : 'Interval (seconds)'}</span>
                <input
                  type="number"
                  name="heroCarouselIntervalSeconds"
                  min={1}
                  max={60}
                  value={formData.heroCarouselIntervalSeconds}
                  onChange={handleChange}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 text-xs"
                />
              </label>
              <button
                type="button"
                onClick={handleSaveCarouselSettings}
                className="px-3 py-1.5 rounded-lg bg-[#10564f] text-white text-[11px] font-bold hover:bg-[#10564f]/90"
              >
                {language === 'bn' ? 'সময় সংরক্ষণ' : 'Save Time'}
              </button>
              <span className="text-[11px] text-slate-500">
                {language === 'bn' ? `${carouselPhotos.length}টি ছবি` : `${carouselPhotos.length} photo(s)`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-5">
            <div className="min-w-0 space-y-3">
              <MediaUploadField
                label={language === 'bn' ? 'ক্যারোসেল ছবি' : 'Carousel Photo'}
                value={carouselPhotoForm.image}
                onChange={(url, storagePath) =>
                  setCarouselPhotoForm((previous) => ({
                    ...previous,
                    image: url,
                    storagePath: storagePath || '',
                  }))
                }
                storageFolder="gallery/photos"
                mediaType="image"
                storagePath={carouselPhotoForm.storagePath}
                language={language}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={carouselPhotoForm.title}
                  onChange={(e) => setCarouselPhotoForm({ ...carouselPhotoForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
                />
                <input
                  type="text"
                  placeholder="শিরোনাম (বাংলা)"
                  value={carouselPhotoForm.titleBn}
                  onChange={(e) => setCarouselPhotoForm({ ...carouselPhotoForm, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Subtitle (English, optional)"
                  value={carouselPhotoForm.subtitle}
                  onChange={(e) => setCarouselPhotoForm({ ...carouselPhotoForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="সাবটাইটেল (বাংলা, ঐচ্ছিক)"
                  value={carouselPhotoForm.subtitleBn}
                  onChange={(e) => setCarouselPhotoForm({ ...carouselPhotoForm, subtitleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveCarouselPhoto}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90"
                >
                  {editingCarouselPhoto ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingCarouselPhoto ? (language === 'bn' ? 'ছবি হালনাগাদ' : 'Update Photo') : language === 'bn' ? 'ছবি যোগ করুন' : 'Add Photo'}
                </button>
                {editingCarouselPhoto && (
                  <button type="button" onClick={resetCarouselPhotoForm} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                    <X className="w-3.5 h-3.5" /> {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              {carouselPhotos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  {language === 'bn' ? 'এখনও কোনো ক্যারোসেল ছবি যোগ করা হয়নি।' : 'No carousel photos have been added yet.'}
                </div>
              )}
              {carouselPhotos.map((photo, index) => (
                <div key={photo.id} className="min-w-0 flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-xl border border-slate-200 p-2.5 bg-slate-50">
                  <img src={photo.image} alt={photo.title} className="w-20 h-14 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1 max-w-full">
                    <p className="text-xs font-bold text-slate-800 truncate">{language === 'bn' ? photo.titleBn || photo.title : photo.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{photo.subtitle || photo.subtitleBn || 'No subtitle'}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" disabled={index === 0} onClick={() => reorderGalleryPhoto(photo.id, 'up')} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                    <button type="button" disabled={index === carouselPhotos.length - 1} onClick={() => reorderGalleryPhoto(photo.id, 'down')} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                    <button type="button" onClick={() => handleEditCarouselPhoto(photo)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-[#1e77bd]"><Edit className="w-3 h-3" /></button>
                    <button type="button" onClick={() => { if (window.confirm(language === 'bn' ? 'এই ছবি মুছে ফেলবেন?' : 'Delete this carousel photo?')) deleteGalleryPhoto(photo.id); }} className="p-1.5 rounded-lg border border-rose-200 bg-white text-rose-600"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Ticker Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? '২. টপ হেডার টিকার টেক্সট' : '2. Top Header Announcement Ticker'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'টিকার টেক্সট (বাংলা)' : 'Ticker Text (Bengali)'}
              </label>
              <input
                type="text"
                name="tickerTextBn"
                value={formData.tickerTextBn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'টিকার টেক্সট (ইংরেজি)' : 'Ticker Text (English)'}
              </label>
              <input
                type="text"
                name="tickerTextEn"
                value={formData.tickerTextEn}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Live Verified Impact Counters */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>{language === 'bn' ? '৩. হোম পেজ প্রভাব পরিসংখ্যান (কাউন্টার)' : '3. Live Public Impact Counters'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মোট সেবাগ্রহীতা' : 'Total Beneficiaries'}
              </label>
              <input
                type="number"
                name="beneficiariesCount"
                value={formData.beneficiariesCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'ব্যাগ রক্তের ব্যবস্থা সম্পন্ন' : 'Blood Bags Arranged'}
              </label>
              <input
                type="number"
                min={0}
                name="bloodBagsArrangedCount"
                value={formData.bloodBagsArrangedCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'সক্রিয় স্বেচ্ছাসেবী' : 'Active Volunteers'}
              </label>
              <input
                type="number"
                name="volunteersCount"
                value={formData.volunteersCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'রোপিত ও সংরক্ষিত বৃক্ষ' : 'Trees Planted'}
              </label>
              <input
                type="number"
                name="treesPlantedCount"
                value={formData.treesPlantedCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'মাসিক বৃত্তিপ্রাপ্ত শিক্ষার্থী' : 'Scholarship Students'}
              </label>
              <input
                type="number"
                name="scholarshipStudentsCount"
                value={formData.scholarshipStudentsCount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#04345c] hover:bg-[#04345c]/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
