import { Button } from "@/components/ui/button";
import { Pencil, Eraser, PaintBucket, Pipette, Grid } from "lucide-react";
import { useTilesStore } from "@/store/useTilesStore";
import { ToolType as ToolTypeEnum } from "@/types/ToolType";
import { cn } from "@/lib/utils";

export function Toolbar() {
  const { currentTool, setTool, showGrid, toggleGrid } = useTilesStore();

  const tools = [
    {
      type: ToolTypeEnum.Pencil,
      icon: Pencil,
      label: "Pencil",
      shortcut: "1",
    },
    {
      type: ToolTypeEnum.Eraser,
      icon: Eraser,
      label: "Eraser",
      shortcut: "2",
    },
    {
      type: ToolTypeEnum.Fill,
      icon: PaintBucket,
      label: "Fill",
      shortcut: "3",
    },
    {
      type: ToolTypeEnum.Picker,
      icon: Pipette,
      label: "Picker",
      shortcut: "4",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 border rounded-md p-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.type;
          return (
            <Button
              key={tool.type}
              variant={isActive ? "default" : "ghost"}
              size="icon"
              onClick={() => setTool(tool.type)}
              className={cn(
                "relative",
                isActive && "bg-primary text-primary-foreground"
              )}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </div>
      <Button
        variant={showGrid ? "default" : "outline"}
        size="icon"
        onClick={toggleGrid}
        title="Toggle Grid (G)"
      >
        <Grid className="size-4" />
      </Button>
    </div>
  );
}

