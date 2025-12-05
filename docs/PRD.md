# TileR Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name:** TileR  
**Version:** 1.0 (MVP)  
**Date:** December 05, 2025  
**Owner:** [User/DecagonDev]  

TileR is a lightweight, browser-based React application designed as a unified pixel-art tile editor and tilemap composer. It enables users to create, edit, and export pixel-art tiles and tilemaps in formats compatible with tools like Tiled and game engines, all while maintaining full offline capability through localStorage and IndexedDB. Built on a Vite + React + TypeScript stack with Tailwind CSS and shadcn/ui, TileR addresses the fragmentation in pixel-art and level design workflows by providing a single, intuitive interface.

The initial MVP focuses on core editing, persistence, and export features, with modular extensibility for future enhancements like multi-layer support. Development will leverage the existing repository at https://github.com/decagondev/TileR as a starter, which appears to be a basic Vite + React + TypeScript setup (rebranded from any prior unrelated content). No breaking changes will be introduced; all additions will follow SOLID principles (e.g., single responsibility for components, open-closed for extensibility) and modular design (e.g., separate concerns for canvas rendering, storage, and export).

**Key Goals:**
- Streamline tile creation and map assembly in a single SPA.
- Ensure 100% client-side operation with seamless persistence.
- Deliver Tiled-compatible exports for immediate integration.

**Success Metrics (Post-MVP):**
- User retention: 70% of sessions >10 minutes.
- Export usage: 80% of projects exported in PNG/JSON.
- Offline functionality: Zero data loss in browser tests.

## 2. Problem Statement

Current workflows for pixel-art and tilemap creation require switching between specialized tools (e.g., Aseprite for pixels, Tiled for maps), leading to manual syncing of assets, IDs, and formats. This is inefficient for hobbyists and indie devs who need quick iteration in a browser environment. Existing solutions like Tiled are robust but backend-agnostic and not optimized for integrated pixel editing. TileR solves this by combining both editors in one offline-capable app, with direct exports to PNG (spritesheets/individuals) and Tiled JSON.

## 3. Target Audience and User Personas

### Personas
1. **Pixel Artist (Alex, 28, Freelance Illustrator)**  
   - Needs: Grid-aligned drawing tools, tile variations, PNG exports for asset pipelines.  
   - Pain: Tedious export/import between apps.  
   - How TileR Helps: Dedicated pixel canvas with palette management.

2. **Level Designer (Jordan, 35, Indie Game Dev)**  
   - Needs: Grid-based painting, map resizing, Tiled JSON for engine import.  
   - Pain: Mismatched tile IDs across tools.  
   - How TileR Helps: Unified map editor with tile referencing.

3. **Hobbyist Dev (Sam, 22, Student)**  
   - Needs: Offline prototyping, local saves, easy import from existing spritesheets.  
   - Pain: Server dependencies or complex setups.  
   - How TileR Helps: Browser-only, auto-persisting projects.

## 4. Feature Set

Features are scoped to MVP, with v1.1 extensions noted. All adhere to modular design: e.g., Canvas rendering decoupled from UI state.

### 4.1 Core Canvas and Tiles
- **Pixel Canvas for Tile Editing**  
  - Configurable tile size (8x8, 16x16, 32x32 presets; custom input).  
  - Tools: Pencil (1px brush), eraser, flood fill, color picker (from palette), pan/zoom (mouse wheel/keyboard).  
  - Grid overlay (toggleable, snap-to-grid).  
  - Color palette: 32-color picker (expandable).  

- **Tile Palette**  
  - Scrollable grid view of tiles with auto-assigned IDs (0-based).  
  - Actions: Add new blank tile, duplicate, delete, select for map painting.  
  - Metadata: Optional rename/tags (stored per tile).  

### 4.2 Tilemap Editor
- **Tilemap Canvas**  
  - Configurable dimensions (width/height in tiles; min 1x1, max 256x256 for MVP).  
  - Painting: Left-click to place selected tile; right-click to erase (set to ID -1).  
  - Single layer (tile layer only; v1.1: Add object/background layers).  

- **View Options**  
  - Toggle grid lines (tile boundaries).  
  - Zoom (25%-400%) and pan (drag).  
  - Auto-fit to viewport.  

