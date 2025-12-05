import type { Layer } from "./Layer";
import type { Tileset } from "./Tileset";

/**
 * Map interface compatible with Tiled JSON format (subset)
 * Represents a tilemap with embedded tileset data
 */
export interface Map {
  version: "1.0";
  width: number; // Width in tiles
  height: number; // Height in tiles
  tilewidth: number;
  tileheight: number;
  layers: Layer[];
  tilesets: Tileset[]; // Embedded for MVP
}

