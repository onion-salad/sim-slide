import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { Presentation } from "@/lib/presentation";
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
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="outline">
            <RefreshCw className="w-4 h-4" />
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
      <Button onClick={onPresentClick} size="icon">
        <Play className="w-4 h-4" />
      </Button>
    </>
  );
};