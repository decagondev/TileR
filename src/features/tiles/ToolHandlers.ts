import type { Tile } from "@/types";
import { getPixelColor, setPixelColor, hexToRgba } from "@/utils/tileUtils";

/**
 * Draw a single pixel at the specified coordinates
 * @param tile - Tile to modify
 * @param x - X coordinate (0-based)
 * @param y - Y coordinate (0-based)
 * @param color - Hex color string (e.g., "#FF0000FF")
 * @returns New Uint8ClampedArray with updated pixel
 */
export function drawPixel(
  tile: Tile,
  x: number,
  y: number,
  color: string
): Uint8ClampedArray {
  const [r, g, b, a] = hexToRgba(color);
  return setPixelColor(tile, x, y, r, g, b, a);
}

/**
 * Erase a pixel (set to transparent)
 * @param tile - Tile to modify
 * @param x - X coordinate (0-based)
 * @param y - Y coordinate (0-based)
 * @returns New Uint8ClampedArray with erased pixel
 */
export function erasePixel(tile: Tile, x: number, y: number): Uint8ClampedArray {
  return setPixelColor(tile, x, y, 0, 0, 0, 0);
}

/**
 * Flood fill algorithm (4-way connectivity)
 * @param tile - Tile to modify
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param fillColor - Hex color string to fill with
 * @returns New Uint8ClampedArray with filled region
 */
export function floodFill(
  tile: Tile,
  startX: number,
  startY: number,
  fillColor: string
): Uint8ClampedArray {
  // Validate coordinates
  if (
    startX < 0 ||
    startX >= tile.width ||
    startY < 0 ||
    startY >= tile.height
  ) {
    return tile.data;
  }

  // Get target color (the color we're replacing)
  const targetColor = getPixelColor(tile, startX, startY);
  if (!targetColor) {
    return tile.data;
  }

  // Get fill color as RGBA
  const [fillR, fillG, fillB, fillA] = hexToRgba(fillColor);

  // If target color matches fill color, no work needed
  if (
    targetColor[0] === fillR &&
    targetColor[1] === fillG &&
    targetColor[2] === fillB &&
    targetColor[3] === fillA
  ) {
    return tile.data;
  }

  // Create new data array
  const newData = new Uint8ClampedArray(tile.data);
  const visited = new Set<string>();

  // Queue-based flood fill
  const queue: Array<[number, number]> = [[startX, startY]];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;

    // Skip if already visited or out of bounds
    if (visited.has(key)) continue;
    if (x < 0 || x >= tile.width || y < 0 || y >= tile.height) continue;

    // Get current pixel color
    const index = (y * tile.width + x) * 4;
    const currentR = newData[index];
    const currentG = newData[index + 1];
    const currentB = newData[index + 2];
    const currentA = newData[index + 3];

    // Check if pixel matches target color
    if (
      currentR !== targetColor[0] ||
      currentG !== targetColor[1] ||
      currentB !== targetColor[2] ||
      currentA !== targetColor[3]
    ) {
      continue;
    }

    // Fill the pixel
    newData[index] = fillR;
    newData[index + 1] = fillG;
    newData[index + 2] = fillB;
    newData[index + 3] = fillA;

    visited.add(key);

    // Add neighbors to queue (4-way connectivity)
    queue.push([x + 1, y]); // Right
    queue.push([x - 1, y]); // Left
    queue.push([x, y + 1]); // Down
    queue.push([x, y - 1]); // Up
  }

  return newData;
}

/**
 * Pick color from pixel at specified coordinates
 * @param tile - Tile to read from
 * @param x - X coordinate (0-based)
 * @param y - Y coordinate (0-based)
 * @returns Hex color string or null if out of bounds
 */
export function pickColor(tile: Tile, x: number, y: number): string | null {
  const color = getPixelColor(tile, x, y);
  if (!color) {
    return null;
  }

  // Convert RGBA to hex
  const [r, g, b, a] = color;
  const hex = [r, g, b, a]
    .map((val) => Math.max(0, Math.min(255, val)).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

/**
 * Convert screen coordinates to pixel coordinates
 * Accounts for canvas transform (scale and pan)
 * @param screenX - Screen X coordinate
 * @param screenY - Screen Y coordinate
 * @param scale - Canvas scale factor
 * @param offsetX - Canvas pan offset X
 * @param offsetY - Canvas pan offset Y
 * @returns Pixel coordinates [x, y] or null if out of bounds
 */
export function screenToPixel(
  screenX: number,
  screenY: number,
  scale: number,
  offsetX: number,
  offsetY: number
): [number, number] | null {
  // Convert screen to world coordinates
  const worldX = (screenX - offsetX) / scale;
  const worldY = (screenY - offsetY) / scale;

  // Snap to pixel grid (floor to get pixel index)
  const pixelX = Math.floor(worldX);
  const pixelY = Math.floor(worldY);

  return [pixelX, pixelY];
}

