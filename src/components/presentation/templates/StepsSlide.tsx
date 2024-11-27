import { Slide } from "@/lib/presentation";
import Title from "../text/Title";
import Subtitle from "../text/Subtitle";
import Body from "../text/Body";
import { Numeric1, Numeric2, Numeric3 } from "lucide-react";

interface StepsSlideProps {
  slide: Slide;
}

const StepsSlide = ({ slide }: StepsSlideProps) => {
  const numberIcons = [
    <Numeric1 className="w-full h-full text-white" />,
    <Numeric2 className="w-full h-full text-white" />,
    <Numeric3 className="w-full h-full text-white" />
  ];

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
            <div className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center p-1.5">
              {numberIcons[index]}
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