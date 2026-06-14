# 20_MEDIA_ASSETS_AND_GALLERY.md

# Real Estate Decision Portal — Media Assets and Gallery

## 1. Purpose of This Document

This document defines the media asset model for the Real Estate Decision Portal.

The original schema docs defined project fields such as `brochureCollected: boolean` and `floorPlanCollected: boolean`, but did not define the actual media storage model.

This document fills that gap.

Real estate decision-making is heavily visual. A portal that only stores numbers and text misses a critical part of the evaluation. A buyer needs to:

* See the project's rendered images and elevation views.
* Compare floor plans of different BHK configurations across towers.
* Watch the builder's property walkthrough video.
* Reference the builder's brochure.
* Review actual site visit photos.
* See the master plan to understand project density and layout.
* Keep builder logos and project identity consistent across comparisons.

This document defines how to model, store, and display all of these.

---

## 2. Media Asset Philosophy

### 2.1 URL-First Storage

The portal is local-first and has no backend in version 1.

Media assets should be stored as **URL references**, not as embedded binaries.

Why:
* URLs are lightweight and do not bloat localStorage or IndexedDB.
* Images from builder websites, Google Drive, Unsplash, or CDNs can be referenced directly.
* YouTube and Vimeo video embeds work with simple URL references.
* PDFs can be linked to Google Drive, builder websites, or local file servers.

Users can paste URLs directly from:
* Builder website image links.
* Google Drive shareable links (for floor plan PDFs, brochures).
* YouTube video URLs.
* Shared Dropbox or OneDrive links.
* Any publicly accessible image URL.

For small logos (builder logo, project badge), base64 data URLs are acceptable as a fallback.

### 2.2 Category-Driven Organization

Every image should belong to a specific category so the UI can display it in the right section.

Image categories:
* `hero` — Main project cover image (first impression).
* `gallery` — General project gallery (rendered images, actual site photos, aerial views).
* `elevation` — Building elevation renders.
* `floor-plan` — Floor plan images for each unit type and tower.
* `master-plan` — Full project master plan layout.
* `amenity-photo` — Photos of amenities (pool, gym, clubhouse, garden, etc.).
* `site-photo` — Photos taken during site visits (real-world construction progress).
* `document-preview` — Preview images of brochures or cost sheets.

### 2.3 Brochures and Floor Plan PDFs

PDFs should be stored as URL references.

A brochure is a DocumentAsset, not an ImageRecord.

Document types:
* `brochure` — Project brochure PDF.
* `floor-plan-pdf` — Floor plan PDF (may contain multiple unit types).
* `cost-sheet` — Builder cost sheet PDF.
* `legal-doc` — Legal documents such as title deed, RERA certificate, Khata.
* `rera-certificate` — RERA registration certificate.
* `agreement-draft` — Draft agreement for review.
* `other` — Any other document.

### 2.4 Videos

Videos should be stored as embed URLs from YouTube or Vimeo.

The portal should extract and render the embed URL from a standard YouTube or Vimeo share URL.

Video types:
* `walkthrough` — Builder property walkthrough video.
* `aerial-view` — Drone/aerial footage.
* `testimonial` — Customer or sales testimonial.
* `progress-update` — Construction progress video.
* `other` — Any other video.

---

## 3. Entity Definitions

### 3.1 ImageRecord

An ImageRecord stores a single image reference.

```typescript
ImageRecord {
  id: string
  url: string                 // Full image URL or base64 data URL
  caption?: string            // Optional caption
  altText?: string            // Accessibility alt text
  category: ImageCategory     // hero | gallery | elevation | floor-plan | master-plan | amenity-photo | site-photo | document-preview
  unitType?: string           // For floor plans: "2BHK", "3BHK", "3.5BHK"
  towerName?: string          // For floor plans: "Tower A", "Tower B"
  sortOrder?: number          // Display order within category
  isCover?: boolean           // Whether this is the primary cover image
  sourceNote?: string         // Where this image came from (builder website, brochure, site visit)
  addedAt: string             // ISO date string
}
```

### 3.2 VideoRecord

A VideoRecord stores a video reference.

```typescript
VideoRecord {
  id: string
  rawUrl: string              // Original URL pasted by user (e.g. https://youtu.be/xxx)
  embedUrl?: string           // Derived embed URL (e.g. https://www.youtube.com/embed/xxx)
  platform: 'youtube' | 'vimeo' | 'other'
  videoType: 'walkthrough' | 'aerial-view' | 'testimonial' | 'progress-update' | 'other'
  title: string
  description?: string
  thumbnailUrl?: string
  durationSeconds?: number
  addedAt: string
}
```

### 3.3 DocumentAsset

A DocumentAsset stores a document reference.

```typescript
DocumentAsset {
  id: string
  url: string                 // External URL or data URL
  name: string                // Display name
  type: DocumentAssetType     // brochure | floor-plan-pdf | cost-sheet | legal-doc | rera-certificate | agreement-draft | other
  projectId?: string
  unitId?: string
  collectionStatus: 'Collected' | 'Requested' | 'Pending' | 'Not Available'
  verificationStatus: 'Unverified' | 'Reviewed' | 'Verified' | 'Rejected'
  notes?: string
  addedAt: string
}
```

