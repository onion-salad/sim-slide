import { useEffect, useRef } from 'react';
import { isMobile } from '@/lib/utils';

export const useAutoScroll = () => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = inputRef.current;
    if (!element || !isMobile()) return;

    const handleBlur = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    element.addEventListener('blur', handleBlur);
    return () => element.removeEventListener('blur', handleBlur);
  }, []);

  return inputRef;
};