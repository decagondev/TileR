import { Card } from "@/components/ui/card"

export function Panel() {
  return (
    <div className="w-64 border-l border-border bg-card p-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-sm text-muted-foreground">
          Properties and export options will appear here
        </p>
      </Card>
    </div>
  )
}

