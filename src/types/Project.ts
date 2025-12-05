import type { Tileset } from "./Tileset";
import type { Map } from "./Map";

/**
 * Project interface representing a complete TileR project
 */
export interface Project {
  id: string;
  name: string;
  tileset: Tileset;
  map: Map;
  settings: {
    theme: "light" | "dark";
  };
  version: number;
  thumbnail?: string; // DataURL
}

