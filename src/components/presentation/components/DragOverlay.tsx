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
          const adjustedIndex = index >= currentIndex ? index + 1 : index;
          if (slide.id === draggedSlideId) {
            return (
              <div
                key={`dummy-${slide.id}`}
                data-index={currentIndex + 1}
                className={cn(
                  "relative transition-all duration-300",
                  "before:absolute before:-left-8 before:top-1/2 before:-translate-y-1/2",
                  "before:text-2xl before:font-bold before:text-primary",
                  "before:content-[attr(data-index)]"
                )}
              >
                <div className="w-48 border-2 border-dashed border-primary/50 aspect-video rounded-lg bg-primary/5" />
              </div>
            );
          }
          return (
            <div
              key={slide.id}
              data-index={adjustedIndex + 1}
              className={cn(
                "relative transition-all duration-300",
                "hover:scale-105",
                "before:absolute before:-left-8 before:top-1/2 before:-translate-y-1/2",
                "before:text-2xl before:font-bold before:text-primary",
                "before:content-[attr(data-index)]"
              )}
            >
              <div className="w-48">
                <SlidePreview slide={slide} scale={0.15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};