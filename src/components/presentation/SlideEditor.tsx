import { Slide } from "@/lib/presentation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageEditor from "./editor/ImageEditor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface SlideEditorProps {
  slide?: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        スライドが選択されていません
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    console.log("handleChange called", field, value);
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  const handleImageChange = (image: string, imagePosition?: { x: number; y: number }) => {
    console.log("handleImageChange called", { image, imagePosition });
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

  // サムネイルテンプレート
  if (slide.template === "thumbnail") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={slide.content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // タイトルテンプレート
  if (slide.template === "title") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={slide.content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="text">本文</Label>
          <Textarea
            id="text"
            value={slide.content.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </div>
        <ImageEditor
          image={slide.content.image}
          imagePosition={slide.content.imagePosition}
          onChange={handleImageChange}
        />
      </div>
    );
  }

  // コンテンツテンプレート
  if (slide.template === "content") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={slide.content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subtitle">サブタイトル</Label>
          <Input
            id="subtitle"
            value={slide.content.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="text">本文</Label>
          <Textarea
            id="text"
            value={slide.content.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </div>
      </div>
    );
  }

  // ステップテンプレート
  if (slide.template === "steps") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={slide.content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
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
                    onChange={(e) =>
                      handleStepChange(index, "subtitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>テキスト</Label>
                  <Textarea
                    value={step.text}
                    onChange={(e) =>
                      handleStepChange(index, "text", e.target.value)
                    }
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
      </div>
    );
  }

  return null;
};

export default SlideEditor;