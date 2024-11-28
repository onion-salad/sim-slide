import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { useState, useEffect, useRef } from "react";

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
  const [placeholderIndex, setPlaceholderIndex] = useState<number>(-1);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragStart = (start: any) => {
    setDraggedSlideId(start.draggableId);
    setPlaceholderIndex(start.source.index);
  };

  const handleDragUpdate = (update: any) => {
    if (!update.destination) return;

    const container = document.querySelector('.slides-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const dragX = update.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    
    // 現在のプレースホルダーの位置を取得
    const currentIndex = placeholderIndex;
    
    // ドラッグ位置に基づいて新しい位置を計算
    const rightThreshold = containerWidth * 0.65;
    const leftThreshold = containerWidth * 0.35;
    
    if (checkIntervalRef.current) {
      clearTimeout(checkIntervalRef.current);
    }

    checkIntervalRef.current = setTimeout(() => {
      if (dragX > rightThreshold && currentIndex < slides.length - 1) {
        setPlaceholderIndex(currentIndex + 1);
        slideRefs.current[slides[currentIndex + 1].id]?.scrollIntoView({ behavior: 'smooth' });
      } else if (dragX < leftThreshold && currentIndex > 0) {
        setPlaceholderIndex(currentIndex - 1);
        slideRefs.current[slides[currentIndex - 1].id]?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  };

  const handleCustomDragEnd = (result: any) => {
    if (checkIntervalRef.current) {
      clearTimeout(checkIntervalRef.current);
    }
    
    if (!result.destination) {
      setDraggedSlideId(null);
      setPlaceholderIndex(-1);
      return;
    }

    onDragEnd(result);
    setDraggedSlideId(null);
    setPlaceholderIndex(-1);
  };

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearTimeout(checkIntervalRef.current);
      }
    };
  }, []);

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
      onDragEnd={handleCustomDragEnd}
    >
      <Droppable droppableId="mobile-slides" direction="horizontal">
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
                    ref={(el) => {
                      provided.innerRef(el);
                      if (slideRefs.current) {
                        slideRefs.current[slide.id] = el;
                      }
                    }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex-none w-[85%] snap-center transition-all duration-300 
                      ${selectedSlide === slide.id ? "shadow-selected scale-[1.02] bg-white rounded-lg" : ""}
                      ${snapshot.isDragging ? "opacity-50" : ""}
                      ${draggedSlideId === slide.id ? "scale-105" : ""}
                      ${index === placeholderIndex ? "border-2 border-dashed border-blue-500" : ""}`}
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
                )}
              </Draggable>
            ))}
            <div className="pr-4" />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};