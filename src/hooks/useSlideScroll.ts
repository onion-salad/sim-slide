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
        
        // アニメーションの設定
        const duration = 800; // アニメーション時間（ミリ秒）
        const steps = 60; // アニメーションのステップ数
        const stepDuration = duration / steps;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          
          // イージング関数（easeInOutCubic）を使用してよりスムーズな動きを実現
          const progress = currentStep / steps;
          const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const newScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * easeProgress;
          
          container.scrollLeft = newScrollLeft;

          if (currentStep < steps) {
            setTimeout(animate, stepDuration);
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