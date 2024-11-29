import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";
import { cn } from "@/lib/utils";

interface MobileImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentation: Presentation;
  onImport: (presentation: Presentation) => void;
}

export const MobileImportExportDialog = ({
  open,
  onOpenChange,
  presentation,
  onImport,
}: MobileImportExportDialogProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();
  const [isCopyAnimating, setIsCopyAnimating] = useState(false);
  const [isImportAnimating, setIsImportAnimating] = useState(false);

  const handleExportToClipboard = () => {
    setIsCopyAnimating(true);
    const jsonString = JSON.stringify(presentation, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast({
      title: "コピー完了",
      description: "JSONがクリップボードにコピーされました",
      duration: 2000,
    });
    setTimeout(() => setIsCopyAnimating(false), 500);
  };

  const handleImport = () => {
    setIsImportAnimating(true);
    try {
      const importedPresentation = JSON.parse(jsonInput);
      onImport(importedPresentation);
      setJsonInput("");
      onOpenChange(false);
      toast({
        title: "インポート完了",
        description: "プレゼンテーションが正常にインポートされました",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "インポートエラー",
        description: "JSONの形式が正しくありません",
        variant: "destructive",
        duration: 2000,
      });
    }
    setTimeout(() => setIsImportAnimating(false), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>プレゼンテーションの連携</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Button onClick={handleExportToClipboard}>
              <Copy className={cn(
                "w-4 h-4 mr-2 transition-transform duration-300",
                isCopyAnimating && "animate-[spin_0.5s_ease-out]"
              )} />
              JSONをクリップボードにコピー
            </Button>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">JSONを貼り付けてインポート:</label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="ここにJSONを貼り付けてください"
                  className="min-h-[150px]"
                />
                <Button 
                  onClick={handleImport} 
                  className="w-full"
                  disabled={!jsonInput}
                >
                  <Upload className={cn(
                    "w-4 h-4 mr-2 transition-transform duration-300",
                    isImportAnimating && "animate-[spin_0.5s_ease-out]"
                  )} />
                  インポート
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};