import { Slide } from "@/lib/presentation";
import TitleSlide from "./templates/TitleSlide";
import ContentSlide from "./templates/ContentSlide";

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
}

const SlidePreview = ({ slide, scale = 1 }: SlidePreviewProps) => {
  if (slide.template === "title") {
    return (
      <div 
        className="slide-preview aspect-video bg-white overflow-hidden relative w-full"
        style={{ 
          fontSize: `${scale}px`,
          width: '100%',
          '--slide-width': '100%'
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
      className="slide-preview aspect-video bg-white w-full"
      style={{ 
        fontSize: `${scale}px`,
        width: '100%',
        '--slide-width': '100%'
      } as React.CSSProperties}
    >
      <ContentSlide slide={slide} />
    </div>
  );
};

export default SlidePreview;