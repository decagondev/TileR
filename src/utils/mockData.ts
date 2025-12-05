import type { Tile, Tileset, Layer, Map, Project } from "@/types";
import { generateId } from "./id";

/**
 * Create a default blank tile with transparent pixels
 */
export function createDefaultTile(id: number, width: number = 16, height: number = 16): Tile {
  const pixelCount = width * height;
  const data = new Uint8ClampedArray(pixelCount * 4); // RGBA
  
  // Initialize all pixels as transparent (0, 0, 0, 0)
  for (let i = 0; i < pixelCount; i++) {
    const index = i * 4;
    data[index] = 0;     // R
    data[index + 1] = 0; // G
    data[index + 2] = 0; // B
    data[index + 3] = 0; // A (transparent)
  }
  
  return {
    id,
    width,
    height,
    data,
  };
}

/**
 * Create a default tileset with a single 16x16 blank tile
 */
export function createDefaultTileset(tilewidth: number = 16, tileheight: number = 16): Tileset {
  return {
    tiles: [createDefaultTile(0, tilewidth, tileheight)],
    tilewidth,
    tileheight,
  };
}

/**
 * Create a default map (1x1 tilemap)
 */
export function createDefaultMap(tilewidth: number = 16, tileheight: number = 16): Map {
  const layer: Layer = {
    id: 0,
    name: "Tile Layer 1",
    width: 1,
    height: 1,
    data: [-1], // Empty cell
  };
  
  return {
    version: "1.0",
    width: 1,
    height: 1,
    tilewidth,
    tileheight,
    layers: [layer],
    tilesets: [createDefaultTileset(tilewidth, tileheight)],
  };
}

/**
 * Create a default project with mock data
 */
export function createDefaultProject(name: string = "New Project"): Project {
  const id = generateId();
  
  return {
    id,
    name,
    tileset: createDefaultTileset(),
    map: createDefaultMap(),
    settings: {
      theme: "dark",
    },
    version: 1,
  };
}

