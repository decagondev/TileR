# TileR MVP Task List – Granular Checklist

Below is a fully granular, tick-box-ready task list based on the approved PRD.  
All tasks follow SOLID principles, modular design, and no breaking changes to the existing starter repo.

### Epic 1: Setup and Foundations
- [ ] **PR-001: Rebrand to TileR + Initial Setup**
  - [ ] Update `package.json` name, description, and version to "TileR"
  - [ ] Update `README.md` title and content to reflect TileR branding
  - [ ] Remove any unrelated files/folders from previous project (e.g., old chatbot code)
  - [ ] Install and configure Tailwind CSS v4
    - [ ] Run `npm install -D tailwindcss postcss autoprefixer`
    - [ ] Generate `tailwind.config.js` and `postcss.config.js`
    - [ ] Add Tailwind directives to `src/index.css`
  - [ ] Initialize shadcn/ui
    - [ ] Run `npx shadcn-ui@latest init`
    - [ ] Install required components: Button, Card, Dialog, Tabs, Input, Label, Separator, Toaster, ScrollArea
  - [ ] Install lucide-react for icons
  - [ ] Create basic layout skeleton in `App.tsx` (Left Sidebar, Center Main, Right Panel placeholders)
  - [ ] Add dark mode provider using shadcn/ui theme system
  - [ ] Verify build and hot reload work (`npm run dev`)

- [ ] **PR-002: Domain Modeling**
  - [ ] Create `/src/types` folder
  - [ ] Add `Tile.ts` interface
  - [ ] Add `Tileset.ts` interface
  - [ ] Add `Layer.ts` interface
  - [ ] Add `Map.ts` interface (Tiled-compatible subset)
  - [ ] Add `Project.ts` interface
  - [ ] Add `ToolType.ts` enum (Pencil, Eraser, Fill, Picker)
  - [ ] Create `/src/utils/id.ts` for generating unique IDs
  - [ ] Create mock data generator for testing (e.g., default 16x16 blank tile)

- [ ] **PR-003: Reusable Canvas Component**
  - [ ] Create `/src/components/canvas/Canvas.tsx`
    - [ ] Accept props: width, height, scale, offsetX, offsetY, onDraw callback
    - [ ] Use `useRef` for canvas element
    - [ ] Use `useEffect` to handle resize and redraw
  - [ ] Create `/src/hooks/useCanvas.ts`
    - [ ] Manage canvas context, scale, pan state
    - [ ] Provide functions: zoomIn, zoomOut, resetView, pan(dx, dy)
  - [ ] Implement grid rendering (toggleable)
    - [ ] Draw vertical and horizontal lines at tile intervals
    - [ ] Respect current zoom and pan
  - [ ] Add mouse wheel zoom (centered on cursor)
  - [ ] Add middle-click/drag panning
  - [ ] Add touch gesture support (pinch zoom, two-finger pan)
  - [ ] Write unit tests for grid drawing and coordinate transforms

### Epic 2: Tile Editor and Palette
- [ ] **PR-004: Tile Palette UI**
  - [ ] Create `/src/features/tiles/Palette.tsx`
  - [ ] Render tiles in a scrollable grid using `ScrollArea`
  - [ ] Show tile preview (scaled canvas or img)
  - [ ] Highlight selected tile
  - [ ] Add "New Tile" button (creates blank tile)
  - [ ] Add "Duplicate" button (active when tile selected)
  - [ ] Add "Delete" button (with confirmation dialog)
  - [ ] Show tile ID and optional name
  - [ ] Emit selected tile ID via context or callback

- [ ] **PR-005: Pixel Editing Tools**
  - [ ] Create `/src/features/tiles/Editor.tsx`
  - [ ] Integrate reusable Canvas component (1:1 pixel view)
  - [ ] Create tool selector bar (shadcn ButtonGroup)
    - [ ] Pencil tool
    - [ ] Eraser tool
    - [ ] Fill (bucket) tool
    - [ ] Color picker (eyedropper)
  - [ ] Implement pencil drawing
    - [ ] Track mouse/touch down/move/up
    - [ ] Draw single pixels on move while button held
  - [ ] Implement eraser (draw transparent)
  - [ ] Implement flood fill (4-way)
  - [ ] Implement color picker (sample pixel under cursor)
  - [ ] Add primary/secondary color selector (left/right click colors)
  - [ ] Add 32-slot color palette UI (click to select)
  - [ ] Snap all drawing to pixel grid
  - [ ] Add grid overlay toggle button

- [ ] **PR-006: Tile State Management**
  - [ ] Create `/src/store/useTilesStore.ts` (Zustand or Context + Reducer)
    - [ ] State: tiles array, selectedTileId, currentTool, primaryColor, secondaryColor
    - [ ] Actions: addTile, deleteTile, duplicateTile, updateTilePixels, selectTile
  - [ ] Persist tile pixel data as `Uint8ClampedArray`
  - [ ] Serialize/deserialize tile data for storage
  - [ ] Add undo/redo stack for tile edits (optional for MVP if time allows)

