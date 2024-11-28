import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { DragOverlay } from "./DragOverlay";
import { useState } from "react";
import { isMobile } from "@/lib/utils";

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

  const handleDragStart = (start: any) => {
    if (isMobile()) {
      setDraggedSlideId(start.draggableId);
      setCurrentIndex(start.source.index);
    }
  };

  const handleDragEnd = (result: any) => {
    setDraggedSlideId(null);
    onDragEnd(result);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="mobile-slides" direction="vertical">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 px-4"
          >
            {slides.map((slide, index) => (
              <Draggable key={slide.id} draggableId={slide.id} index={index}>
                {(provided) => (
                  <div
                    ref={(el) => {
                      provided.innerRef(el);
                      if (slideRefs.current) {
                        slideRefs.current[slide.id] = el;
                      }
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative transition-all duration-300 ${
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
      {draggedSlideId && isMobile() && (
        <DragOverlay
          slides={slides}
          draggedSlideId={draggedSlideId}
          currentIndex={currentIndex}
        />
      )}
    </DragDropContext>
  );
};