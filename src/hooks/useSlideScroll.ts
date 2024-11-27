import { useRef } from 'react';

export const useSlideScroll = () => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSlide = (slideId: string) => {
    const slideElement = slideRefs.current[slideId];
    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  return {
    slideRefs,
    scrollToSlide
  };
};