import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Language,
  PaletteId,
  ColorPalette,
  BloodDonor,
  CommitteeMember,
  CommitteeGroup,
  DignitaryMessage,
  ProjectItem,
  NoticeItem,
  GalleryPhoto,
  GalleryAlbum,
  ProgramItem,
  VolunteerApplication,
  SiteSettings,
  DonationRecord,
  UserGoal,
  UserProfile,
  CustomCategoriesMap,
} from '../types';
import { COLOR_PALETTES } from '../data/palettes';
import {
  INITIAL_DONORS,
  INITIAL_COMMITTEE,
  INITIAL_COMMITTEE_GROUPS,
  INITIAL_DIGNITARY_MESSAGES,
  INITIAL_PROJECTS,
  INITIAL_NOTICES,
  INITIAL_GALLERY,
  INITIAL_GALLERY_ALBUMS,
  INITIAL_PROGRAMS,
  INITIAL_VOLUNTEERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_DONATIONS,
  INITIAL_USER_GOALS,
  INITIAL_USER_PROFILE,
  INITIAL_CUSTOM_CATEGORIES,
} from '../data/initialData';
import { translations } from '../translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
  paletteId: PaletteId;
  currentPalette: ColorPalette;
  setPaletteId: (id: PaletteId) => void;
  activePage: string;
  setActivePage: (page: string) => void;

  // Custom Categories & Tags Autocomplete Registry (Firestore: categories/registry)
  customCategories: CustomCategoriesMap;
  addCustomCategory: (domain: keyof CustomCategoriesMap, value: string) => void;

  // Site Settings (Firestore: site_settings/global)
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Dignitary Messages (Firestore: dignitary_messages)
  dignitaryMessages: DignitaryMessage[];
  addDignitaryMessage: (msg: Omit<DignitaryMessage, 'id'>) => void;
  updateDignitaryMessage: (id: string, updated: Partial<DignitaryMessage>) => void;
  deleteDignitaryMessage: (id: string) => void;
  reorderDignitaryMessage: (id: string, direction: 'up' | 'down') => void;

  // Committee Members & Optional Groups (Firestore: committee_members & committee_groups)
  committee: CommitteeMember[];
  addCommitteeMember: (member: Omit<CommitteeMember, 'id'>) => void;
  updateCommitteeMember: (id: string, updated: Partial<CommitteeMember>) => void;
  deleteCommitteeMember: (id: string) => void;
  reorderCommitteeMember: (id: string, direction: 'up' | 'down') => void;

  committeeGroups: CommitteeGroup[];
  addCommitteeGroup: (group: Omit<CommitteeGroup, 'id'>) => void;
  updateCommitteeGroup: (id: string, updated: Partial<CommitteeGroup>) => void;
  deleteCommitteeGroup: (id: string) => void;
  reorderCommitteeGroup: (id: string, direction: 'up' | 'down') => void;

  // Programs & Wings (Firestore: programs)
  programs: ProgramItem[];
  addProgram: (prog: Omit<ProgramItem, 'id'>) => void;
  updateProgram: (id: string, updated: Partial<ProgramItem>) => void;
  deleteProgram: (id: string) => void;
  reorderProgram: (id: string, direction: 'up' | 'down') => void;

  // Projects & Campaigns (Firestore: projects)
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  addProject: (proj: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  reorderProject: (id: string, direction: 'up' | 'down') => void;
  contributeToProject: (id: string, amount: number) => void;

  // Notices & Circulars (Firestore: notices - sorted by date DESC)
  notices: NoticeItem[];
  addNotice: (notice: Omit<NoticeItem, 'id'>) => void;
  updateNotice: (id: string, updated: Partial<NoticeItem>) => void;
  deleteNotice: (id: string) => void;

  // Gallery Items & Albums (Firestore: gallery_items & gallery_albums)
  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  updateGalleryPhoto: (id: string, updated: Partial<GalleryPhoto>) => void;
  deleteGalleryPhoto: (id: string) => void;
  reorderGalleryPhoto: (id: string, direction: 'up' | 'down') => void;

  galleryAlbums: GalleryAlbum[];
  addGalleryAlbum: (album: Omit<GalleryAlbum, 'id'>) => string;
  updateGalleryAlbum: (id: string, updated: Partial<GalleryAlbum>) => void;
  deleteGalleryAlbum: (id: string) => void;
  reorderGalleryAlbum: (id: string, direction: 'up' | 'down') => void;

  // Volunteers (Firestore: volunteers)
  volunteers: VolunteerApplication[];
  addVolunteer: (vol: Omit<VolunteerApplication, 'id' | 'status' | 'appliedDate'>) => void;
  approveVolunteer: (id: string) => void;
  deleteVolunteer: (id: string) => void;

  // Donations & Audit (Firestore: donations)
  donations: DonationRecord[];
  addDonation: (donation: Omit<DonationRecord, 'id' | 'status' | 'date'>) => void;
  updateDonation: (id: string, updated: Partial<DonationRecord>) => void;
  verifyDonation: (id: string) => void;
  deleteDonation: (id: string) => void;

  // Donors (Firestore: blood_donors)
  donors: BloodDonor[];
  bloodDonors: BloodDonor[];
  addDonor: (donor: Omit<BloodDonor, 'id' | 'verified'>) => void;
  toggleDonorAvailability: (id: string) => void;
  deleteDonor: (id: string) => void;
  resetToDefaults: () => void;

  // User Goals & Profile
  userGoals: UserGoal[];
  addGoal: (goal: Omit<UserGoal, 'id' | 'completed'>) => void;
  updateGoalProgress: (id: string, delta: number) => void;
  toggleGoalComplete: (id: string) => void;
  deleteGoal: (id: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  emergencySosOpen: boolean;
  setEmergencySosOpen: (open: boolean) => void;
  paletteModalOpen: boolean;
  setPaletteModalOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toasts: Toast[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function sortByPriority<T extends { priority?: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
}

function swapPriorityInList<T extends { id: string; priority?: number }>(
  list: T[],
  id: string,
  direction: 'up' | 'down'
): T[] {
  const sorted = sortByPriority(list).map((item, idx) => ({
    ...item,
    priority: idx + 1,
  }));
  const currentIndex = sorted.findIndex((item) => item.id === id);
  if (currentIndex === -1) return sorted;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return sorted;

  const tempPriority = sorted[currentIndex].priority;
  sorted[currentIndex].priority = sorted[targetIndex].priority;
  sorted[targetIndex].priority = tempPriority;

  return sortByPriority(sorted);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('jagreeti_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const [paletteId, setPaletteIdState] = useState<PaletteId>(() => {
    const saved = localStorage.getItem('jagreeti_palette');
    return (saved as PaletteId) || 'emerald';
  });

  const [activePage, setActivePage] = useState<string>('home');

  // Custom Categories Registry
  const [customCategories, setCustomCategories] = useState<CustomCategoriesMap>(() => {
    const saved = localStorage.getItem('jagreeti_custom_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_CUSTOM_CATEGORIES,
          ...parsed,
          gallery: parsed.gallery || parsed.galleryCategories || INITIAL_CUSTOM_CATEGORIES.gallery,
          galleryCategories:
            parsed.galleryCategories || parsed.gallery || INITIAL_CUSTOM_CATEGORIES.galleryCategories,
          projects: parsed.projects || parsed.projectCategories || INITIAL_CUSTOM_CATEGORIES.projects,
          projectCategories:
            parsed.projectCategories || parsed.projects || INITIAL_CUSTOM_CATEGORIES.projectCategories,
          programs: parsed.programs || parsed.programCategories || INITIAL_CUSTOM_CATEGORIES.programs,
          programCategories:
            parsed.programCategories || parsed.programs || INITIAL_CUSTOM_CATEGORIES.programCategories,
          notices: parsed.notices || parsed.noticeCategories || INITIAL_CUSTOM_CATEGORIES.notices,
          noticeCategories:
            parsed.noticeCategories || parsed.notices || INITIAL_CUSTOM_CATEGORIES.noticeCategories,
          donations: parsed.donations || parsed.donationCauses || INITIAL_CUSTOM_CATEGORIES.donations,
          donationCauses:
            parsed.donationCauses || parsed.donations || INITIAL_CUSTOM_CATEGORIES.donationCauses,
        };
      } catch {
        return INITIAL_CUSTOM_CATEGORIES;
      }
    }
    return INITIAL_CUSTOM_CATEGORIES;
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('jagreeti_site_settings');
    if (saved) {
      try {
        return { ...INITIAL_SITE_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return INITIAL_SITE_SETTINGS;
      }
    }
    return INITIAL_SITE_SETTINGS;
  });

  // Dignitary Messages
  const [rawDignitaryMessages, setDignitaryMessages] = useState<DignitaryMessage[]>(() => {
    const saved = localStorage.getItem('jagreeti_dignitaries');
    const source: any[] = saved
      ? (() => {
          try {
            return JSON.parse(saved);
          } catch {
            return INITIAL_DIGNITARY_MESSAGES;
          }
        })()
      : INITIAL_DIGNITARY_MESSAGES;

    return source.map((m, idx) => ({
      ...m,
      name: m.name || m.authorEn || m.authorBn || '',
      nameBn: m.nameBn || m.authorBn || m.authorEn || '',
      title: m.title || m.titleEn || m.titleBn || '',
      titleBn: m.titleBn || m.title || '',
      designation: m.designation || m.role || m.designationEn || m.designationBn || '',
      designationBn: m.designationBn || m.roleBn || m.designation || '',
      role: m.role || m.designation || '',
      roleBn: m.roleBn || m.designationBn || '',
      image: m.image || m.photoUrl || '',
      quote: m.quote || m.quoteEn || m.quoteBn || m.message || '',
      quoteBn: m.quoteBn || m.quote || m.messageBn || '',
      fullMessage: m.fullMessage || m.messageEn || m.message || m.quote || '',
      fullMessageBn: m.fullMessageBn || m.messageBn || m.fullMessage || m.quoteBn || '',
      message: m.message || m.quote || m.fullMessage || '',
      messageBn: m.messageBn || m.quoteBn || m.fullMessageBn || '',
      priority: m.priority ?? idx + 1,
    }));
  });

  // Committee Groups
  const [rawCommitteeGroups, setCommitteeGroups] = useState<CommitteeGroup[]>(() => {
    const saved = localStorage.getItem('jagreeti_committee_groups');
    return saved ? JSON.parse(saved) : INITIAL_COMMITTEE_GROUPS;
  });

  // Committee Members
  const [rawCommittee, setCommittee] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem('jagreeti_committee');
    if (saved) {
      try {
        const parsed: CommitteeMember[] = JSON.parse(saved);
        return parsed.map((m, idx) => ({
          ...m,
          priority: m.priority ?? idx + 1,
          tags:
            m.tags && m.tags.length > 0
              ? m.tags
              : m.category === 'advisory'
              ? ['Advisory Board']
              : m.category === 'subcommittee'
              ? ['Wing Coordinator']
              : ['Executive Council'],
          groupId:
            m.groupId !== undefined
              ? m.groupId
              : m.category === 'advisory'
              ? 'grp-advisory'
              : m.category === 'subcommittee'
              ? 'grp-coordinators'
              : 'grp-executive',
        }));
      } catch {
        return INITIAL_COMMITTEE;
      }
    }
    return INITIAL_COMMITTEE;
  });

  // Programs
  const [rawPrograms, setPrograms] = useState<ProgramItem[]>(() => {
    const saved = localStorage.getItem('jagreeti_programs');
    if (saved) {
      try {
        const parsed: ProgramItem[] = JSON.parse(saved);
        return parsed.map((p, idx) => ({ ...p, priority: p.priority ?? idx + 1 }));
      } catch {
        return INITIAL_PROGRAMS;
      }
    }
    return INITIAL_PROGRAMS;
  });

  // Projects
  const [rawProjects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem('jagreeti_projects');
    const source: ProjectItem[] = saved
      ? (() => {
          try {
            return JSON.parse(saved);
          } catch {
            return INITIAL_PROJECTS;
          }
        })()
      : INITIAL_PROJECTS;
    return source.map((p, idx) => ({
      ...p,
      priority: p.priority ?? idx + 1,
      categoryBn: p.categoryBn || p.category,
      locationBn: p.locationBn || p.location,
      date: p.date || p.startDate || '2026',
      dateBn: p.dateBn || p.date || p.startDate || '২০২৬',
      beneficiariesBn: p.beneficiariesBn || `${p.beneficiaries}+`,
      budget: p.budget || (p.targetAmount ? `৳ ${p.targetAmount.toLocaleString()}` : undefined),
    }));
  });

  // Notices (Date ordered)
  const [rawNotices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem('jagreeti_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Gallery Albums
  const [rawGalleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>(() => {
    const saved = localStorage.getItem('jagreeti_gallery_albums');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ALBUMS;
  });

  // Gallery Items (Photos & Videos)
  const [rawGalleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('jagreeti_gallery');
    const source: any[] = saved
      ? (() => {
          try {
            return JSON.parse(saved);
          } catch {
            return INITIAL_GALLERY;
          }
        })()
      : INITIAL_GALLERY;
    return source.map((g, idx) => {
      const resolvedImg = g.image || g.imageUrl || '';
      return {
        ...g,
        title: g.title || g.titleEn || g.titleBn || 'Gallery Item',
        titleBn: g.titleBn || g.title || 'গ্যালারি চিত্র',
        categoryBn: g.categoryBn || g.category,
        image: resolvedImg,
        imageUrl: resolvedImg,
        mediaType: g.mediaType || 'photo',
        showAsSingle: g.showAsSingle !== undefined ? g.showAsSingle : true,
        priority: g.priority ?? idx + 1,
      };
    });
  });

  // Volunteers
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(() => {
    const saved = localStorage.getItem('jagreeti_volunteers');
    return saved ? JSON.parse(saved) : INITIAL_VOLUNTEERS;
  });

  // Donations
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('jagreeti_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  // Donors
  const [donors, setDonors] = useState<BloodDonor[]>(() => {
    const saved = localStorage.getItem('jagreeti_donors');
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [userGoals, setUserGoals] = useState<UserGoal[]>(() => {
    const saved = localStorage.getItem('jagreeti_user_goals');
    return saved ? JSON.parse(saved) : INITIAL_USER_GOALS;
  });

  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('jagreeti_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [emergencySosOpen, setEmergencySosOpen] = useState<boolean>(false);
  const [paletteModalOpen, setPaletteModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sorted Views
  const dignitaryMessages = useMemo(
    () => sortByPriority(rawDignitaryMessages),
    [rawDignitaryMessages]
  );
  const committee = useMemo(() => sortByPriority(rawCommittee), [rawCommittee]);
  const committeeGroups = useMemo(
    () => sortByPriority(rawCommitteeGroups),
    [rawCommitteeGroups]
  );
  const programs = useMemo(() => sortByPriority(rawPrograms), [rawPrograms]);
  const projects = useMemo(() => sortByPriority(rawProjects), [rawProjects]);
  const galleryPhotos = useMemo(
    () => sortByPriority(rawGalleryPhotos),
    [rawGalleryPhotos]
  );
  const galleryAlbums = useMemo(
    () => sortByPriority(rawGalleryAlbums),
    [rawGalleryAlbums]
  );

  // Notices sorted chronologically by Date (newest first)
  const notices = useMemo(() => {
    return [...rawNotices].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });
  }, [rawNotices]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('jagreeti_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const setPaletteId = (id: PaletteId) => {
    setPaletteIdState(id);
    localStorage.setItem('jagreeti_palette', id);
  };

  const currentPalette =
    COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentPalette.primary);
    root.style.setProperty('--primary-hover', currentPalette.primaryHover);
    root.style.setProperty('--primary-light', currentPalette.primaryLight);
    root.style.setProperty('--accent-color', currentPalette.accent);
    root.style.setProperty('--accent-hover', currentPalette.accentHover);
    root.style.setProperty('--bg-page', currentPalette.bgPage);
    root.style.setProperty('--bg-surface', currentPalette.bgSurface);
    root.style.setProperty('--text-main', currentPalette.textMain);
    root.style.setProperty('--text-muted', currentPalette.textMuted);
    root.style.setProperty('--border-color', currentPalette.borderColor);

    if (paletteId === 'obsidian') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentPalette, paletteId]);

  // Safe localStorage persistence helper
  const safeSave = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Storage quota warning for ${key}:`, e);
    }
  };

  useEffect(() => safeSave('jagreeti_custom_categories', customCategories), [customCategories]);
  useEffect(() => safeSave('jagreeti_site_settings', siteSettings), [siteSettings]);
  useEffect(() => safeSave('jagreeti_dignitaries', rawDignitaryMessages), [rawDignitaryMessages]);
  useEffect(() => safeSave('jagreeti_committee', rawCommittee), [rawCommittee]);
  useEffect(() => safeSave('jagreeti_committee_groups', rawCommitteeGroups), [rawCommitteeGroups]);
  useEffect(() => safeSave('jagreeti_programs', rawPrograms), [rawPrograms]);
  useEffect(() => safeSave('jagreeti_projects', rawProjects), [rawProjects]);
  useEffect(() => safeSave('jagreeti_notices', rawNotices), [rawNotices]);
  useEffect(() => safeSave('jagreeti_gallery', rawGalleryPhotos), [rawGalleryPhotos]);
  useEffect(() => safeSave('jagreeti_gallery_albums', rawGalleryAlbums), [rawGalleryAlbums]);
  useEffect(() => safeSave('jagreeti_volunteers', volunteers), [volunteers]);
  useEffect(() => safeSave('jagreeti_donations', donations), [donations]);
  useEffect(() => safeSave('jagreeti_donors', donors), [donors]);
  useEffect(() => safeSave('jagreeti_user_goals', userGoals), [userGoals]);
  useEffect(() => safeSave('jagreeti_user_profile', userProfile), [userProfile]);

  // Custom Category Autocomplete Registration
  const addCustomCategory = (domain: keyof CustomCategoriesMap, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setCustomCategories((prev) => {
      const existing = prev[domain] || [];
      const alreadyExists = existing.some(
        (item) => item.toLowerCase() === trimmed.toLowerCase()
      );
      if (alreadyExists) return prev;
      const updatedList = [...existing, trimmed];
      const next = {
        ...prev,
        [domain]: updatedList,
      };
      if (domain === 'gallery' || domain === 'galleryCategories') {
        next.gallery = updatedList;
        next.galleryCategories = updatedList;
      } else if (domain === 'projects' || domain === 'projectCategories') {
        next.projects = updatedList;
        next.projectCategories = updatedList;
      } else if (domain === 'programs' || domain === 'programCategories') {
        next.programs = updatedList;
        next.programCategories = updatedList;
      } else if (domain === 'notices' || domain === 'noticeCategories') {
        next.notices = updatedList;
        next.noticeCategories = updatedList;
      } else if (domain === 'donations' || domain === 'donationCauses') {
        next.donations = updatedList;
        next.donationCauses = updatedList;
      }
      return next;
    });
  };

  // Site Settings CRUD
  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    showToast(
      language === 'bn'
        ? 'ওয়েবসাইটের তথ্য সফলভাবে আপডেট হয়েছে'
        : 'Site content updated successfully',
      'success'
    );
  };

  // Dignitary Messages CRUD + Reorder
  const addDignitaryMessage = (msg: Omit<DignitaryMessage, 'id'>) => {
    const nextPriority = msg.priority ?? rawDignitaryMessages.length + 1;
    const newMsg: DignitaryMessage = {
      ...msg,
      priority: nextPriority,
      id: `msg-${Date.now()}`,
    };
    setDignitaryMessages((prev) => [...prev, newMsg]);
  };

  const updateDignitaryMessage = (id: string, updated: Partial<DignitaryMessage>) => {
    setDignitaryMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  const deleteDignitaryMessage = (id: string) => {
    setDignitaryMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const reorderDignitaryMessage = (id: string, direction: 'up' | 'down') => {
    setDignitaryMessages((prev) => swapPriorityInList(prev, id, direction));
  };

  // Committee Members CRUD + Reorder
  const addCommitteeMember = (member: Omit<CommitteeMember, 'id'>) => {
    const nextPriority = member.priority ?? rawCommittee.length + 1;
    const newMember: CommitteeMember = {
      ...member,
      priority: nextPriority,
      id: `mem-${Date.now()}`,
    };
    if (member.tags) {
      member.tags.forEach((tag) => addCustomCategory('committeeTags', tag));
    }
    setCommittee((prev) => [...prev, newMember]);
  };

  const updateCommitteeMember = (id: string, updated: Partial<CommitteeMember>) => {
    if (updated.tags) {
      updated.tags.forEach((tag) => addCustomCategory('committeeTags', tag));
    }
    setCommittee((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  const deleteCommitteeMember = (id: string) => {
    setCommittee((prev) => prev.filter((m) => m.id !== id));
  };

  const reorderCommitteeMember = (id: string, direction: 'up' | 'down') => {
    setCommittee((prev) => swapPriorityInList(prev, id, direction));
  };

  // Committee Groups CRUD + Reorder
  const addCommitteeGroup = (group: Omit<CommitteeGroup, 'id'>) => {
    const nextPriority = group.priority ?? rawCommitteeGroups.length + 1;
    const newGroup: CommitteeGroup = {
      ...group,
      priority: nextPriority,
      id: `grp-${Date.now()}`,
    };
    setCommitteeGroups((prev) => [...prev, newGroup]);
  };

  const updateCommitteeGroup = (id: string, updated: Partial<CommitteeGroup>) => {
    setCommitteeGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const deleteCommitteeGroup = (id: string) => {
    setCommitteeGroups((prev) => prev.filter((g) => g.id !== id));
    // Detach deleted group from members so members remain in the unified list
    setCommittee((prev) =>
      prev.map((m) => (m.groupId === id ? { ...m, groupId: '' } : m))
    );
  };

  const reorderCommitteeGroup = (id: string, direction: 'up' | 'down') => {
    setCommitteeGroups((prev) => swapPriorityInList(prev, id, direction));
  };

  // Programs CRUD + Reorder
  const addProgram = (prog: Omit<ProgramItem, 'id'>) => {
    const nextPriority = prog.priority ?? rawPrograms.length + 1;
    if (prog.category) addCustomCategory('programs', prog.category);
    const newProg: ProgramItem = {
      ...prog,
      priority: nextPriority,
      id: `prog-${Date.now()}`,
    };
    setPrograms((prev) => [...prev, newProg]);
  };

  const updateProgram = (id: string, updated: Partial<ProgramItem>) => {
    if (updated.category) addCustomCategory('programs', updated.category);
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderProgram = (id: string, direction: 'up' | 'down') => {
    setPrograms((prev) => swapPriorityInList(prev, id, direction));
  };

  // Projects CRUD + Reorder
  const addProject = (newProjData: Omit<ProjectItem, 'id'>) => {
    const nextPriority = newProjData.priority ?? rawProjects.length + 1;
    if (newProjData.category) addCustomCategory('projects', newProjData.category);
    const newProject: ProjectItem = {
      ...newProjData,
      priority: nextPriority,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    if (updated.category) addCustomCategory('projects', updated.category);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const reorderProject = (id: string, direction: 'up' | 'down') => {
    setProjects((prev) => swapPriorityInList(prev, id, direction));
  };

  const contributeToProject = (id: string, amount: number) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, raisedAmount: p.raisedAmount + amount } : p
      )
    );
    showToast(
      language === 'bn'
        ? `৳${amount} অনুদানের জন্য ধন্যবাদ!`
        : `Thank you for contributing ৳${amount}!`,
      'success'
    );
  };

  // Notices CRUD (Date ordered)
  const addNotice = (newNoticeData: Omit<NoticeItem, 'id'>) => {
    if (newNoticeData.category) addCustomCategory('notices', newNoticeData.category);
    const newNotice: NoticeItem = {
      ...newNoticeData,
      id: `not-${Date.now()}`,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const updateNotice = (id: string, updated: Partial<NoticeItem>) => {
    if (updated.category) addCustomCategory('notices', updated.category);
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated } : n))
    );
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Gallery Photos/Videos CRUD + Reorder
  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const nextPriority = photo.priority ?? rawGalleryPhotos.length + 1;
    if (photo.category) addCustomCategory('gallery', photo.category);
    const resolvedImg = photo.image || photo.imageUrl || '';
    const newPhoto: GalleryPhoto = {
      ...photo,
      image: resolvedImg,
      imageUrl: resolvedImg,
      priority: nextPriority,
      id: `gal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setGalleryPhotos((prev) => [...prev, newPhoto]);
  };

  const updateGalleryPhoto = (id: string, updated: Partial<GalleryPhoto>) => {
    if (updated.category) addCustomCategory('gallery', updated.category);
    setGalleryPhotos((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const resolvedImg = updated.image ?? updated.imageUrl ?? g.image ?? g.imageUrl ?? '';
        return { ...g, ...updated, image: resolvedImg, imageUrl: resolvedImg };
      })
    );
  };

  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos((prev) => prev.filter((g) => g.id !== id));
  };

  const reorderGalleryPhoto = (id: string, direction: 'up' | 'down') => {
    setGalleryPhotos((prev) => swapPriorityInList(prev, id, direction));
  };

  // Gallery Albums CRUD + Reorder
  const addGalleryAlbum = (album: Omit<GalleryAlbum, 'id'>): string => {
    const nextPriority = album.priority ?? rawGalleryAlbums.length + 1;
    if (album.category) addCustomCategory('gallery', album.category);
    const newId = `alb-${Date.now()}`;
    const newAlbum: GalleryAlbum = {
      ...album,
      priority: nextPriority,
      id: newId,
    };
    setGalleryAlbums((prev) => [...prev, newAlbum]);
    return newId;
  };

  const updateGalleryAlbum = (id: string, updated: Partial<GalleryAlbum>) => {
    if (updated.category) addCustomCategory('gallery', updated.category);
    setGalleryAlbums((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteGalleryAlbum = (id: string) => {
    setGalleryAlbums((prev) => prev.filter((a) => a.id !== id));
    // Unlink photos from deleted album so they remain as standalone singles
    setGalleryPhotos((prev) =>
      prev.map((g) => (g.albumId === id ? { ...g, albumId: '', showAsSingle: true } : g))
    );
  };

  const reorderGalleryAlbum = (id: string, direction: 'up' | 'down') => {
    setGalleryAlbums((prev) => swapPriorityInList(prev, id, direction));
  };

  // Volunteers CRUD
  const addVolunteer = (vol: Omit<VolunteerApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newVol: VolunteerApplication = {
      ...vol,
      id: `vol-${Date.now()}`,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    setVolunteers((prev) => [newVol, ...prev]);
    showToast(
      language === 'bn' ? 'স্বেচ্ছাসেবী আবেদন জমা হয়েছে' : 'Volunteer application registered',
      'success'
    );
  };

  const approveVolunteer = (id: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'approved' } : v))
    );
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers((prev) => prev.filter((v) => v.id !== id));
  };

  // Donations CRUD
  const addDonation = (donationData: Omit<DonationRecord, 'id' | 'status' | 'date'>) => {
    if (donationData.cause) addCustomCategory('donations', donationData.cause);
    const newDonation: DonationRecord = {
      ...donationData,
      id: `trx-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setDonations((prev) => [newDonation, ...prev]);
  };

  const updateDonation = (id: string, updated: Partial<DonationRecord>) => {
    if (updated.cause) addCustomCategory('donations', updated.cause);
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const verifyDonation = (id: string) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'verified' } : d))
    );
  };

  const deleteDonation = (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  // Donors
  const addDonor = (newDonorData: Omit<BloodDonor, 'id' | 'verified'>) => {
    const newDonor: BloodDonor = {
      ...newDonorData,
      id: `donor-${Date.now()}`,
      verified: true,
    };
    setDonors((prev) => [newDonor, ...prev]);
    showToast(
      language === 'bn' ? 'রক্তদাতা সফলভাবে যোগ হয়েছে!' : 'Donor registered successfully!',
      'success'
    );
  };

  const toggleDonorAvailability = (id: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d))
    );
  };

  const deleteDonor = (id: string) => {
    setDonors((prev) => prev.filter((d) => d.id !== id));
  };

  // Goals
  const addGoal = (newGoalData: Omit<UserGoal, 'id' | 'completed'>) => {
    const newGoal: UserGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
      completed: false,
    };
    setUserGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setUserGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const nextVal = Math.max(0, (g.currentValue ?? 0) + delta);
        const isNowCompleted = nextVal >= (g.targetValue ?? 0);
        return {
          ...g,
          currentValue: nextVal,
          completed: isNowCompleted,
        };
      })
    );
  };

  const toggleGoalComplete = (id: string) => {
    setUserGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              completed: !g.completed,
              currentValue: !g.completed ? g.targetValue : g.currentValue,
            }
          : g
      )
    );
  };

  const deleteGoal = (id: string) => {
    setUserGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfileState((prev) => ({ ...prev, ...profile }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem('jagreeti_custom_categories');
    localStorage.removeItem('jagreeti_site_settings');
    localStorage.removeItem('jagreeti_dignitaries');
    localStorage.removeItem('jagreeti_committee');
    localStorage.removeItem('jagreeti_committee_groups');
    localStorage.removeItem('jagreeti_programs');
    localStorage.removeItem('jagreeti_projects');
    localStorage.removeItem('jagreeti_notices');
    localStorage.removeItem('jagreeti_gallery');
    localStorage.removeItem('jagreeti_gallery_albums');
    localStorage.removeItem('jagreeti_volunteers');
    localStorage.removeItem('jagreeti_donations');
    localStorage.removeItem('jagreeti_donors');
    setCustomCategories(INITIAL_CUSTOM_CATEGORIES);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setDignitaryMessages(INITIAL_DIGNITARY_MESSAGES);
    setCommittee(INITIAL_COMMITTEE);
    setCommitteeGroups(INITIAL_COMMITTEE_GROUPS);
    setPrograms(INITIAL_PROGRAMS);
    setProjects(INITIAL_PROJECTS);
    setNotices(INITIAL_NOTICES);
    setGalleryPhotos(INITIAL_GALLERY);
    setGalleryAlbums(INITIAL_GALLERY_ALBUMS);
    setVolunteers(INITIAL_VOLUNTEERS);
    setDonations(INITIAL_DONATIONS);
    setDonors(INITIAL_DONORS);
    showToast(
      language === 'bn'
        ? 'সকল ডেটা ডিফল্ট অবস্থায় রিসেট করা হয়েছে'
        : 'All data reset to initial defaults',
      'info'
    );
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        paletteId,
        currentPalette,
        setPaletteId,
        activePage,
        setActivePage,

        // Custom Categories
        customCategories,
        addCustomCategory,

        // Site Settings
        siteSettings,
        updateSiteSettings,

        // Dignitaries
        dignitaryMessages,
        addDignitaryMessage,
        updateDignitaryMessage,
        deleteDignitaryMessage,
        reorderDignitaryMessage,

        // Committee & Groups
        committee,
        addCommitteeMember,
        updateCommitteeMember,
        deleteCommitteeMember,
        reorderCommitteeMember,
        committeeGroups,
        addCommitteeGroup,
        updateCommitteeGroup,
        deleteCommitteeGroup,
        reorderCommitteeGroup,

        // Programs
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        reorderProgram,

        // Projects
        projects,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        reorderProject,
        contributeToProject,

        // Notices
        notices,
        addNotice,
        updateNotice,
        deleteNotice,

        // Gallery & Albums
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

        // Volunteers
        volunteers,
        addVolunteer,
        approveVolunteer,
        deleteVolunteer,

        // Donations
        donations,
        addDonation,
        updateDonation,
        verifyDonation,
        deleteDonation,

        // Donors
        donors,
        bloodDonors: donors,
        addDonor,
        toggleDonorAvailability,
        deleteDonor,
        resetToDefaults,

        // Goals & Profile
        userGoals,
        addGoal,
        updateGoalProgress,
        toggleGoalComplete,
        deleteGoal,
        userProfile,
        updateUserProfile,

        emergencySosOpen,
        setEmergencySosOpen,
        paletteModalOpen,
        setPaletteModalOpen,
        showToast,
        toasts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
