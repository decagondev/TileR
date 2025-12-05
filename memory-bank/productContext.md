# TileR Product Context

## Why TileR Exists

Current workflows for pixel-art and tilemap creation require switching between specialized tools (e.g., Aseprite for pixels, Tiled for maps), leading to:
- Manual syncing of assets, IDs, and formats
- Inefficient iteration for hobbyists and indie devs
- Lack of integrated browser-based solutions
- Backend dependencies or complex setups

TileR solves this by combining both editors in one offline-capable app, with direct exports to PNG (spritesheets/individuals) and Tiled JSON.

## Target User Personas

### 1. Pixel Artist (Alex, 28, Freelance Illustrator)

**Needs:**
- Grid-aligned drawing tools
- Tile variations management
- PNG exports for asset pipelines

**Pain Points:**
- Tedious export/import between apps
- Manual asset organization

**How TileR Helps:**
- Dedicated pixel canvas with palette management
- Direct PNG export (spritesheet or individual tiles)
- Integrated tile library

### 2. Level Designer (Jordan, 35, Indie Game Dev)

**Needs:**
- Grid-based painting
- Map resizing
- Tiled JSON for engine import

**Pain Points:**
- Mismatched tile IDs across tools
- Format conversion overhead

**How TileR Helps:**
- Unified map editor with tile referencing
- Direct Tiled JSON export
- Consistent tile ID management

### 3. Hobbyist Dev (Sam, 22, Student)

**Needs:**
- Offline prototyping
- Local saves
- Easy import from existing spritesheets

**Pain Points:**
- Server dependencies
- Complex setups
- Data loss on refresh

**How TileR Helps:**
- Browser-only, auto-persisting projects
- No server required
- Import existing tilesheets

## User Experience Goals

### Workflow Efficiency
- Single interface for tile creation and map assembly
- No context switching between tools
- Immediate visual feedback

### Offline Capability
- 100% client-side operation
- Auto-save every 30 seconds
- Persistent storage across sessions

### Export Integration
- Tiled-compatible JSON format
- PNG spritesheets for asset pipelines
- Individual tile exports for reuse

### Accessibility
- Keyboard navigation
- High-contrast grids
- ARIA labels for screen readers

## Integration Points

### Tiled Compatibility
- Export to Tiled JSON format (orthogonal maps)
- Embedded tileset data
- CSV-compressed layer data
- Reference: https://doc.mapeditor.org/en/stable/reference/json-map-format/

### Game Engine Integration
- Standard PNG spritesheets
- Tiled JSON import ready
- Consistent tile dimensions

## User Stories (MVP Priority)

1. **As Alex (Pixel Artist), I want a pixel canvas with pencil/eraser tools so I can draw aligned pixel art.**
2. **As Alex, I want to add/delete tiles in a palette so I can manage my asset library.**
3. **As Jordan (Level Designer), I want to paint tiles on a map grid so I can prototype layouts.**
4. **As Jordan, I want to export Tiled JSON so I can import directly into my engine.**
5. **As Sam (Hobbyist), I want auto-local saves so I don't lose work on refresh.**
6. **As Sam, I want to import a PNG tilesheet so I can reuse external art.**
7. **As a user, I want dark mode toggle so I can match my environment.**

