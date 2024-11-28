import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Play, List } from "lucide-react";
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
import { Slide } from "@/lib/presentation";
import { MobileReorderModal } from "./MobileReorderModal";

interface MobileHeaderProps {
  onSave: () => void;
  onRefresh: () => void;
  onPresentClick: () => void;
  onReorder: (result: any) => void;
  slides: Slide[];
  isSaveAnimating: boolean;
}

export const MobileHeader = ({
  onSave,
  onRefresh,
  onPresentClick,
  onReorder,
  slides,
  isSaveAnimating
}: MobileHeaderProps) => {
  const [isRefreshAnimating, setIsRefreshAnimating] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshAnimating(true);
    onRefresh();
    setTimeout(() => setIsRefreshAnimating(false), 1000);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsRefreshAnimating(true);
      setTimeout(() => setIsRefreshAnimating(false), 1000);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b p-4 md:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-[1.4rem] font-bold tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Sim-Slide
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={onSave}
              variant="ghost"
              size="icon"
              className={`${isSaveAnimating ? "animate-[spin_0.5s_ease-out]" : ""}`}
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => setShowReorderModal(true)}
              variant="ghost"
              size="icon"
            >
              <List className="h-5 w-5" />
            </Button>
            <AlertDialog onOpenChange={handleOpenChange}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <RefreshCw className={cn(
                    "h-5 w-5 transition-transform duration-300",
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
                  <AlertDialogAction onClick={handleRefresh}>
                    リフレッシュ
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={onPresentClick}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
      <MobileReorderModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        slides={slides}
        onReorder={onReorder}
      />
    </>
  );
};