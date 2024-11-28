import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <ScrollArea className="h-[30vh] px-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="mobile-slides">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {slides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={(el) => {
                        provided.innerRef(el);
                        if (slideRefs.current) {
                          slideRefs.current[slide.id] = el;
                        }
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group cursor-pointer transition-all duration-300 relative ${
                        selectedSlide === slide.id ? "shadow-selected scale-[1.02] bg-white rounded-lg" : ""
                      } ${snapshot.isDragging ? "opacity-50" : ""}`}
                      onClick={() => onSlideSelect(slide.id)}
                    >
                      <div className="relative">
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
                        <div className="w-full">
                          <SlidePreview slide={slide} scale={0.3} />
                        </div>
                        {snapshot.isDragging && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" />
                        )}
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
  );
};