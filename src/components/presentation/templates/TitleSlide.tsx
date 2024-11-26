import { Slide } from "@/lib/presentation";
import Title from "../text/Title";
import Body from "../text/Body";

interface TitleSlideProps {
  slide: Slide;
}

const TitleSlide = ({ slide }: TitleSlideProps) => {
  return (
    <div className="h-full flex">
      {/* 左側のコンテンツエリア (60%) */}
      <div className="w-[60%] p-[8%] flex flex-col justify-center">
        {slide.content.title && (
          <Title className="mb-[4%]">
            {slide.content.title}
          </Title>
        )}
        {slide.content.text && (
          <Body className="max-w-[80%]">
            {slide.content.text}
          </Body>
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
    </div>
  );
};

export default TitleSlide;