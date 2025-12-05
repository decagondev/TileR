import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTilesStore } from "@/store/useTilesStore";
import { TilePreview } from "./TilePreview";
import { PaletteToolbar } from "./PaletteToolbar";

export function Palette() {
  const { tiles, selectedTileId, selectTile } = useTilesStore();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tile Palette</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <PaletteToolbar />
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-2 pr-4">
            {tiles.map((tile) => (
              <TilePreview
                key={tile.id}
                tile={tile}
                isSelected={tile.id === selectedTileId}
                onClick={() => selectTile(tile.id)}
              />
            ))}
          </div>
        </ScrollArea>
        {tiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            No tiles. Click "Add" to create one.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

