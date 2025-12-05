# TileR Active Context

## Current Work Focus

**Epic:** Epic 0 - Memory Bank & Cursor Rules Initialization  
**Status:** In Progress  
**Date:** December 05, 2025

Establishing the foundation for project documentation and AI assistance by creating comprehensive memory bank files and cursor rules that will guide development throughout the TileR project lifecycle.

## Recent Changes

- Created memory-bank/ directory structure
- Created .cursor/rules/ directory structure
- Initialized core documentation files
- Established project-specific development guidelines

## Next Steps

After Epic 0 completion:
- **Epic 1: Setup and Foundations** - Rebrand to TileR, install dependencies, create reusable Canvas component
- **Epic 2: Tile Editor and Palette** - Implement pixel editing tools and tile management
- **Epic 3: Tilemap Editor** - Build map canvas and painting functionality
- **Epic 4: Storage and Persistence** - IndexedDB abstraction and project management
- **Epic 5: Export Flows** - PNG and Tiled JSON export implementation
- **Epic 6: Polish and UX** - Keyboard shortcuts, theming, error handling

## Active Decisions

### Codebase Strategy
- **Keeping chatbot code:** The existing chatbot infrastructure (SupportBot, groqClient, vectorDB, etc.) will be preserved for future repurposing as tooling/assistance features
- **No rebranding yet:** Rebranding to TileR will occur in later epics (Epic 6: Polish and UX) as part of final polish
- **Build on existing starter:** All additions will follow SOLID principles and modular design without breaking changes

### Architecture Decisions
- **Feature-based organization:** `/src/features/tiles`, `/src/features/map` structure
- **Canvas component:** Reusable base component with pan/zoom capabilities
- **State management:** Zustand or Context + Reducer (no global state)
- **Storage strategy:** IndexedDB for projects/tiles (blobs), localStorage for settings

### Development Approach
- **SOLID principles:** Single responsibility, open-closed for extensibility
- **Modular design:** Separate concerns for rendering, state, and storage
- **Type safety:** Strict TypeScript with comprehensive interfaces
- **Testing:** Unit tests (Vitest) and E2E tests (Playwright)

## Current Blockers

None at this time.

## Key Considerations

- All development must maintain backward compatibility with existing codebase
- Canvas performance optimization critical for large maps (256x256 max for MVP)
- IndexedDB browser compatibility testing required (Chrome/FF/Safari)
- Tiled JSON format validation essential for engine compatibility

