import { Card } from "@/components/ui/card"

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-card p-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Tile Palette</h2>
        <p className="text-sm text-muted-foreground">
          Tile palette will appear here
        </p>
      </Card>
    </div>
  )
}

