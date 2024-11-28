import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Presentation, Slide, createSlide } from "@/lib/presentation";
import { savePresentation } from "@/components/presentation/utils/presentationStorage";
import { cn } from "@/lib/utils";
import SlidePreview from "./SlidePreview";
import SlideEditor from "./SlideEditor";
import TemplateGallery from "./TemplateGallery";
import FullscreenPresentation from "./FullscreenPresentation";
import { Plus, X, RefreshCw, Play } from "lucide-react";
import { useSlideScroll } from "@/hooks/useSlideScroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorButtons } from "./components/EditorButtons";
import { SaveButton } from "./components/SaveButton";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useToast } from "@/components/ui/use-toast";
import { MobileHeader } from "./components/MobileHeader";
import { MobileAddButton } from "./components/MobileAddButton";
import { isMobile } from "@/lib/utils";
import { DesktopBottomButtons } from "./components/DesktopBottomButtons";
import { MobileSlideList } from "./components/MobileSlideList";
import { DesktopSlideList } from "./components/DesktopSlideList";

interface PresentationEditorProps {
  presentation: Presentation;
  onUpdate: (presentation: Presentation) => void;
}

const PresentationEditor = ({ presentation, onUpdate }: PresentationEditorProps) => {
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);
  const [isAddAnimating, setIsAddAnimating] = useState(false);
  const { slideRefs, scrollToSlide } = useSlideScroll();
  const { toast } = useToast();

  const handleSlideSelect = (slideId: string) => {
    setSelectedSlide(slideId);
    scrollToSlide(slideId);
  };

  const handleAddClick = () => {
    setIsAddAnimating(true);
    setShowTemplates(true);
    setTimeout(() => setIsAddAnimating(false), 500);
  };

  const handlePresentClick = () => {
    setIsFullscreen(true);
  };

  const handleSave = () => {
    setIsSaveAnimating(true);
    try {
      savePresentation(presentation);
      if (!isMobile()) {
        toast({
          title: "保存完了",
          description: "プレゼンテーションが保存されました",
          duration: 500,
        });
      }
    } catch (error) {
      console.error("Failed to save presentation:", error);
      toast({
        title: "保存エラー",
        description: "プレゼンテーションの保存に失敗しました",
        variant: "destructive",
        duration: 500,
      });
    }
    setTimeout(() => setIsSaveAnimating(false), 1000);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const slides = Array.from(presentation.slides);
    const [reorderedSlide] = slides.splice(result.source.index, 1);
    slides.splice(result.destination.index, 0, reorderedSlide);

    onUpdate({ ...presentation, slides });
  };

  const handleAddSlide = (template: string) => {
    const newSlide = createSlide(template);
    onUpdate({
      ...presentation,
      slides: [...presentation.slides, newSlide],
    });
    setShowTemplates(false);
  };

  const handleUpdateSlide = (updatedSlide: Slide) => {
    const slideIndex = presentation.slides.findIndex((s) => s.id === updatedSlide.id);
    if (slideIndex === -1) return;

    const updatedSlides = [...presentation.slides];
    updatedSlides[slideIndex] = updatedSlide;
    onUpdate({ ...presentation, slides: updatedSlides });
  };

  const handleDeleteSlide = (slideId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedSlides = presentation.slides.filter((s) => s.id !== slideId);
    onUpdate({ ...presentation, slides: updatedSlides });
    
    if (selectedSlide === slideId) {
      setSelectedSlide(updatedSlides[0]?.id || null);
    }
  };

  const handleRefresh = () => {
    setSelectedSlide(null);
    localStorage.clear();
    onUpdate({ ...presentation, slides: [] });
  };

  const handleReorderSlides = (newOrder: string[]) => {
    const reorderedSlides = newOrder.map(id => 
      presentation.slides.find(slide => slide.id === id)!
    );
    onUpdate({ ...presentation, slides: reorderedSlides });
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <MobileHeader
        onSave={handleSave}
        onRefresh={handleRefresh}
        onPresentClick={handlePresentClick}
        isSaveAnimating={isSaveAnimating}
        slides={presentation.slides}
        onReorderSlides={handleReorderSlides}
      />

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen pt-[4.5rem] md:pt-0">
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {isMobile() ? (
            <MobileSlideList
              slides={presentation.slides}
              selectedSlide={selectedSlide}
              onSlideSelect={handleSlideSelect}
              onDeleteSlide={handleDeleteSlide}
              slideRefs={slideRefs}
            />
          ) : (
            <div className="flex flex-wrap gap-4 mb-4">
              {presentation.slides.map((slide) => (
                <div
                  key={slide.id}
                  onClick={() => handleSlideSelect(slide.id)}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 relative",
                    selectedSlide === slide.id && "shadow-selected scale-[1.02]"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full bg-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 text-white"
                    onClick={(e) => handleDeleteSlide(slide.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div ref={(el) => (slideRefs.current[slide.id] = el)}>
                    <SlidePreview slide={slide} scale={0.2} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto mt-4 bg-white p-4 overflow-x-hidden">
            {selectedSlide ? (
              <SlideEditor
                slide={presentation.slides.find((s) => s.id === selectedSlide)!}
                onUpdate={handleUpdateSlide}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                スライドを選択して編集
              </div>
            )}
          </div>
        </div>

        {!isMobile() && (
          <div className="hidden md:block w-64 bg-white p-4 border-l">
            <div className="space-y-2">
              <Button className="w-full" onClick={handleAddClick}>
                <Plus className={cn(
                  "w-4 h-4 mr-2 transition-transform duration-300",
                  isAddAnimating && "animate-[spin_0.5s_ease-out]"
                )} />
                追加 (Space×2)
              </Button>
              <SaveButton onSave={handleSave} isAnimating={isSaveAnimating} />
            </div>
          </div>
        )}
      </div>

      <MobileAddButton onSelectTemplate={handleAddSlide} />

      {!isMobile() && (
        <DesktopBottomButtons
          onRefresh={handleRefresh}
          onPresentClick={handlePresentClick}
        />
      )}

      {showTemplates && (
        <TemplateGallery
          onSelect={handleAddSlide}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {isFullscreen && (
        <FullscreenPresentation
          slides={presentation.slides}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
};

export default PresentationEditor;