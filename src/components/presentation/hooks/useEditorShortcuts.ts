import { useEffect } from "react";

interface UseEditorShortcutsProps {
  onAddSlide: () => void;
  onPresent: () => void;
  onSave: () => void;
}

export const useEditorShortcuts = ({ onAddSlide, onPresent, onSave }: UseEditorShortcutsProps) => {
  useEffect(() => {
    let lastSpaceKeyTime = 0;
    let lastFnKeyTime = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      // スペースキーのダブルクリック
      if (event.code === 'Space' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastSpaceKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          onAddSlide();
        }
        lastSpaceKeyTime = currentTime;
      }

      // Fnキーのダブルクリック (F1キーを使用)
      if (event.key === 'F1' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastFnKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          onPresent();
        }
        lastFnKeyTime = currentTime;
      }

      // Command + S
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddSlide, onPresent, onSave]);
};