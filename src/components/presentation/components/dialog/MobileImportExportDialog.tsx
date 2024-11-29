import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Upload, Copy } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";
import { cn } from "@/lib/utils";
import { useAutoScrollTextarea } from "@/hooks/useAutoScroll";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCopyAnimating, setIsCopyAnimating] = useState(false);
  const [isDownloadAnimating, setIsDownloadAnimating] = useState(false);
  const [isFileSelectAnimating, setIsFileSelectAnimating] = useState(false);
  const [isImportAnimating, setIsImportAnimating] = useState(false);
  const textareaRef = useAutoScrollTextarea();

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
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleExportFile = () => {
    setIsDownloadAnimating(true);
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
    setTimeout(() => setIsDownloadAnimating(false), 500);
  };

  const handleFileSelect = () => {
    setIsFileSelectAnimating(true);
    fileInputRef.current?.click();
    setTimeout(() => setIsFileSelectAnimating(false), 500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedPresentation = JSON.parse(content);
        onImport(importedPresentation);
        onOpenChange(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast({
          title: "インポート完了",
          description: "ファイルからプレゼンテーションをインポートしました",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "インポートエラー",
          description: "JSONファイルの形式が正しくありません",
          variant: "destructive",
          duration: 2000,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[400px] p-4">
        <DialogHeader>
          <DialogTitle>プレゼンテーションの連携</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={handleExportFile} variant="outline" size="icon" className="w-10">
                <Download className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isDownloadAnimating && "animate-[spin_0.5s_ease-out]"
                )} />
              </Button>
              <Button onClick={handleExportToClipboard} className="flex-1">
                <Copy className={cn(
                  "w-4 h-4 mr-2 transition-transform duration-300",
                  isCopyAnimating && "animate-[spin_0.5s_ease-out]"
                )} />
                JSONをコピー
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">JSONファイルをインポート:</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button 
                    onClick={handleFileSelect} 
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className={cn(
                      "w-4 h-4 mr-2 transition-transform duration-300",
                      isFileSelectAnimating && "animate-[spin_0.5s_ease-out]"
                    )} />
                    JSONファイルを選択
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">JSONを貼り付けてインポート:</label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="ここにJSONを貼り付けてください"
                  className="min-h-[100px]"
                  ref={textareaRef}
                  style={{ fontSize: '16px' }}
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