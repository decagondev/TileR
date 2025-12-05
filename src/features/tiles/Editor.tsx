import { useCallback, useRef, useState } from "react";
import { Canvas } from "@/components/canvas/Canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useTilesStore } from "@/store/useTilesStore";
import { Toolbar } from "./Toolbar";
import { ColorPalette } from "./ColorPalette";
import {
  drawPixel,
  erasePixel,
  floodFill,
  pickColor,
  screenToPixel,
} from "./ToolHandlers";
import { tileDataToImageData } from "@/utils/tileUtils";
import { ToolType as ToolTypeEnum } from "@/types/ToolType";

export function Editor() {
  const {
    tiles,
    selectedTileId,
    currentTool,
    primaryColor,
    secondaryColor,
    showGrid,
    updateTilePixels,
  } = useTilesStore();

  const { scale, offsetX, offsetY, setZoom, setPan, resetView } = useCanvas(4); // Start zoomed in for pixel editing
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Get selected tile
  const selectedTile = tiles.find((t) => t.id === selectedTileId);

  // Draw callback for Canvas component
  const handleDraw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!selectedTile) return;

      // Draw tile pixels
      const imageData = tileDataToImageData(selectedTile);
      ctx.putImageData(imageData, 0, 0);
    },
    [selectedTile]
  );

  // Handle mouse/touch down
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!selectedTile || !canvasWrapperRef.current) return;

      const canvas = canvasWrapperRef.current.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const pixel = screenToPixel(screenX, screenY, scale, offsetX, offsetY);
      if (!pixel) return;

      const [x, y] = pixel;

      // Validate coordinates
      if (x < 0 || x >= selectedTile.width || y < 0 || y >= selectedTile.height) {
        return;
      }

      setIsDrawing(true);

      // Determine which color to use based on button
      const useSecondary = e.button === 2; // Right click
      const color = useSecondary ? secondaryColor : primaryColor;

      // Handle different tools
      if (currentTool === ToolTypeEnum.Pencil) {
        const newData = drawPixel(selectedTile, x, y, color);
        updateTilePixels(selectedTileId!, newData);
      } else if (currentTool === ToolTypeEnum.Eraser) {
        const newData = erasePixel(selectedTile, x, y);
        updateTilePixels(selectedTileId!, newData);
      } else if (currentTool === ToolTypeEnum.Fill) {
        const newData = floodFill(selectedTile, x, y, color);
        updateTilePixels(selectedTileId!, newData);
      } else if (currentTool === ToolTypeEnum.Picker) {
        const pickedColor = pickColor(selectedTile, x, y);
        if (pickedColor) {
          const { setPrimaryColor, setSecondaryColor } = useTilesStore.getState();
          if (useSecondary) {
            setSecondaryColor(pickedColor);
          } else {
            setPrimaryColor(pickedColor);
          }
        }
      }
    },
    [selectedTile, selectedTileId, currentTool, primaryColor, secondaryColor, scale, offsetX, offsetY, updateTilePixels]
  );

  // Handle mouse/touch move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDrawing || !selectedTile || !canvasWrapperRef.current) return;

      const canvas = canvasWrapperRef.current.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const pixel = screenToPixel(screenX, screenY, scale, offsetX, offsetY);
      if (!pixel) return;

      const [x, y] = pixel;

      // Validate coordinates
      if (x < 0 || x >= selectedTile.width || y < 0 || y >= selectedTile.height) {
        return;
      }

      // Only pencil and eraser support continuous drawing
      if (currentTool === ToolTypeEnum.Pencil) {
        const newData = drawPixel(selectedTile, x, y, primaryColor);
        updateTilePixels(selectedTileId!, newData);
      } else if (currentTool === ToolTypeEnum.Eraser) {
        const newData = erasePixel(selectedTile, x, y);
        updateTilePixels(selectedTileId!, newData);
      }
    },
    [isDrawing, selectedTile, selectedTileId, currentTool, primaryColor, scale, offsetX, offsetY, updateTilePixels]
  );

  // Handle mouse/touch up
  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Prevent context menu on right click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  if (!selectedTile) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a tile from the palette to edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b flex items-center justify-between">
        <Toolbar />
        <div className="flex items-center gap-4">
          <ColorPalette />
        </div>
      </div>

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
              width={selectedTile.width}
              height={selectedTile.height}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
              onScaleChange={setZoom}
              onPanChange={setPan}
              onDraw={handleDraw}
              showGrid={showGrid}
              tileSize={1} // 1 pixel per grid cell
              className="block"
            />
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-2 border-t text-xs text-muted-foreground flex items-center justify-between">
        <div>
          Tile #{selectedTile.id} • {selectedTile.width}×{selectedTile.height}px
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={resetView}
            className="hover:text-foreground transition-colors"
          >
            Reset View
          </button>
          <div>
            Zoom: {Math.round(scale * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

