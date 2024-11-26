import { Slide } from "@/lib/presentation";
import { Sparkles } from "lucide-react";

interface SlidePreviewProps {
  slide: Slide;
}

const SlidePreview = ({ slide }: SlidePreviewProps) => {
  if (slide.template === "title") {
    return (
      <div className="slide-preview aspect-video bg-gradient-to-br from-primary-light to-white rounded shadow-sm p-6 text-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
          <Sparkles className="w-4 h-4 text-primary/50" />
        </div>
        <div className="h-full flex flex-col justify-center items-start text-left">
          {slide.content.title && (
            <h3 className="font-bold text-base mb-3 text-primary">
              {slide.content.title}
            </h3>
          )}
          {slide.content.text && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {slide.content.text}
            </p>
          )}
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