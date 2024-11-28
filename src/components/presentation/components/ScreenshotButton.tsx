import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { captureSlides, downloadImages } from "../utils/screenshot";

interface ScreenshotButtonProps {
  onCapture: () => void;
}

export const ScreenshotButton = ({ onCapture }: ScreenshotButtonProps) => {
  const { toast } = useToast();

  const handleCapture = async () => {
    try {
      onCapture();
      const slideElements = Array.from(document.querySelectorAll('.slide-preview'));
      const images = await captureSlides(slideElements as HTMLElement[]);
      downloadImages(images);
      
      toast({
        title: "スクリーンショット完了",
        description: `${images.length}枚のスライドを保存しました`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "スクリーンショットの保存に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleCapture}
      variant="ghost"
      className="w-full"
    >
      <Camera className="w-4 h-4 mr-2" />
      スクリーンショット
    </Button>
  );
};