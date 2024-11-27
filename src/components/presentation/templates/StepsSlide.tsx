import { Slide } from "@/lib/presentation";
import Title from "../text/Title";
import Subtitle from "../text/Subtitle";
import Body from "../text/Body";
import { CircleDot } from "lucide-react";

interface StepsSlideProps {
  slide: Slide;
}

const StepsSlide = ({ slide }: StepsSlideProps) => {
  const numbers = ["1", "2", "3"];

  return (
    <div className="h-full p-[8%] flex flex-col">
      {slide.content.title && (
        <Title className="mb-[6%]">
          {slide.content.title}
        </Title>
      )}
      <div className="space-y-[5%] mt-[2%]">
        {slide.content.steps?.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center relative shadow-selected">
              <CircleDot className="w-4 h-4 text-white/30 absolute" />
              <span className="text-white font-bold text-sm z-10">{numbers[index]}</span>
            </div>
            <div className="flex-1">
              <Subtitle className="mb-2">
                {step.subtitle}
              </Subtitle>
              <Body>
                {step.text}
              </Body>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsSlide;