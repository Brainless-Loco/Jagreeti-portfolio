# JAGREETI — Firebase Firestore Collections & Storage Setup Documentation

This document serves as the **single authoritative reference** for setting up **Firebase Firestore (NoSQL Database)** and **Firebase Cloud Storage** for the **JAGREETI Socio-Humanitarian Youth Foundation** platform.

---

## 1. Architecture Overview

All dynamic content, media metadata, priority ordering (`priority`), custom categories, albums, committee tags/groups, admin profiles, and operational records are structured around **14 Firestore Collections** and **7 Firebase Storage Directories**.

### Environment Variables (`.env`)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIRESTORE_DATABASE_ID=(default)
```

---

## 2. Admin Portal Authentication and First Admin

The Admin Portal does **not** store passwords in Firestore. The login form uses **Firebase Authentication > Email/Password** and signs in with `signInWithEmailAndPassword`. Firestore and Storage access is then checked against the signed-in user's UID.

### Create the first admin

1. Open **Firebase Console > your project > Authentication > Sign-in method** and enable **Email/Password**.
2. Open **Authentication > Users > Add user**.
3. Create the first administrator with the real admin email address and a strong password. Do not put the password in Firestore, source code, or this document.
4. Copy the new user's **UID**.
5. Open **Firestore Database > Data**, create a top-level collection named `admins`, and create a document whose ID is exactly that copied UID.
6. Add the profile fields shown below. The `active` field is used as an operational switch for disabling access without deleting the Auth account.

The admin then opens the website's `#admin` link and signs in with the Auth email/password. A Firestore document called `admins/admin@example.com` is only an example of the shape; the real document ID must be the Firebase Auth UID, not the email address.

### Sample document: `admins/{firebaseAuthUid}`

```json
{
  "email": "admin@example.com",
  "displayName": "JAGREETI Administrator",
  "role": "admin",
  "active": true,
  "createdAt": "2026-10-11T00:00:00.000Z"
}
```

The document ID is the Auth user's UID, for example:

```text
admins/AbCdEfGhIjKlMnOpQrStUvWxYz12
```

Do not create a document with a literal ID such as `admin` unless the Auth UID is actually `admin`.

### Optional custom claim

For larger deployments, also set the Firebase Auth custom claim `{ "admin": true }` using a trusted Admin SDK script or Cloud Function. Never set claims from the browser. The rules below use the `admins/{uid}` document as the source of truth, so the profile document must still exist and have `active: true`.

---

## 3. Firebase Cloud Storage Folder Hierarchy

Whenever an administrator uploads a photo or video in the Admin Panel (instead of pasting an external link), the file is stored in Firebase Cloud Storage under these standardized paths and its public download URL (`getDownloadURL`) + `storagePath` are saved in the corresponding Firestore document:

| Media Context | Storage Bucket Path Pattern | Allowed MIME Types | Max Size |
| :--- | :--- | :--- | :--- |
| **Dignitary Portraits** | `gs://<bucket>/dignitaries/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| **Committee Member Photos** | `gs://<bucket>/committee/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| **Programs & Wings Covers** | `gs://<bucket>/programs/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| **Project Campaign Covers** | `gs://<bucket>/projects/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| **Gallery Album Covers** | `gs://<bucket>/gallery/albums/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 5 MB |
| **Gallery Photos** | `gs://<bucket>/gallery/photos/{timestamp}_{filename}` | `image/jpeg`, `image/png`, `image/webp` | 10 MB |
| **Gallery Uploaded Videos** | `gs://<bucket>/gallery/videos/{timestamp}_{filename}` | `video/mp4`, `video/webm`, `video/ogg` | 50 MB |

---

## 4. Firestore Collections & Document Schemas

### 4.1 `site_settings` (Single Document: `site_settings/global_config`)
Stores global homepage hero copy, live impact counters, ticker text, organizational history, mission/vision, and headquarters contact details.

