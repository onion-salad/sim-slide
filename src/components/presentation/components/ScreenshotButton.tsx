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
      
      if (slideElements.length === 0) {
        toast({
          title: "エラー",
          description: "スライドが見つかりませんでした",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const images = await captureSlides(slideElements as HTMLElement[]);
      
      if (images.length === 0) {
        toast({
          title: "エラー",
          description: "スクリーンショットの作成に失敗しました",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      await downloadImages(images);
      
      toast({
        title: "スクリーンショット完了",
        description: `${images.length}枚のスライドを保存しました`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      toast({
        title: "エラー",
        description: "スクリーンショットの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
        duration: 3000,
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