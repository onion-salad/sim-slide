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
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Shortcut detected:', {
        key: event.key,
        code: event.code,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey
      });

      if (event.code === 'Space' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastSpaceKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          console.log('Double Space detected');
          onAddSlide();
        }
        
        setLastSpaceKeyTime(currentTime);
      }

      if (event.key === 'Alt' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastAltKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          console.log('Double Alt/Option detected');
          onPresent();
        }
        
        setLastAltKeyTime(currentTime);
      }

      // Command + S shortcut
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        console.log('Command + S detected');
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastSpaceKeyTime, lastAltKeyTime, onAddSlide, onPresent, onSave]);
};