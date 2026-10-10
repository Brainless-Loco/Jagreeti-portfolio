import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  FolderHeart,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Hash,
  Youtube,
  Layers,
  Eye,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { GalleryPhoto, GalleryAlbum } from '../../../types';
import { MediaUploadField } from '../../../components/admin/MediaUploadField';
import { CategoryAutocomplete } from '../../../components/admin/CategoryAutocomplete';
import {
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from '../../../services/firebaseStorageService';

export const AdminGalleryTab: React.FC = () => {
  const {
    language,
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    reorderGalleryPhoto,
    galleryAlbums,
    addGalleryAlbum,
    updateGalleryAlbum,
    deleteGalleryAlbum,
    reorderGalleryAlbum,
    customCategories,
    addCustomCategory,
    showToast,
  } = useApp();

  const [subTab, setSubTab] = useState<'media' | 'albums'>('media');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [albumFilter, setAlbumFilter] = useState<string>('all');

  // Media Modal State
  const [editingMedia, setEditingMedia] = useState<GalleryPhoto | null>(null);
  const [isCreatingMedia, setIsCreatingMedia] = useState<boolean>(false);
  const [mediaForm, setMediaForm] = useState<{
    title: string;
    titleBn: string;
    category: string;
    categoryBn: string;
    date: string;
    mediaType: 'photo' | 'video';
    image: string;
    videoUrl: string;
    videoSource: 'upload' | 'youtube' | 'link';
    storagePath: string;
    albumId: string;
    showAsSingle: boolean;
    priority: number;
  }>({
    title: '',
    titleBn: '',
    category: 'Medical',
    categoryBn: 'চিকিৎসা সেবা',
    date: new Date().getFullYear().toString(),
    mediaType: 'photo',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
    videoUrl: '',
    videoSource: 'youtube',
    storagePath: '',
    albumId: '',
    showAsSingle: true,
    priority: galleryPhotos.length + 1,
  });

  // Album Modal State
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState<boolean>(false);
  const [albumForm, setAlbumForm] = useState<{
    title: string;
    titleBn: string;
    description: string;
    descriptionBn: string;
    coverImage: string;
    storagePath: string;
    category: string;
    categoryBn: string;
    date: string;
    priority: number;
  }>({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    storagePath: '',
    category: 'Relief',
    categoryBn: 'ত্রাণ ও পুনর্বাসন',
    date: '2025',
    priority: galleryAlbums.length + 1,
  });

  // Open Media Create
  const handleOpenCreateMedia = (presetAlbumId = '', presetType: 'photo' | 'video' = 'photo') => {
    setMediaForm({
      title: '',
      titleBn: '',
      category: 'Medical',
      categoryBn: 'চিকিৎসা সেবা',
      date: new Date().getFullYear().toString(),
      mediaType: presetType,
      image:
        presetType === 'photo'
          ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
      videoUrl: presetType === 'video' ? 'https://www.youtube.com/embed/libKVRa01L8' : '',
      videoSource: 'youtube',
      storagePath: '',
      albumId: presetAlbumId,
      showAsSingle: true,
      priority: galleryPhotos.length + 1,
    });
    setEditingMedia(null);
    setIsCreatingMedia(true);
  };

  const handleOpenEditMedia = (item: GalleryPhoto) => {
    setEditingMedia(item);
    setMediaForm({
      title: item.title,
      titleBn: item.titleBn,
      category: item.category,
      categoryBn: item.categoryBn || item.category,
      date: item.date || '2025',
      mediaType: item.mediaType || 'photo',
      image: item.image,
      videoUrl: item.videoUrl || '',
      videoSource: item.videoSource || 'youtube',
      storagePath: item.storagePath || '',
      albumId: item.albumId || '',
      showAsSingle: item.showAsSingle !== false,
      priority: item.priority || 1,
    });
    setIsCreatingMedia(false);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.title && !mediaForm.titleBn) return;

    if (mediaForm.category) {
      addCustomCategory('galleryCategories', mediaForm.category);
    }

    let finalImage = mediaForm.image;
    let finalVideoUrl = mediaForm.videoUrl;
    let finalVideoSource = mediaForm.videoSource;

    if (mediaForm.mediaType === 'video' && finalVideoUrl) {
      if (isYouTubeUrl(finalVideoUrl)) {
        finalVideoUrl = getYouTubeEmbedUrl(finalVideoUrl);
        finalVideoSource = 'youtube';
        const ytThumb = getYouTubeThumbnailUrl(finalVideoUrl);
        if (ytThumb && (!finalImage || finalImage.includes('unsplash.com'))) {
          finalImage = ytThumb;
        }
      }
    }

    const payload: Omit<GalleryPhoto, 'id'> = {
      title: mediaForm.title || mediaForm.titleBn,
      titleBn: mediaForm.titleBn || mediaForm.title,
      category: mediaForm.category || 'Events',
      categoryBn: mediaForm.categoryBn || mediaForm.category || 'ইভেন্ট',
      date: mediaForm.date || '2025',
      mediaType: mediaForm.mediaType,
      image: finalImage,
      videoUrl: mediaForm.mediaType === 'video' ? finalVideoUrl : undefined,
      videoSource: mediaForm.mediaType === 'video' ? finalVideoSource : undefined,
      storagePath: mediaForm.storagePath || undefined,
      albumId: mediaForm.albumId || undefined,
      showAsSingle: mediaForm.showAsSingle,
      priority: Number(mediaForm.priority) || galleryPhotos.length + 1,
    };

    if (editingMedia) {
      updateGalleryPhoto(editingMedia.id, payload);
      showToast(
        language === 'bn' ? 'গ্যালারি মিডিয়া সফলভাবে হালনাগাদ হয়েছে' : 'Gallery media updated in Firestore',
        'success'
      );
      setEditingMedia(null);
    } else if (isCreatingMedia) {
      addGalleryPhoto(payload);
      showToast(
        language === 'bn' ? 'নতুন মিডিয়া গ্যালারিতে যুক্ত হয়েছে' : 'New media added to gallery_media collection',
        'success'
      );
      setIsCreatingMedia(false);
    }
  };

  const handleDeleteMedia = (id: string, title: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে "${title}" মুছে ফেলতে চান?` : `Delete "${title}" from gallery?`)) {
      deleteGalleryPhoto(id);
      showToast(
        language === 'bn' ? 'মিডিয়া মুছে ফেলা হয়েছে' : 'Gallery item deleted',
        'info'
      );
    }
  };

  // Open Album Create / Edit
  const handleOpenCreateAlbum = () => {
    setAlbumForm({
      title: '',
      titleBn: '',
      description: '',
      descriptionBn: '',
      coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
      storagePath: '',
      category: 'Relief',
      categoryBn: 'ত্রাণ ও পুনর্বাসন',
      date: '2025',
      priority: galleryAlbums.length + 1,
    });
    setEditingAlbum(null);
    setIsCreatingAlbum(true);
  };

  const handleOpenEditAlbum = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title,
      titleBn: album.titleBn,
      description: album.description,
      descriptionBn: album.descriptionBn,
      coverImage: album.coverImage,
      storagePath: album.storagePath || '',
      category: album.category,
      categoryBn: album.categoryBn,
      date: album.date,
      priority: album.priority || 1,
    });
    setIsCreatingAlbum(false);
  };

  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title && !albumForm.titleBn) return;

    if (albumForm.category) {
      addCustomCategory('galleryCategories', albumForm.category);
    }

    const payload: Omit<GalleryAlbum, 'id'> = {
      title: albumForm.title || albumForm.titleBn,
      titleBn: albumForm.titleBn || albumForm.title,
      description: albumForm.description || albumForm.descriptionBn,
      descriptionBn: albumForm.descriptionBn || albumForm.description,
      coverImage: albumForm.coverImage,
      storagePath: albumForm.storagePath || undefined,
      category: albumForm.category || 'Events',
      categoryBn: albumForm.categoryBn || albumForm.category || 'ইভেন্ট',
      date: albumForm.date || '2025',
      priority: Number(albumForm.priority) || galleryAlbums.length + 1,
    };

    if (editingAlbum) {
      updateGalleryAlbum(editingAlbum.id, payload);
      showToast(
        language === 'bn' ? 'অ্যালবাম হালনাগাদ হয়েছে' : 'Album updated in gallery_albums collection',
        'success'
      );
      setEditingAlbum(null);
    } else if (isCreatingAlbum) {
      addGalleryAlbum(payload);
      showToast(
        language === 'bn' ? 'নতুন অ্যালবাম তৈরি হয়েছে' : 'New album created in gallery_albums collection',
        'success'
      );
      setIsCreatingAlbum(false);
    }
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (
      window.confirm(
        language === 'bn'
          ? `আপনি কি নিশ্চিত যে "${title}" অ্যালবামটি মুছে ফেলতে চান? (ভেতরের ছবিগুলো একক ছবি হিসেবে থেকে যাবে)`
          : `Delete album "${title}"? (Media inside will remain as standalone items)`
      )
    ) {
      deleteGalleryAlbum(id);
      showToast(
        language === 'bn' ? 'অ্যালবাম মুছে ফেলা হয়েছে' : 'Album deleted',
        'info'
      );
    }
  };

  const filteredMedia = galleryPhotos.filter((item) => {
    const matchesType = mediaFilter === 'all' || (item.mediaType || 'photo') === mediaFilter;
    const matchesAlbum =
      albumFilter === 'all'
        ? true
        : albumFilter === 'unassigned'
        ? !item.albumId
        : item.albumId === albumFilter;
    return matchesType && matchesAlbum;
  });

  const getAlbumName = (albumId?: string) => {
    if (!albumId) return null;
    const found = galleryAlbums.find((a) => a.id === albumId);
    if (!found) return null;
    return language === 'bn' ? found.titleBn : found.title;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <span>
                {language === 'bn'
                  ? 'ফটো, ভিডিও ও অ্যালবাম গ্যালারি ব্যবস্থাপনা'
                  : 'Photo, Video & Album Gallery Manager'}
              </span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              gallery_media + gallery_albums
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ছবি ও ভিডিও আপলোড বা ইউটিউব লিঙ্ক যুক্ত করুন, অ্যালবাম তৈরি করুন এবং পোর্টফোলিওতে একক ও অ্যালবাম ভিউ নিয়ন্ত্রণ করুন।'
              : 'Upload photos/videos to Firebase Storage or add YouTube iframe links, organize into albums, and serialize priority order.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenCreateMedia('', 'photo')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#04345c] text-white text-xs font-bold hover:bg-[#04345c]/90 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ছবি যোগ' : 'Add Photo'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateMedia('', 'video')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-xs cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ভিডিও / YouTube' : 'Add Video / YouTube'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateAlbum}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#10564f] text-white text-xs font-bold hover:bg-[#10564f]/90 transition shadow-xs cursor-pointer"
          >
            <FolderHeart className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন অ্যালবাম তৈরি' : 'Create Album'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setSubTab('media')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subTab === 'media'
                ? 'bg-[#04345c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? `একক ছবি ও ভিডিও (${galleryPhotos.length})`
                : `Photos & Videos (${galleryPhotos.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('albums')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              subTab === 'albums'
                ? 'bg-[#04345c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? `ফটো ও ভিডিও অ্যালবাম (${galleryAlbums.length})`
                : `Albums (${galleryAlbums.length})`}
            </span>
          </button>
        </div>

        {subTab === 'media' && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Media Type Filter */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
              {(['all', 'photo', 'video'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMediaFilter(t)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                    mediaFilter === t ? 'bg-[#04345c] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t === 'all' ? 'All Media' : t === 'photo' ? 'Photos' : 'Videos'}
                </button>
              ))}
            </div>

            {/* Album Filter */}
            <select
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
            >
              <option value="all">{language === 'bn' ? 'সকল অ্যালবাম ও একক' : 'All Albums & Singles'}</option>
              <option value="unassigned">{language === 'bn' ? 'অ্যালবাম ছাড়া (Standalone)' : 'Standalone Only'}</option>
              {galleryAlbums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  Album: {language === 'bn' ? alb.titleBn : alb.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: PHOTOS & VIDEOS */}
      {subTab === 'media' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedia.map((item, idx) => {
            const albumName = getAlbumName(item.albumId);
            const isVideo = item.mediaType === 'video';
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {/* Priority & Type Bar */}
                  <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#04345c]/10 text-[#04345c] text-[10px] font-bold">
                        <Hash className="w-3 h-3" />
                        {item.priority ?? idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isVideo
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        {isVideo ? (item.videoSource === 'youtube' ? 'YouTube' : 'Video') : 'Photo'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderGalleryPhoto(item.id, 'up')}
                        className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === filteredMedia.length - 1}
                        onClick={() => reorderGalleryPhoto(item.id, 'down')}
                        className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    {isVideo && item.videoUrl && item.videoSource === 'youtube' ? (
                      <iframe
                        src={getYouTubeEmbedUrl(item.videoUrl)}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : isVideo && item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        poster={item.image}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/65 text-white backdrop-blur-xs">
                        {language === 'bn' ? item.categoryBn || item.category : item.category}
                      </span>
                      {albumName && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10564f]/90 text-white backdrop-blur-xs flex items-center gap-1">
                          <FolderHeart className="w-2.5 h-2.5" />
                          {albumName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {language === 'bn' ? item.titleBn || item.title : item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.date || '2025'}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                        <Eye className="w-3 h-3 text-emerald-600" />
                        {item.showAsSingle !== false
                          ? language === 'bn'
                            ? 'একক ভিউতে দৃশ্যমান'
                            : 'Shown in Singles'
                          : language === 'bn'
                          ? 'শুধু অ্যালবামে'
                          : 'Album Only'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditMedia(item)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                    <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(item.id, item.title)}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: ALBUMS */}
      {subTab === 'albums' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryAlbums.map((album, idx) => {
            const albumItems = galleryPhotos.filter((p) => p.albumId === album.id);
            const videoCount = albumItems.filter((p) => p.mediaType === 'video').length;
            const photoCount = albumItems.length - videoCount;

            return (
              <div
                key={album.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Priority Header */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#10564f]/10 text-[#10564f] text-[10px] font-bold">
                      <Hash className="w-3 h-3" />
                      Album Order #{album.priority ?? idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderGalleryAlbum(album.id, 'up')}
                        className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === galleryAlbums.length - 1}
                        onClick={() => reorderGalleryAlbum(album.id, 'down')}
                        className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#04345c]/90 text-white">
                        {language === 'bn' ? album.categoryBn || album.category : album.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span>{album.date}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                        {photoCount} Photos • {videoCount} Videos
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? album.titleBn : album.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {language === 'bn' ? album.descriptionBn : album.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCreateMedia(album.id, 'photo')}
                    className="px-2.5 py-1.5 rounded-lg bg-[#10564f]/10 hover:bg-[#10564f]/20 text-[#10564f] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'মিডিয়া যোগ' : 'Add Media'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAlbum(album)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#1e77bd]" />
                      <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAlbum(album.id, album.title)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD / EDIT PHOTO OR VIDEO */}
      {(editingMedia || isCreatingMedia) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#04345c] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mediaForm.mediaType === 'video' ? (
                  <Video className="w-5 h-5 text-rose-300" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#bad3e4]" />
                )}
                <h3 className="font-bold text-base">
                  {editingMedia
                    ? language === 'bn'
                      ? 'গ্যালারি মিডিয়া সম্পাদনা'
                      : 'Edit Gallery Media'
                    : language === 'bn'
                    ? 'নতুন ছবি বা ভিডিও যোগ করুন'
                    : 'Add New Photo or Video to Gallery'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingMedia(null);
                  setIsCreatingMedia(false);
                }}
                className="text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Media Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'bn' ? 'মিডিয়ার ধরন নির্বাচন করুন' : 'Select Media Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaForm({ ...mediaForm, mediaType: 'photo' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      mediaForm.mediaType === 'photo'
                        ? 'bg-[#04345c] text-white border-[#04345c]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ছবি (Photo Upload / URL)' : 'Photo (Upload / Link)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaForm({ ...mediaForm, mediaType: 'video' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      mediaForm.mediaType === 'video'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Youtube className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ভিডিও (Upload / YouTube Iframe)' : 'Video (Upload / YouTube Iframe)'}</span>
                  </button>
                </div>
              </div>

              {/* Conditional Upload / Link Fields */}
              {mediaForm.mediaType === 'photo' ? (
                <MediaUploadField
                  label={language === 'bn' ? 'গ্যালারির ছবি (Firebase Storage আপলোড বা লিঙ্ক)' : 'Gallery Photo (Upload to Firebase Storage or Image Link)'}
                  value={mediaForm.image}
                  onChange={(url, meta) =>
                    setMediaForm({
                      ...mediaForm,
                      image: url,
                      storagePath: meta?.storagePath || mediaForm.storagePath,
                    })
                  }
                  folder="gallery/photos"
                  accept="image/*"
                  mediaKind="image"
                />
              ) : (
                <div className="space-y-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200/70">
                  <MediaUploadField
                    label={
                      language === 'bn'
                        ? 'ভিডিও ফাইল আপলোড অথবা YouTube ভিডিও লিঙ্ক (Iframe সাপোর্টসহ)'
                        : 'Upload Video File OR Paste YouTube Link (Auto Iframe in Portfolio)'
                    }
                    value={mediaForm.videoUrl}
                    onChange={(url, meta) => {
                      const autoThumb = meta?.thumbnailUrl || getYouTubeThumbnailUrl(url);
                      setMediaForm({
                        ...mediaForm,
                        videoUrl: url,
                        videoSource: meta?.videoSource || (isYouTubeUrl(url) ? 'youtube' : 'link'),
                        storagePath: meta?.storagePath || mediaForm.storagePath,
                        image: autoThumb || mediaForm.image,
                      });
                    }}
                    folder="gallery/videos"
                    accept="video/*"
                    mediaKind="video"
                  />

                  <MediaUploadField
                    label={
                      language === 'bn'
                        ? 'ভিডিও কভার থাম্বনেইল ছবি (YouTube হলে স্বয়ংক্রিয়ভাবে যুক্ত হয়)'
                        : 'Video Thumbnail Image (Auto-filled for YouTube, or upload custom cover)'
                    }
                    value={mediaForm.image}
                    onChange={(url) => setMediaForm({ ...mediaForm, image: url })}
                    folder="gallery/photos"
                    accept="image/*"
                    mediaKind="image"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাপশন / শিরোনাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={mediaForm.titleBn}
                    onChange={(e) => setMediaForm({ ...mediaForm, titleBn: e.target.value })}
                    placeholder="যেমন: ফ্রি মেডিকেল ক্যাম্প ২০২৫"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাপশন / শিরোনাম (English) *</label>
                  <input
                    type="text"
                    required
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    placeholder="e.g. Free Medical Camp 2025"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#1e77bd]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'ক্যাটাগরি (Auto-complete / Add New)' : 'Category (Auto-complete / Add New)'}
                  value={mediaForm.category}
                  onChange={(val) => setMediaForm({ ...mediaForm, category: val })}
                  options={customCategories.galleryCategories}
                  onAddNewOption={(newCat) => addCustomCategory('galleryCategories', newCat)}
                  placeholder="Select or add category..."
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি (বাংলা)</label>
                  <input
                    type="text"
                    value={mediaForm.categoryBn}
                    onChange={(e) => setMediaForm({ ...mediaForm, categoryBn: e.target.value })}
                    placeholder="যেমন: চিকিৎসা সেবা"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সাল / তারিখ</label>
                  <input
                    type="text"
                    value={mediaForm.date}
                    onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Album Assignment & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অ্যালবামে যুক্ত করুন (ঐচ্ছিক)' : 'Assign to Album (Optional)'}
                  </label>
                  <select
                    value={mediaForm.albumId}
                    onChange={(e) => setMediaForm({ ...mediaForm, albumId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="">
                      {language === 'bn' ? '— কোনো অ্যালবাম নয় (Standalone) —' : '— No Album (Standalone) —'}
                    </option>
                    {galleryAlbums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {language === 'bn' ? alb.titleBn : alb.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'ক্রম / সিরিয়াল নম্বর (Priority)' : 'Priority Order'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={mediaForm.priority}
                    onChange={(e) => setMediaForm({ ...mediaForm, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={mediaForm.showAsSingle}
                      onChange={(e) => setMediaForm({ ...mediaForm, showAsSingle: e.target.checked })}
                      className="w-4 h-4 rounded text-[#04345c]"
                    />
                    <span>
                      {language === 'bn' ? 'একক গ্যালারিতেও দেখান' : 'Show in Single Media View'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMedia(null);
                    setIsCreatingMedia(false);
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
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Media'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE / EDIT ALBUM */}
      {(editingAlbum || isCreatingAlbum) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-5 bg-[#10564f] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">
                  {editingAlbum
                    ? language === 'bn'
                      ? 'অ্যালবাম সম্পাদনা করুন'
                      : 'Edit Gallery Album'
                    : language === 'bn'
                    ? 'নতুন ফটো/ভিডিও অ্যালবাম তৈরি করুন'
                    : 'Create New Photo/Video Album'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingAlbum(null);
                  setIsCreatingAlbum(false);
                }}
                className="text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="p-6 overflow-y-auto space-y-4 text-xs">
              <MediaUploadField
                label={language === 'bn' ? 'অ্যালবাম কভার ছবি (Upload বা Link)' : 'Album Cover Image (Upload or URL Link)'}
                value={albumForm.coverImage}
                onChange={(url, meta) =>
                  setAlbumForm({
                    ...albumForm,
                    coverImage: url,
                    storagePath: meta?.storagePath || albumForm.storagePath,
                  })
                }
                folder="gallery/albums"
                accept="image/*"
                mediaKind="image"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অ্যালবামের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={albumForm.titleBn}
                    onChange={(e) => setAlbumForm({ ...albumForm, titleBn: e.target.value })}
                    placeholder="যেমন: উপকূলীয় ত্রাণ অভিযান ২০২৫"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Album Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                    placeholder="e.g. Coastal Relief Drive 2025"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={albumForm.descriptionBn}
                    onChange={(e) => setAlbumForm({ ...albumForm, descriptionBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={albumForm.description}
                    onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CategoryAutocomplete
                  label={language === 'bn' ? 'ক্যাটাগরি' : 'Album Category'}
                  value={albumForm.category}
                  onChange={(val) => setAlbumForm({ ...albumForm, category: val })}
                  options={customCategories.galleryCategories}
                  onAddNewOption={(newCat) => addCustomCategory('galleryCategories', newCat)}
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সাল / তারিখ</label>
                  <input
                    type="text"
                    value={albumForm.date}
                    onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্রম / সিরিয়াল (Priority)</label>
                  <input
                    type="number"
                    min={1}
                    value={albumForm.priority}
                    onChange={(e) => setAlbumForm({ ...albumForm, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAlbum(null);
                    setIsCreatingAlbum(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10564f] text-white font-bold hover:bg-[#10564f]/90 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'bn' ? 'অ্যালবাম সংরক্ষণ' : 'Save Album'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
