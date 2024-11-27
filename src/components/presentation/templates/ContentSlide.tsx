import { Slide } from "@/lib/presentation";
import Title from "../text/Title";
import Subtitle from "../text/Subtitle";
import Body from "../text/Body";

interface ContentSlideProps {
  slide: Slide;
}

const ContentSlide = ({ slide }: ContentSlideProps) => {
  return (
    <div className="h-full p-[8%] flex flex-col">
      {slide.content.title && (
        <Title className="mb-[4%]">
          {slide.content.title}
        </Title>
      )}
      {slide.content.subtitle && (
        <Subtitle className="mb-[4%]">
          {slide.content.subtitle}
        </Subtitle>
      )}
      {slide.content.text && (
        <Body>
          {slide.content.text}
        </Body>
      )}
      {slide.content.image && (
        <div className="mt-auto">
          <img
            src={slide.content.image}
            alt="Slide content"
            className="w-full h-auto object-cover rounded-lg"
            style={{
              objectPosition: `${slide.content.imagePosition?.x || 50}% ${slide.content.imagePosition?.y || 50}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ContentSlide;