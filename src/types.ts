export type Language = 'en' | 'bn';

export type PaletteId = 'emerald' | 'crimson' | 'nordic' | 'obsidian';

export interface ColorPalette {
  id: PaletteId;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  accentHover: string;
  bgPage: string;
  bgSurface: string;
  textMain: string;
  textMuted: string;
  borderColor: string;
  gradientHero: string;
  badgeBg: string;
  badgeText: string;
  vibe: { en: string; bn: string };
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  name: string;
  nameBn?: string;
  bloodGroup: BloodGroup;
  phone: string;
  whatsapp?: string;
  district?: string;
  upazila?: string;
  location?: string;
  locationBn?: string;
  lastDonationDate?: string;
  lastDonated?: string;
  lastDonatedBn?: string;
  available: boolean;
  isAvailable?: boolean;
  totalDonations: number;
  verified: boolean;
}

export interface CommitteeGroup {
  id: string;
  name: string;
  nameBn: string;
  description?: string;
  descriptionBn?: string;
  priority: number;
}

export interface CommitteeMember {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  category: string;
  tags?: string[];
  groupId?: string;
  priority?: number;
  phone?: string;
  email?: string;
  image: string;
  storagePath?: string;
  institution?: string;
  term?: string;
  bio: { en: string; bn: string };
}

export interface DignitaryMessage {
  id: string;
  type: string;
  priority?: number;
  title: string;
  titleBn: string;
  name: string;
  nameBn: string;
  designation: string;
  designationBn: string;
  role?: string;
  roleBn?: string;
  academicBackground?: string;
  academicBackgroundBn?: string;
  image: string;
  storagePath?: string;
  quote: string;
  quoteBn: string;
  fullMessage: string;
  fullMessageBn: string;
  message?: string;
  messageBn?: string;
  date?: string;
}

export interface ProjectItem {
  id: string;
  priority?: number;
  title: string;
  titleBn: string;
  category: string;
  categoryBn?: string;
  description: string;
  descriptionBn: string;
  targetAmount?: number;
  raisedAmount?: number;
  beneficiaries: number | string;
  beneficiariesBn?: string;
  location: string;
  locationBn?: string;
  date?: string;
  dateBn?: string;
  budget?: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  image: string;
  storagePath?: string;
  startDate?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  category: string;
  summary: string;
  summaryBn: string;
  content: string;
  contentBn: string;
  image?: string;
  storagePath?: string;
  attachmentType?: 'pdf' | 'image';
  attachmentName?: string;
  isUrgent?: boolean;
}

export interface GalleryAlbum {
  id: string;
  priority?: number;
  title: string;
  titleBn: string;
  description?: string;
  descriptionBn?: string;
  category: string;
  categoryBn?: string;
  coverImage: string;
  storagePath?: string;
  date: string;
}

export interface GalleryPhoto {
  id: string;
  priority?: number;
  title: string;
  titleBn: string;
  caption?: string;
  captionBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  category: string;
  categoryBn?: string;
  mediaType?: 'photo' | 'video';
  image: string;
  imageUrl?: string;
  videoUrl?: string;
  videoSource?: 'upload' | 'youtube' | 'link';
  albumId?: string;
  showAsSingle?: boolean;
  storagePath?: string;
  date: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  trxId: string;
  phone: string;
  cause: string;
  date: string;
  status: 'verified' | 'pending';
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  wing?: string;
  skills: string;
  district: string;
  institution: string;
  motivation?: string;
  status: 'approved' | 'pending';
  appliedDate: string;
}

export interface ProgramItem {
  id: string;
  priority?: number;
  category?: string;
  title: string;
  titleBn: string;
  desc: string;
  descBn: string;
  impact: string;
  impactBn?: string;
  image: string;
  storagePath?: string;
  highlights: string[];
  highlightsBn: string[];
}

export interface CustomCategoriesMap {
  gallery: string[];
  galleryCategories: string[];
  projects: string[];
  projectCategories: string[];
  programs: string[];
  programCategories: string[];
  notices: string[];
  noticeCategories: string[];
  committeeTags: string[];
  committeeRoles: string[];
  dignitaryRoles: string[];
  donations: string[];
  donationCauses: string[];
}

export interface SiteSettings {
  heroHeadlineEn: string;
  heroHeadlineBn: string;
  heroSubheadlineEn: string;
  heroSubheadlineBn: string;
  tickerTextEn: string;
  tickerTextBn: string;
  heroCarouselIntervalSeconds?: number;
  beneficiariesCount: number;
  bloodBagsArrangedCount: number;
  volunteersCount: number;
  treesPlantedCount: number;
  scholarshipStudentsCount: number;
  contactPhone: string;
  contactEmail: string;
  emergencyHotline: string;
  officeAddressEn: string;
  officeAddressBn: string;
  facebookUrl: string;
  historyP1En: string;
  historyP1Bn: string;
  historyP2En: string;
  historyP2Bn: string;
  missionEn: string;
  missionBn: string;
  visionEn: string;
  visionBn: string;
}

export interface UserGoal {
  id: string;
  title: string;
  titleBn: string;
  category: 'blood' | 'volunteer_hours' | 'donation' | 'trees' | 'mentoring' | 'tree' | 'hours';
  currentValue?: number;
  current?: number;
  targetValue?: number;
  target?: number;
  unit: string;
  unitBn?: string;
  completed: boolean;
  targetDate?: string;
  deadline?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'member' | 'volunteer' | 'donor' | 'admin' | string;
  joinedDate?: string;
  memberSince?: string;
  district?: string;
  impactScore?: number;
  bloodGroup: string;
  volunteerHours?: number;
  hoursVolunteered?: number;
  donationsCount: number;
  treesPlanted?: number;
  amountContributed?: number;
}
