import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { Tile } from "@/types";
import { tileToDataURL } from "@/utils/tileUtils";
import { cn } from "@/lib/utils";

interface TilePreviewProps {
  tile: Tile;
  isSelected: boolean;
  onClick: () => void;
  size?: number; // Preview size in pixels
}

export function TilePreview({
  tile,
  isSelected,
  onClick,
  size = 64,
}: TilePreviewProps) {
  const dataURL = useMemo(() => {
    try {
      return tileToDataURL(tile);
    } catch (error) {
      console.error("Failed to generate tile preview:", error);
      return "";
    }
  }, [tile]);

  return (
    <Card
      className={cn(
        "p-2 cursor-pointer transition-all hover:border-primary/50",
        isSelected && "border-primary border-2 ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className="border border-border rounded bg-checkerboard"
          style={{
            width: size,
            height: size,
            backgroundImage:
              "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px",
          }}
        >
          {dataURL && (
            <img
              src={dataURL}
              alt={`Tile ${tile.id}`}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          )}
        </div>
        <div className="text-xs text-center">
          <div className="font-medium">#{tile.id}</div>
          {tile.name && (
            <div className="text-muted-foreground truncate max-w-[60px]">
              {tile.name}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

