import { Slide } from "@/lib/presentation";

interface TitleSlideProps {
  slide: Slide;
}

const TitleSlide = ({ slide }: TitleSlideProps) => {
  return (
    <div className="h-full flex">
      {/* 左側のコンテンツエリア (60%) */}
      <div className="w-[60%] p-[8%] flex flex-col justify-center">
        {slide.content.title && (
          <h3 className="text-[32px] md:text-[48px] font-bold mb-[4%] bg-gradient-to-r from-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent">
            {slide.content.title}
          </h3>
        )}
        {slide.content.text && (
          <p className="text-[16px] md:text-[24px] leading-relaxed text-gray-600 max-w-[80%]">
            {slide.content.text}
          </p>
        )}
      </div>
      
      {/* 右側の画像エリア (40%) */}
      {slide.content.image && (
        <div className="w-[40%] relative">
          <img
            src={slide.content.image}
            alt="Slide content"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: `${slide.content.imagePosition?.x || 50}% ${slide.content.imagePosition?.y || 50}%`
            }}
          />
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500/20 to-indigo-500/20" />
    </div>
  );
};

export default TitleSlide;