import { useShortcuts } from "./useShortcuts";

interface EditorShortcutsProps {
  onAddClick: () => void;
  onPresentClick: () => void;
  onSaveClick: () => void;
}

export const useEditorShortcuts = ({ onAddClick, onPresentClick, onSaveClick }: EditorShortcutsProps) => {
  useShortcuts({
    onAddSlide: onAddClick,
    onPresent: onPresentClick,
    onSave: onSaveClick,
  });
};