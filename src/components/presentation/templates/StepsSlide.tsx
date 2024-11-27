import { Slide } from "@/lib/presentation";
import Title from "../text/Title";
import Subtitle from "../text/Subtitle";
import Body from "../text/Body";

interface StepsSlideProps {
  slide: Slide;
}

const StepsSlide = ({ slide }: StepsSlideProps) => {
  const numbers = ["1", "2", "3"];

  return (
    <div className="h-full p-[8%] flex flex-col">
      {slide.content.title && (
        <Title className="mb-[3%]">
          {slide.content.title}
        </Title>
      )}
      <div className="space-y-[5%] mt-[2%]">
        {slide.content.steps?.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-none w-[calc(var(--slide-width)*0.048)] h-[calc(var(--slide-width)*0.048)] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6366F1] flex items-center justify-center relative shadow-selected">
              <span className="text-white font-bold text-[calc(var(--slide-width)*0.024)]">{numbers[index]}</span>
            </div>
            <div className="flex-1 flex items-center">
              <div>
                <h2 className={`text-[length:calc(var(--slide-width)*0.036)] leading-[1.15] font-semibold bg-gradient-to-r from-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent ${!step.text ? "" : "mb-1.5"}`}>
                  {step.subtitle}
                </h2>
                {step.text && (
                  <Body>
                    {step.text}
                  </Body>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsSlide;