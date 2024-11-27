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

        // スライドを中央に配置するためのスクロール位置を計算
        const targetScrollLeft = slideElement.offsetLeft - (containerRect.width - slideRect.width) / 2;

        // 現在表示されているスライドのIDを取得
        const currentSlideId = Object.entries(slideRefs.current).find(([id, el]) => {
          if (!el) return false;
          const elRect = el.getBoundingClientRect();
          const centerX = containerRect.left + containerRect.width / 2;
          return elRect.left <= centerX && elRect.right >= centerX;
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
        const duration = 600;
        const stepsPerSlide = 15;
        const totalSteps = stepsPerSlide * (slidesToPass.length - 1);
        const stepDuration = duration / totalSteps;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          
          // 現在のスライドインデックスと進行度を計算
          const progress = currentStep / totalSteps;
          
          // スライドの選択状態を更新（進行度に基づいて少し早めに更新）
          const adjustedIndex = Math.min(
            Math.floor((progress + 0.1) * (slidesToPass.length - 1)),
            slidesToPass.length - 1
          );
          
          if (adjustedIndex >= 0 && adjustedIndex < slidesToPass.length) {
            const currentSlideElement = slideRefs.current[slidesToPass[adjustedIndex]];
            if (currentSlideElement) {
              Object.values(slideRefs.current).forEach(el => {
                if (el) el.classList.remove('shadow-selected', 'scale-[1.02]', 'bg-white', 'rounded-lg');
              });
              currentSlideElement.classList.add('shadow-selected', 'scale-[1.02]', 'bg-white', 'rounded-lg');
            }
          }

          // スクロール位置の計算
          const easeProgress = progress < 0.5
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;

          const currentScrollLeft = container.scrollLeft;
          const newScrollLeft = currentScrollLeft + (targetScrollLeft - currentScrollLeft) * easeProgress;
          container.scrollLeft = newScrollLeft;

          if (currentStep < totalSteps) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    }
  };

  return {
    slideRefs,
    scrollToSlide
  };
};