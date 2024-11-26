import { Slide } from "@/lib/presentation";
import TitleSlide from "./templates/TitleSlide";
import ContentSlide from "./templates/ContentSlide";
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

  if (slide.template === "title") {
    return (
      <div 
        ref={slideRef}
        className="slide-preview aspect-video bg-white overflow-hidden relative w-full"
        style={{ 
          fontSize: `${scale}px`,
          '--slide-width': `${slideWidth}px`
        } as React.CSSProperties}
      >
        {/* 背景のグラデーション効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FF] to-white" />
        
        {/* メインコンテンツ */}
        <div className="relative h-full">
          <TitleSlide slide={slide} />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={slideRef}
      className="slide-preview aspect-video bg-white w-full"
      style={{ 
        fontSize: `${scale}px`,
        '--slide-width': `${slideWidth}px`
      } as React.CSSProperties}
    >
      <ContentSlide slide={slide} />
    </div>
  );
};

export default SlidePreview;