import { Button } from "@/components/ui/button";
import { Copy, Download, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";

interface ImportExportButtonsProps {
  onExportToClipboard: () => void;
  onExportFile: () => void;
  onFileSelect: () => void;
  onImport: () => void;
  jsonInput: string;
  isCopyAnimating: boolean;
  isDownloadAnimating: boolean;
  isFileSelectAnimating: boolean;
  isImportAnimating: boolean;
  isMobile?: boolean;
}

export const ImportExportButtons = ({
  onExportToClipboard,
  onExportFile,
  onFileSelect,
  onImport,
  jsonInput,
  isCopyAnimating,
  isDownloadAnimating,
  isFileSelectAnimating,
  isImportAnimating,
  isMobile = false,
}: ImportExportButtonsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onExportToClipboard} className="flex-1">
          <Copy className={cn(
            "w-4 h-4 mr-2 transition-transform duration-300",
            isCopyAnimating && "animate-[spin_0.5s_ease-out]"
          )} />
          {isMobile ? "JSONをコピー" : "JSONをクリップボードにコピー"}
        </Button>
        <Button onClick={onExportFile} variant="outline" className="flex-1">
          <Download className={cn(
            "w-4 h-4 mr-2 transition-transform duration-300",
            isDownloadAnimating && "animate-[spin_0.5s_ease-out]"
          )} />
          {isMobile ? "JSONをダウンロード" : "JSONファイルをダウンロード"}
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onFileSelect} 
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
        <Button 
          onClick={onImport} 
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
  );
};