```json
{
  "heroHeadlineEn": "Youth. Humanity. Unconditional Service.",
  "heroHeadlineBn": "তারুণ্যের শক্তিতে মানবতার জয়গান",
  "heroSubheadlineEn": "JAGREETI is an apolitical socio-humanitarian youth organization...",
  "heroSubheadlineBn": "জাগ্রীতি একটি সম্পূর্ণ অরাজনৈতিক ও সমাজকল্যাণমূলক যুব সংগঠন...",
  "tickerTextEn": "JAGREETI — Apolitical Socio-Humanitarian Youth Movement | Bangladesh",
  "tickerTextBn": "জাগ্রীতি — অরাজনৈতিক সমাজকল্যাণমূলক যুব সংগঠন | লালমনিরহাট",
  "beneficiariesCount": 28500,
  "volunteersCount": 450,
  "treesPlantedCount": 18200,
  "scholarshipStudentsCount": 230,
  "contactPhone": "+880 1744-769331",
  "contactEmail": "contact@jagreetibd.org",
  "emergencyHotline": "+880 1744-769331",
  "officeAddressEn": "JAGREETI Central Complex, Station Road, Lalmonirhat - 5500, Bangladesh",
  "officeAddressBn": "জাগ্রীতি কেন্দ্রীয় কমপ্লেক্স, স্টেশন রোড, লালমনিরহাট - ৫৫০০, বাংলাদেশ",
  "facebookUrl": "https://facebook.com/jagreetibd",
  "historyP1En": "...",
  "historyP1Bn": "...",
  "historyP2En": "...",
  "historyP2Bn": "...",
  "missionEn": "...",
  "missionBn": "...",
  "visionEn": "...",
  "visionBn": "...",
  "updatedAt": "2026-10-09T04:00:00Z"
}
```

---

### 4.2 `dignitary_messages` (Collection: `/dignitary_messages/{messageId}`)
Stores speeches from the Chief Advisor, Founder, Central President, General Secretary, and any additional patrons.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Document ID (e.g., `msg-chief-advisor`) |
| `type` | `string` | Yes | Role key (`chief_advisor`, `founder`, `president`, `secretary`, or custom) |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `title` | `string` | Yes | Speech heading in English |
| `titleBn` | `string` | Yes | Speech heading in Bengali |
| `name` | `string` | Yes | Speaker's full name (EN) |
| `nameBn` | `string` | Yes | Speaker's full name (BN) |
| `designation` | `string` | Yes | Official title/designation (EN) |
| `designationBn` | `string` | Yes | Official title/designation (BN) |
| `academicBackground` | `string` | No | Credentials / profession (EN) |
| `academicBackgroundBn` | `string` | No | Credentials / profession (BN) |
| `image` | `string` | Yes | Public download URL (Firebase Storage or external URL) |
| `storagePath` | `string` | No | Firebase Storage object path (`dignitaries/...`) if uploaded |
| `quote` | `string` | Yes | Highlighted pull-quote (EN) |
| `quoteBn` | `string` | Yes | Highlighted pull-quote (BN) |
| `fullMessage` | `string` | Yes | Complete speech body (EN) |
| `fullMessageBn` | `string` | Yes | Complete speech body (BN) |

---

### 4.3 `committee_members` (Collection: `/committee_members/{memberId}`)
Stores the unified leadership directory. Members appear in a **single serialized list** ordered by `priority`, enriched with multiple `tags` and an optional `groupId`.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Document ID |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `name` | `string` | Yes | Full Name (English) |
| `nameBn` | `string` | Yes | Full Name (Bengali) |
| `role` | `string` | Yes | Designation / Post (English) |
| `roleBn` | `string` | Yes | Designation / Post (Bengali) |
| `tags` | `string[]` | Yes | Array of tags (e.g. `["Executive Council", "Founding Member", "Finance"]`) |
| `groupId` | `string` | No | Optional reference to `committee_groups/{groupId}` (`""` if ungrouped) |
| `category` | `string` | No | Legacy/primary category tag |
| `image` | `string` | Yes | Portrait URL (Firebase Storage download URL or direct link) |
| `storagePath` | `string` | No | Firebase Storage path (`committee/...`) if uploaded |
| `institution` | `string` | No | Academic institution or workplace |
| `term` | `string` | No | Committee session term (e.g., `2025-2027`) |
| `phone` | `string` | No | Contact phone number |
| `email` | `string` | No | Contact email address |
| `bio` | `map` | Yes | `{ en: string, bn: string }` biography |

