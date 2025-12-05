import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Copy, Trash2 } from "lucide-react";
import { useTilesStore } from "@/store/useTilesStore";
import { createDefaultTile } from "@/utils/mockData";

export function PaletteToolbar() {
  const { tiles, selectedTileId, addTile, duplicateTile, deleteTile } =
    useTilesStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleAddTile = () => {
    // Find next available ID
    const maxId = Math.max(...tiles.map((t) => t.id), -1);
    const newId = maxId + 1;
    
    // Get tile size from first tile or default to 16x16
    const tileSize = tiles.length > 0 ? tiles[0].width : 16;
    const newTile = createDefaultTile(newId, tileSize, tileSize);
    addTile(newTile);
  };

  const handleDuplicate = () => {
    if (selectedTileId !== null) {
      duplicateTile(selectedTileId);
    }
  };

  const handleDelete = () => {
    if (selectedTileId !== null) {
      deleteTile(selectedTileId);
      setShowDeleteDialog(false);
    }
  };

  const canDelete = selectedTileId !== null && tiles.length > 1;
  const canDuplicate = selectedTileId !== null;

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTile}
          className="flex-1"
        >
          <Plus className="size-4" />
          <span className="sr-only sm:not-sr-only">Add</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicate}
          disabled={!canDuplicate}
          className="flex-1"
        >
          <Copy className="size-4" />
          <span className="sr-only sm:not-sr-only">Duplicate</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={!canDelete}
          className="flex-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete tile #{selectedTileId}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

