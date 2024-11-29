import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Link2 } from "lucide-react";
import { Slide } from "@/lib/presentation";
import { Presentation } from "@/lib/presentation";
import { ImportExportDialog } from "./ImportExportDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isLinkAnimating, setIsLinkAnimating] = useState(false);
  const [isRefreshAnimating, setIsRefreshAnimating] = useState(false);

  const handleLinkClick = () => {
    setIsLinkAnimating(true);
    setShowImportExport(true);
    setTimeout(() => setIsLinkAnimating(false), 500);
  };

  const handleRefreshClick = () => {
    setIsRefreshAnimating(true);
    onRefresh();
    setTimeout(() => setIsRefreshAnimating(false), 500);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsRefreshAnimating(true);
      setTimeout(() => setIsRefreshAnimating(false), 500);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleLinkClick}
          title="プレゼンテーションの連携"
        >
          <Link2 className={cn(
            "h-4 w-4 transition-transform duration-300",
            isLinkAnimating && "animate-[spin_0.5s_ease-out]"
          )} />
        </Button>
        <AlertDialog onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              title="リセット"
            >
              <RefreshCw className={cn(
                "h-4 w-4 transition-transform duration-300",
                isRefreshAnimating && "animate-[spin_0.5s_ease-out]"
              )} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>プレゼンテーションをリフレッシュ</AlertDialogTitle>
              <AlertDialogDescription>
                本当にプレゼンテーション情報を消去してもよろしいですか？
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleRefreshClick}>
                リフレッシュ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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