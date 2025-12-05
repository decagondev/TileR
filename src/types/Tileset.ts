import { Tile } from "./Tile";

/**
 * Tileset interface containing a collection of tiles
 */
export interface Tileset {
  tiles: Tile[];
  tilewidth: number;
  tileheight: number;
}

