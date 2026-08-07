# Changelog - Interactive Organization Explorer DJBC

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-08-07

### 🌟 Initial Release v1.0
- **Interactive Organization Chart (Kantor Pusat, Kanwil, KPPBC, UPT)**:
  - Full hierarchical rendering with D3/SVG canvas.
  - Multi-line wrap `<tspan>` text formatting for full untruncated unit names.
  - Unit ID resolution fallback for special units (e.g. `dit-audit` to `"Direktorat Audit Kepabeanan dan Cukai"`).
- **User Profile Integration (KLC2 Kemenkeu)**:
  - Header profile widget displaying User Name (`name`) and Avatar Photo (`image_url`).
  - Integration support for KLC2 API (`https://klc2.kemenkeu.go.id/res/user/principal/me/profile`).
  - Persistent profile storage in `localStorage`.
- **Interactive Assessment & Challenges**:
  - Tantangan Klik Bagan Hirarki & Studi Kasus Kerja Mandiri.
  - Correct/Incorrect icons, confetti celebration effects, and answer revelation options.
- **Interactive Maps & Workflow Views**:
  - Connection Map, Geographic Map, Alur Kerja & Alur Proses.
