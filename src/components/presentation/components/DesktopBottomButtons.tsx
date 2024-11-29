import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
import { Slide } from "@/lib/presentation";
import { ImportExportButtons } from "./ImportExportButtons";
import { Presentation } from "@/lib/presentation";

interface DesktopBottomButtonsProps {
  onRefresh: () => void;
  onPresentClick: () => void;
  slides: Slide[];
  presentation: Presentation;
  onImport: (presentation: Presentation) => void;
}

export const DesktopBottomButtons = ({
  onRefresh,
  onPresentClick,
  slides,
  presentation,
  onImport,
}: DesktopBottomButtonsProps) => {
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2">
      <ImportExportButtons presentation={presentation} onImport={onImport} />
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        title="リセット"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPresentClick}
        disabled={slides.length === 0}
        title="プレゼンテーションを開始"
      >
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
};