/**
 * Layer interface representing a tile layer in a map
 * data array contains tile IDs (0-based), -1 for empty cells
 */
export interface Layer {
  id: number;
  name: string;
  data: number[]; // Tile IDs (CSV-like, -1 for empty)
  width: number;
  height: number;
}

