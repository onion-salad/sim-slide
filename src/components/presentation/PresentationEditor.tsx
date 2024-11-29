import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Presentation, Slide, createSlide } from "@/lib/presentation";
import { savePresentation } from "@/components/presentation/utils/presentationStorage";
import { cn } from "@/lib/utils";
import SlidePreview from "./SlidePreview";
import SlideEditor from "./SlideEditor";
import TemplateGallery from "./TemplateGallery";
import FullscreenPresentation from "./FullscreenPresentation";
import { Plus } from "lucide-react";
import { useSlideScroll } from "@/hooks/useSlideScroll";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useToast } from "@/components/ui/use-toast";
import { isMobile } from "@/lib/utils";
import { MobileHeader } from "./components/MobileHeader";
import { MobileAddButton } from "./components/MobileAddButton";
import { DesktopBottomButtons } from "./components/DesktopBottomButtons";
import { MobileSlideList } from "./components/MobileSlideList";
import { DesktopSlideList } from "./components/DesktopSlideList";
import { SaveButton } from "./components/SaveButton";

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

  useEditorShortcuts({
    onAddClick: handleAddClick,
    onPresentClick: handlePresentClick,
    onSaveClick: handleSave,
  });

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <MobileHeader
        onSave={handleSave}
        onRefresh={handleRefresh}
        onPresentClick={handlePresentClick}
        onReorder={handleDragEnd}
        slides={presentation.slides}
        isSaveAnimating={isSaveAnimating}
        presentation={presentation}
        onImport={onUpdate}
      />

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen pt-[4.5rem] md:pt-0">
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {isMobile() ? (
            <MobileSlideList
              slides={presentation.slides}
              selectedSlide={selectedSlide}
              onSlideSelect={handleSlideSelect}
              onDeleteSlide={handleDeleteSlide}
              onDragEnd={handleDragEnd}
              slideRefs={slideRefs}
            />
          ) : (
            <div className="slides-container w-full overflow-x-auto pb-4 flex gap-4 snap-x snap-mandatory pt-4">
              <div className="pl-4" />
              {presentation.slides.map((slide) => (
                <div
                  key={slide.id}
                  ref={(el) => slideRefs.current[slide.id] = el}
                  className={`flex-none w-[85%] md:w-[70%] snap-center transition-all duration-300 ${selectedSlide === slide.id ? "shadow-selected scale-[1.02] bg-white rounded-lg" : ""}`}
                  onClick={() => handleSlideSelect(slide.id)}
                >
                  <div className="relative group">
                    <SlidePreview slide={slide} scale={1} />
                  </div>
                </div>
              ))}
              <div className="pr-4" />
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
                Select a slide to edit
              </div>
            )}
          </div>
        </div>

        {!isMobile() && (
          <div className="hidden md:block w-64 bg-gray-50 p-4 border-l border-gray-200">
            <div className="space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary/90 hover:to-primary-dark/90" 
                onClick={handleAddClick}
              >
                <Plus className={cn(
                  "w-4 h-4 mr-2 transition-transform duration-300 text-white",
                  isAddAnimating && "animate-[spin_0.5s_ease-out]"
                )} />
                Add (Space × 2)
              </Button>
              <SaveButton onSave={handleSave} isAnimating={isSaveAnimating} />
            </div>
            <DesktopSlideList
              slides={presentation.slides}
              selectedSlide={selectedSlide}
              onSlideSelect={handleSlideSelect}
              onDeleteSlide={handleDeleteSlide}
              onDragEnd={handleDragEnd}
            />
          </div>
        )}
      </div>

      <MobileAddButton onSelectTemplate={handleAddSlide} />

      {!isMobile() && (
        <DesktopBottomButtons
          onRefresh={handleRefresh}
          onPresentClick={handlePresentClick}
          slides={presentation.slides}
          presentation={presentation}
          onImport={onUpdate}
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
