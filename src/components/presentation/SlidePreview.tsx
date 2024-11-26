import { Slide } from "@/lib/presentation";
import { Sparkles } from "lucide-react";

interface SlidePreviewProps {
  slide: Slide;
}

const SlidePreview = ({ slide }: SlidePreviewProps) => {
  if (slide.template === "title") {
    return (
      <div className="slide-preview aspect-video bg-white rounded-[32px] shadow-sm overflow-hidden relative">
        {/* 背景のグラデーション効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FF] to-white" />
        
        {/* メインコンテンツ */}
        <div className="relative h-full flex">
          {/* 左側のコンテンツエリア */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            {slide.content.title && (
              <h3 className="font-bold text-[28px] mb-4 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent">
                {slide.content.title}
              </h3>
            )}
            {slide.content.text && (
              <p className="text-sm text-gray-600 leading-relaxed max-w-[80%]">
                {slide.content.text}
              </p>
            )}
          </div>
          
          {/* 右側の画像エリア */}
          {slide.content.image && (
            <div className="w-[45%] relative">
              <img
                src={slide.content.image}
                alt="Slide content"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* 装飾的な要素 */}
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-violet-400/50" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500/20 to-indigo-500/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="slide-preview aspect-video bg-white rounded shadow-sm p-2 text-xs">
      <div className="h-full border border-gray-200 rounded p-2">
        {slide.content.title && (
          <h3 className="font-semibold mb-1">{slide.content.title}</h3>
        )}
        {slide.content.text && (
          <p className="text-gray-600 truncate">{slide.content.text}</p>
        )}
        {slide.content.image && (
          <img
            src={slide.content.image}
            alt="Slide content"
            className="w-full h-20 object-cover rounded"
          />
        )}
      </div>
    </div>
  );
};

export default SlidePreview;