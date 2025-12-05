# TileR - Pixel Art Tile Editor & Tilemap Composer

A lightweight, browser-based React application designed as a unified pixel-art tile editor and tilemap composer. Create, edit, and export pixel-art tiles and tilemaps in formats compatible with tools like Tiled and game engines, all while maintaining full offline capability through localStorage and IndexedDB.

## Features

- **Pixel Canvas for Tile Editing**: Configurable tile sizes (8x8, 16x16, 32x32 presets; custom input) with tools: Pencil, Eraser, Flood Fill, Color Picker
- **Tile Palette**: Scrollable grid view of tiles with auto-assigned IDs, add/duplicate/delete functionality
- **Tilemap Editor**: Grid-based painting with configurable dimensions (1x1 to 256x256 tiles)
- **Export/Import**: 
  - PNG export (spritesheet, individual tiles, map rasterization)
  - Tiled-compatible JSON export
  - Import tilesheet PNGs with auto-slicing
- **Project Management**: Auto-save to IndexedDB, recent projects list, offline-first operation
- **Dark Mode**: Beautiful dark theme with light mode support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser to the local development URL (typically `http://localhost:5173`)

## Tech Stack

- **Frontend Framework**: React 19 + TypeScript 5
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Canvas**: Native HTML5 Canvas API
- **Storage**: IndexedDB for projects/tiles, localStorage for settings
- **Icons**: lucide-react

## Project Structure

```
src/
├── components/          # React components
│   ├── canvas/         # Canvas rendering components
│   ├── layout/         # Layout components (Sidebar, Main, Panel)
│   └── ui/             # shadcn/ui components
├── features/           # Feature modules
│   ├── tiles/          # Tile editing
│   ├── map/            # Map editing
│   └── projects/        # Project management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── storage/            # Storage abstractions (IndexedDB)
├── types/              # TypeScript interfaces
└── utils/              # Export utilities
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. **Create a Project**: Start a new project or open a recent one
2. **Edit Tiles**: Use the Tile Editor to create pixel art tiles with drawing tools
3. **Build Maps**: Use the Map Editor to paint tiles onto a tilemap grid
4. **Export**: Export your work as PNG spritesheets or Tiled-compatible JSON

## License

See [LICENSE](LICENSE) file for details.
