import React, { useState, useMemo } from 'react';
import {
  Camera,
  X,
  ZoomIn,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Video,
  Youtube,
  FolderHeart,
  Image as ImageIcon,
  Play,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryPhoto, GalleryAlbum } from '../types';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '../services/firebaseStorageService';

export const GalleryPage: React.FC = () => {
  const { language, galleryPhotos, galleryAlbums } = useApp();

  // Main portfolio view mode: 'both' (shows Albums + Single Media), 'albums', or 'singles'
  const [portfolioView, setPortfolioView] = useState<'both' | 'albums' | 'singles'>('both');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photo' | 'video'>('all');

  // Active opened Album Modal
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  // Active Lightbox Item (Photo or Video)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Track which inline video cards are actively playing in the grid
  const [playingInlineIds, setPlayingInlineIds] = useState<Record<string, boolean>>({});

  // Dynamic categories from albums & photos
  const dynamicCategories = useMemo(() => {
    const map = new Map<string, string>();
    galleryPhotos.forEach((p) => {
      if (p.category) map.set(p.category, p.categoryBn || p.category);
    });
    galleryAlbums.forEach((a) => {
      if (a.category) map.set(a.category, a.categoryBn || a.category);
    });
    return Array.from(map.entries()).map(([id, bn]) => ({
      id,
      en: id,
      bn,
    }));
  }, [galleryPhotos, galleryAlbums]);

  // Filtered Albums (sorted by priority in AppContext)
  const filteredAlbums = useMemo(() => {
    return galleryAlbums.filter((alb) => {
      return selectedCategory === 'all' || alb.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [galleryAlbums, selectedCategory]);

  // Filtered Single Media items (showAsSingle !== false, sorted by priority)
  const filteredSingleMedia = useMemo(() => {
    return galleryPhotos.filter((item) => {
      if (item.showAsSingle === false) return false;
      const matchesCat =
        selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesType =
        mediaTypeFilter === 'all' || (item.mediaType || 'photo') === mediaTypeFilter;
      return matchesCat && matchesType;
    });
  }, [galleryPhotos, selectedCategory, mediaTypeFilter]);

  // Media list inside currently opened album
  const activeAlbumMedia = useMemo(() => {
    if (!activeAlbum) return [];
    return galleryPhotos.filter((p) => p.albumId === activeAlbum.id);
  }, [activeAlbum, galleryPhotos]);

  // Determine which array the lightbox is currently navigating
  const currentLightboxList = activeAlbum ? activeAlbumMedia : filteredSingleMedia;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && currentLightboxList.length > 0) {
      setLightboxIndex(
        (lightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && currentLightboxList.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % currentLightboxList.length);
    }
  };

  const toggleInlinePlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingInlineIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMediaCard = (item: GalleryPhoto, index: number) => {
    const isVideo = item.mediaType === 'video';
    const isYouTube =
      isVideo && (item.videoSource === 'youtube' || (item.videoUrl && isYouTubeUrl(item.videoUrl)));
    const isPlayingInline = Boolean(playingInlineIds[item.id]);

    return (
      <div
        key={item.id}
        onClick={() => setLightboxIndex(index)}
        className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 aspect-4/3 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
      >
        {isVideo && isPlayingInline && item.videoUrl ? (
          <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
            {isYouTube ? (
              <iframe
                src={`${getYouTubeEmbedUrl(item.videoUrl)}?autoplay=1`}
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={item.videoUrl}
                poster={item.image}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <>
            <img
              src={item.image}
              alt={language === 'bn' ? item.titleBn : item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Top Left Badges */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                  isVideo ? 'bg-rose-600 text-white' : 'bg-[#04345c]/90 text-white backdrop-blur-xs'
                }`}
              >
                {isVideo ? (
                  isYouTube ? (
                    <>
                      <Youtube className="w-3 h-3" />
                      <span>YouTube</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </>
                  )
                ) : (
                  <>
                    <ImageIcon className="w-3 h-3" />
                    <span>{language === 'bn' ? item.categoryBn || item.category : item.category}</span>
                  </>
                )}
              </span>
            </div>

            {/* Center Play Button for Videos or Zoom Icon for Photos */}
            {isVideo ? (
              <button
                type="button"
                onClick={(e) => toggleInlinePlay(item.id, e)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-rose-600/95 hover:bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition cursor-pointer"
                title={language === 'bn' ? 'এখানেই ভিডিও চালান (Iframe)' : 'Play Video Inline (Iframe)'}
              >
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </button>
            ) : (
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            )}

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-[11px] text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
                <span>•</span>
                <span>{language === 'bn' ? item.categoryBn || item.category : item.category}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold leading-snug line-clamp-2">
                {language === 'bn' ? item.titleBn : item.title}
              </h3>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="py-12 min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#04345c]/10 text-[#04345c]">
              <Camera className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? 'ফটো, ভিডিও ও অ্যালবাম আর্কাইভ'
                  : 'Photo, Video & Album Portfolio'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {language === 'bn'
                ? 'জাগৃতি ফটো ও ভিডিও গ্যালারি'
                : 'Moments of Humanitarian Impact'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {language === 'bn'
                ? 'আমাদের মাঠপর্যায়ের কর্মসূচির অ্যালবাম, একক আলোকচিত্র এবং ডকুমেন্টারি ভিডিও (YouTube ও সরাসরি আপলোড)।'
                : 'Explore curated event albums, single field photographs, and embedded documentary videos from across Bangladesh.'}
            </p>
          </div>

          {/* Main Portfolio View Mode Switcher: Both vs Albums vs Single Media */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs self-start flex-wrap">
            <button
              type="button"
              onClick={() => setPortfolioView('both')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                portfolioView === 'both'
                  ? 'bg-[#04345c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অ্যালবাম ও একক সব' : 'All (Albums & Singles)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPortfolioView('albums')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                portfolioView === 'albums'
                  ? 'bg-[#10564f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? `অ্যালবাম (${filteredAlbums.length})`
                  : `Albums (${filteredAlbums.length})`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPortfolioView('singles')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                portfolioView === 'singles'
                  ? 'bg-[#1e77bd] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>
                {language === 'bn'
                  ? `একক ছবি ও ভিডিও (${filteredSingleMedia.length})`
                  : `Single Media (${filteredSingleMedia.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Category & Media Type Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#04345c] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-[#04345c] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>

          {portfolioView !== 'albums' && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
              {(['all', 'photo', 'video'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMediaTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    mediaTypeFilter === type
                      ? 'bg-white text-[#04345c] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'video' && <Video className="w-3.5 h-3.5 text-rose-600" />}
                  {type === 'photo' && <ImageIcon className="w-3.5 h-3.5 text-[#1e77bd]" />}
                  <span>
                    {type === 'all'
                      ? language === 'bn'
                        ? 'ছবি ও ভিডিও'
                        : 'All Media'
                      : type === 'photo'
                      ? language === 'bn'
                        ? 'শুধু ছবি'
                        : 'Photos'
                      : language === 'bn'
                      ? 'ভিডিও / YouTube'
                      : 'Videos'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 1: CURATED PHOTO & VIDEO ALBUMS */}
        {(portfolioView === 'both' || portfolioView === 'albums') && filteredAlbums.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <FolderHeart className="w-5 h-5 text-[#10564f]" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'bn' ? 'বিশেষ ফটো ও ভিডিও অ্যালবাম' : 'Curated Photo & Video Albums'}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredAlbums.length} {language === 'bn' ? 'টি অ্যালবাম' : 'Albums'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => {
                const itemsInAlbum = galleryPhotos.filter((p) => p.albumId === album.id);
                const videoCount = itemsInAlbum.filter((p) => p.mediaType === 'video').length;
                const photoCount = itemsInAlbum.length - videoCount;

                return (
                  <div
                    key={album.id}
                    onClick={() => setActiveAlbum(album)}
                    className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-56 bg-slate-900 overflow-hidden">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10564f] text-white shadow-xs flex items-center gap-1">
                            <FolderHeart className="w-3 h-3" />
                            <span>{language === 'bn' ? 'অ্যালবাম' : 'Album'}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {language === 'bn' ? album.categoryBn || album.category : album.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                          <span>{album.date}</span>
                          <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px]">
                            {photoCount} {language === 'bn' ? 'টি ছবি' : 'Photos'}
                            {videoCount > 0
                              ? ` • ${videoCount} ${language === 'bn' ? 'টি ভিডিও' : 'Videos'}`
                              : ''}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#04345c] transition">
                          {language === 'bn' ? album.titleBn : album.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {language === 'bn' ? album.descriptionBn : album.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#04345c]">
                      <span>{language === 'bn' ? 'অ্যালবামটি খুলুন' : 'Open Complete Album'}</span>
                      <span>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: SINGLE PHOTOS & VIDEOS GRID */}
        {(portfolioView === 'both' || portfolioView === 'singles') && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-[#04345c]" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'bn'
                    ? 'একক আলোকচিত্র ও ডকুমেন্টারি ভিডিও'
                    : 'Single Photos & Documentary Videos'}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredSingleMedia.length} {language === 'bn' ? 'টি মিডিয়া' : 'Items'}
              </span>
            </div>

            {filteredSingleMedia.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {language === 'bn' ? 'কোনো ছবি বা ভিডিও পাওয়া যায়নি' : 'No photos or videos found'}
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSingleMedia.map((item, index) => renderMediaCard(item, index))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ALBUM DRAWER / MODAL */}
      {activeAlbum && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveAlbum(null)}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-[#04345c] text-white flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#bad3e4] font-bold uppercase tracking-wider mb-1">
                  <FolderHeart className="w-4 h-4" />
                  <span>{language === 'bn' ? activeAlbum.categoryBn : activeAlbum.category}</span>
                  <span>•</span>
                  <span>{activeAlbum.date}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold">
                  {language === 'bn' ? activeAlbum.titleBn : activeAlbum.title}
                </h3>
                <p className="text-xs text-slate-200 mt-1 max-w-3xl">
                  {language === 'bn' ? activeAlbum.descriptionBn : activeAlbum.description}
                </p>
              </div>
              <button
                onClick={() => setActiveAlbum(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {activeAlbumMedia.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm">
                  {language === 'bn'
                    ? 'এই অ্যালবামে এখনো কোনো ছবি বা ভিডিও যোগ করা হয়নি।'
                    : 'No photos or videos assigned to this album yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeAlbumMedia.map((item, idx) => renderMediaCard(item, idx))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL (Supports both Images and YouTube Iframe / Video) */}
      {lightboxIndex !== null && currentLightboxList[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const activeItem = currentLightboxList[lightboxIndex];
              const isVideo = activeItem.mediaType === 'video';
              const isYT =
                isVideo &&
                (activeItem.videoSource === 'youtube' ||
                  (activeItem.videoUrl && isYouTubeUrl(activeItem.videoUrl)));

              return (
                <>
                  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                    {isVideo && activeItem.videoUrl ? (
                      isYT ? (
                        <div className="aspect-video w-full">
                          <iframe
                            src={`${getYouTubeEmbedUrl(activeItem.videoUrl)}?autoplay=1`}
                            title={activeItem.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <video
                          src={activeItem.videoUrl}
                          poster={activeItem.image}
                          controls
                          autoPlay
                          className="w-full max-h-[75vh] object-contain mx-auto"
                        />
                      )
                    ) : (
                      <img
                        src={activeItem.image}
                        alt={activeItem.title}
                        className="w-full max-h-[75vh] object-contain mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white px-2">
                    <div>
                      <h3 className="text-lg font-bold">
                        {language === 'bn' ? activeItem.titleBn : activeItem.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          {language === 'bn'
                            ? activeItem.categoryBn || activeItem.category
                            : activeItem.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {activeItem.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {lightboxIndex + 1} / {currentLightboxList.length}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
