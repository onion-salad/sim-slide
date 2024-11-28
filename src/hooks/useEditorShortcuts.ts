import { useEffect } from 'react';

interface UseEditorShortcutsProps {
  onSave: () => void;
  onPresent: () => void;
  onShowTemplates: () => void;
}

export const useEditorShortcuts = ({ onSave, onPresent, onShowTemplates }: UseEditorShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command + S
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }

      // Fnキーのダブルクリック
      if (event.key === 'F12' && !event.repeat) {
        event.preventDefault();
        onPresent();
      }

      // スペースキーのダブルクリック
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault();
        onShowTemplates();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onPresent, onShowTemplates]);
};