---

### 4.4 `committee_groups` (Collection: `/committee_groups/{groupId}`) — *Optional Groups*
Allows admins to optionally organize committee members into serialized sections/groups while preserving the unified member list.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Group ID (e.g., `grp-executive`, `grp-advisory`) |
| `name` | `string` | Yes | Group Title (English) |
| `nameBn` | `string` | Yes | Group Title (Bengali) |
| `description` | `string` | No | Subtitle / Mandate (English) |
| `descriptionBn` | `string` | No | Subtitle / Mandate (Bengali) |
| `priority` | `number` | Yes | Group serialization order (`1`, `2`, `3`, ...) |

---

### 4.5 `programs` (Collection: `/programs/{programId}`)
Stores permanent organizational wings and core service pillars.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Program ID |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `category` | `string` | No | Wing category (with autocomplete creation) |
| `title` | `string` | Yes | Program title (EN) |
| `titleBn` | `string` | Yes | Program title (BN) |
| `desc` | `string` | Yes | Overview description (EN) |
| `descBn` | `string` | Yes | Overview description (BN) |
| `impact` | `string` | Yes | Quantified impact badge (EN) |
| `impactBn` | `string` | Yes | Quantified impact badge (BN) |
| `image` | `string` | Yes | Cover photo URL (uploaded to Firebase Storage or external link) |
| `storagePath` | `string` | No | Storage path (`programs/...`) |
| `highlights` | `string[]` | Yes | Bullet points in English |
| `highlightsBn` | `string[]` | Yes | Bullet points in Bengali |

---

### 4.6 `projects` (Collection: `/projects/{projectId}`)
Stores active, upcoming, and completed humanitarian relief campaigns.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Project ID |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `title` | `string` | Yes | Campaign title (EN) |
| `titleBn` | `string` | Yes | Campaign title (BN) |
| `category` | `string` | Yes | Category (`relief`, `education`, `health`, `environment`, or custom) |
| `description` | `string` | Yes | Campaign details (EN) |
| `descriptionBn` | `string` | Yes | Campaign details (BN) |
| `targetAmount` | `number` | Yes | Target fundraising goal in BDT |
| `raisedAmount` | `number` | Yes | Verified amount raised in BDT |
| `beneficiaries` | `number` | Yes | Target beneficiary count |
| `location` | `string` | Yes | Field deployment location |
| `status` | `string` | Yes | `'ongoing' | 'completed' | 'upcoming'` |
| `image` | `string` | Yes | Campaign photo URL (Firebase Storage or external link) |
| `storagePath` | `string` | No | Storage path (`projects/...`) |
| `startDate` | `string` | Yes | ISO date (`YYYY-MM-DD`) |

---

### 4.7 `gallery_albums` (Collection: `/gallery_albums/{albumId}`)
Stores multi-photo/video albums displayed alongside single items in the main portfolio.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Album ID |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `title` | `string` | Yes | Album title (EN) |
| `titleBn` | `string` | Yes | Album title (BN) |
| `description` | `string` | No | Album summary (EN) |
| `descriptionBn` | `string` | No | Album summary (BN) |
| `category` | `string` | Yes | Category (supports autocomplete creation) |
| `coverImage` | `string` | Yes | Album cover image URL (uploaded or linked) |
| `storagePath` | `string` | No | Storage path (`gallery/albums/...`) |
| `date` | `string` | Yes | Event date (`YYYY-MM-DD`) |

---

