/**
 * Convert screen coordinates to tile coordinates on the map
 * @param screenX - Screen X coordinate (relative to canvas)
 * @param screenY - Screen Y coordinate (relative to canvas)
 * @param scale - Current zoom scale
 * @param offsetX - Current pan offset X
 * @param offsetY - Current pan offset Y
 * @param tilewidth - Width of a tile in pixels
 * @param tileheight - Height of a tile in pixels
 * @returns Tile coordinates {x, y} or null if invalid
 */
export function screenToTileCoords(
  screenX: number,
  screenY: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  tilewidth: number,
  tileheight: number
): { x: number; y: number } | null {
  // Convert screen coordinates to world coordinates
  const worldX = (screenX - offsetX) / scale;
  const worldY = (screenY - offsetY) / scale;

  // Convert world coordinates to tile coordinates
  const tileX = Math.floor(worldX / tilewidth);
  const tileY = Math.floor(worldY / tileheight);

  return { x: tileX, y: tileY };
}

/**
 * Validate tile coordinates are within map bounds
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @param mapWidth - Map width in tiles
 * @param mapHeight - Map height in tiles
 * @returns True if coordinates are valid
 */
export function isValidTileCoord(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number
): boolean {
  return x >= 0 && x < mapWidth && y >= 0 && y < mapHeight;
}

/**
 * Get tile index in layer data array from tile coordinates
 * @param x - Tile X coordinate
 * @param y - Tile Y coordinate
 * @param width - Map width in tiles
 * @returns Array index
 */
export function tileCoordsToIndex(x: number, y: number, width: number): number {
  return y * width + x;
}

/**
 * Get tile coordinates from array index
 * @param index - Array index in layer data
 * @param width - Map width in tiles
 * @returns Tile coordinates {x, y}
 */
export function indexToTileCoords(index: number, width: number): { x: number; y: number } {
  const y = Math.floor(index / width);
  const x = index % width;
  return { x, y };
}

