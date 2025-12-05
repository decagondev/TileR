import { useRef, useState, useCallback } from "react";

export interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;
const DEFAULT_SCALE = 1.0;

/**
 * Hook for managing canvas state (scale, pan, context)
 */
export function useCanvas(initialScale: number = DEFAULT_SCALE) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const getContext = useCallback((): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  const zoomIn = useCallback((factor: number = 1.2) => {
    setScale((prev) => Math.min(prev * factor, MAX_SCALE));
  }, []);

  const zoomOut = useCallback((factor: number = 1.2) => {
    setScale((prev) => Math.max(prev / factor, MIN_SCALE));
  }, []);

  const setZoom = useCallback((newScale: number) => {
    setScale(Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE)));
  }, []);

  const pan = useCallback((dx: number, dy: number) => {
    setOffsetX((prev) => prev + dx);
    setOffsetY((prev) => prev + dy);
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setOffsetX(x);
    setOffsetY(y);
  }, []);

  const resetView = useCallback(() => {
    setScale(DEFAULT_SCALE);
    setOffsetX(0);
    setOffsetY(0);
  }, []);

  return {
    canvasRef,
    scale,
    offsetX,
    offsetY,
    getContext,
    zoomIn,
    zoomOut,
    setZoom,
    pan,
    setPan,
    resetView,
  };
}

