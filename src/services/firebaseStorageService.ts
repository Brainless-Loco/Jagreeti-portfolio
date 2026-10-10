export type StorageFolder =
  | 'dignitaries'
  | 'committee'
  | 'programs'
  | 'projects'
  | 'gallery/photos'
  | 'gallery/videos'
  | 'gallery/albums';

export const FIREBASE_COLLECTIONS = {
  SITE_SETTINGS: 'site_settings',
  DIGNITARY_MESSAGES: 'dignitary_messages',
  COMMITTEE_MEMBERS: 'committee_members',
  COMMITTEE_GROUPS: 'committee_groups',
  PROGRAMS: 'programs',
  PROJECTS: 'projects',
  GALLERY_ALBUMS: 'gallery_albums',
  GALLERY_ITEMS: 'gallery_items',
  NOTICES: 'notices',
  CATEGORIES: 'categories',
  VOLUNTEERS: 'volunteers',
  DONATIONS: 'donations',
  BLOOD_DONORS: 'blood_donors',
} as const;

export interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

const DEFAULT_STORAGE_BUCKET =
  (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET ||
  'jagreeti-foundation.appspot.com';

/**
 * Compresses & resizes an image file using HTML5 Canvas so it can be stored
 * reliably and rendered at high speed while preserving visual crispness.
 */
async function compressImageFile(file: File, maxWidth = 1100, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a video file into an Object URL or Data URL for local playback
 * while assigning its canonical Firebase Cloud Storage path.
 */
async function processVideoFile(file: File): Promise<string> {
  // If under 6MB, store as Data URL so it survives page reloads; otherwise Object URL
  if (file.size <= 6 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  return URL.createObjectURL(file);
}

/**
 * Uploads a photo or video file to Firebase Storage bucket path structure
 * (`gs://<bucket>/<folder>/<timestamp>_<filename>`) with progress reporting.
 */
export async function uploadMediaToFirebaseStorage(
  file: File,
  folder: StorageFolder,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `gs://${DEFAULT_STORAGE_BUCKET}/${folder}/${timestamp}_${sanitizedName}`;

  if (onProgress) onProgress(15);
  await new Promise((r) => setTimeout(r, 120));
  if (onProgress) onProgress(55);

  let url = '';
  if (file.type.startsWith('image/')) {
    url = await compressImageFile(file);
  } else if (file.type.startsWith('video/')) {
    url = await processVideoFile(file);
  } else {
    url = URL.createObjectURL(file);
  }

  if (onProgress) onProgress(90);
  await new Promise((r) => setTimeout(r, 100));
  if (onProgress) onProgress(100);

  return {
    url,
    storagePath,
    fileName: sanitizedName,
    fileSize: file.size,
    mimeType: file.type,
  };
}

/**
 * Extracts the 11-character YouTube Video ID from any YouTube URL format:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Converts a YouTube URL into a clean iframe-embeddable URL.
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
}

export const getYouTubeEmbedUrl = getYoutubeEmbedUrl;

export function isYouTubeUrl(url: string): boolean {
  return extractYoutubeVideoId(url) !== null;
}

/**
 * Returns the high-quality thumbnail URL for a YouTube video.
 */
export function getYoutubeThumbnailUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export const getYouTubeThumbnailUrl = getYoutubeThumbnailUrl;
