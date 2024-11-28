import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    onDragEnd(result);
  };

  return (
    <>
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="mobile-slides-horizontal" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="slides-container w-full overflow-x-auto pb-4 flex gap-4 snap-x snap-mandatory pt-4"
            >
              <div className="pl-4" />
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex-none w-[85%] snap-center transition-all duration-300 ${
                        selectedSlide === slide.id ? "shadow-selected scale-[1.02] bg-white rounded-lg" : ""
                      }`}
                      onClick={() => onSlideSelect(slide.id)}
                    >
                      <div
                        ref={(el) => {
                          if (slideRefs.current) {
                            slideRefs.current[slide.id] = el;
                          }
                        }}
                        className="relative group"
                      >
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="pr-4" />
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={isDragging} onOpenChange={() => setIsDragging(false)}>
        <DialogContent className="max-w-[90%] h-[80vh] p-0 bg-white/80 backdrop-blur-md">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="mobile-slides" direction="vertical">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 space-y-2 h-full overflow-y-auto"
                >
                  {slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white rounded-lg shadow-md transition-all duration-300 ${
                            snapshot.isDragging ? "scale-[1.02] shadow-lg" : ""
                          }`}
                        >
                          <div className="relative">
                            <SlidePreview slide={slide} scale={0.15} />
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
        </DialogContent>
      </Dialog>
    </>
  );
};