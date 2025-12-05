import { create } from "zustand";
import type { Map } from "@/types";
import { createDefaultMap } from "@/utils/mockData";

interface MapStore {
  // State
  map: Map;
  selectedLayerId: number;
  showGrid: boolean;

  // Actions
  updateMap: (map: Map) => void;
  resizeMap: (width: number, height: number) => void;
  setLayerData: (layerId: number, data: number[]) => void;
  updateLayerData: (layerId: number, x: number, y: number, tileId: number) => void;
  selectLayer: (id: number) => void;
  toggleGrid: () => void;
  resetMap: () => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  // Initial state
  map: createDefaultMap(),
  selectedLayerId: 0,
  showGrid: true,

  // Actions
  updateMap: (map: Map) => {
    set({ map });
  },

  resizeMap: (width: number, height: number) => {
    const { map } = get();
    const oldWidth = map.width;
    const oldHeight = map.height;

    // Update map dimensions
    const newMap: Map = {
      ...map,
      width,
      height,
    };

    // Resize each layer
    newMap.layers = map.layers.map((layer) => {
      const newData: number[] = new Array(width * height).fill(-1);

      // Copy existing data where cells overlap
      for (let y = 0; y < Math.min(oldHeight, height); y++) {
        for (let x = 0; x < Math.min(oldWidth, width); x++) {
          const oldIndex = y * oldWidth + x;
          const newIndex = y * width + x;
          newData[newIndex] = layer.data[oldIndex];
        }
      }

      return {
        ...layer,
        width,
        height,
        data: newData,
      };
    });

    set({ map: newMap });
  },

  setLayerData: (layerId: number, data: number[]) => {
    const { map } = get();
    const layer = map.layers.find((l) => l.id === layerId);
    if (!layer) return;

    // Validate data length matches layer dimensions
    if (data.length !== layer.width * layer.height) {
      console.warn(
        `Layer data length (${data.length}) does not match layer dimensions (${layer.width * layer.height})`
      );
      return;
    }

    const updatedLayers = map.layers.map((l) =>
      l.id === layerId ? { ...l, data: [...data] } : l
    );

    set({
      map: {
        ...map,
        layers: updatedLayers,
      },
    });
  },

  updateLayerData: (layerId: number, x: number, y: number, tileId: number) => {
    const { map } = get();
    const layer = map.layers.find((l) => l.id === layerId);
    if (!layer) return;

    // Validate coordinates
    if (x < 0 || x >= layer.width || y < 0 || y >= layer.height) {
      return;
    }

    const index = y * layer.width + x;
    const newData = [...layer.data];
    newData[index] = tileId;

    const updatedLayers = map.layers.map((l) =>
      l.id === layerId ? { ...l, data: newData } : l
    );

    set({
      map: {
        ...map,
        layers: updatedLayers,
      },
    });
  },

  selectLayer: (id: number) => {
    const { map } = get();
    const layerExists = map.layers.some((l) => l.id === id);
    if (layerExists) {
      set({ selectedLayerId: id });
    }
  },

  toggleGrid: () => {
    set((state) => ({ showGrid: !state.showGrid }));
  },

  resetMap: () => {
    set({
      map: createDefaultMap(),
      selectedLayerId: 0,
      showGrid: true,
    });
  },
}));

