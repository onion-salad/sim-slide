import { useEffect, useState } from "react";

interface ShortcutHandlers {
  onAddSlide: () => void;
  onPresent: () => void;
}

export const useShortcuts = ({ onAddSlide, onPresent }: ShortcutHandlers) => {
  const [lastSpaceKeyTime, setLastSpaceKeyTime] = useState<number>(0);
  const [lastFnKeyTime, setLastFnKeyTime] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastSpaceKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          onAddSlide();
        }
        
        setLastSpaceKeyTime(currentTime);
      }

      if (event.key === 'Fn' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastFnKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          onPresent();
        }
        
        setLastFnKeyTime(currentTime);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastSpaceKeyTime, lastFnKeyTime, onAddSlide, onPresent]);
};