import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Play, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import { useToast } from "@/components/ui/use-toast";
import { Slide } from "@/lib/presentation";

interface DesktopBottomButtonsProps {
  onRefresh: () => void;
  onPresentClick: () => void;
  slides: Slide[];
}

export const DesktopBottomButtons = ({
  onRefresh,
  onPresentClick,
  slides,
}: DesktopBottomButtonsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsAnimating(true);
    onRefresh();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const handleDownload = async () => {
    if (slides.length === 0) {
      toast({
        title: "エラー",
        description: "スライドがありません",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const pdf = new jsPDF("landscape");
      const slideElements = document.querySelectorAll(".slide-preview");
      
      for (let i = 0; i < slideElements.length; i++) {
        const canvas = await html2canvas(slideElements[i] as HTMLElement, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        
        if (i > 0) {
          pdf.addPage();
        }
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = (pdfHeight - imgHeight * ratio) / 2;
        
        pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      }
      
      pdf.save("presentation.pdf");
      toast({
        title: "ダウンロード完了",
        description: "プレゼンテーションのPDFをダウンロードしました",
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "エラー",
        description: "PDFの生成に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 hidden md:flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-white"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        <Download className={cn(
          "h-5 w-5 transition-transform duration-300",
          isDownloading && "animate-pulse"
        )} />
      </Button>
      <AlertDialog onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white"
          >
            <RefreshCw className={cn(
              "h-5 w-5 transition-transform duration-300",
              isAnimating && "animate-[spin_0.5s_ease-out]"
            )} />
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
            <AlertDialogAction onClick={handleRefresh}>
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