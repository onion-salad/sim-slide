import { useEffect, useState } from "react";

interface ShortcutHandlers {
  onAddSlide: () => void;
  onPresent: () => void;
  onSave: () => void;
}

export const useShortcuts = ({ onAddSlide, onPresent, onSave }: ShortcutHandlers) => {
  const [lastSpaceKeyTime, setLastSpaceKeyTime] = useState<number>(0);
  const [lastAltKeyTime, setLastAltKeyTime] = useState<number>(0);

  useEffect(() => {
    console.log('useShortcuts hook initialized');

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', {
        key: event.key,
        code: event.code,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        repeat: event.repeat,
        timestamp: new Date().getTime()
      });

      // Command + S
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        console.log('Command + S detected - calling onSave');
        onSave();
        return;
      }

      if (event.code === 'Space' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastSpaceKeyTime;
        
        console.log('Space key pressed:', {
          timeDiff,
          lastSpaceKeyTime,
          currentTime
        });
        
        if (timeDiff < 500) {
          event.preventDefault();
          console.log('Double Space detected - calling onAddSlide');
          onAddSlide();
        }
        
        setLastSpaceKeyTime(currentTime);
      }

      if (event.key === 'Alt' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastAltKeyTime;
        
        console.log('Alt key pressed:', {
          timeDiff,
          lastAltKeyTime,
          currentTime
        });
        
        if (timeDiff < 500) {
          event.preventDefault();
          console.log('Double Alt/Option detected - calling onPresent');
          onPresent();
        }
        
        setLastAltKeyTime(currentTime);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log('useShortcuts hook cleanup');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastSpaceKeyTime, lastAltKeyTime, onAddSlide, onPresent, onSave]);
};