### 4.8 `gallery_items` (Collection: `/gallery_items/{itemId}`)
Stores both **Photos** (uploaded or linked) and **Videos** (uploaded video files or YouTube embed links), either standalone or linked to a `gallery_albums` document via `albumId`.
- **Default Query**: `orderBy('priority', 'asc')`

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Media item ID |
| `priority` | `number` | Yes | Serialization order (`1`, `2`, `3`, ...) |
| `mediaType` | `string` | Yes | `'photo' | 'video'` |
| `title` | `string` | Yes | Media title (EN) |
| `titleBn` | `string` | Yes | Media title (BN) |
| `caption` | `string` | No | Extended caption (EN) |
| `captionBn` | `string` | No | Extended caption (BN) |
| `category` | `string` | Yes | Category (supports autocomplete creation) |
| `imageUrl` | `string` | Yes | Photo URL or Video thumbnail URL |
| `videoUrl` | `string` | No | YouTube watch/embed URL or uploaded video file URL (when `mediaType === 'video'`) |
| `videoSource` | `string` | No | `'youtube' | 'upload'` |
| `albumId` | `string` | No | Optional `gallery_albums/{albumId}` reference (`""` if standalone single item) |
| `showAsSingle` | `boolean` | No | If `true`, also appears in the single media stream even if inside an album |
| `storagePath` | `string` | No | Firebase Storage path (`gallery/photos/...` or `gallery/videos/...`) |
| `date` | `string` | Yes | Capture date (`YYYY-MM-DD`) |

---

### 4.9 `notices` (Collection: `/notices/{noticeId}`)
Stores official circulars, AGM calls, and scholarship announcements.
- **Default Query**: `orderBy('date', 'desc')` *(Strictly ordered by date, newest first)*

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Yes | Notice ID |
| `title` | `string` | Yes | Notice headline (EN) |
| `titleBn` | `string` | Yes | Notice headline (BN) |
| `date` | `string` | Yes | ISO Date (`YYYY-MM-DD`) for chronological sorting |
| `category` | `string` | Yes | Category (`circular`, `event`, `scholarship`, `meeting`, or custom) |
| `summary` | `string` | Yes | Short excerpt (EN) |
| `summaryBn` | `string` | Yes | Short excerpt (BN) |
| `content` | `string` | Yes | Full circular text (EN) |
| `contentBn` | `string` | Yes | Full circular text (BN) |
| `isUrgent` | `boolean` | Yes | Highlights urgent circulars at the top |

---

### 4.10 `categories` (Document: `categories/registry`)
Stores the deduplicated list of autocomplete categories and tags across all modules so admins can select existing categories or seamlessly add new ones.

```json
{
  "gallery": ["Education", "Winter Relief", "Healthcare", "Tree Plantation", "Events", "Documentary"],
  "projects": ["relief", "education", "health", "environment", "sports"],
  "programs": ["Education", "Healthcare", "Disaster Relief", "Environment", "Ethics", "Youth Leadership"],
  "notices": ["circular", "event", "scholarship", "meeting"],
  "committeeTags": ["Executive Council", "Advisory Board", "Founding Member", "Trustee", "Wing Coordinator", "Scholarship Board", "Audit Committee"],
  "donations": ["Winter Relief", "Merit Scholarship Fund", "Emergency Health Camp", "Tree Plantation", "General Fund"]
}
```

---

### 4.11 `volunteers`, `donations`, & `blood_donors`
- **`volunteers/{volunteerId}`**: `{ id, fullName, email, phone, bloodGroup, wing, skills, district, institution, motivation, status: 'pending' | 'approved', appliedDate }`
- **`donations/{donationId}`**: `{ id, donorName, amount, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank', trxId, phone, cause, date, status: 'pending' | 'verified' }`
- **`blood_donors/{donorId}`**: `{ id, name, nameBn, bloodGroup, phone, whatsapp, district, upazila, lastDonationDate, available, totalDonations, verified }`

---

## 5. Recommended Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.active == true &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }

    // Public Content Collections: Publicly readable, Admin-only write
    match /site_settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /dignitary_messages/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /committee_members/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /committee_groups/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /programs/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /projects/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /gallery_albums/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /gallery_items/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /notices/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /categories/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /blood_donors/{docId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if isAdmin();
    }

    // Operational Submissions: Public can submit, Admin verifies/manages
    match /volunteers/{docId} {
      allow create: if request.resource.data.status == 'pending';
      allow read, update, delete: if isAdmin();
    }
    match /donations/{docId} {
      allow read: if resource.data.status == 'verified' || isAdmin();
      allow create: if request.resource.data.status == 'pending';
      allow update, delete: if isAdmin();
    }
  }
}
```
