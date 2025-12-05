# TileR Project Brief

## Product Overview

**Product Name:** TileR  
**Version:** 1.0 (MVP)  
**Date:** December 05, 2025

TileR is a lightweight, browser-based React application designed as a unified pixel-art tile editor and tilemap composer. It enables users to create, edit, and export pixel-art tiles and tilemaps in formats compatible with tools like Tiled and game engines, all while maintaining full offline capability through localStorage and IndexedDB.

## Core Purpose

TileR addresses the fragmentation in pixel-art and level design workflows by providing a single, intuitive interface that combines both tile editing and map composition. Users no longer need to switch between specialized tools (e.g., Aseprite for pixels, Tiled for maps), eliminating manual syncing of assets, IDs, and formats.

## Key Goals

- Streamline tile creation and map assembly in a single SPA
- Ensure 100% client-side operation with seamless persistence
- Deliver Tiled-compatible exports for immediate integration
- Provide offline-first functionality with zero data loss

## Success Metrics (Post-MVP)

- User retention: 70% of sessions >10 minutes
- Export usage: 80% of projects exported in PNG/JSON
- Offline functionality: Zero data loss in browser tests

## MVP Scope

The initial MVP focuses on:
- Core editing (pixel canvas, tile palette, tilemap editor)
- Persistence (localStorage for settings, IndexedDB for projects)
- Export features (PNG spritesheets, individual tiles, Tiled JSON)
- Single-layer tilemaps (multi-layer support planned for v1.1)

## Technical Foundation

- **Stack:** Vite + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui
- **Storage:** IndexedDB for projects/tiles, localStorage for settings
- **Canvas:** Native HTML5 Canvas API (no external libs for MVP)
- **Export:** Canvas.toBlob() for PNG, JSON.stringify for maps

## Development Principles

- **SOLID Principles:** Single responsibility for components, open-closed for extensibility
- **Modular Design:** Separate concerns for canvas rendering, storage, and export
- **No Breaking Changes:** Build atop existing starter without altering core config
- **Offline-First:** All data local; no external dependencies for core functionality

## Future Roadmap (v1.1+)

- Multi-layer support (object/background layers)
- PWA install/manifest
- Advanced tools (selection, animation frames)
- Cloud sync (optional Firebase)
- Tiled JSON import

## Reference Documents

- [Product Requirements Document](../docs/PRD.md)
- [Task List](../docs/TASKS.md)

