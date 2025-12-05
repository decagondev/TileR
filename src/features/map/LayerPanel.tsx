import { useState } from "react";
import { useMapStore } from "@/store/useMapStore";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function LayerPanel() {
  const { map, selectedLayerId, selectLayer } = useMapStore();
  const selectedLayer = map.layers.find((l) => l.id === selectedLayerId);

  if (!selectedLayer) {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-4">Layers</h3>
        <p className="text-sm text-muted-foreground">No layer selected</p>
      </Card>
    );
  }

  // MVP: Single layer, so visibility and opacity are always on/100%
  // But we prepare the UI structure for future multi-layer support
  const [opacity, setOpacity] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  // For MVP, we don't actually use these values, but the UI is ready
  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    // Future: updateLayerOpacity(selectedLayerId, value[0] / 100)
  };

  const handleVisibilityChange = (checked: boolean) => {
    setIsVisible(checked);
    // Future: updateLayerVisibility(selectedLayerId, checked)
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Layers</h3>
      
      <div className="space-y-4">
        {/* Layer List - MVP: Single layer, but structure ready for expansion */}
        <div className="space-y-2">
          {map.layers.map((layer) => (
            <div
              key={layer.id}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                layer.id === selectedLayerId
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent"
              }`}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    value={layer.name}
                    readOnly // MVP: Read-only, future: editable
                    className="h-7 text-sm font-medium border-none bg-transparent p-0 focus-visible:ring-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {layer.width}×{layer.height}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layer Properties - Only show for selected layer */}
        {selectedLayer && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="layer-visibility">Visible</Label>
                <Switch
                  id="layer-visibility"
                  checked={isVisible}
                  onCheckedChange={handleVisibilityChange}
                  disabled // MVP: Always visible
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Layer visibility (always on in MVP)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="layer-opacity">Opacity</Label>
                <span className="text-xs text-muted-foreground">{opacity}%</span>
              </div>
              <Slider
                id="layer-opacity"
                min={0}
                max={100}
                step={1}
                value={[opacity]}
                onValueChange={handleOpacityChange}
                disabled // MVP: Always 100%
              />
              <p className="text-xs text-muted-foreground">
                Layer opacity (always 100% in MVP)
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

