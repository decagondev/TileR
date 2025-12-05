import { ScrollArea } from "@/components/ui/scroll-area"
import { MapConfigPanel } from "@/features/map/MapConfigPanel"
import { LayerPanel } from "@/features/map/LayerPanel"

export function Panel() {
  return (
    <div className="w-64 border-l border-border bg-card p-4 h-full overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          <MapConfigPanel />
          <LayerPanel />
        </div>
      </ScrollArea>
    </div>
  )
}

