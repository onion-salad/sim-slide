import { useRef } from 'react';

interface ScrollState {
  lastScrollTime: number;
  isScrolling: boolean;
}

export const useSlideScroll = () => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollState = useRef<ScrollState>({
    lastScrollTime: 0,
    isScrolling: false,
  });

  const getNextSlideId = (currentSlideId: string, slides: string[], direction: 'left' | 'right') => {
    const currentIndex = slides.indexOf(currentSlideId);
    if (direction === 'right' && currentIndex < slides.length - 1) {
      return slides[currentIndex + 1];
    }
    if (direction === 'left' && currentIndex > 0) {
      return slides[currentIndex - 1];
    }
    return currentSlideId;
  };

  const scrollToSlide = (targetSlideId: string) => {
    const slideElement = slideRefs.current[targetSlideId];
    if (!slideElement) return;

    const container = document.querySelector('.slides-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const slideRect = slideElement.getBoundingClientRect();
    const targetScrollLeft = container.scrollLeft + (slideRect.left - containerRect.left) - (containerRect.width - slideRect.width) / 2;

    const startTime = performance.now();
    const startScrollLeft = container.scrollLeft;
    const scrollDistance = targetScrollLeft - startScrollLeft;
    const duration = 300;

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
  };

  const handleDragScroll = (dragX: number, currentSlideId: string, slides: string[]) => {
    const container = document.querySelector('.slides-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const currentTime = Date.now();

    // 前回のスクロールから1秒以上経過していない場合は何もしない
    if (currentTime - scrollState.current.lastScrollTime < 1000) {
      return;
    }

    const relativeX = dragX - containerRect.left;
    const containerWidth = containerRect.width;
    const leftZone = containerWidth * 0.35;
    const rightZone = containerWidth * 0.65;

    if (relativeX < leftZone) {
      const nextSlideId = getNextSlideId(currentSlideId, slides, 'left');
      if (nextSlideId !== currentSlideId) {
        scrollState.current.lastScrollTime = currentTime;
        scrollToSlide(nextSlideId);
      }
    } else if (relativeX > rightZone) {
      const nextSlideId = getNextSlideId(currentSlideId, slides, 'right');
      if (nextSlideId !== currentSlideId) {
        scrollState.current.lastScrollTime = currentTime;
        scrollToSlide(nextSlideId);
      }
    }
  };

  return {
    slideRefs,
    scrollToSlide,
    handleDragScroll
  };
};