import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Play } from "lucide-react";
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

interface MobileHeaderProps {
  onSave: () => void;
  onRefresh: () => void;
  onPresentClick: () => void;
  isSaveAnimating: boolean;
}

export const MobileHeader = ({
  onSave,
  onRefresh,
  onPresentClick,
  isSaveAnimating
}: MobileHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b p-4 md:hidden">
      <div className="flex justify-end items-center gap-2">
        <Button
          onClick={onSave}
          variant="ghost"
          size="icon"
          className={`${isSaveAnimating ? "animate-[spin_0.5s_ease-out]" : ""}`}
        >
          <Save className="h-5 w-5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <RefreshCw className="h-5 w-5" />
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
              <AlertDialogAction onClick={onRefresh}>
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
  );
};