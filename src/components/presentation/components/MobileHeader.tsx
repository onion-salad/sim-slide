import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Play, List } from "lucide-react";
import { cn } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slide } from "@/lib/presentation";
import SlidePreview from "../SlidePreview";

interface MobileHeaderProps {
  onSave: () => void;
  onRefresh: () => void;
  onPresentClick: () => void;
  isSaveAnimating: boolean;
  slides: Slide[];
  onReorderSlides: (newOrder: string[]) => void;
}

export const MobileHeader = ({
  onSave,
  onRefresh,
  onPresentClick,
  isSaveAnimating,
  slides,
  onReorderSlides,
}: MobileHeaderProps) => {
  const [isRefreshAnimating, setIsRefreshAnimating] = useState(false);
  const [reorderedSlides, setReorderedSlides] = useState<Slide[]>([]);

  const handleRefresh = () => {
    setIsRefreshAnimating(true);
    onRefresh();
    setTimeout(() => setIsRefreshAnimating(false), 1000);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsRefreshAnimating(true);
      setTimeout(() => setIsRefreshAnimating(false), 1000);
    }
  };

  const handleSheetOpen = (open: boolean) => {
    if (open) {
      setReorderedSlides([...slides]);
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...reorderedSlides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newSlides.length) {
      [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
      setReorderedSlides(newSlides);
      onReorderSlides(newSlides.map(slide => slide.id));
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b p-4 md:hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-[1.4rem] font-bold tracking-tight bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Sim-Slide
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={onSave}
            variant="ghost"
            size="icon"
            className={`${isSaveAnimating ? "animate-[spin_0.5s_ease-out]" : ""}`}
          >
            <Save className="h-5 w-5" />
          </Button>

          <Sheet onOpenChange={handleSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>スライドの並び替え</SheetTitle>
                <SheetDescription>
                  スライドの順序を変更するには、上下の矢印を使用してください。
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {reorderedSlides.map((slide, index) => (
                  <div key={slide.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="w-32 h-20 relative">
                      <SlidePreview slide={slide} scale={0.5} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === reorderedSlides.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <AlertDialog onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <RefreshCw className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isRefreshAnimating && "animate-[spin_0.5s_ease-out]"
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
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Play className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};