import React, { useCallback, useRef, useState } from "react";
import { Canvas } from "@/components/canvas/Canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useMapStore } from "@/store/useMapStore";
import { useTilesStore } from "@/store/useTilesStore";
import { screenToTileCoords, isValidTileCoord } from "@/utils/mapUtils";
import { tileToDataURL } from "@/utils/tileUtils";

export function MapCanvas() {
  const { map, selectedLayerId, showGrid, updateLayerData } = useMapStore();
  const { tiles, selectedTileId } = useTilesStore();
  const { scale, offsetX, offsetY, setZoom, setPan, resetView } = useCanvas(1);
  const [isPainting, setIsPainting] = useState(false);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Get selected layer
  const selectedLayer = map.layers.find((l) => l.id === selectedLayerId);
  if (!selectedLayer) {
    return <div className="h-full flex items-center justify-center">No layer selected</div>;
  }

  // Canvas dimensions in pixels
  const canvasWidth = map.width * map.tilewidth;
  const canvasHeight = map.height * map.tileheight;

  // Create image cache for tiles
  const tileImageCache = useRef<Map<number, HTMLImageElement>>(new Map());

  // Preload tile images when tiles change
  const preloadTileImages = useCallback(() => {
    tiles.forEach((tile) => {
      if (!tileImageCache.current.has(tile.id)) {
        const dataURL = tileToDataURL(tile);
        const img = new Image();
        img.src = dataURL;
        tileImageCache.current.set(tile.id, img);
      }
    });
  }, [tiles]);

  // Preload images on mount and when tiles change
  React.useEffect(() => {
    preloadTileImages();
  }, [preloadTileImages]);

  // Get tile image from cache
  const getTileImage = useCallback(
    (tileId: number): HTMLImageElement | null => {
      if (tileId < 0) return null; // Empty cell
      return tileImageCache.current.get(tileId) || null;
    },
    []
  );

  // Draw callback for Canvas component
  const handleDraw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Draw tiles from layer data
      for (let y = 0; y < selectedLayer.height; y++) {
        for (let x = 0; x < selectedLayer.width; x++) {
          const index = y * selectedLayer.width + x;
          const tileId = selectedLayer.data[index];

          if (tileId >= 0) {
            const img = getTileImage(tileId);
            if (img && img.complete) {
              ctx.drawImage(img, x * map.tilewidth, y * map.tileheight);
            }
          }
        }
      }

      // Draw hover preview
      if (hoverTile && selectedTileId !== null && isValidTileCoord(hoverTile.x, hoverTile.y, map.width, map.height)) {
        const hoverTileId = selectedLayer.data[hoverTile.y * selectedLayer.width + hoverTile.x];
        // Only show preview if cell is empty or different from selected tile
        if (hoverTileId !== selectedTileId) {
          const img = getTileImage(selectedTileId);
          if (img && img.complete) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.drawImage(img, hoverTile.x * map.tilewidth, hoverTile.y * map.tileheight);
            ctx.restore();
          }
        }
      }
    },
    [selectedLayer, map.tilewidth, map.tileheight, hoverTile, selectedTileId, getTileImage, map.width, map.height]
  );

  // Get pointer position relative to canvas
  const getPointerPosition = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canvasWrapperRef.current) return null;
      const rect = canvasWrapperRef.current.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  // Handle pointer down (start painting)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canvasWrapperRef.current || e.button !== 0 && e.button !== 2) return;

      const pos = getPointerPosition(e);
      if (!pos) return;

      const tileCoords = screenToTileCoords(
        pos.x,
        pos.y,
        scale,
        offsetX,
        offsetY,
        map.tilewidth,
        map.tileheight
      );

      if (!tileCoords || !isValidTileCoord(tileCoords.x, tileCoords.y, map.width, map.height)) {
        return;
      }

      setIsPainting(true);

      // Left-click: place tile, Right-click: erase
      if (e.button === 0 && selectedTileId !== null) {
        updateLayerData(selectedLayerId, tileCoords.x, tileCoords.y, selectedTileId);
      } else if (e.button === 2) {
        updateLayerData(selectedLayerId, tileCoords.x, tileCoords.y, -1);
      }
    },
    [scale, offsetX, offsetY, map.tilewidth, map.tileheight, map.width, map.height, selectedTileId, selectedLayerId, updateLayerData, getPointerPosition]
  );

  // Handle pointer move (continue painting while dragging)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const pos = getPointerPosition(e);
      if (!pos) return;

      const tileCoords = screenToTileCoords(
        pos.x,
        pos.y,
        scale,
        offsetX,
        offsetY,
        map.tilewidth,
        map.tileheight
      );

      // Update hover position
      if (tileCoords && isValidTileCoord(tileCoords.x, tileCoords.y, map.width, map.height)) {
        setHoverTile(tileCoords);
      } else {
        setHoverTile(null);
      }

      // Continue painting if button is held
      if (isPainting && tileCoords && isValidTileCoord(tileCoords.x, tileCoords.y, map.width, map.height)) {
        if (e.buttons === 1 && selectedTileId !== null) {
          // Left button: place tile
          updateLayerData(selectedLayerId, tileCoords.x, tileCoords.y, selectedTileId);
        } else if (e.buttons === 2) {
          // Right button: erase
          updateLayerData(selectedLayerId, tileCoords.x, tileCoords.y, -1);
        }
      }
    },
    [scale, offsetX, offsetY, map.tilewidth, map.tileheight, map.width, map.height, isPainting, selectedTileId, selectedLayerId, updateLayerData, getPointerPosition]
  );

  // Handle pointer up (end painting)
  const handlePointerUp = useCallback(() => {
    setIsPainting(false);
  }, []);

  // Handle context menu (prevent default right-click menu)
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative border rounded-lg bg-checkerboard overflow-hidden">
          <div
            ref={canvasWrapperRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onContextMenu={handleContextMenu}
            className="cursor-crosshair"
          >
            <Canvas
              width={canvasWidth}
              height={canvasHeight}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              onScaleChange={setZoom}
              onPanChange={setPan}
              onDraw={handleDraw}
              showGrid={showGrid}
              tileSize={map.tilewidth}
              className="block"
            />
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-2 border-t text-xs text-muted-foreground flex items-center justify-between">
        <div>
          Map: {map.width}×{map.height} tiles • Layer: {selectedLayer.name}
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={resetView}
            className="hover:text-foreground transition-colors"
          >
            Reset View
          </button>
          <div>Zoom: {Math.round(scale * 100)}%</div>
        </div>
      </div>
    </div>
  );
}

