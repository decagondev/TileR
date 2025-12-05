import type { Tile } from "@/types";

/**
 * Convert tile pixel data (Uint8ClampedArray) to ImageData
 * @param tile - Tile with pixel data
 * @returns ImageData object ready for canvas operations
 */
export function tileDataToImageData(tile: Tile): ImageData {
  const imageData = new ImageData(tile.width, tile.height);
  imageData.data.set(tile.data);
  return imageData;
}

/**
 * Convert ImageData to tile pixel data (Uint8ClampedArray)
 * @param imageData - ImageData from canvas
 * @returns Uint8ClampedArray pixel data
 */
export function imageDataToTileData(imageData: ImageData): Uint8ClampedArray {
  return new Uint8ClampedArray(imageData.data);
}

/**
 * Convert tile to data URL for preview rendering
 * Creates a temporary canvas, draws the tile, and exports as data URL
 * @param tile - Tile to convert
 * @returns Data URL string (e.g., "data:image/png;base64,...")
 */
export function tileToDataURL(tile: Tile): string {
  const canvas = document.createElement("canvas");
  canvas.width = tile.width;
  canvas.height = tile.height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  
  const imageData = tileDataToImageData(tile);
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL("image/png");
}

/**
 * Get pixel color at specific coordinates from tile data
 * @param tile - Tile to read from
 * @param x - X coordinate (0-based)
 * @param y - Y coordinate (0-based)
 * @returns RGBA color as [r, g, b, a] or null if out of bounds
 */
export function getPixelColor(
  tile: Tile,
  x: number,
  y: number
): [number, number, number, number] | null {
  if (x < 0 || x >= tile.width || y < 0 || y >= tile.height) {
    return null;
  }
  
  const index = (y * tile.width + x) * 4;
  return [
    tile.data[index],
    tile.data[index + 1],
    tile.data[index + 2],
    tile.data[index + 3],
  ];
}

/**
 * Set pixel color at specific coordinates in tile data
 * @param tile - Tile to modify
 * @param x - X coordinate (0-based)
 * @param y - Y coordinate (0-based)
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param a - Alpha component (0-255)
 * @returns New Uint8ClampedArray with updated pixel
 */
export function setPixelColor(
  tile: Tile,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
): Uint8ClampedArray {
  if (x < 0 || x >= tile.width || y < 0 || y >= tile.height) {
    return tile.data;
  }
  
  const newData = new Uint8ClampedArray(tile.data);
  const index = (y * tile.width + x) * 4;
  newData[index] = r;
  newData[index + 1] = g;
  newData[index + 2] = b;
  newData[index + 3] = a;
  
  return newData;
}

/**
 * Convert hex color string to RGBA array
 * @param hex - Hex color string (e.g., "#FF0000" or "#FF0000FF")
 * @returns RGBA array [r, g, b, a] with alpha defaulting to 255
 */
export function hexToRgba(hex: string): [number, number, number, number] {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  const a = normalized.length >= 8 
    ? parseInt(normalized.substring(6, 8), 16) 
    : 255;
  
  return [r, g, b, a];
}

/**
 * Convert RGBA array to hex color string
 * @param rgba - RGBA array [r, g, b, a]
 * @returns Hex color string (e.g., "#FF0000FF")
 */
export function rgbaToHex(rgba: [number, number, number, number]): string {
  const [r, g, b, a] = rgba;
  const hex = [r, g, b, a]
    .map((val) => Math.max(0, Math.min(255, val)).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

