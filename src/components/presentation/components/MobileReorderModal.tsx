import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slide } from "@/lib/presentation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SlidePreview from "../SlidePreview";

interface MobileReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  onReorder: (result: any) => void;
}

export const MobileReorderModal = ({
  isOpen,
  onClose,
  slides,
  onReorder,
}: MobileReorderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[80vh] max-w-[90vw] flex flex-col">
        <DialogHeader>
          <DialogTitle>スライドの並び替え</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <DragDropContext onDragEnd={onReorder}>
            <Droppable droppableId="mobile-slides-reorder">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4 p-4"
                >
                  {slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-lg shadow-md"
                        >
                          <div className="w-full aspect-video">
                            <SlidePreview slide={slide} scale={0.5} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};