# Pending deletion review

This directory contains 37 files moved for team review. No file has been deleted. Each file keeps its original repository path beneath `pending_deletion/`, so `git mv pending_deletion/<original-path> <original-path>` restores it.

## Moved

- Historical Markdown: superseded React, SSG, Vercel, Coming Soon, and feature status instructions. Current WordPress setup and editing guidance remains in `wordpress-cms/README.md`.
- `migrate-ssg.sh`: one-time migration script with no active build or deployment reference.
- Two source backups and seven tracked `.vite-ssg-temp` build artifacts.
- `SentimentBarChart.jsx` and `SentimentPieChart.jsx`: no imports from current frontend source.
- Five images in `frontend/public/vi` and the `references` image: no references in current frontend source or WordPress content manifest. Public images may still have external direct links; check those before deletion.

## Kept for a separate decision

- `frontend/dist` and `.github/workflows/ssg-prerender.yml`: the manual workflow still generates and commits that directory.
- `frontend/src/pages/EditorialPageAlt.jsx`: absent from React routes, but listed in the WordPress content manifest; removing it also requires a content mapping decision.
- Public assets such as `frontend/public/sitemap.xml` and `voice-wave-ai.mp4`: URL consumers cannot be ruled out from source searches alone.
- Historical documents with possible credential material: handle through a separate credential review. Moving a file would not remove the material from Git history.
- Runtime code, CMS files, environment configuration, and data files remain in place.

This folder is excluded from Railway, Vercel, and WordPress Docker build contexts. It is intentionally tracked for review.