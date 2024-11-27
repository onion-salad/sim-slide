import { Slide } from "@/lib/presentation";
import TitleSlide from "./templates/TitleSlide";
import ContentSlide from "./templates/ContentSlide";
import StepsSlide from "./templates/StepsSlide";
import { useEffect, useRef, useState } from "react";

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
}

const SlidePreview = ({ slide, scale = 1 }: SlidePreviewProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (slideRef.current) {
        setSlideWidth(slideRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const renderSlide = () => {
    switch (slide.template) {
      case "title":
        return <TitleSlide slide={slide} />;
      case "steps":
        return <StepsSlide slide={slide} />;
      default:
        return <ContentSlide slide={slide} />;
    }
  };

  return (
    <div 
      ref={slideRef}
      className="slide-preview aspect-video bg-white overflow-hidden relative w-full"
      style={{ 
        fontSize: `${scale}px`,
        '--slide-width': `${slideWidth}px`
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FF] to-white" />
      <div className="relative h-full">
        {renderSlide()}
      </div>
    </div>
  );
};

export default SlidePreview;