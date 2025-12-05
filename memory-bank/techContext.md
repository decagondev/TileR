# TileR Technical Context

## Technology Stack

### Core Framework
- **React 19+**: UI framework with latest features
- **TypeScript 5+**: Type safety and developer experience
- **Vite 7+**: Build tool and dev server

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **lucide-react**: Icon library

### Browser APIs
- **HTML5 Canvas API**: Native canvas rendering (no external libs for MVP)
- **IndexedDB**: Persistent storage for projects and tile blobs
- **localStorage**: Settings and UI preferences
- **File API**: Import tilesheet PNGs

### Additional Libraries
- **ZIP.js**: Client-side ZIP creation for batch tile exports
- **react-router-dom**: Routing (already in codebase, may be repurposed)

## Development Setup

### Prerequisites
- Node.js (version compatible with Vite 7)
- npm or compatible package manager

### Installation
```bash
npm install
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Configuration Files

**vite.config.ts:**
- React plugin
- Tailwind CSS plugin
- Path alias: `@` → `./src`
- TypeScript path resolution

**tsconfig.json:**
- Base configuration
- Path aliases for `@/*`
- References to `tsconfig.app.json` and `tsconfig.node.json`

**components.json:**
- shadcn/ui configuration
- Style: "new-york"
- Component aliases
- Tailwind CSS variables setup

## Build Configuration

### Vite Configuration
- React plugin for JSX/TSX support
- Tailwind CSS plugin for PostCSS processing
- Path aliases for clean imports (`@/components`, `@/lib`, etc.)

### TypeScript Configuration
- Strict mode enabled
- Path mapping for `@/*` alias
- Separate configs for app and node environments

### Tailwind CSS
- v4 with custom theme variables
- CSS variables for theming (light/dark mode)
- Custom radius and color tokens
- Dark mode variant support

## Dependencies

### Production Dependencies
- `react`, `react-dom`: React framework
- `@tailwindcss/vite`: Tailwind CSS integration
- `@radix-ui/react-slot`: Radix UI primitives
- `class-variance-authority`, `clsx`, `tailwind-merge`: Styling utilities
- `lucide-react`: Icons
- `react-router-dom`: Routing (existing, may be repurposed)

### Development Dependencies
- `@vitejs/plugin-react`: Vite React plugin
- `typescript`: TypeScript compiler
- `eslint`: Linting
- `@types/react`, `@types/react-dom`: TypeScript types

### Future Dependencies (Epic 5+)
- `jszip`: ZIP file creation for batch exports
- `hotkeys-js` (optional): Keyboard shortcuts
- `vitest`: Unit testing
- `@playwright/test`: E2E testing

## Browser Compatibility

### Target Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

### Required Features
- HTML5 Canvas API
- IndexedDB
- localStorage
- File API (FileReader)
- ES6+ JavaScript features

### Polyfills
- None required for MVP
- OffscreenCanvas polyfill may be needed for performance optimization

## Development Workflow

### Code Organization
```
src/
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components
│   └── canvas/      # Canvas-related components
├── features/        # Feature modules
│   ├── tiles/       # Tile editing
│   ├── map/         # Map editing
│   └── projects/    # Project management
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
│   └── utils.ts     # General utilities
├── storage/          # Storage abstractions
│   └── db.ts        # IndexedDB wrapper
├── types/           # TypeScript interfaces
└── utils/           # Export utilities
    ├── exportPng.ts
    └── exportJson.ts
```

### Import Patterns
- Use `@/` alias for src-relative imports
- Feature modules import from shared utilities
- Components import from `@/components/ui` for primitives

## Performance Considerations

### Canvas Performance
- Limit map dimensions (256x256 tiles max for MVP)
- Optimize redraw regions
- Use requestAnimationFrame for smooth animations
- Consider OffscreenCanvas for heavy operations

### Storage Performance
- Index tile blobs separately from project metadata
- Batch operations where possible
- Debounce auto-save operations

### Build Performance
- Vite's fast HMR for development
- Tree-shaking for production builds
- Code splitting for future feature modules

## Security Considerations

### Client-Side Only
- No server-side code
- No external API calls for core functionality
- All data stored locally

### Data Validation
- Validate imported tilesheet dimensions
- Sanitize user input (project names, etc.)
- Validate Tiled JSON structure before export

## Future Technical Considerations

### PWA Support (v1.1)
- Service worker for offline functionality
- Web app manifest
- Install prompt

### Cloud Sync (Future)
- Optional Firebase integration
- Encrypted data transmission
- Conflict resolution strategies

