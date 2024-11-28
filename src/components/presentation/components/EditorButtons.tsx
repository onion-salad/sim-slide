import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { Presentation } from "@/lib/presentation";
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

interface EditorButtonsProps {
  presentation: Presentation;
  onRefresh: () => void;
  onPresentClick: () => void;
}

export const EditorButtons = ({ presentation, onRefresh, onPresentClick }: EditorButtonsProps) => {
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
    <>
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="outline">
            <RefreshCw className={cn(
              "w-4 h-4 transition-transform duration-300",
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
      <Button onClick={onPresentClick} size="sm" className="whitespace-nowrap">
        <Play className="w-4 h-4 mr-2" />
        (fn×2)
      </Button>
    </>
  );
};