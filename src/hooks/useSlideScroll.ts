import { useRef } from 'react';

export const useSlideScroll = () => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSlide = (targetSlideId: string) => {
    const slideElement = slideRefs.current[targetSlideId];
    if (slideElement) {
      const container = document.querySelector('.slides-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const slideRect = slideElement.getBoundingClientRect();
        const currentScrollLeft = container.scrollLeft;
        const targetScrollLeft = container.scrollLeft + (slideRect.left - containerRect.left - (containerRect.width - slideRect.width) / 2);

        // 現在表示されているスライドのIDを取得
        const currentSlideId = Object.entries(slideRefs.current).find(([id, el]) => {
          if (!el) return false;
          const elRect = el.getBoundingClientRect();
          return elRect.left >= containerRect.left && elRect.left <= containerRect.right;
        })?.[0];

        if (!currentSlideId) return;

        // 通過するスライドのIDリストを作成
        const slideIds = Object.keys(slideRefs.current);
        const currentIndex = slideIds.indexOf(currentSlideId);
        const targetIndex = slideIds.indexOf(targetSlideId);
        const isForward = targetIndex > currentIndex;
        
        const slidesToPass = isForward 
          ? slideIds.slice(currentIndex, targetIndex + 1)
          : slideIds.slice(targetIndex, currentIndex + 1).reverse();

        // アニメーションの設定
        const duration = 1200;
        const stepsPerSlide = 20;
        const totalSteps = stepsPerSlide * (slidesToPass.length - 1);
        const stepDuration = duration / totalSteps;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          
          // 現在のスライドインデックスを計算
          const slideIndex = Math.floor(currentStep / stepsPerSlide);
          if (slideIndex < slidesToPass.length) {
            // スライドを選択状態に
            const currentSlideElement = slideRefs.current[slidesToPass[slideIndex]];
            if (currentSlideElement) {
              // 前のスライドの選択を解除
              Object.values(slideRefs.current).forEach(el => {
                if (el) el.classList.remove('shadow-selected', 'scale-[1.02]', 'bg-white', 'rounded-lg');
              });
              // 現在のスライドを選択状態に
              currentSlideElement.classList.add('shadow-selected', 'scale-[1.02]', 'bg-white', 'rounded-lg');
            }
          }

          // スクロール位置の計算
          const progress = currentStep / totalSteps;
          const easeProgress = progress < 0.5
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;

          const newScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * easeProgress;
          container.scrollLeft = newScrollLeft;

          if (currentStep < totalSteps) {
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