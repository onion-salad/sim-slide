import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
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
}

export const DesktopBottomButtons = ({
  onRefresh,
  onPresentClick,
}: DesktopBottomButtonsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    setIsAnimating(true);
    onRefresh();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 hidden md:flex gap-2">
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white"
          >
            <RefreshCw className={cn(
              "h-5 w-5 transition-transform duration-300",
              isAnimating && "animate-[spin_0.5s_ease-out]"
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
        className="bg-primary hover:bg-primary/90 px-4 py-2 flex items-center gap-2"
      >
        <Play className="h-5 w-5 text-white" />
        <span className="text-white">(Option×2)</span>
      </Button>
    </div>
  );
};