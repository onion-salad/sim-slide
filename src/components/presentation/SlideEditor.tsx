import { Slide } from "@/lib/presentation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageEditor from "./editor/ImageEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useCallback, useRef } from "react";

interface SlideEditorProps {
  slide?: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const isComposingRef = useRef(false);

  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        スライドが選択されていません
      </div>
    );
  }

  const handleChange = useCallback((field: string, value: any) => {
    console.log('Input event details:', {
      field,
      value,
      type: typeof value,
      composing: isComposingRef.current
    });

    if (isComposingRef.current) {
      console.log('Skipping update during IME composition');
      return;
    }

    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  }, [slide, onUpdate]);

  const handleCompositionStart = () => {
    console.log('Composition start');
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (field: string, value: string) => {
    console.log('Composition end:', { field, value });
    isComposingRef.current = false;
    handleChange(field, value);
  };

  const handleImageChange = useCallback((image: string, imagePosition?: { x: number; y: number }) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        image,
        imagePosition: imagePosition || { x: 50, y: 50 },
      },
    });
  }, [slide, onUpdate]);

  const handleStepChange = useCallback((index: number, field: string, value: string) => {
    const steps = [...(slide.content.steps || [])];
    steps[index] = {
      ...steps[index],
      [field]: value,
    };
    handleChange("steps", steps);
  }, [slide.content.steps, handleChange]);

  const handleAddStep = useCallback(() => {
    const steps = [...(slide.content.steps || [])];
    if (steps.length >= 3) return;
    steps.push({ subtitle: "", text: "" });
    handleChange("steps", steps);
  }, [slide.content.steps, handleChange]);

  const handleRemoveStep = useCallback((index: number) => {
    const steps = [...(slide.content.steps || [])];
    steps.splice(index, 1);
    handleChange("steps", steps);
  }, [slide.content.steps, handleChange]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={slide.content.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={(e) => handleCompositionEnd("title", e.currentTarget.value)}
        />
      </div>
      {slide.template === "content" && (
        <div>
          <Label htmlFor="subtitle">サブタイトル</Label>
          <Input
            id="subtitle"
            value={slide.content.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(e) => handleCompositionEnd("subtitle", e.currentTarget.value)}
          />
        </div>
      )}
      {(slide.template === "content" || slide.template === "title") && (
        <div>
          <Label htmlFor="text">本文</Label>
          <Textarea
            id="text"
            value={slide.content.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(e) => handleCompositionEnd("text", e.currentTarget.value)}
          />
        </div>
      )}
      {slide.template === "title" && (
        <ImageEditor
          image={slide.content.image}
          imagePosition={slide.content.imagePosition}
          onChange={handleImageChange}
        />
      )}
      {slide.template === "steps" && (
        <>
          <div>
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={slide.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={(e) => handleCompositionEnd("title", e.currentTarget.value)}
            />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {(slide.content.steps || []).map((step, index) => (
              <AccordionItem key={index} value={`step-${index}`}>
                <div className="flex items-center">
                  <AccordionTrigger className="flex-1">
                    {step.subtitle || `ステップ ${index + 1}`}
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStep(index)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <AccordionContent className="space-y-4">
                  <div>
                    <Label>サブタイトル</Label>
                    <Input
                      value={step.subtitle}
                      onChange={(e) => handleStepChange(index, "subtitle", e.target.value)}
                      onCompositionStart={handleCompositionStart}
                      onCompositionEnd={(e) => handleCompositionEnd(`steps.${index}.subtitle`, e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <Label>テキスト</Label>
                    <Textarea
                      value={step.text}
                      onChange={(e) => handleStepChange(index, "text", e.target.value)}
                      onCompositionStart={handleCompositionStart}
                      onCompositionEnd={(e) => handleCompositionEnd(`steps.${index}.text`, e.currentTarget.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button 
            onClick={handleAddStep} 
            variant="outline" 
            className="w-full"
            disabled={slide.content.steps?.length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" />
            ステップを追加
          </Button>
        </>
      )}
    </div>
  );
};

export default SlideEditor;