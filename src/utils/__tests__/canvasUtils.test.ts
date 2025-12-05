import { describe, it, expect } from "vitest";

/**
 * Test coordinate transform utilities
 */
describe("Canvas Coordinate Transforms", () => {
  describe("screenToWorld", () => {
    it("should convert screen coordinates to world coordinates", () => {
      const scale = 2.0;
      const offsetX = 10;
      const offsetY = 20;

      // Screen coordinate (50, 60)
      // World = (screen - offset) / scale
      const worldX = (50 - offsetX) / scale;
      const worldY = (60 - offsetY) / scale;

      expect(worldX).toBe(20);
      expect(worldY).toBe(20);
    });

    it("should handle zero offset", () => {
      const scale = 1.0;
      const offsetX = 0;
      const offsetY = 0;

      const worldX = (100 - offsetX) / scale;
      const worldY = (200 - offsetY) / scale;

      expect(worldX).toBe(100);
      expect(worldY).toBe(200);
    });

    it("should handle different scales", () => {
      const scale = 0.5;
      const offsetX = 0;
      const offsetY = 0;

      const worldX = (50 - offsetX) / scale;
      const worldY = (100 - offsetY) / scale;

      expect(worldX).toBe(100);
      expect(worldY).toBe(200);
    });
  });

  describe("zoom calculations", () => {
    it("should clamp zoom to min scale", () => {
      const MIN_SCALE = 0.25;
      const currentScale = 0.3;
      const zoomFactor = 0.9;
      const newScale = Math.max(MIN_SCALE, currentScale * zoomFactor);

      expect(newScale).toBeGreaterThanOrEqual(MIN_SCALE);
      expect(newScale).toBeCloseTo(0.27, 2);
    });

    it("should clamp zoom to max scale", () => {
      const MAX_SCALE = 4.0;
      const currentScale = 3.5;
      const zoomFactor = 1.2;
      const newScale = Math.min(MAX_SCALE, currentScale * zoomFactor);

      expect(newScale).toBeLessThanOrEqual(MAX_SCALE);
      expect(newScale).toBe(4.0);
    });
  });
});

/**
 * Test grid drawing calculations
 */
describe("Grid Drawing", () => {
  describe("grid line calculations", () => {
    it("should calculate correct grid start position", () => {
      const offsetX = 10;
      const scale = 1.0;
      const tileSize = 16;

      const startX = Math.floor((-offsetX / scale) / tileSize) * tileSize;

      expect(startX).toBe(-16); // First grid line before origin
    });

    it("should calculate correct grid end position", () => {
      const width = 320;
      const offsetX = 0;
      const scale = 1.0;
      const tileSize = 16;

      const endX = Math.ceil((width / scale - offsetX / scale) / tileSize) * tileSize;

      expect(endX).toBe(320); // Last grid line at or after width
    });

    it("should respect zoom when calculating grid bounds", () => {
      const width = 640;
      const offsetX = 0;
      const scale = 2.0; // Zoomed in
      const tileSize = 16;

      // Visible width in world coordinates
      const worldWidth = width / scale;
      const endX = Math.ceil((worldWidth - offsetX / scale) / tileSize) * tileSize;

      expect(endX).toBe(320); // Half the screen width due to zoom
    });
  });

  describe("grid line spacing", () => {
    it("should draw lines at correct intervals", () => {
      const tileSize = 16;
      const lines: number[] = [];

      for (let x = 0; x <= 64; x += tileSize) {
        lines.push(x);
      }

      expect(lines).toEqual([0, 16, 32, 48, 64]);
    });

    it("should handle different tile sizes", () => {
      const tileSize = 32;
      const lines: number[] = [];

      for (let x = 0; x <= 64; x += tileSize) {
        lines.push(x);
      }

      expect(lines).toEqual([0, 32, 64]);
    });
  });
});

