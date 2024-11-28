import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Presentation, Slide, createSlide } from "@/lib/presentation";
import SlidePreview from "./SlidePreview";
import SlideEditor from "./SlideEditor";
import TemplateGallery from "./TemplateGallery";
import FullscreenPresentation from "./FullscreenPresentation";
import { X } from "lucide-react";
import { useSlideScroll } from "@/hooks/useSlideScroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorButtons } from "./components/EditorButtons";
import { SaveButton } from "./components/SaveButton";
import { AddSlideButton } from "./components/AddSlideButton";

interface PresentationEditorProps {
  presentation: Presentation;
  onUpdate: (presentation: Presentation) => void;
}

const PresentationEditor = ({ presentation, onUpdate }: PresentationEditorProps) => {
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { slideRefs, scrollToSlide } = useSlideScroll();
  const [lastSpaceKeyTime, setLastSpaceKeyTime] = useState<number>(0);
  const [lastFnKeyTime, setLastFnKeyTime] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // スペースキーのダブルクリック
      if (event.code === 'Space' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastSpaceKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          setShowTemplates(true);
        }
        
        setLastSpaceKeyTime(currentTime);
      }

      // Fnキーのダブルクリック
      if (event.key === 'Fn' && !event.repeat) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastFnKeyTime;
        
        if (timeDiff < 500) {
          event.preventDefault();
          setIsFullscreen(true);
        }
        
        setLastFnKeyTime(currentTime);
      }

      // Command + S
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastSpaceKeyTime, lastFnKeyTime]);

  const handleSlideSelect = (slideId: string) => {
    setSelectedSlide(slideId);
    scrollToSlide(slideId);
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

  const handleSave = () => {
    localStorage.setItem('presentation', JSON.stringify(presentation));
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b p-4 md:hidden">
        <div className="flex flex-col gap-2">
          <AddSlideButton onClick={() => setShowTemplates(true)} />
          <SaveButton onSave={handleSave} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen pt-[4.5rem] md:pt-0">
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="slides-container w-full overflow-x-auto pb-4 flex gap-4 snap-x snap-mandatory pt-4">
            <div className="pl-4" />
            {presentation.slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => slideRefs.current[slide.id] = el}
                className={`flex-none w-[85%] md:w-[70%] snap-center transition-all duration-300 ${
                  selectedSlide === slide.id 
                    ? "shadow-selected scale-[1.02] bg-white rounded-lg" 
                    : ""
                }`}
                onClick={() => handleSlideSelect(slide.id)}
              >
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full bg-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 text-white"
                    onClick={(e) => handleDeleteSlide(slide.id, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <SlidePreview slide={slide} scale={1} />
                </div>
              </div>
            ))}
            <div className="pr-4" />
          </div>

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

      <div className="hidden md:block w-64 bg-white p-4 border-l">
        <div className="space-y-2">
          <AddSlideButton onClick={() => setShowTemplates(true)} />
          <SaveButton onSave={handleSave} />
        </div>
          <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="slides">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {presentation.slides.map((slide, index) => (
                      <Draggable
                        key={slide.id}
                        draggableId={slide.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleSlideSelect(slide.id)}
                            className={`group cursor-pointer transition-all duration-300 relative ${
                              selectedSlide === slide.id 
                                ? "shadow-selected scale-[1.02] bg-white rounded-lg" 
                                : ""
                            }`}
                          >
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 h-6 w-6 rounded-full bg-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 text-white"
                                onClick={(e) => handleDeleteSlide(slide.id, e)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <SlidePreview slide={slide} scale={0.15} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </ScrollArea>
      </div>

      <div className="fixed bottom-4 right-4 space-x-2">
        <EditorButtons
          presentation={presentation}
          onRefresh={handleRefresh}
          onPresentClick={() => setIsFullscreen(true)}
        />
      </div>

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
