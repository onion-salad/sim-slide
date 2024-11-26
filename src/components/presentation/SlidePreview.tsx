import { Slide } from "@/lib/presentation";

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
}

const SlidePreview = ({ slide, scale = 1 }: SlidePreviewProps) => {
  const baseStyles = {
    titleText: "text-[5%] md:text-[7%] font-bold mb-[4%]",
    bodyText: "text-[3%] md:text-[4%] leading-relaxed",
    contentPadding: "p-[8%]",
    imageWidth: "w-[45%]",
  };

  if (slide.template === "title") {
    return (
      <div 
        className="slide-preview aspect-video bg-white overflow-hidden relative"
        style={{ fontSize: `${100 * scale}px` }} // フォントサイズの基準値を設定
      >
        {/* 背景のグラデーション効果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FF] to-white" />
        
        {/* メインコンテンツ */}
        <div className="relative h-full flex">
          {/* 左側のコンテンツエリア */}
          <div className={`flex-1 ${baseStyles.contentPadding} flex flex-col justify-center`}>
            {slide.content.title && (
              <h3 className={`${baseStyles.titleText} bg-gradient-to-r from-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent`}>
                {slide.content.title}
              </h3>
            )}
            {slide.content.text && (
              <p className={`${baseStyles.bodyText} text-gray-600 max-w-[80%]`}>
                {slide.content.text}
              </p>
            )}
          </div>
          
          {/* 右側の画像エリア */}
          {slide.content.image && (
            <div className={baseStyles.imageWidth}>
              <img
                src={slide.content.image}
                alt="Slide content"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500/20 to-indigo-500/20" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="slide-preview aspect-video bg-white"
      style={{ fontSize: `${100 * scale}px` }}
    >
      <div className="h-full p-[4%]">
        {slide.content.title && (
          <h3 className={baseStyles.titleText}>{slide.content.title}</h3>
        )}
        {slide.content.text && (
          <p className={`${baseStyles.bodyText} text-gray-600`}>{slide.content.text}</p>
        )}
        {slide.content.image && (
          <img
            src={slide.content.image}
            alt="Slide content"
            className="w-full h-[40%] object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default SlidePreview;