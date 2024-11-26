import { useState, useEffect, TouchEvent } from "react";
import { Slide } from "@/lib/presentation";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import SlidePreview from "./SlidePreview";

interface FullscreenPresentationProps {
  slides: Slide[];
  onClose: () => void;
}

const FullscreenPresentation = ({ slides, onClose }: FullscreenPresentationProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

    if (Math.abs(diff) > 50) { // minimum swipe distance
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, onClose]);

  if (!slides.length) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
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