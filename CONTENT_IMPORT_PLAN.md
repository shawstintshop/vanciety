# Content Import Plan — Salvaged Assets to Primary App

**Date:** June 18, 2026  
**Source:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/`  
**Destination:** `/Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app/`

---

## Import Strategy

### Phase 1: Images (50 files, 39 MB)
**Source:** `salvaged-assets/images/`  
**Destination:** `primary_app/public/images/salvaged/`

**Structure:**
```
public/images/salvaged/
├── logos/          (2 files)
├── heroes/         (5 files)
├── icons/          (1 file)
├── photos/         (23 files)
└── misc/           (19 files)
```

**Action:** Copy entire directory structure

---

### Phase 2: Data Files
**Source:** `salvaged-assets/data/`  
**Destination:** Multiple locations

#### 2A: JSON Seed Data → `public/data/salvaged/`
Copy for reference/backup:
- products.json
- van-products.json
- sample-products.json
- northwest-locations.json
- sample-locations.json
- news.json
- sample-news.json
- videos.json
- videos_backup.json
- sample-videos.json
- constants.ts
- seed.ts
- videoDatabase.ts

#### 2B: SQL Migrations → `supabase/migrations/salvaged/`
Archive the old schema:
- sql-migrations/ (20 files from old SprinterSociety)
- vanciety-migrations/ (17 files from vanciety.com Sept 2025)

**Purpose:** Historical reference, schema comparison, potential migration reuse

---

### Phase 3: Documentation
**Source:** `salvaged-assets/`  
**Destination:** `primary_app/docs/salvaged/`

Copy:
- SALVAGE_SUMMARY.md
- video-links.md
- company-vendor-links.md

---

## Execution Steps

### Step 1: Create Directory Structure
```bash
cd /Volumes/AI-DATA/PROJECTS/VANCIETY/code/primary_app

mkdir -p public/images/salvaged
mkdir -p public/data/salvaged
mkdir -p supabase/migrations/salvaged
mkdir -p docs/salvaged
```

### Step 2: Copy Images
```bash
cp -R /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/images/* \
      public/images/salvaged/
```

### Step 3: Copy Data Files
```bash
cp /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/data/*.json \
   public/data/salvaged/

cp /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/data/*.ts \
   public/data/salvaged/
```

### Step 4: Copy SQL Migrations
```bash
cp -R /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/data/sql-migrations \
      supabase/migrations/salvaged/

cp -R /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/data/vanciety-migrations \
      supabase/migrations/salvaged/
```

### Step 5: Copy Documentation
```bash
cp /Volumes/AI-DATA/PROJECTS/VANCIETY/salvaged-assets/*.md \
   docs/salvaged/
```

### Step 6: Create Import Index
Create `IMPORTED_CONTENT_INDEX.md` listing all imported files with:
- Original location
- New location
- File size
- Purpose
- Usage notes

---

## Post-Import Tasks

### Immediate
1. ✅ Verify all files copied (check file counts)
2. ✅ Update .gitignore if needed
3. ✅ Create index/manifest of imported content
4. ✅ Update PROJECT_STATUS.md

### Short-term
1. Review salvaged images for app integration
2. Compare SQL migrations with current schema
3. Import useful products/locations to Supabase
4. Update video data if salvaged videos are better

### Optional
1. Create image gallery page showing salvaged photos
2. Import vendor affiliate data
3. Seed forum with sample content from seed.ts

---

## File Count Verification

**Expected:**
- Images: 50 files (48 png/jpg confirmed)
- Data files: 13 JSON/TS files
- SQL migrations: 37 files (20 + 17)
- Documentation: 3 MD files

**Total:** ~103 files + directory structure

---

## Disk Impact

**Images:** 39 MB  
**Data:** <1 MB  
**SQL:** <500 KB  
**Total:** ~40 MB added to primary_app

**Current primary_app:** 677 MB  
**After import:** ~717 MB  

---

## Safety Notes

- All imports go into `/salvaged/` subdirectories (non-destructive)
- No existing files will be overwritten
- Original salvaged-assets folder remains untouched
- Can be reversed by deleting `/salvaged/` directories

---

## Status

- [ ] Phase 1: Images
- [ ] Phase 2: Data files
- [ ] Phase 3: Documentation
- [ ] Verification
- [ ] Index creation
- [ ] PROJECT_STATUS update
