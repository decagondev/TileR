import { useEffect, useRef, useCallback } from "react";

export interface CanvasProps {
  width: number;
  height: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  onDraw?: (ctx: CanvasRenderingContext2D) => void;
  onScaleChange?: (scale: number) => void;
  onPanChange?: (offsetX: number, offsetY: number) => void;
  showGrid?: boolean;
  tileSize?: number;
  className?: string;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;

/**
 * Base Canvas component with support for custom drawing callbacks and pan/zoom
 * Handles resize and redraw automatically
 */
export function Canvas({
  width,
  height,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
  onDraw,
  onScaleChange,
  onPanChange,
  showGrid = false,
  tileSize = 16,
  className,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);

  // Convert screen coordinates to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      return {
        x: (screenX - offsetX) / scale,
        y: (screenY - offsetY) / scale,
      };
    },
    [scale, offsetX, offsetY]
  );

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || !onScaleChange) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Get world coordinates before zoom
      const worldBefore = screenToWorld(mouseX, mouseY);

      // Calculate new scale
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, scale * zoomFactor)
      );

      if (newScale !== scale && onScaleChange) {
        onScaleChange(newScale);

        // Adjust offset to zoom towards mouse position
        const worldAfter = screenToWorld(mouseX, mouseY);
        const dx = (worldBefore.x - worldAfter.x) * newScale;
        const dy = (worldBefore.y - worldAfter.y) * newScale;

        if (onPanChange) {
          onPanChange(offsetX + dx, offsetY + dy);
        }
      }
    },
    [scale, offsetX, offsetY, onScaleChange, onPanChange, screenToWorld]
  );

  // Handle middle-click/drag panning
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
        // Middle mouse button or Ctrl+Left click
        e.preventDefault();
        isPanningRef.current = true;
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanningRef.current && lastPanPointRef.current && onPanChange) {
        const dx = e.clientX - lastPanPointRef.current.x;
        const dy = e.clientY - lastPanPointRef.current.y;
        onPanChange(offsetX + dx, offsetY + dy);
        lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    [offsetX, offsetY, onPanChange]
  );

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    lastPanPointRef.current = null;
  }, []);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Draw grid overlay
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!showGrid || tileSize <= 0) return;

      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; // High-contrast for accessibility
      ctx.lineWidth = 1 / scale; // Scale line width inversely with zoom

      // Calculate visible bounds
      const startX = Math.floor((-offsetX / scale) / tileSize) * tileSize;
      const startY = Math.floor((-offsetY / scale) / tileSize) * tileSize;
      const endX = Math.ceil((width / scale - offsetX / scale) / tileSize) * tileSize;
      const endY = Math.ceil((height / scale - offsetY / scale) / tileSize) * tileSize;

      // Draw vertical lines
      for (let x = startX; x <= endX; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = startY; y <= endY; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      ctx.restore();
    },
    [showGrid, tileSize, scale, offsetX, offsetY, width, height]
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Draw grid first (behind content)
    if (showGrid) {
      drawGrid(ctx);
    }

    // Call custom draw function if provided
    if (onDraw) {
      onDraw(ctx);
    }

    ctx.restore();
  }, [width, height, scale, offsetX, offsetY, onDraw, showGrid, drawGrid]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "block",
        cursor: isPanningRef.current ? "grabbing" : "default",
      }}
    />
  );
}

