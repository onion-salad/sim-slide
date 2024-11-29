import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Presentation } from "@/lib/presentation";

interface ImportExportButtonsProps {
  presentation: Presentation;
  onImport: (presentation: Presentation) => void;
}

export const ImportExportButtons = ({ presentation, onImport }: ImportExportButtonsProps) => {
  const { toast } = useToast();

  const handleExport = () => {
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        onImport(jsonData);
        toast({
          title: "インポート完了",
          description: "プレゼンテーションが正常にインポートされました",
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
    event.target.value = ''; // リセット
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleExport}
        title="JSONとしてエクスポート"
      >
        <Download className="h-4 w-4" />
      </Button>
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
        />
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-none"
          title="JSONからインポート"
        >
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};