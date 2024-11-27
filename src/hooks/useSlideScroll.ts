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
        const currentScrollLeft = container.scrollLeft;
        const targetScrollLeft = container.scrollLeft + (slideRect.left - containerRect.left - (containerRect.width - slideRect.width) / 2);
        
        // アニメーションの設定を調整
        const duration = 1200; // アニメーション時間を1.2秒に延長
        const steps = 120; // より細かいステップ数に増加
        const stepDuration = duration / steps;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          
          // よりスムーズなイージング関数（easeInOutQuint）を使用
          const progress = currentStep / steps;
          const easeProgress = progress < 0.5
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;

          const newScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * easeProgress;
          
          container.scrollLeft = newScrollLeft;

          if (currentStep < steps) {
            requestAnimationFrame(() => setTimeout(animate, stepDuration));
          }
        };

        animate();
      }
    }
  };

  return {
    slideRefs,
    scrollToSlide
  };
};