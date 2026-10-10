# JAGREETI — Socio-Humanitarian Youth Foundation Platform

A bilingual (**English & বাংলা**) web application and content management system built for **JAGREETI (জাগ্রীতি)**, an apolitical socio-humanitarian youth organization founded in Lalmonirhat, Bangladesh (Est. 2020).

The platform combines a responsive public portfolio with a full-featured **Admin CMS Portal**, **Emergency Blood Donor Network**, **Humanitarian Project & Relief Tracker**, **Unified Committee Directory with Multi-Tagging & Optional Groups**, and **Multi-Mode Photo/Video/Album Gallery** backed by a **Firebase Firestore & Cloud Storage** schema architecture.

---

## Table of Contents

1. [Key Platform Features](#1-key-platform-features)
2. [Tech Stack](#2-tech-stack)
3. [Project Folder Architecture](#3-project-folder-architecture)
4. [Database & Storage Configuration (Firebase)](#4-database--storage-configuration-firebase)
   - [Environment Variables](#41-environment-variables)
   - [Firebase Cloud Storage Hierarchy](#42-firebase-cloud-storage-hierarchy)
   - [Firestore Collections & Schema Reference](#43-firestore-collections--schema-reference)
   - [Sorting & Serialization Rules](#44-sorting--serialization-rules)
   - [Firestore & Storage Security Rules](#45-firestore--storage-security-rules)
5. [Core Architectural Modules](#5-core-architectural-modules)
6. [Admin CMS Portal Guide](#6-admin-cms-portal-guide)
7. [Local Development & Build Commands](#7-local-development--build-commands)

---

## 1. Key Platform Features

### Public Portfolio & Community Modules
- **Bilingual Experience (`EN` / `বাংলা`)**: Instant language switching across all navigation, static labels, and dynamic database records.
- **Dynamic Theme & Color Palettes**: Supports Light/Dark mode alongside 4 curated organizational color palettes (*Emerald Hope*, *Crimson Urgent*, *Nordic Trust*, *Obsidian Gold*).
- **Lightweight Parallax Homepage**: Smooth, hardware-accelerated scroll parallax effects (`translate3d` with `requestAnimationFrame`), live impact counters, urgent circular ticker, dignitary speeches, featured wings, and media highlights.
- **Unified Committee & Leadership Directory**:
  - Displays members in a single priority-serialized list (`priority: 1, 2, 3...`) or grouped by **Optional Serialized Committee Groups**.
  - Each member supports **multiple custom tags** (e.g., `Executive Council`, `Founding Member`, `Advisory Board`, `Scholarship Wing`) for instant filtering.
- **Multimedia Portfolio & Album Gallery**:
  - Supports **Single Media Stream** and **Curated Multi-Item Albums** (`gallery_albums`) side by side.
  - Supports both **Photos** (file upload or external URL) and **Videos** (direct video file upload or **YouTube URL** rendered via responsive `<iframe>` embeds).
- **Emergency Blood Network & SOS Dispatch**: Searchable directory of verified blood donors by blood group (`A+`, `O-`, etc.), district/upazila, and availability status, plus an instant SOS blood request modal.
- **Transparent Donations & Volunteer Registration**: Public submission workflows for bKash/Nagad/Rocket/Bank donations (with Transaction ID verification) and wing-based volunteer onboarding.

### Admin CMS Portal Capabilities
- **Dual-Mode Media Uploader (`MediaUploadInput`)**: Every image/video field across Dignitaries, Committee, Programs, Projects, and Gallery supports both **Direct File Upload** (assigned to Firebase Cloud Storage paths with client-side image compression) and **Direct External/YouTube Link** input.
- **Priority Serialization (`PriorityOrderControl`)**: One-click Up/Down reordering and numeric priority assignment (`#1`, `#2`, `#3`...) for Dignitaries, Committee Members, Committee Groups, Programs, Projects, Gallery Albums, and Gallery Items. *(Notices are automatically ordered chronologically by date).*
- **Smart Category & Tag Autocomplete (`CategoryAutocomplete`)**: Dropdowns across the Admin Panel suggest existing categories/tags and allow admins to create new categories inline only if they do not already exist.
- **Built-in Firebase Schema Explorer**: Interactive documentation tab inside the Admin Panel with one-click JSON export and reset-to-defaults utilities.

---

## 2. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool & Dev Server** | Vite 6 (`@vitejs/plugin-react`) |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) |
| **Icons & UI Primitives** | Lucide React (`lucide-react`), Motion (`motion`), Canvas Confetti |
| **State & Persistence** | React Context API (`AppContext`) with Firestore Collection Mapping & `localStorage` offline persistence |
| **Database & Storage Schema** | Firebase Firestore (12 Collections) + Firebase Cloud Storage (7 Bucket Directories) |

---

## 3. Project Folder Architecture

```text
/
├── .env.example                        # Template for environment variables (Firebase & API keys)
├── FIREBASE_SCHEMA_DOCUMENTATION.md    # Authoritative Firebase Firestore & Storage schema reference
├── README.md                           # Project overview, architecture & setup guide
├── index.html                          # Main HTML entry point & SEO metadata
├── metadata.json                       # Application metadata & capability declarations
├── package.json                        # Dependencies and NPM scripts
├── tsconfig.json                       # TypeScript compiler configuration
├── vite.config.ts                      # Vite bundler and dev server configuration (Port 3000)
└── src/
    ├── main.tsx                        # React DOM root mount
    ├── App.tsx                         # Root layout, page router, parallax scroll wrapper & modals
    ├── index.css                       # Global Tailwind CSS v4 imports & custom utility styles
    ├── types.ts                        # Comprehensive TypeScript interfaces for all 12 collections
    ├── translations.ts                 # Bilingual dictionary (English & Bengali UI strings)
    │
    ├── components/                     # Reusable UI & Admin form components
    │   ├── Navbar.tsx                  # Sticky bilingual header, theme/palette switcher & nav links
    │   ├── Footer.tsx                  # Organizational footer, quick links & hotline info
    │   ├── EmergencySOSModal.tsx       # Urgent blood request & emergency hotline modal
    │   ├── MediaUploadInput.tsx        # Dual-mode media input (File Upload to Storage + URL/YouTube)
    │   ├── CategoryAutocomplete.tsx    # Smart dropdown with deduplicated inline category creation
    │   └── PriorityOrderControl.tsx    # Up/Down arrows + numeric priority badge for list ordering
    │
    ├── context/
    │   └── AppContext.tsx              # Global state store, CRUD actions, priority sorting & persistence
    │
    ├── data/
    │   └── initialData.ts              # Seed data for all collections, groups, albums & categories
    │
    ├── services/
    │   └── firebaseStorageService.ts   # Media compression, Storage path generator & YouTube URL parser
    │
    └── pages/                          # Public views & Admin CMS portal
        ├── HomePage.tsx                # Parallax hero, impact stats, speeches, wings & album preview
        ├── AboutPage.tsx               # History, constitutional principles, mission/vision & speeches
        ├── CommitteePage.tsx           # Unified serialized member directory, tag filter & group view
        ├── ProgramsPage.tsx            # Core operational wings ordered by priority
        ├── ProjectsPage.tsx            # Relief & humanitarian campaigns with fundraising progress
        ├── GalleryPage.tsx             # Single media & Album explorer + YouTube iframe/video lightbox
        ├── NoticesPage.tsx             # Official circulars & announcements sorted by date
        ├── BloodNetworkPage.tsx        # Verified blood donor finder & new donor registration
        ├── VolunteerPage.tsx           # Volunteer application form & wing overview
        ├── DonationPage.tsx            # Transparent donation portal (bKash/Nagad/Rocket/Bank) & ledger
        ├── ContactPage.tsx             # Headquarters contact info, FAQ & inquiry dispatch
        ├── AdminPanelPage.tsx          # Admin CMS shell, authentication gate & tab router
        │
        └── admin/                      # Modular Admin CMS architecture
            ├── AdminLogin.tsx          # Role-based admin authentication screen
            ├── AdminSidebar.tsx        # Collapsible admin navigation sidebar
            └── tabs/
                ├── AdminOverviewTab.tsx        # Live KPIs, pending verifications & quick actions
                ├── AdminHomeTab.tsx            # Hero copy, live impact counters & contact settings
                ├── AdminDignitariesTab.tsx     # Dignitary speeches CRUD, portrait upload & priority
                ├── AdminCommitteeTab.tsx       # Unified members CRUD, multi-tags & optional groups
                ├── AdminProgramsTab.tsx        # Programs/Wings CRUD, cover upload & priority order
                ├── AdminProjectsTab.tsx        # Relief campaigns CRUD, progress & category autocomplete
                ├── AdminGalleryTab.tsx         # Photos, Videos (Upload/YouTube) & Albums manager
                ├── AdminNoticesTab.tsx         # Date-sorted circulars & urgent notice toggles
                ├── AdminDonationsTab.tsx       # Donation verification ledger & blood donor manager
                ├── AdminVolunteersTab.tsx      # Volunteer applicant review & approval pipeline
                ├── AdminSchemaTab.tsx          # Interactive Firebase Firestore & Storage schema viewer
                └── AdminFirebaseSchemaTab.tsx  # Collection export & schema documentation reference
```

---

## 4. Database & Storage Configuration (Firebase)

The platform is engineered around **12 Firebase Firestore Collections** and **7 Firebase Cloud Storage Folders**. By default, the app runs seamlessly with an offline-first persistence layer (`localStorage` synced with `initialData.ts`) and can be connected directly to a live Firebase project via environment variables.

> For full field-by-field JSON schemas, see [`FIREBASE_SCHEMA_DOCUMENTATION.md`](./FIREBASE_SCHEMA_DOCUMENTATION.md).

### 4.1 Environment Variables

Create a `.env` file in the project root (refer to `.env.example`):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
VITE_FIRESTORE_DATABASE_ID="(default)"

# Platform Runtime Variables
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

---

### 4.2 Firebase Cloud Storage Hierarchy

When an administrator uploads a photo or video file in the Admin Panel, `firebaseStorageService.ts` processes the media and assigns it a canonical Firebase Storage path (`gs://<bucket>/<folder>/<timestamp>_<filename>`):

| Media Context | Storage Bucket Path Pattern | Accepted Formats | Max Size |
| :--- | :--- | :--- | :--- |
| **Dignitary Portraits** | `gs://<bucket>/dignitaries/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 5 MB |
| **Committee Member Photos** | `gs://<bucket>/committee/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 5 MB |
| **Programs & Wings Covers** | `gs://<bucket>/programs/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 5 MB |
| **Project Campaign Covers** | `gs://<bucket>/projects/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 5 MB |
| **Gallery Album Covers** | `gs://<bucket>/gallery/albums/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 5 MB |
| **Gallery Photos** | `gs://<bucket>/gallery/photos/{timestamp}_{filename}` | `JPEG`, `PNG`, `WEBP` | 10 MB |
| **Gallery Uploaded Videos** | `gs://<bucket>/gallery/videos/{timestamp}_{filename}` | `MP4`, `WEBM`, `OGG` | 50 MB |

---

### 4.3 Firestore Collections & Schema Reference

| # | Collection Name | Document ID Pattern | Default Sort Order | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `site_settings` | `global` (Singleton) | N/A | Hero headlines (EN/BN), impact counters, history, mission/vision, contact info |
| 2 | `dignitary_messages` | `{messageId}` | `priority ASC` | Chief Advisor, Founder, President & Secretary speeches with uploaded/linked portraits |
| 3 | `committee_members` | `{memberId}` | `priority ASC` | Unified member list with `tags: string[]`, optional `groupId`, photo & bio |
| 4 | `committee_groups` | `{groupId}` | `priority ASC` | Optional organizational groups (e.g., Executive Council, Advisory Board) |
| 5 | `programs` | `{programId}` | `priority ASC` | Core wings & permanent initiatives with bilingual highlights and cover photo |
| 6 | `projects` | `{projectId}` | `priority ASC` | Humanitarian campaigns with target/raised BDT amounts, status & location |
| 7 | `gallery_albums` | `{albumId}` | `priority ASC` | Curated photo/video albums displayed in the portfolio gallery |
| 8 | `gallery_items` | `{itemId}` | `priority ASC` | Single or album-linked photos & videos (`mediaType: 'photo' \| 'video'`, `videoSource: 'youtube' \| 'upload'`) |
| 9 | `notices` | `{noticeId}` | `date DESC` | Official circulars, AGM notices & urgent alerts sorted strictly by date |
| 10 | `categories` | `registry` (Singleton) | Alphabetical | Autocomplete category & tag registry (`gallery`, `projects`, `programs`, `notices`, `committeeTags`, `donations`) |
| 11 | `volunteers` | `{volunteerId}` | `appliedDate DESC` | Volunteer applications (`pending` / `approved`) |
| 12 | `donations` & `blood_donors` | `{id}` | `date DESC` | Financial donation records (`pending` / `verified`) & blood donor directory |

---

### 4.4 Sorting & Serialization Rules

1. **Priority-Serialized Collections (`orderBy('priority', 'asc')`)**:
   - `dignitary_messages`, `committee_members`, `committee_groups`, `programs`, `projects`, `gallery_albums`, and `gallery_items` all include a numeric `priority` field (`1, 2, 3...`).
   - Reordering items in the Admin Panel automatically normalizes priorities and updates the public portfolio immediately.
2. **Chronological Collections (`orderBy('date', 'desc')`)**:
   - `notices` are strictly ordered by their ISO `date` (`YYYY-MM-DD`) so the newest announcements always appear first, with `isUrgent: true` highlighted in the ticker and top badges.

---

### 4.5 Firestore & Storage Security Rules

#### `firestore.rules`
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Public read, Admin-only write for portfolio collections
    match /{collection}/{docId}
      where collection in [
        'site_settings', 'dignitary_messages', 'committee_members',
        'committee_groups', 'programs', 'projects', 'gallery_albums',
        'gallery_items', 'notices', 'categories'
      ] {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Blood Donors: Public read & registration, Admin moderation
    match /blood_donors/{donorId} {
      allow read, create: if true;
      allow update, delete: if isAdmin();
    }

    // Volunteers & Donations: Public creation (pending), Admin verification
    match /volunteers/{volunteerId} {
      allow create: if request.resource.data.status == 'pending';
      allow read, update, delete: if isAdmin();
    }
    match /donations/{donationId} {
      allow read: if resource.data.status == 'verified' || isAdmin();
      allow create: if request.resource.data.status == 'pending';
      allow update, delete: if isAdmin();
    }
  }
}
```

#### `storage.rules`
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 50 * 1024 * 1024;
    }
  }
}
```

---

## 5. Core Architectural Modules

### Dual-Mode Media Upload (`src/components/MediaUploadInput.tsx`)
Provides a unified tab switcher for every media field in the Admin CMS:
- **Upload File Mode**: Accepts drag-and-drop or file selection, compresses images client-side via HTML5 Canvas (`compressImageFile`), generates a `gs://` storage path, and previews the asset immediately.
- **Direct Link / YouTube Mode**: Accepts any direct image/video URL or YouTube link (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`). YouTube links are automatically parsed via `getYoutubeEmbedUrl()` and `getYoutubeThumbnailUrl()` to render clean `<iframe>` players in the public gallery.

### Unified Committee with Multi-Tags & Optional Groups (`src/pages/CommitteePage.tsx`)
- **Unified Serialized View**: Displays all committee members in a single continuous grid ordered by `priority`.
- **Multi-Tag Filtering**: Members can hold multiple tags simultaneously (e.g., `["Executive Council", "Founding Member", "Education Wing"]`). Clicking any tag filters the list.
- **Optional Group View**: Admins can optionally define serialized groups (`committee_groups`) and assign members to a `groupId`. Visitors can toggle between **All Members (Unified List)** and **Grouped Sections View**.

### Smart Category Autocomplete (`src/components/CategoryAutocomplete.tsx`)
- Searches existing categories in `customCategories` case-insensitively as the admin types.
- If the typed category already exists, selects it without duplication.
- If it does not exist, displays a `+ Create "{category}"` action button that saves the new category to the global `categories/registry` state immediately.

---

## 6. Admin CMS Portal Guide

Click the **Admin** button in the top navigation bar (or footer) to open the Admin CMS Portal.

- **Default Demo Passcode**: `jagreeti2025` (or click the **One-Click Demo Login** button on the login screen).
- **Available Admin Tabs**:
  1. **Overview**: Dashboard KPIs, pending donation/volunteer approvals, and quick shortcuts.
  2. **Home & Settings**: Edit bilingual hero titles, live impact counters, history paragraphs, mission/vision, and contact details.
  3. **Dignitary Speeches**: Add/edit speeches, upload or link portraits, and reorder speeches by priority.
  4. **Committee & Groups**: Manage the unified member list, assign multiple tags with autocomplete, create optional groups, and serialize both members and groups.
  5. **Programs & Wings**: Add/edit permanent wings, upload cover photos, manage categories, and set priority order.
  6. **Projects**: Manage relief campaigns, fundraising progress bars, categories, and priority order.
  7. **Gallery & Albums**: Create curated albums (`gallery_albums`), add photos or videos (via file upload or YouTube embed link), assign items to an album or standalone stream, and reorder priorities.
  8. **Notices**: Publish bilingual circulars and urgent announcements (automatically sorted by date).
  9. **Donations & Blood**: Verify or reject public donation transactions and manage blood donor availability.
  10. **Volunteers**: Review and approve volunteer applications.
  11. **Firebase Schema**: View complete Firestore collection documentation, inspect live JSON state, or reset demo data to defaults.

---

## 7. Local Development & Build Commands

### Prerequisites
- **Node.js** `>= 18.x` (or **Bun** `>= 1.x`)

### Installation & Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev
```

### Type-Checking & Production Build
```bash
# Validate TypeScript types across the entire project
npm run lint

# Build production bundle into /dist
npm run build

# Preview production build locally
npm run preview
```
