import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  X,
  Youtube,
  Video,
  Image as ImageIcon,
  FolderUp,
} from 'lucide-react';
import {
  uploadMediaToFirebaseStorage,
  StorageFolder,
  getYoutubeEmbedUrl,
  getYoutubeThumbnailUrl,
} from '../../services/firebaseStorageService';

interface MediaUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string, storagePath?: string) => void;
  storageFolder: StorageFolder;
  mediaType?: 'image' | 'video';
  storagePath?: string;
  videoSource?: 'upload' | 'youtube';
  onVideoSourceChange?: (source: 'upload' | 'youtube') => void;
  onAutoThumbnail?: (thumbnailUrl: string) => void;
  required?: boolean;
  language?: 'en' | 'bn';
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  value,
  onChange,
  storageFolder,
  mediaType = 'image',
  storagePath,
  videoSource = 'youtube',
  onVideoSourceChange,
  onAutoThumbnail,
  required = false,
  language = 'en',
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'link'>(() => {
    if (mediaType === 'video') {
      return videoSource === 'upload' ? 'upload' : 'link';
    }
    return value && value.startsWith('data:') ? 'upload' : 'upload';
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStoragePath, setCurrentStoragePath] = useState<string>(storagePath || '');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি বৈধ ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।'
          : 'Please select a valid image file (JPG, PNG, WEBP).'
      );
      return;
    }

    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setErrorMsg(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি বৈধ ভিডিও ফাইল (MP4, WEBM) নির্বাচন করুন।'
          : 'Please select a valid video file (MP4, WEBM).'
      );
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      const result = await uploadMediaToFirebaseStorage(file, storageFolder, (pct) => {
        setProgress(pct);
      });
      setCurrentStoragePath(result.storagePath);
      onChange(result.url, result.storagePath);
      if (mediaType === 'video' && onVideoSourceChange) {
        onVideoSourceChange('upload');
      }
    } catch (err) {
      setErrorMsg(
        language === 'bn' ? 'ফাইল আপলোড ব্যর্থ হয়েছে।' : 'Failed to upload file to storage.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setErrorMsg('');
    setCurrentStoragePath('');
    onChange(newUrl, '');

    if (mediaType === 'video') {
      if (onVideoSourceChange) {
        onVideoSourceChange('youtube');
      }
      const ytThumb = getYoutubeThumbnailUrl(newUrl);
      if (ytThumb && onAutoThumbnail) {
        onAutoThumbnail(ytThumb);
      }
    }
  };

  const ytEmbedUrl = mediaType === 'video' ? getYoutubeEmbedUrl(value) : null;

  return (
    <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
      {/* Top Bar: Label & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
          {mediaType === 'video' ? (
            <Video className="w-3.5 h-3.5 text-[#1e77bd]" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-[#10564f]" />
          )}
          <span>
            {label} {required && <span className="text-rose-600">*</span>}
          </span>
        </label>

        {/* Segmented Control: Upload vs Link */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-200/80 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setInputMode('upload');
              if (mediaType === 'video' && onVideoSourceChange) {
                onVideoSourceChange('upload');
              }
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
              inputMode === 'upload'
                ? 'bg-[#04345c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            <span>
              {mediaType === 'video'
                ? language === 'bn'
                  ? 'ভিডিও আপলোড (Firebase)'
                  : 'Upload Video (Firebase)'
                : language === 'bn'
                ? 'ছবি আপলোড (Firebase)'
                : 'Upload Photo (Firebase)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInputMode('link');
              if (mediaType === 'video' && onVideoSourceChange) {
                onVideoSourceChange('youtube');
              }
            }}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer whitespace-nowrap ${
              inputMode === 'link'
                ? 'bg-[#04345c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {mediaType === 'video' ? (
              <Youtube className="w-3 h-3" />
            ) : (
              <LinkIcon className="w-3 h-3" />
            )}
            <span>
              {mediaType === 'video'
                ? language === 'bn'
                  ? 'YouTube লিঙ্ক (iFrame)'
                  : 'YouTube Link (iFrame)'
                : language === 'bn'
                ? 'ডিরেক্ট লিঙ্ক (URL)'
                : 'Direct Link (URL)'}
            </span>
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload to Firebase Storage */}
      {inputMode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={mediaType === 'video' ? 'video/mp4,video/webm,video/ogg' : 'image/*'}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#1e77bd] bg-white rounded-xl p-4 text-center cursor-pointer transition group"
          >
            <FolderUp className="w-6 h-6 text-[#1e77bd] mx-auto mb-1.5 group-hover:scale-105 transition" />
            <div className="text-xs font-bold text-slate-700">
              {uploading
                ? language === 'bn'
                  ? `Firebase Storage-এ আপলোড হচ্ছে... (${progress}%)`
                  : `Uploading to Firebase Storage... (${progress}%)`
                : language === 'bn'
                ? 'কম্পিউটার বা ফোন থেকে ফাইল নির্বাচন করতে ক্লিক করুন'
                : 'Click to select file from device to upload to Firebase Storage'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Target Bucket: gs://jagreeti-foundation.appspot.com/{storageFolder}/
            </div>

            {uploading && (
              <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#10564f] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Also allow pasting URL right below if needed */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 shrink-0">
              {language === 'bn' ? 'অথবা লিঙ্ক:' : 'Or URL:'}
            </span>
            <input
              type="text"
              value={value.startsWith('data:') ? '' : value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={
                mediaType === 'video'
                  ? 'https://www.youtube.com/watch?v=...'
                  : 'https://...'
              }
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] focus:outline-none focus:ring-1 focus:ring-[#1e77bd]"
            />
          </div>
        </div>
      ) : (
        /* Mode 2: Direct URL or YouTube Link */
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="url"
              required={required && !value}
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={
                mediaType === 'video'
                  ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                  : 'https://example.com/photo.jpg'
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#1e77bd]"
            />
          </div>
          {mediaType === 'video' && (
            <p className="text-[10px] text-slate-500">
              {language === 'bn'
                ? 'যেকোনো YouTube ভিডিও লিঙ্ক দিলে সেটি স্বয়ংক্রিয়ভাবে মূল পোর্টফোলিওতে iFrame প্লেয়ারে যুক্ত হবে।'
                : 'Paste any YouTube watch, share, or shorts URL — it will automatically render as an embedded iFrame in the main portfolio.'}
            </p>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-rose-600 font-semibold">{errorMsg}</p>}

      {/* Live Media Preview */}
      {value && (
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {currentStoragePath
                ? `Saved in Firebase Storage (${currentStoragePath.split('/').slice(-2).join('/')})`
                : mediaType === 'video' && ytEmbedUrl
                ? 'YouTube iFrame Embed Ready'
                : 'Media Linked Ready'}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentStoragePath('');
                onChange('', '');
              }}
              className="text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
            >
              <X className="w-3 h-3" />
              <span>{language === 'bn' ? 'সরান' : 'Clear'}</span>
            </button>
          </div>

          {mediaType === 'image' ? (
            <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
              <img
                src={value}
                alt="Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : ytEmbedUrl ? (
            <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black">
              <iframe
                src={ytEmbedUrl}
                title="YouTube video preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-black">
              <video src={value} controls className="w-full max-h-44 object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
