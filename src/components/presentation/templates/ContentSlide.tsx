import { Slide } from "@/lib/presentation";

interface ContentSlideProps {
  slide: Slide;
}

const ContentSlide = ({ slide }: ContentSlideProps) => {
  return (
    <div className="h-full p-[4%]">
      {slide.content.title && (
        <h3 className="text-[32px] md:text-[48px] font-bold mb-[4%]">
          {slide.content.title}
        </h3>
      )}
      {slide.content.text && (
        <p className="text-[16px] md:text-[24px] leading-relaxed text-gray-600">
          {slide.content.text}
        </p>
      )}
      {slide.content.image && (
        <img
          src={slide.content.image}
          alt="Slide content"
          className="w-full h-[40%] object-cover"
        />
      )}
    </div>
  );
};

export default ContentSlide;