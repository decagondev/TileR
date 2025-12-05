import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from "@/features/tiles/Editor"
import { MapCanvas } from "@/features/map/MapCanvas"

export function Main() {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <Tabs defaultValue="tile-editor" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="tile-editor">Tile Editor</TabsTrigger>
          <TabsTrigger value="map-editor">Map Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="tile-editor" className="flex-1 m-0">
          <Editor />
        </TabsContent>
        <TabsContent value="map-editor" className="flex-1 m-0">
          <MapCanvas />
        </TabsContent>
      </Tabs>
    </div>
  )
}

