# TileR System Patterns

## Architecture Principles

### SOLID Principles

**Single Responsibility:**
- Canvas components only handle rendering
- State management in separate hooks (e.g., `useTiles`, `useCanvas`)
- Storage logic abstracted in `/src/storage/` modules

**Open-Closed:**
- Tools extensible via plugin pattern
- Canvas rendering decoupled from UI state
- Export formats can be added without modifying core

**Dependency Inversion:**
- Components depend on interfaces, not concrete implementations
- Storage abstraction allows swapping IndexedDB implementation

### Modular Design

**Feature-Based Organization:**
```
/src/features/
  /tiles/          # Tile editing functionality
  /map/            # Tilemap editing functionality
  /projects/       # Project management
```

**Shared Utilities:**
```
/src/utils/
  /canvas.ts       # Pan/zoom utilities
  /exportPng.ts    # PNG export logic
  /exportJson.ts   # Tiled JSON export
```

**Component Structure:**
- Presentational components in `/src/components/`
- Feature-specific components in `/src/features/[feature]/`
- Reusable UI primitives in `/src/components/ui/`

## Data Models

### Core Interfaces

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

### Storage Schema

**IndexedDB Stores:**
- `projects`: Project metadata and structure (JSON)
- `tiles`: Tile pixel data as Blobs (keyed by projectId + tileId)
- `settings`: User preferences (localStorage fallback)

**Versioning:**
- Schema versioning via `onupgradeneeded`
- Project version field for migration support

## Canvas Rendering Patterns

### Base Canvas Component

**Responsibilities:**
- Handle resize and redraw
- Manage canvas context reference
- Render grid overlay (toggleable)
- Coordinate transformations (pan/zoom)

**State Management:**
- Canvas rendering is stateless (props-driven)
- Transform state managed externally via hooks

### Pan/Zoom Implementation

**Pattern:**
- Use `ctx.setTransform()` for coordinate transformations
- Mouse wheel zoom centered on cursor position
- Middle-click/drag for panning
- Touch gestures for mobile (pinch zoom, two-finger pan)

### Grid Rendering

**Pattern:**
- Draw vertical/horizontal lines at tile intervals
- Respect current zoom and pan transforms
- Toggleable via prop
- High-contrast for accessibility

## Storage Patterns

### IndexedDB Abstraction

**Wrapper Pattern:**
```typescript
// /src/storage/db.ts
export const db = {
  save: async <T>(storeName: string, data: T): Promise<IDBValidKey>
  get: async <T>(storeName: string, id: IDBValidKey): Promise<T | undefined>
  getAll: async <T>(storeName: string): Promise<T[]>
  delete: async (storeName: string, id: IDBValidKey): Promise<void>
}
```

**Blob Handling:**
- Store tile images as Blobs in IndexedDB
- Use `URL.createObjectURL()` for rendering
- Clean up object URLs to prevent memory leaks

### Auto-Save Pattern

**Implementation:**
- Debounced save every 30 seconds
- Save on tab close / visibility change
- Conflict resolution via timestamps
- Generate thumbnail (canvas snapshot) on save

### localStorage Usage

**Settings Storage:**
- Theme preference
- Recent projects list (max 10)
- UI preferences (grid visibility, etc.)

## Component Patterns

### Canvas Components

**Separation:**
- Canvas rendering: Pure rendering logic
- State management: External hooks (`useCanvas`, `useTiles`)
- Event handling: Props callbacks (`onDraw`, `onMouseDown`, etc.)

### Tool System

**Pattern:**
- Tool enum: `Pencil | Eraser | Fill | Picker`
- Tool state in store/hook
- Tool-specific handlers passed to canvas

### Export Patterns

**PNG Export:**
- Use `canvas.toBlob()` for conversion
- Spritesheet: Composite canvas with grid layout
- Individual tiles: Loop through tiles, create blob, download
- ZIP batch: Use ZIP.js for client-side compression

**Tiled JSON Export:**
- Map internal format to Tiled spec
- Embed tileset with base64 images
- CSV-compressed layer data
- Validate against official Tiled examples

## Performance Patterns

### Canvas Optimization

- Use `OffscreenCanvas` for large operations (if supported)
- Limit map dimensions (256x256 max for MVP)
- Optimize redraw: only affected region
- Debounce expensive operations

### State Management

- No global state for MVP
- Zustand or Context + Reducer for app-wide state (projects)
- Local state for component-specific data

## Testing Patterns

### Unit Tests (Vitest)
- Test hooks in isolation
- Mock canvas context
- Validate data transformations

### E2E Tests (Playwright)
- Simulate canvas interactions
- Test full workflows (create → edit → save → export)
- Verify Tiled JSON output

