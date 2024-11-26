import { useState, useEffect, TouchEvent } from "react";
import { Slide } from "@/lib/presentation";
import { X } from "lucide-react";

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
      
      <div className="h-full flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-4xl aspect-video rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            {slides[currentSlide].content.title}
          </h2>
          <p className="text-xl mb-4">{slides[currentSlide].content.text}</p>
          {slides[currentSlide].content.image && (
            <img
              src={slides[currentSlide].content.image}
              alt="Slide content"
              className="max-h-[50vh] object-contain mx-auto"
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default FullscreenPresentation;