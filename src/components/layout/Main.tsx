import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Main() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <Tabs defaultValue="tile-editor" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="tile-editor">Tile Editor</TabsTrigger>
          <TabsTrigger value="map-editor">Map Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="tile-editor" className="flex-1 m-0 p-4">
          <div className="h-full flex items-center justify-center border border-border rounded-lg">
            <p className="text-muted-foreground">Tile Editor Canvas</p>
          </div>
        </TabsContent>
        <TabsContent value="map-editor" className="flex-1 m-0 p-4">
          <div className="h-full flex items-center justify-center border border-border rounded-lg">
            <p className="text-muted-foreground">Map Editor Canvas</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