### Epic 3: Tilemap Editor
- [ ] **PR-007: Map Canvas Setup**
  - [ ] Create `/src/features/map/MapCanvas.tsx`
  - [ ] Use reusable Canvas component with map dimensions
  - [ ] Render tiles based on layer data (drawImage from tile blobs)
  - [ ] Handle empty cells (skip or draw transparent)
  - [ ] Create map config panel
    - [ ] Inputs for map width and height (in tiles)
    - [ ] Update map data array on resize (pad or truncate)
  - [ ] Add "Resize Map" confirmation dialog

- [ ] **PR-008: Map Painting**
  - [ ] Listen for mouse/touch events on map canvas
  - [ ] On left-click/drag: place selected tile ID at grid position
  - [ ] On right-click/drag: erase (set tile ID to -1)
  - [ ] Convert screen coords → tile coords (respect zoom/pan)
  - [ ] Optimize redraw: only affected region
  - [ ] Add hover preview (semi-transparent tile overlay)
  - [ ] Sync zoom/pan state between tile editor and map editor

- [ ] **PR-009: Layer Basics**
  - [ ] Add single tile layer to map state
  - [ ] Create layer panel (name, visibility toggle, opacity slider)
  - [ ] Render layers in order (foreground on top)
  - [ ] Prepare structure for future multi-layer support (array of layers)

### Epic 4: Storage and Persistence
- [ ] **PR-010: IndexedDB Abstraction**
  - [ ] Create `/src/storage/db.ts`
  - [ ] Initialize DB with stores: `projects`, `tiles`, `settings`
  - [ ] Implement async functions: getProject, saveProject, listProjects
  - [ ] Store tile pixel data as Blobs
  - [ ] Handle DB upgrade (versioning)
  - [ ] Add fallback error logging

- [ ] **PR-011: Project Flows**
  - [ ] Create `/src/features/projects/ProjectManager.tsx`
  - [ ] "New Project" → prompt name → create default tiles/map
  - [ ] "Open Recent" → read from localStorage → load from IndexedDB
  - [ ] Auto-save every 30 seconds (debounced)
  - [ ] Save on tab close / visibility change
  - [ ] Generate thumbnail (canvas snapshot) on save
  - [ ] Store recent projects list in localStorage (max 10)

- [ ] **PR-012: Import Tilesheet**
  - [ ] Add file input (hidden, triggered by button)
  - [ ] On file select: draw image to offscreen canvas
  - [ ] Validate dimensions divisible by tile size
  - [ ] Slice into individual tiles (loop over grid)
  - [ ] Add all tiles to palette
  - [ ] Show success toast with count
  - [ ] Show error toast if invalid

### Epic 5: Export Flows
- [ ] **PR-013: PNG Exports**
  - [ ] Create `/src/utils/exportPng.ts`
  - [ ] Export single spritesheet
    - [ ] Create composite canvas (grid layout)
    - [ ] Draw all tiles in order
    - [ ] Trigger download via `toBlob()`
  - [ ] Export individual tiles
    - [ ] Loop through tiles → create blob → download
  - [ ] Export map as PNG
    - [ ] Use map canvas → `toBlob()` at full resolution
  - [ ] Install and use `jszip` for batch ZIP download
  - [ ] Add export buttons to UI (spritesheet, individuals, map)

- [ ] **PR-014: Tiled JSON Export**
  - [ ] Create `/src/utils/exportTiledJson.ts`
  - [ ] Map internal format → Tiled JSON spec
    - [ ] Set `orientation: "orthogonal"`
    - [ ] Embed tileset with image data (base64 PNG per tile)
    - [ ] Generate `data` array (CSV format, global tile IDs)
    - [ ] Include required fields: version, tiledversion, tilewidth, etc.
  - [ ] Stringify and trigger download as `.json`
  - [ ] Validate output against official Tiled example
  - [ ] Add export button in map panel

### Epic 6: Polish and UX
- [ ] **PR-015: Keyboard Shortcuts & Theming**
  - [ ] Install `hotkeys-js` or use native event listeners
  - [ ] Implement shortcuts:
    - [ ] Ctrl+Z / Cmd+Z → Undo
    - [ ] Ctrl+Y / Cmd+Shift+Z → Redo
    - [ ] 1 → Pencil, 2 → Eraser, 3 → Fill, 4 → Picker
    - [ ] +/- → Zoom in/out
    - [ ] 0 → Reset view
    - [ ] G → Toggle grid
  - [ ] Add theme toggle button (sun/moon icon)
  - [ ] Persist theme in localStorage

- [ ] **PR-016: Error Handling & Basic Undo**
  - [ ] Set up global Toaster (shadcn)
  - [ ] Show user-friendly errors (e.g., invalid tilesheet size)
  - [ ] Implement simple undo stack for map painting
    - [ ] Store previous layer data on change
    - [ ] Max 20 steps
  - [ ] Add undo/redo buttons to toolbar

- [ ] **PR-017: MVP Integration & Deploy**
  - [ ] Create tab switcher: "Tile Editor" ↔ "Map Editor"
  - [ ] Wire full project load flow (open → hydrate stores)
  - [ ] Ensure auto-save works across tabs
  - [ ] Test full workflow: create → edit → save → reload → export
  - [ ] Add basic Playwright E2E tests
    - [ ] Draw a tile
    - [ ] Paint on map
    - [ ] Export JSON
  - [ ] Configure GitHub Pages deployment
  - [ ] Final build and deploy
