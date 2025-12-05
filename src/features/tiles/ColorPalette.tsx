import { useTilesStore } from "@/store/useTilesStore";
import { cn } from "@/lib/utils";

export function ColorPalette() {
  const {
    colorPalette,
    primaryColor,
    secondaryColor,
    setPrimaryColor,
    setSecondaryColor,
  } = useTilesStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">
            Primary
          </label>
          <button
            type="button"
            className={cn(
              "w-full h-8 rounded border-2 transition-all",
              "hover:ring-2 hover:ring-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            style={{ backgroundColor: primaryColor }}
            onClick={() => {
              // Open color picker (native browser picker for MVP)
              const input = document.createElement("input");
              input.type = "color";
              input.value = primaryColor.substring(0, 7); // Remove alpha for color input
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                // Preserve alpha if present, otherwise add FF
                const newColor =
                  primaryColor.length === 9
                    ? target.value + primaryColor.substring(7)
                    : target.value + "FF";
                setPrimaryColor(newColor);
              };
              input.click();
            }}
            aria-label="Primary color"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">
            Secondary
          </label>
          <button
            type="button"
            className={cn(
              "w-full h-8 rounded border-2 transition-all",
              "hover:ring-2 hover:ring-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary"
            )}
            style={{ backgroundColor: secondaryColor }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "color";
              input.value = secondaryColor.substring(0, 7);
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                const newColor =
                  secondaryColor.length === 9
                    ? target.value + secondaryColor.substring(7)
                    : target.value + "FF";
                setSecondaryColor(newColor);
              };
              input.click();
            }}
            aria-label="Secondary color"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">
          Color Palette
        </label>
        <div className="grid grid-cols-8 gap-1">
          {colorPalette.map((color, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "aspect-square rounded border transition-all",
                "hover:ring-2 hover:ring-primary/50 hover:scale-110",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                (color === primaryColor || color === secondaryColor) &&
                  "ring-2 ring-primary"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                // Left click sets primary, right click sets secondary
                // For now, just set primary (right-click handling in Editor)
                setPrimaryColor(color);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(color);
              }}
              aria-label={`Color ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