### 4.3 Export/Import
- **PNG Export**  
  - Tiles: Single spritesheet (grid-packed) or individual PNGs (batch download via ZIP.js client-side).  
  - Map: Full rasterized PNG (pixel-perfect via canvas scale).  

- **JSON Export**  
  - Tiled-compatible: Orthogonal map with embedded tileset data (width, height, tilewidth/height, layers array with CSV-compressed data field).  
  - Reference: https://doc.mapeditor.org/en/stable/reference/json-map-format/.  

- **Import**  
  - Tilesheet PNG: Upload and auto-slice by tile size (validation: dimensions must divide evenly).  
  - v1.1: Tiled JSON import (parse and populate palette/map).  

### 4.4 Project and Storage
- **Project Management**  
  - Actions: New, Open Recent (list in localStorage), Save (auto on change).  
  - Metadata: Name, thumbnail (canvas snapshot), last modified.  

- **Persistence**  
  - localStorage: Settings (theme, recent projects), UI prefs.  
  - IndexedDB: Tiles (as blobs), maps (JSON objects), with versioning (e.g., schema v1).  
  - Auto-save every 30s; conflict resolution via timestamps.  

### 4.5 UI & UX
- **Layout**  
  - Split-view: Left (palette/tools sidebar), Center (tabbed canvases: Tile Editor | Map Editor), Right (properties/exports panel).  
  - Responsive: Mobile-friendly zoom/pan (touch gestures).  

- **Shortcuts**  
  - Undo (Ctrl+Z), Redo (Ctrl+Y), Tool switch (1-5 keys), Zoom ( +/- ).  

- **Theming**  
  - Light/dark mode (shadcn/ui default, persist in localStorage).  

### 4.6 Non-Functional Requirements
- **Performance:** <100ms redraw on 64x64 map; handle 256 tiles.  
- **Accessibility:** Keyboard nav, high-contrast grids, ARIA labels.  
- **Security:** All data local; no external deps for core (e.g., no npm installs post-setup).  
- **Offline:** PWA-ready (manifest in v1.1).  

## 5. User Stories

Prioritized for MVP (as INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable).

1. **As Alex (Pixel Artist), I want a pixel canvas with pencil/eraser tools so I can draw aligned pixel art.** (MVP Core)  
2. **As Alex, I want to add/delete tiles in a palette so I can manage my asset library.** (MVP Core)  
3. **As Jordan (Level Designer), I want to paint tiles on a map grid so I can prototype layouts.** (MVP Core)  
4. **As Jordan, I want to export Tiled JSON so I can import directly into my engine.** (MVP Export)  
5. **As Sam (Hobbyist), I want auto-local saves so I don't lose work on refresh.** (MVP Storage)  
6. **As Sam, I want to import a PNG tilesheet so I can reuse external art.** (MVP Import)  
7. **As a user, I want dark mode toggle so I can match my environment.** (MVP UI)  
8. **v1.1: As Jordan, I want multi-layers so I can separate foreground/background.**  

## 6. Technical Specifications

### 6.1 Stack
- **Frontend:** Vite (build tool), React 18+, TypeScript 5+.  
- **Styling:** Tailwind CSS 4, shadcn/ui (primitives: Button, Dialog, Tabs, etc.).  
- **Canvas:** Native HTML5 Canvas API (no external libs for MVP; hooks for state).  
- **Storage:** idb-keyval or native IndexedDB wrapper (for blobs).  
- **Export:** Canvas.toBlob() for PNG; JSON.stringify for maps.  
- **Other:** ZIP.js for batch PNG exports (client-side).  

### 6.2 Data Models (TypeScript Interfaces)
Follow Tiled subset; modular (e.g., separate Tile.ts, Map.ts).

```typescript
interface Tile {
  id: number;
  name?: string;
  tags?: string[];
  data: Uint8ClampedArray; // Pixel data (r,g,b,a per pixel)
  width: number;
  height: number;
}

interface Tileset {
  tiles: Tile[];
  tilewidth: number;
  tileheight: number;
}

interface Layer {
  id: number;
  name: string;
  data: number[]; // Tile IDs (CSV-like, -1 for empty)
  width: number;
  height: number;
}

interface Map {
  version: '1.0';
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Layer[];
  tilesets: Tileset[]; // Embedded for MVP
}

interface Project {
  id: string;
  name: string;
  tileset: Tileset;
  map: Map;
  settings: { theme: 'light' | 'dark' };
  version: number;
  thumbnail?: string; // DataURL
}
```

