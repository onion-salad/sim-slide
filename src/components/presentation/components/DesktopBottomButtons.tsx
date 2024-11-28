import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";
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
  return (
    <div className="fixed bottom-4 right-4 hidden md:flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white"
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
        className="bg-primary hover:bg-primary/90 px-4 py-2 flex items-center gap-2"
      >
        <Play className="h-5 w-5 text-white" />
        <span className="text-white">(Option×2)</span>
      </Button>
    </div>
  );
};