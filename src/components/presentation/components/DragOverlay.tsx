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
  
  if (!draggedSlide) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[80%] max-w-2xl transform scale-90 transition-transform">
        <SlidePreview slide={draggedSlide} scale={1} />
      </div>
    </div>
  );
};