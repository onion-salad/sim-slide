import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Copy, Link2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentation: Presentation;
  onImport: (presentation: Presentation) => void;
}

export const ImportExportDialog = ({
  open,
  onOpenChange,
  presentation,
  onImport,
}: ImportExportDialogProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const { toast } = useToast();

  const handleExportToClipboard = () => {
    const jsonString = JSON.stringify(presentation, null, 2);
    navigator.clipboard.writeText(jsonString);
    toast({
      title: "コピー完了",
      description: "JSONがクリップボードにコピーされました",
      duration: 2000,
    });
  };

  const handleImport = () => {
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
  };

  const handleExportFile = () => {
    const jsonString = JSON.stringify(presentation, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "エクスポート完了",
      description: "プレゼンテーションがJSONファイルとしてダウンロードされました",
      duration: 2000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>プレゼンテーションの連携</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={handleExportToClipboard} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                JSONをクリップボードにコピー
              </Button>
              <Button onClick={handleExportFile} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                JSONファイルをダウンロード
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">JSONを貼り付けてインポート:</label>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="ここにJSONを貼り付けてください"
                className="min-h-[200px]"
              />
              <Button 
                onClick={handleImport} 
                className="w-full"
                disabled={!jsonInput}
              >
                <Upload className="w-4 h-4 mr-2" />
                インポート
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};