- **Internal Schema:** Projects stored as JSON blobs in IndexedDB (store: 'projects'); tiles as separate blob store keyed by projectId + tileId.

### 6.3 Architecture Principles
- **SOLID:** Single Responsibility (e.g., TileCanvas component only renders; useTile hook manages state). Open-Closed (extensible tools via plugin pattern).  
- **Modular Design:** Feature folders (e.g., /src/features/tiles, /src/features/map); shared utils (/src/utils/canvas.ts for pan/zoom). No global state; Zustand or Context for app-wide (projects).  
- **No Breaking Changes:** Build atop existing starter (assume basic App.tsx, main.tsx); add routes/components without altering index.html or vite.config.ts.  
- **Testing:** Unit (Vitest for hooks), E2E (Playwright for canvas interactions).  

## 7. High-Level Implementation Plan

Development follows Agile: Epics as milestones, PRs as features, commits as atomic changes, subtasks as granular steps. Total MVP: ~8 weeks (assuming 1 dev). Prioritize: Foundations > Core Editing > Persistence > Export > Polish.

### Epic 1: Setup and Foundations (Week 1)
**Goal:** Rebrand and establish rendering base.  
**Dependencies:** Existing repo starter (Vite + React + TS; add Tailwind/shadcn if missing).  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-001 | Rebrand to TileR + Initial Setup | - Commit 1a: Update package.json/name to TileR; rm unrelated files (e.g., chatbot remnants).<br>- Commit 1b: Install deps (tailwindcss@4, shadcn/ui init, lucide-react icons).<br>- Subtask 1.1: Configure vite.config.ts for TS strict + Tailwind.<br>- Subtask 1.2: Scaffold layout (App.tsx with Sidebar, Main, Panel via shadcn Tabs). | 1 day |
| PR-002 | Domain Modeling | - Commit 2a: Add /src/types (Tile.ts, Map.ts, Project.ts interfaces).<br>- Subtask 2.1: Validate against Tiled JSON spec (mock data gen).<br>- Subtask 2.2: Utils for tile ID gen and data serialization. | 0.5 day |
| PR-003 | Reusable Canvas Component | - Commit 3a: Create /src/components/Canvas.tsx (base with drawImage, grid render).<br>- Commit 3b: Add hooks/useCanvas.ts (resize, ctx ref).<br>- Subtask 3.1: Implement pan/zoom (transform via ctx.setTransform).<br>- Subtask 3.2: Grid toggle (draw lines at tile intervals).<br>- SOLID: Canvas only renders; state external. | 2 days |

### Epic 2: Tile Editor and Palette (Weeks 2-3)
**Goal:** Enable tile creation/editing.  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-004 | Tile Palette UI | - Commit 4a: /src/features/tiles/Palette.tsx (grid view with shadcn Card).<br>- Subtask 4.1: Add/Del/Dup buttons (useState for tiles array).<br>- Subtask 4.2: Selection state (hover/click, emit selectedTileId). | 1 day |
| PR-005 | Pixel Editing Tools | - Commit 5a: /src/features/tiles/Editor.tsx (integrate Canvas for tile view).<br>- Commit 5b: Tools bar (shadcn ButtonGroup: pencil, eraser, etc.).<br>- Subtask 5.1: Pencil impl (onMouseDown/move/up: flood pixels via getImageData/putImageData).<br>- Subtask 5.2: Eraser/fill (transparent fill for bucket; color pick via getImageData).<br>- Subtask 5.3: Snap-to-grid (mouse pos % tileSize). | 3 days |
| PR-006 | Tile State Management | - Commit 6a: useTiles hook (/src/hooks/useTiles.ts) for CRUD.<br>- Subtask 6.1: Persist tile data as Uint8Array (serialize to blob for storage). | 1 day |

