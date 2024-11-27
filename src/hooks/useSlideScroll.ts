import { useRef } from 'react';

export const useSlideScroll = () => {
  const slideRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToSlide = (targetSlideId: string) => {
    console.log('scrollToSlide called with targetSlideId:', targetSlideId);
    
    const slideElement = slideRefs.current[targetSlideId];
    if (slideElement) {
      console.log('Found slide element');
      const container = document.querySelector('.slides-container');
      if (container) {
        console.log('Found container element');
        const containerRect = container.getBoundingClientRect();
        const slideRect = slideElement.getBoundingClientRect();

        // スライドの位置を正確に計算
        const containerLeft = containerRect.left;
        const slideLeft = slideRect.left;
        const scrollOffset = container.scrollLeft;
        
        console.log('Position calculations:', {
          containerLeft,
          slideLeft,
          scrollOffset,
          containerWidth: containerRect.width,
          slideWidth: slideRect.width
        });
        
        // スライドを中央に配置するための位置を計算
        const targetScrollLeft = scrollOffset + (slideLeft - containerLeft) - (containerRect.width - slideRect.width) / 2;
        console.log('Target scroll position:', targetScrollLeft);

        // 現在表示されているスライドのIDを取得
        const currentSlideId = Object.entries(slideRefs.current).find(([id, el]) => {
          if (!el) return false;
          const elRect = el.getBoundingClientRect();
          const centerX = containerRect.left + containerRect.width / 2;
          return elRect.left <= centerX && elRect.right >= centerX;
        })?.[0];

        console.log('Current slide ID:', currentSlideId);

        if (!currentSlideId) {
          console.log('No current slide found');
          return;
        }

        // 通過するスライドのIDリストを作成
        const slideIds = Object.keys(slideRefs.current);
        const currentIndex = slideIds.indexOf(currentSlideId);
        const targetIndex = slideIds.indexOf(targetSlideId);
        const isForward = targetIndex > currentIndex;
        
        console.log('Slide indices:', {
          currentIndex,
          targetIndex,
          isForward
        });
        
        const slidesToPass = isForward 
          ? slideIds.slice(currentIndex, targetIndex + 1)
          : slideIds.slice(targetIndex, currentIndex + 1).reverse();

        console.log('Slides to pass:', slidesToPass);

        // アニメーションの設定
        const duration = 600;
        const stepsPerSlide = 15;
        const totalSteps = stepsPerSlide * (slidesToPass.length - 1);
        const stepDuration = duration / totalSteps;
        let currentStep = 0;

        const animate = () => {
          currentStep++;
          
          const progress = currentStep / totalSteps;
          
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

          const easeProgress = progress < 0.5
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;

          container.scrollLeft = targetScrollLeft * easeProgress;
          console.log('Animation progress:', {
            progress,
            easeProgress,
            currentScrollLeft: container.scrollLeft
          });

          if (currentStep < totalSteps) {
            requestAnimationFrame(animate);
          } else {
            console.log('Animation complete');
          }
        };

        requestAnimationFrame(animate);
      } else {
        console.log('Container element not found');
      }
    } else {
      console.log('Slide element not found');
    }
  };

  return {
    slideRefs,
    scrollToSlide
  };
};