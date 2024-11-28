import { Button } from "@/components/ui/button";
import { Play, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";
import { savePresentation } from "../utils/presentationStorage";

interface EditorButtonsProps {
  presentation: Presentation;
  onRefresh: () => void;
  onPresentClick: () => void;
}

export const EditorButtons = ({ presentation, onRefresh, onPresentClick }: EditorButtonsProps) => {
  const { toast } = useToast();

  const handleSave = () => {
    savePresentation(presentation);
    toast({
      title: "保存完了",
      description: "プレゼンテーションが保存されました",
    });
  };

  const handleRefresh = () => {
    onRefresh();
    toast({
      title: "リフレッシュ完了",
      description: "プレゼンテーション情報がリフレッシュされました",
    });
  };

  return (
    <>
      <Button onClick={handleSave} size="sm" variant="outline">
        <Save className="w-4 h-4 mr-2" />
        保存
      </Button>
      <Button onClick={handleRefresh} size="sm" variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        リフレッシュ
      </Button>
      <Button onClick={onPresentClick} size="sm">
        <Play className="w-4 h-4 mr-2" />
        Present
      </Button>
    </>
  );
};