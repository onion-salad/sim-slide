import { Slide } from "@/lib/presentation";
import ImageEditor from "./editor/ImageEditor";
import TextEditor from "./editor/TextEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  const handleImageChange = (image: string, imagePosition?: { x: number; y: number }) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        image,
        imagePosition: imagePosition || { x: 50, y: 50 },
      },
    });
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const steps = [...(slide.content.steps || [])];
    steps[index] = {
      ...steps[index],
      [field]: value,
    };
    handleChange("steps", steps);
  };

  const handleAddStep = () => {
    const steps = [...(slide.content.steps || [])];
    if (steps.length >= 3) {
      toast({
        title: "ステップ数制限",
        description: "ステップは最大3つまでです",
        variant: "destructive",
      });
      return;
    }
    steps.push({ subtitle: "", text: "" });
    handleChange("steps", steps);
  };

  const handleRemoveStep = (index: number) => {
    const steps = [...(slide.content.steps || [])];
    steps.splice(index, 1);
    handleChange("steps", steps);
  };

  if (slide.template === "thumbnail") {
    return (
      <TextEditor
        title={slide.content.title}
        onChange={handleChange}
      />
    );
  }

  if (slide.template === "title") {
    return (
      <div className="space-y-4">
        <TextEditor
          title={slide.content.title}
          text={slide.content.text}
          onChange={handleChange}
        />
        <ImageEditor
          image={slide.content.image}
          imagePosition={slide.content.imagePosition}
          onChange={handleImageChange}
        />
      </div>
    );
  }

  if (slide.template === "content") {
    return (
      <TextEditor
        title={slide.content.title}
        subtitle={slide.content.subtitle}
        text={slide.content.text}
        onChange={handleChange}
        showSubtitle={true}
      />
    );
  }

  if (slide.template === "steps") {
    return (
      <div className="space-y-4">
        <TextEditor
          title={slide.content.title}
          onChange={handleChange}
        />
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
                <TextEditor
                  subtitle={step.subtitle}
                  onChange={(field, value) => handleStepChange(index, field, value)}
                  showSubtitle={true}
                />
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
      </div>
    );
  }

  return null;
};

export default SlideEditor;