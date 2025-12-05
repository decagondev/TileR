/**
 * Tile interface representing a single pixel-art tile
 */
export interface Tile {
  id: number;
  name?: string;
  tags?: string[];
  data: Uint8ClampedArray; // Pixel data (r,g,b,a per pixel)
  width: number;
  height: number;
}

