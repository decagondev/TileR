import { useState } from "react";
import { useMapStore } from "@/store/useMapStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const MIN_MAP_SIZE = 1;
const MAX_MAP_SIZE = 256;

export function MapConfigPanel() {
  const { map, resizeMap } = useMapStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [width, setWidth] = useState(map.width.toString());
  const [height, setHeight] = useState(map.height.toString());
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      // Reset to current values when opening
      setWidth(map.width.toString());
      setHeight(map.height.toString());
      setError(null);
    }
  };

  const handleResize = () => {
    setError(null);

    // Validate inputs
    const newWidth = parseInt(width, 10);
    const newHeight = parseInt(height, 10);

    if (isNaN(newWidth) || isNaN(newHeight)) {
      setError("Width and height must be numbers");
      return;
    }

    if (newWidth < MIN_MAP_SIZE || newWidth > MAX_MAP_SIZE) {
      setError(`Width must be between ${MIN_MAP_SIZE} and ${MAX_MAP_SIZE}`);
      return;
    }

    if (newHeight < MIN_MAP_SIZE || newHeight > MAX_MAP_SIZE) {
      setError(`Height must be between ${MIN_MAP_SIZE} and ${MAX_MAP_SIZE}`);
      return;
    }

    // Resize map
    resizeMap(newWidth, newHeight);
    setIsDialogOpen(false);
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Map Configuration</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-muted-foreground">
          Current Size: {map.width} × {map.height} tiles
        </div>
        <div className="text-xs text-muted-foreground">
          Tile Size: {map.tilewidth} × {map.tileheight} px
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Resize Map
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resize Map</DialogTitle>
            <DialogDescription>
              Enter new dimensions for the map. Existing tiles will be preserved where possible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="map-width">Width (tiles)</Label>
              <Input
                id="map-width"
                type="number"
                min={MIN_MAP_SIZE}
                max={MAX_MAP_SIZE}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="map-height">Height (tiles)</Label>
              <Input
                id="map-height"
                type="number"
                min={MIN_MAP_SIZE}
                max={MAX_MAP_SIZE}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResize}>Resize</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

