import { useState, useEffect, TouchEvent } from "react";
import { Slide } from "@/lib/presentation";
import { X, ArrowLeft, ArrowRight, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { isMobile } from "@/lib/utils";
import SlidePreview from "./SlidePreview";

interface FullscreenPresentationProps {
  slides: Slide[];
  onClose: () => void;
}

const FullscreenPresentation = ({ slides, onClose }: FullscreenPresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [lastAltKeyTime, setLastAltKeyTime] = useState<number>(0);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStart(null);
  };

  const handleVideoClick = () => {
    console.log('ビデオボタンがクリックされました');
    toast({
      title: "スクリーン録画",
      description: "Command (⌘) + Shift + 5 を押して録画を開始してください",
      duration: 1000,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('キーが押されました:', {
        key: e.key,
        code: e.code,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        repeat: e.repeat,
        timestamp: new Date().getTime()
      });

      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Alt" && !e.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastAltKeyTime;
        
        if (timeDiff < 500) {
          onClose();
        }
        
        setLastAltKeyTime(currentTime);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, onClose, lastAltKeyTime]);

  if (!slides.length) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-4 right-4 flex items-center gap-4 text-white">
        {!isMobile() && (
          <button
            onClick={handleVideoClick}
            className="hover:text-gray-300"
          >
            <Video className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={onClose}
          className="hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="h-full flex items-center justify-center p-4">
        <div className="w-full aspect-video">
          <SlidePreview slide={slides[currentSlide]} />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8 text-white">
        <button 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="p-2 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span>{currentSlide + 1} / {slides.length}</span>
        <button 
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="p-2 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FullscreenPresentation;