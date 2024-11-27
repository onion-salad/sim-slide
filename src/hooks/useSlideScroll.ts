import { useRef } from 'react';

export const useSlideScroll = () => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSlide = (slideId: string) => {
    const slideElement = slideRefs.current[slideId];
    if (slideElement) {
      const container = document.querySelector('.slides-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const slideRect = slideElement.getBoundingClientRect();
        const scrollLeft = slideRect.left - containerRect.left - (containerRect.width - slideRect.width) / 2;
        
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  return {
    slideRefs,
    scrollToSlide
  };
};