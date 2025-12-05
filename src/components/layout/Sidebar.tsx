import { Palette } from "@/features/tiles/Palette"

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-card p-4 h-full overflow-hidden">
      <Palette />
    </div>
  )
}

