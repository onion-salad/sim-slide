import { useState } from "react";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { DraggableSlideList } from "./DraggableSlideList";

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
      <div className="slides-container w-full overflow-x-auto pb-4 flex gap-4 snap-x snap-mandatory pt-4">
        <div className="pl-4" />
        {slides.map((slide) => (
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
            onTouchStart={handleDragStart}
          >
            <div className="relative group">
              <SlidePreview slide={slide} scale={1} />
            </div>
          </div>
        ))}
        <div className="pr-4" />
      </div>

      <Dialog open={isDragging} onOpenChange={() => setIsDragging(false)}>
        <DialogOverlay className="bg-white/30 backdrop-blur-md" />
        <DialogContent className="max-w-[90%] h-[80vh] p-6 bg-white/95 border shadow-lg">
          <DraggableSlideList
            slides={slides}
            selectedSlide={selectedSlide}
            onSlideSelect={onSlideSelect}
            onDeleteSlide={onDeleteSlide}
            onDragEnd={handleDragEnd}
            scale={0.15}
            className="h-full"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};