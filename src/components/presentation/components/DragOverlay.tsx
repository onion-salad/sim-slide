import { cn } from "@/lib/utils";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";

interface DragOverlayProps {
  slides: Slide[];
  draggedSlideId: string;
  currentIndex: number;
}

export const DragOverlay = ({ slides, draggedSlideId, currentIndex }: DragOverlayProps) => {
  const draggedSlide = slides.find(slide => slide.id === draggedSlideId);
  
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="space-y-4 py-8">
        {slides.map((slide, index) => {
          const isBeforeDropPosition = index === currentIndex;
          
          return (
            <div key={slide.id} className="relative">
              {isBeforeDropPosition && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              )}
              <div
                data-index={index + 1}
                className={cn(
                  "relative transition-all duration-300",
                  "hover:scale-105",
                  "before:absolute before:-left-8 before:top-1/2 before:-translate-y-1/2",
                  "before:text-2xl before:font-bold before:text-primary",
                  "before:content-[attr(data-index)]",
                  slide.id === draggedSlideId && "opacity-50"
                )}
              >
                <div className="w-48">
                  <SlidePreview slide={slide} scale={0.15} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};