import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";

interface DesktopSlideListProps {
  slides: Slide[];
  selectedSlide: string | null;
  onSlideSelect: (slideId: string) => void;
  onDeleteSlide: (slideId: string, event: React.MouseEvent) => void;
  onDragEnd: (result: any) => void;
}

export const DesktopSlideList = ({
  slides,
  selectedSlide,
  onSlideSelect,
  onDeleteSlide,
  onDragEnd,
}: DesktopSlideListProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragUpdate = (event: any) => {
    if (!event.clientY || !scrollAreaRef.current) return;

    const { clientY } = event;
    const { top, bottom, height } = scrollAreaRef.current.getBoundingClientRect();
    const relativeY = ((clientY - top) / height) * 100;

    if (relativeY < 40) {
      setScrollDirection('up');
    } else if (relativeY > 60) {
      setScrollDirection('down');
    } else {
      setScrollDirection(null);
    }
  };

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    setScrollDirection(null);
    if (scrollIntervalRef.current) {
      window.clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    onDragEnd(result);
  };

  useEffect(() => {
    if (!scrollDirection || !scrollAreaRef.current) {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    scrollIntervalRef.current = window.setInterval(() => {
      if (scrollAreaRef.current) {
        const scrollAmount = scrollDirection === 'up' ? -10 : 10;
        scrollAreaRef.current.scrollTop += scrollAmount;
      }
    }, 16);

    return () => {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [scrollDirection]);

  return (
    <div className={`mt-4 transition-opacity duration-300 ${isDragging ? 'bg-white/80 backdrop-blur-md' : ''}`}>
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-12rem)]">
        <DragDropContext
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId="slides" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 p-2"
              >
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative group transition-all duration-300 ${
                          selectedSlide === slide.id
                            ? "shadow-selected scale-[1.02] bg-white rounded-lg"
                            : ""
                        } ${snapshot.isDragging ? "scale-75" : ""}`}
                        onClick={() => onSlideSelect(slide.id)}
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
                        <div className="w-full">
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
      </ScrollArea>
    </div>
  );
};