---

## 4. Builder Media Fields

The Builder entity must be extended to include:

```typescript
Builder {
  // ...existing fields...

  logoUrl?: string            // Builder logo image URL or base64
  logoInitials?: string       // Fallback initials when logo is unavailable (e.g. "DSR", "SAN")
  logoColor?: string          // Brand color for initials badge (hex)
  brandWebsiteHeroUrl?: string // Builder brand website hero image
  builderGallery?: ImageRecord[] // Images of past projects, awards, etc.
}
```

### 4.1 Logo Display Rules

* If `logoUrl` is available, display the logo image.
* If `logoUrl` is unavailable, display a styled badge with `logoInitials` and `logoColor`.
* If neither is available, derive initials from `builderName` (e.g. "DSR Infrastructure" → "DSR").
* Logo should appear in project cards, project detail headers, and comparison tables.

---

## 5. Project Media Fields

The Project entity must be extended to include:

```typescript
Project {
  // ...existing fields...

  // Identity
  projectLogoUrl?: string       // Project-specific logo (if builder provides one)
  projectBrandColor?: string    // Project brand/accent color

  // Images
  images: ImageRecord[]         // All project images (hero, gallery, elevation, master plan, amenities)

  // Videos
  videos: VideoRecord[]         // All project videos

  // Documents
  documents: DocumentAsset[]    // All project-level documents (brochure, RERA cert, legal)

  // Flags
  brochureCollected: boolean    // Whether brochure PDF is available
  floorPlansCollected: boolean  // Whether floor plans are available
  masterPlanCollected: boolean  // Whether master plan image is available
  reraCertificateCollected: boolean  // Whether RERA certificate is available
}
```

### 5.1 Derived Hero Image

The project's hero image should be determined as:

```text
heroImage =
  first ImageRecord where isCover = true
  OR first ImageRecord where category = "hero"
  OR first ImageRecord in images[]
  OR default project placeholder
```

---

## 6. Unit Media Fields

Each unit should support its own floor plan images:

```typescript
Unit {
  // ...existing fields...

  floorPlanImages: ImageRecord[]  // Floor plan images for this specific unit type
  // category should be "floor-plan", unitType set to BHK config, towerName if applicable
}
```

---

## 7. Site Visit Media Fields

Each site visit should support photos:

```typescript
SiteVisit {
  // ...existing fields...

  photos: ImageRecord[]         // Photos taken during or related to this site visit
  // category = "site-photo"
}
```

---

## 8. Gallery Display Rules

### 8.1 Project Gallery Layout

The project gallery should display in the following order:

1. Hero image (full-width or prominent position).
2. Elevation renders.
3. General gallery images.
4. Amenity photos.
5. Site visit photos (with date).

### 8.2 Floor Plan Display

The floor plan section should:

* Show tabs or buttons for each available BHK type (2BHK, 3BHK, etc.).
* Show tower name if multiple towers have different floor plans.
* Display the floor plan image.
* Allow zooming or opening in a lightbox.

### 8.3 Video Display

The video section should:

* Render YouTube or Vimeo embeds using the `embedUrl`.
* Show a thumbnail grid when multiple videos are available.
* Support a lightbox or drawer for full-screen video viewing.

---

## 9. Media Completeness Tracking

The data completeness check should include media:

| Asset                | Weight | Rule                                      |
| -------------------- | ------ | ----------------------------------------- |
| Hero image           | Medium | Project should have at least one image    |
| Builder logo         | Low    | Nice to have, fallback to initials        |
| Floor plan images    | High   | Required for unit evaluation              |
| Brochure             | High   | Key document for comparison               |
| RERA certificate     | High   | Required for legal readiness              |
| Property video       | Low    | Nice to have, improves decision quality   |
| Master plan          | Medium | Helps evaluate density and open spaces    |

Missing media should be surfaced in the data completeness score and shown as follow-up tasks.

---

## 10. Media Input Methods

### 10.1 URL Paste (primary)

* User pastes an image URL from a builder website, Google Drive, or any CDN.
* Portal stores the URL and displays the image.

### 10.2 YouTube/Vimeo URL

* User pastes a YouTube or Vimeo share URL.
* Portal derives the embed URL automatically.
* Displays an embedded video player.

### 10.3 Google Drive Shareable Link

* User shares a PDF or image from Google Drive with link access.
* Portal stores the link and opens it in a new tab.
* Drive links can be converted to direct preview URLs.

### 10.4 File Upload (future)

* File upload to browser-based storage (IndexedDB) or cloud storage (future).
* Not required for version 1.

---

## 11. Seed Data Media

The five seed projects should include:

* At least one hero image per project (Unsplash real estate images as demo).
* At least two gallery images per project.
* YouTube URL placeholder per project (can be a real Bangalore project walkthrough or demo).
* Brochure URL placeholder (can be a Google Drive demo PDF link).
* One floor plan image per main BHK type.

This ensures the UI gallery, floor plan, and video sections always have demo data to display.