### Epic 3: Tilemap Editor (Weeks 4-5)
**Goal:** Map assembly with tile placement.  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-007 | Map Canvas Setup | - Commit 7a: /src/features/map/MapCanvas.tsx (extend Canvas for multi-tile).<br>- Subtask 7.1: Render tiles from palette (forEach cell: drawImage if ID >=0).<br>- Subtask 7.2: Config panel (inputs for width/height; resize data array). | 1.5 days |
| PR-008 | Map Painting | - Commit 8a: Painting logic (left-click: set data[y*width + x] = selectedId).<br>- Subtask 8.1: Right-click erase (set -1).<br>- Subtask 8.2: Zoom/pan sync with tile editor (shared hook). | 2 days |
| PR-009 | Layer Basics | - Commit 9a: Single layer impl (Layer interface in map state).<br>- Subtask 9.1: Toggle visibility (MVP: always on). | 0.5 day |

### Epic 4: Storage and Persistence (Week 6)
**Goal:** Local project handling.  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-010 | IndexedDB Abstraction | - Commit 10a: /src/storage/db.ts (IDB wrapper: get/put for 'tiles'/'projects' stores).<br>- Subtask 10.1: Blob handling for tile images (URL.createObjectURL).<br>- Subtask 10.2: Versioning (onupgradeneeded: add indexes). | 1.5 days |
| PR-011 | Project Flows | - Commit 11a: /src/features/projects/ProjectManager.tsx (New/Open/Save).<br>- Subtask 11.1: localStorage for recents (JSON.parse list).<br>- Subtask 11.2: Auto-save hook (debounce setInterval to db.put). | 1.5 days |
| PR-012 | Import Tilesheet | - Commit 12a: File upload (useRef input; canvas drawImage + slice).<br>- Subtask 12.1: Validate/even divide (throw toast error via shadcn). | 1 day |

### Epic 5: Export Flows (Week 7)
**Goal:** Asset output.  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-013 | PNG Exports | - Commit 13a: /src/utils/exportPng.ts (tilesheet: composite canvas; map: scale draw).<br>- Subtask 13.1: Individual tiles (loop toBlob + a.download).<br>- Subtask 13.2: ZIP batch (add ZIP.js dep). | 2 days |
| PR-014 | Tiled JSON Export | - Commit 14a: /src/utils/exportJson.ts (map internal to Tiled format).<br>- Subtask 14.1: Embed tileset (base64 images in tiles); CSV data compression.<br>- Subtask 14.2: Download via Blob URL. | 1.5 days |

### Epic 6: Polish and UX (Week 8)
**Goal:** Shortcuts, theming, testing.  

| PR # | Title | Commits/Subtasks | Est. Effort |
|------|-------|------------------|-------------|
| PR-015 | Keyboard Shortcuts & Theming | - Commit 15a: useHotkeys hook (hotkeys-js dep if needed).<br>- Subtask 15.1: Map keys to actions (e.g., 'P' for pencil).<br>- Subtask 15.2: Theme toggle (shadcn theme provider). | 1 day |
| PR-016 | Error Handling & Undo | - Commit 16a: Global toast (shadcn Toaster for validations).<br>- Subtask 16.1: Basic undo stack (useReducer for actions: paint, resize).<br>- Subtask 16.2: E2E tests (Playwright: simulate draws). | 2 days |
| PR-017 | MVP Integration & Deploy | - Commit 17a: Wire tabs (Tile/Map switch).<br>- Subtask 17.1: Full project load (hydrate from DB).<br>- Subtask 17.2: Vite build/deploy to GitHub Pages. | 1 day |

## 8. Risks and Mitigations
- **Risk:** Canvas perf on large maps. **Mitigation:** OffscreenCanvas polyfill; limit dims.  
- **Risk:** IndexedDB browser quirks. **Mitigation:** Fallback to localStorage strings; test on Chrome/FF/Safari.  
- **Risk:** Tiled format mismatches. **Mitigation:** Unit tests with sample JSON validation.  

## 9. Future Roadmap (v1.1+)
- Multi-layer support.  
- PWA install/manifest.  
- Advanced tools (selection, animation frames).  
- Cloud sync (optional Firebase).  
