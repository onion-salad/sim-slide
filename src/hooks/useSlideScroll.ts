import { useRef, useCallback } from 'react';

interface SlideRefs {
  [key: string]: HTMLDivElement | null;
}

export const useSlideScroll = () => {
  const slideRefs = useRef<SlideRefs>({});

  const scrollToSlide = useCallback((targetSlideId: string) => {
    const slideElement = slideRefs.current[targetSlideId];
    if (slideElement) {
      const container = document.querySelector('.slides-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const slideRect = slideElement.getBoundingClientRect();
        const targetScrollLeft = container.scrollLeft + (slideRect.left - containerRect.left) - (containerRect.width - slideRect.width) / 2;

        const duration = 600;
        const startTime = performance.now();
        const startScrollLeft = container.scrollLeft;
        const scrollDistance = targetScrollLeft - startScrollLeft;

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          container.scrollLeft = startScrollLeft + (scrollDistance * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    }
  }, []);

  return {
    slideRefs,
    scrollToSlide
  };
};