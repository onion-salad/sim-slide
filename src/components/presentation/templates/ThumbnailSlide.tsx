import { Slide } from "@/lib/presentation";
import Title from "../text/Title";

interface ThumbnailSlideProps {
  slide: Slide;
}

const ThumbnailSlide = ({ slide }: ThumbnailSlideProps) => {
  return (
    <div className="h-full flex items-center justify-center p-[8%] bg-gradient-to-br from-primary-light to-white">
      {slide.content.title && (
        <Title className="text-center">
          {slide.content.title}
        </Title>
      )}
    </div>
  );
};

export default ThumbnailSlide;