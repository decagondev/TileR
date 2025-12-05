import { create } from "zustand";
import type { Tile, ToolType } from "@/types";
import { ToolType as ToolTypeEnum } from "@/types/ToolType";
import { createDefaultTileset } from "@/utils/mockData";

interface TilesStore {
  // State
  tiles: Tile[];
  selectedTileId: number | null;
  currentTool: ToolType;
  primaryColor: string; // hex format
  secondaryColor: string; // hex format
  colorPalette: string[]; // 32 colors in hex format
  showGrid: boolean;

  // Actions
  addTile: (tile: Tile) => void;
  deleteTile: (id: number) => void;
  duplicateTile: (id: number) => void;
  updateTilePixels: (id: number, data: Uint8ClampedArray) => void;
  updateTile: (id: number, updates: Partial<Tile>) => void;
  selectTile: (id: number | null) => void;
  setTool: (tool: ToolType) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  updateColorPalette: (index: number, color: string) => void;
  toggleGrid: () => void;
  resetStore: () => void;
}

// Default 32-color palette (common pixel art colors)
const DEFAULT_COLOR_PALETTE = [
  "#000000FF", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
  "#808080", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080", "#C0C0C0",
  "#FF8080", "#80FF80", "#8080FF", "#FFFF80", "#FF80FF", "#80FFFF", "#FFC0C0", "#C0FFC0",
  "#C0C0FF", "#FFFFC0", "#FFC0FF", "#C0FFFF", "#FFA500", "#A52A2A", "#FF1493", "#00CED1",
];

// Initialize with default tileset
const defaultTileset = createDefaultTileset();
const initialTiles = defaultTileset.tiles;

export const useTilesStore = create<TilesStore>((set, _get) => ({
  // Initial state
  tiles: initialTiles,
  selectedTileId: initialTiles.length > 0 ? initialTiles[0].id : null,
  currentTool: ToolTypeEnum.Pencil,
  primaryColor: "#000000FF",
  secondaryColor: "#FFFFFFFF",
  colorPalette: DEFAULT_COLOR_PALETTE,
  showGrid: true,

  // Actions
  addTile: (tile: Tile) => {
    set((state) => ({
      tiles: [...state.tiles, tile],
      selectedTileId: tile.id,
    }));
  },

  deleteTile: (id: number) => {
    set((state) => {
      const newTiles = state.tiles.filter((t) => t.id !== id);
      const newSelectedId =
        state.selectedTileId === id
          ? newTiles.length > 0
            ? newTiles[0].id
            : null
          : state.selectedTileId;
      return {
        tiles: newTiles,
        selectedTileId: newSelectedId,
      };
    });
  },

  duplicateTile: (id: number) => {
    set((state) => {
      const tileToDuplicate = state.tiles.find((t) => t.id === id);
      if (!tileToDuplicate) return state;

      // Find next available ID
      const maxId = Math.max(...state.tiles.map((t) => t.id), -1);
      const newId = maxId + 1;

      // Deep copy pixel data
      const newData = new Uint8ClampedArray(tileToDuplicate.data);

      const newTile: Tile = {
        id: newId,
        name: tileToDuplicate.name ? `${tileToDuplicate.name} (copy)` : undefined,
        tags: tileToDuplicate.tags ? [...tileToDuplicate.tags] : undefined,
        data: newData,
        width: tileToDuplicate.width,
        height: tileToDuplicate.height,
      };

      return {
        tiles: [...state.tiles, newTile],
        selectedTileId: newId,
      };
    });
  },

  updateTilePixels: (id: number, data: Uint8ClampedArray) => {
    set((state) => ({
      tiles: state.tiles.map((t) =>
        t.id === id ? { ...t, data: new Uint8ClampedArray(data) } : t
      ),
    }));
  },

  updateTile: (id: number, updates: Partial<Tile>) => {
    set((state) => ({
      tiles: state.tiles.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  selectTile: (id: number | null) => {
    set({ selectedTileId: id });
  },

  setTool: (tool: ToolType) => {
    set({ currentTool: tool });
  },

  setPrimaryColor: (color: string) => {
    set({ primaryColor: color });
  },

  setSecondaryColor: (color: string) => {
    set({ secondaryColor: color });
  },

  updateColorPalette: (index: number, color: string) => {
    set((state) => {
      const newPalette = [...state.colorPalette];
      if (index >= 0 && index < newPalette.length) {
        newPalette[index] = color;
      }
      return { colorPalette: newPalette };
    });
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  resetStore: () => {
    const defaultTileset = createDefaultTileset();
    set({
      tiles: defaultTileset.tiles,
      selectedTileId: defaultTileset.tiles.length > 0 ? defaultTileset.tiles[0].id : null,
      currentTool: ToolTypeEnum.Pencil,
      primaryColor: "#000000FF",
      secondaryColor: "#FFFFFFFF",
      colorPalette: DEFAULT_COLOR_PALETTE,
      showGrid: true,
    });
  },
}));

