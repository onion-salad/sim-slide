import { Slide } from "@/lib/presentation";
import { DraggableSlideList } from "./DraggableSlideList";

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
  return (
    <DraggableSlideList
      slides={slides}
      selectedSlide={selectedSlide}
      onSlideSelect={onSlideSelect}
      onDeleteSlide={onDeleteSlide}
      onDragEnd={onDragEnd}
      className="h-[calc(100vh-10rem)] mt-4"
    />
  );
};