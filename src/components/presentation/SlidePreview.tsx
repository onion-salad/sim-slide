import { Slide } from "@/lib/presentation";

interface SlidePreviewProps {
  slide: Slide;
}

const SlidePreview = ({ slide }: SlidePreviewProps) => {
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