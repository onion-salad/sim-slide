import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Presentation, Slide, createSlide } from "@/lib/presentation";
import SlidePreview from "./SlidePreview";
import SlideEditor from "./SlideEditor";
import TemplateGallery from "./TemplateGallery";
import FullscreenPresentation from "./FullscreenPresentation";
import { Download, Play } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PresentationEditorProps {
  presentation: Presentation;
  onUpdate: (presentation: Presentation) => void;
}

const PresentationEditor = ({ presentation, onUpdate }: PresentationEditorProps) => {
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

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
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white p-4 border-r">
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
                        onClick={() => setSelectedSlide(slide.id)}
                        className={`cursor-pointer ${
                          selectedSlide === slide.id ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <SlidePreview slide={slide} />
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

      <div className="flex-1 p-8">
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

      <div className="fixed bottom-4 right-4 space-x-2">
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={() => setIsFullscreen(true)}>
          <Play className="w-4 h-4 mr-2" />
          Present
        </Button>
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