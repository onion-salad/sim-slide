import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";

interface EditorButtonsProps {
  presentation: Presentation;
  onRefresh: () => void;
  onPresentClick: () => void;
}

export const EditorButtons = ({ presentation, onRefresh, onPresentClick }: EditorButtonsProps) => {
  const { toast } = useToast();

  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "リフレッシュ完了",
      description: "プレゼンテーション情報がリフレッシュされました",
    });
  };

  return (
    <>
      <Button onClick={handleRefresh} size="icon" variant="outline">
        <RefreshCw className="w-4 h-4" />
      </Button>
      <Button onClick={onPresentClick} size="icon">
        <Play className="w-4 h-4" />
      </Button>
    </>
  );
};