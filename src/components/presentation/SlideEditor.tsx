import { Slide } from "@/lib/presentation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Upload, Trash2 } from "lucide-react";
import ImageEditor from "./editor/ImageEditor";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const handleChange = (
    field: keyof typeof slide.content,
    value: string | number | { x: number; y: number } | { subtitle: string; text: string }[]
  ) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  const handleStepChange = (index: number, field: "subtitle" | "text", value: string) => {
    if (!slide.content.steps) return;
    
    const newSteps = [...slide.content.steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value
    };
    
    handleChange("steps", newSteps);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={slide.content.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="スライドのタイトル"
        />
      </div>

      {slide.template === "steps" ? (
        <div className="space-y-6">
          {slide.content.steps?.map((step, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white text-sm">
                  {index + 1}
                </div>
                <Label htmlFor={`step-${index}-subtitle`}>サブタイトル</Label>
              </div>
              <Input
                id={`step-${index}-subtitle`}
                value={step.subtitle}
                onChange={(e) => handleStepChange(index, "subtitle", e.target.value)}
                placeholder={`ステップ ${index + 1} のタイトル`}
              />
              <Label htmlFor={`step-${index}-text`}>本文</Label>
              <Textarea
                id={`step-${index}-text`}
                value={step.text}
                onChange={(e) => handleStepChange(index, "text", e.target.value)}
                placeholder={`ステップ ${index + 1} の説明`}
                rows={3}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          {slide.template !== "title" && (
            <div>
              <Label htmlFor="subtitle">サブタイトル</Label>
              <Input
                id="subtitle"
                value={slide.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="スライドのサブタイトル"
              />
            </div>
          )}
          <div>
            <Label htmlFor="text">本文</Label>
            <Textarea
              id="text"
              value={slide.content.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              placeholder="スライドの本文"
              rows={5}
            />
          </div>
        </>
      )}

      {slide.template !== "steps" && (
        <ImageEditor
          image={slide.content.image}
          imagePosition={slide.content.imagePosition}
          onChange={(field, value) => {
            if (field === "image" && value === "") {
              // 画像を削除する場合は、imagePositionも同時にリセット
              handleChange("image", "");
              handleChange("imagePosition", { x: 50, y: 50 });
            } else {
              handleChange(field, value);
            }
          }}
        />
      )}
    </div>
  );
};

export default SlideEditor;