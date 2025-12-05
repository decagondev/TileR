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

    // Call custom draw function if provided
    if (onDraw) {
      onDraw(ctx);
    }

    ctx.restore();
  }, [width, height, scale, offsetX, offsetY, onDraw]);

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

