import type { Map } from "@/types";

/**
 * Tiled JSON format validation utilities
 * Reference: https://doc.mapeditor.org/en/stable/reference/json-map-format/
 */

/**
 * Required fields for a valid Tiled JSON map
 */
const REQUIRED_MAP_FIELDS = [
  "version",
  "width",
  "height",
  "tilewidth",
  "tileheight",
  "layers",
  "tilesets",
] as const;

/**
 * Required fields for a valid Tiled layer
 */
const REQUIRED_LAYER_FIELDS = [
  "id",
  "name",
  "width",
  "height",
  "data",
] as const;

/**
 * Validate that a Map structure matches Tiled JSON format requirements
 */
export function validateTiledMap(map: Map): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required top-level fields
  for (const field of REQUIRED_MAP_FIELDS) {
    if (!(field in map)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate version
  if (map.version !== "1.0") {
    errors.push(`Invalid version: ${map.version}. Expected "1.0"`);
  }

  // Validate dimensions
  if (map.width <= 0 || map.height <= 0) {
    errors.push(`Invalid dimensions: width=${map.width}, height=${map.height}`);
  }

  if (map.tilewidth <= 0 || map.tileheight <= 0) {
    errors.push(
      `Invalid tile dimensions: tilewidth=${map.tilewidth}, tileheight=${map.tileheight}`
    );
  }

  // Validate layers
  if (!Array.isArray(map.layers) || map.layers.length === 0) {
    errors.push("Map must have at least one layer");
  } else {
    map.layers.forEach((layer, index) => {
      for (const field of REQUIRED_LAYER_FIELDS) {
        if (!(field in layer)) {
          errors.push(`Layer ${index}: Missing required field: ${field}`);
        }
      }

      // Validate layer dimensions match map
      if (layer.width !== map.width || layer.height !== map.height) {
        errors.push(
          `Layer ${index}: Dimensions (${layer.width}x${layer.height}) don't match map (${map.width}x${map.height})`
        );
      }

      // Validate layer data array length
      const expectedDataLength = layer.width * layer.height;
      if (layer.data.length !== expectedDataLength) {
        errors.push(
          `Layer ${index}: Data array length (${layer.data.length}) doesn't match expected (${expectedDataLength})`
        );
      }
    });
  }

  // Validate tilesets
  if (!Array.isArray(map.tilesets) || map.tilesets.length === 0) {
    errors.push("Map must have at least one tileset");
  } else {
    map.tilesets.forEach((tileset, index) => {
      if (!tileset.tiles || tileset.tiles.length === 0) {
        errors.push(`Tileset ${index}: Must have at least one tile`);
      }

      if (tileset.tilewidth !== map.tilewidth || tileset.tileheight !== map.tileheight) {
        errors.push(
          `Tileset ${index}: Tile dimensions don't match map tile dimensions`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Expected Tiled JSON structure (for reference/documentation)
 * 
 * Example Tiled JSON structure:
 * {
 *   "version": "1.0",
 *   "tiledversion": "1.x.x",
 *   "orientation": "orthogonal",
 *   "renderorder": "right-down",
 *   "width": 10,
 *   "height": 10,
 *   "tilewidth": 16,
 *   "tileheight": 16,
 *   "layers": [
 *     {
 *       "id": 0,
 *       "name": "Tile Layer 1",
 *       "type": "tilelayer",
 *       "width": 10,
 *       "height": 10,
 *       "data": [1, 2, 3, ...], // CSV format or array
 *       "visible": true,
 *       "opacity": 1
 *     }
 *   ],
 *   "tilesets": [
 *     {
 *       "firstgid": 1,
 *       "source": "tileset.tsx" // or embedded
 *     }
 *   ]
 * }
 * 
 * Note: Our Map interface uses embedded tilesets for MVP
 */

