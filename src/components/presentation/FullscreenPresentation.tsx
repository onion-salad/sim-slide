import { useState, useEffect, TouchEvent, useRef } from "react";
import { Slide } from "@/lib/presentation";
import { X, ArrowLeft, ArrowRight, Video, VideoOff } from "lucide-react";
import SlidePreview from "./SlidePreview";
import { ScreenRecorder } from "@/lib/screenRecorder";
import { useToast } from "@/components/ui/use-toast";

interface FullscreenPresentationProps {
  slides: Slide[];
  onClose: () => void;
}

const FullscreenPresentation = ({ slides, onClose }: FullscreenPresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [lastAltKeyTime, setLastAltKeyTime] = useState<number>(0);
  const [lastShiftKeyTime, setLastShiftKeyTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const screenRecorder = useRef(new ScreenRecorder());
  const presentationRef = useRef<HTMLDivElement>(null);
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

  const toggleRecording = async () => {
    if (!presentationRef.current) return;

    if (!isRecording) {
      try {
        await screenRecorder.current.startRecording(presentationRef.current, { preferCurrentTab: true });
        setIsRecording(true);
        toast({
          title: "録画開始",
          description: "プレゼンテーションの録画を開始しました",
          duration: 700,
        });
      } catch (error) {
        toast({
          title: "録画エラー",
          description: "録画の開始に失敗しました",
          variant: "destructive",
          duration: 700,
        });
      }
    } else {
      screenRecorder.current.stopRecording();
      setIsRecording(false);
      toast({
        title: "録画終了",
        description: "録画を保存しました",
        duration: 700,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.key === "Shift" && !e.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastShiftKeyTime;
        
        if (timeDiff < 500) {
          toggleRecording();
        }
        
        setLastShiftKeyTime(currentTime);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, onClose, lastAltKeyTime, lastShiftKeyTime, isRecording]);

  if (!slides.length) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={presentationRef}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-2 text-white">
          <button
            onClick={toggleRecording}
            className="text-white hover:text-gray-300 flex items-center gap-2"
          >
            {isRecording ? (
              <VideoOff className="w-6 h-6" />
            ) : (
              <Video className="w-6 h-6" />
            )}
            <span className="text-sm">(Shift×2)</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300"
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