import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Presentation, Slide, createSlide } from "@/lib/presentation";
import SlidePreview from "./SlidePreview";
import SlideEditor from "./SlideEditor";
import TemplateGallery from "./TemplateGallery";
import FullscreenPresentation from "./FullscreenPresentation";
import { Download, Play, Plus } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useSlideScroll } from "@/hooks/useSlideScroll";

interface PresentationEditorProps {
  presentation: Presentation;
  onUpdate: (presentation: Presentation) => void;
}

const PresentationEditor = ({ presentation, onUpdate }: PresentationEditorProps) => {
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { slideRefs, scrollToSlide } = useSlideScroll();

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

  const handleDownload = async () => {
    const pdf = new jsPDF();
    const slides = document.querySelectorAll(".slide-preview");
    
    for (let i = 0; i < slides.length; i++) {
      const canvas = await html2canvas(slides[i] as HTMLElement);
      const imgData = canvas.toDataURL("image/png");
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    }
    
    pdf.save("presentation.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header - Fixed on mobile */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b p-4 md:hidden">
        <div className="flex justify-between items-center gap-2">
          <Button onClick={() => setShowTemplates(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownload} size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsFullscreen(true)} size="sm">
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-screen pt-[4.5rem] md:pt-0">
        {/* Main Content Area */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          {/* Horizontal Slide Preview Carousel */}
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
                <SlidePreview slide={slide} scale={1} />
              </div>
            ))}
            <div className="pr-4" />
          </div>

          {/* Slide Editor */}
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

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white p-4 border-l">
          <Button
            className="w-full mb-4"
            onClick={() => setShowTemplates(true)}
          >
            Add Slide
          </Button>
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
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedSlide === slide.id 
                              ? "shadow-selected scale-[1.02] bg-white rounded-lg" 
                              : ""
                          }`}
                        >
                          <SlidePreview slide={slide} scale={0.15} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex fixed bottom-4 right-4 space-x-2">
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={() => setIsFullscreen(true)}>
            <Play className="w-4 h-4 mr-2" />
            Present
          </Button>
        </div>
      </div>

      {/* Templates and Fullscreen Components */}
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
