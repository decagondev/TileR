import { useEffect, useRef } from "react";

export interface CanvasProps {
  width: number;
  height: number;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  onDraw?: (ctx: CanvasRenderingContext2D) => void;
  className?: string;
}

/**
 * Base Canvas component with support for custom drawing callbacks
 * Handles resize and redraw automatically
 */
export function Canvas({
  width,
  height,
  scale = 1.0,
  offsetX = 0,
  offsetY = 0,
  onDraw,
  className,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      }}
    />
  );
}

