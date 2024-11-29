import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Link2 } from "lucide-react";
import { Slide } from "@/lib/presentation";
import { Presentation } from "@/lib/presentation";
import { ImportExportDialog } from "./ImportExportDialog";
import { useState } from "react";

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
  const [showImportExport, setShowImportExport] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowImportExport(true)}
          title="プレゼンテーションの連携"
        >
          <Link2 className="h-4 w-4" />
        </Button>
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
      <ImportExportDialog
        open={showImportExport}
        onOpenChange={setShowImportExport}
        presentation={presentation}
        onImport={onImport}
      />
    </>
  );
};