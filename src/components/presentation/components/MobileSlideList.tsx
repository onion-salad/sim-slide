import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { DragOverlay } from "./DragOverlay";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MobileSlideListProps {
  slides: Slide[];
  selectedSlide: string | null;
  onSlideSelect: (slideId: string) => void;
  onDeleteSlide: (slideId: string, event: React.MouseEvent) => void;
  onDragEnd: (result: any) => void;
  slideRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export const MobileSlideList = ({
  slides,
  selectedSlide,
  onSlideSelect,
  onDeleteSlide,
  onDragEnd,
  slideRefs,
}: MobileSlideListProps) => {
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showDragDialog, setShowDragDialog] = useState(false);

  const handleDragStart = (start: any) => {
    console.log('Drag started:', start);
    setDraggedSlideId(start.draggableId);
    setCurrentIndex(start.source.index);
    setShowDragDialog(true);
  };

  const handleDragEnd = (result: any) => {
    console.log('Drag ended:', result);
    setDraggedSlideId(null);
    setShowDragDialog(false);
    onDragEnd(result);
  };

  return (
    <>
      <div className="slides-container w-full overflow-x-auto pb-4 flex gap-4 snap-x snap-mandatory pt-4">
        <div className="pl-4" />
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => {
              if (slideRefs.current) {
                slideRefs.current[slide.id] = el;
              }
            }}
            className={`flex-none w-[85%] snap-center transition-all duration-300 ${
              selectedSlide === slide.id ? "shadow-selected scale-[1.02] bg-white rounded-lg" : ""
            }`}
            onClick={() => onSlideSelect(slide.id)}
          >
            <div className="relative group">
              {selectedSlide === slide.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 shadow-md z-10 hover:bg-red-600 text-white"
                  onClick={(e) => onDeleteSlide(slide.id, e)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <SlidePreview slide={slide} scale={1} />
            </div>
          </div>
        ))}
        <div className="pr-4" />
      </div>

      <Dialog open={showDragDialog} onOpenChange={setShowDragDialog}>
        <DialogContent className="max-w-md">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Droppable droppableId="vertical-slides" direction="vertical">
              {(provided, snapshot) => {
                console.log('Droppable provided:', provided);
                console.log('Droppable snapshot:', snapshot);
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 p-2"
                  >
                    {slides.map((slide, index) => (
                      <Draggable key={slide.id} draggableId={slide.id} index={index}>
                        {(provided, snapshot) => {
                          console.log('Draggable provided for slide:', slide.id, provided);
                          console.log('Draggable snapshot for slide:', slide.id, snapshot);
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative transition-all duration-300 ${
                                snapshot.isDragging ? "scale-95" : ""
                              }`}
                            >
                              <div className="w-full bg-white rounded-lg shadow-sm">
                                <SlidePreview slide={slide} scale={0.5} />
                              </div>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </DialogContent>
      </Dialog>
    </>
  );
};