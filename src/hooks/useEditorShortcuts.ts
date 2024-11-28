import { useShortcuts } from "./useShortcuts";

interface EditorShortcutsProps {
  onAddClick: () => void;
  onPresentClick: () => void;
}

export const useEditorShortcuts = ({ onAddClick, onPresentClick }: EditorShortcutsProps) => {
  useShortcuts({
    onAddSlide: onAddClick,
    onPresent: onPresentClick,
  });
};