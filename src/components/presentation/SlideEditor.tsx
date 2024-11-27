import { Slide } from "@/lib/presentation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Upload, Trash2 } from "lucide-react";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const handleChange = (
    field: keyof typeof slide.content,
    value: string | number | { x: number; y: number }
  ) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      handleChange("image", imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    const updatedSlide = {
      ...slide,
      content: {
        ...slide.content,
        image: "",
        imagePosition: { x: 50, y: 50 }
      }
    };
    onUpdate(updatedSlide);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    handleChange("imagePosition", {
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100)
    });
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
      <div>
        <Label htmlFor="subtitle">サブタイトル</Label>
        <Input
          id="subtitle"
          value={slide.content.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="スライドのサブタイトル"
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="image">画像</Label>
        <div className="flex gap-2 items-start">
          <Input
            id="image"
            value={slide.content.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="画像URL"
            className="flex-1"
          />
          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {slide.content.image && (
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleImageDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {slide.content.image && (
          <div 
            className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
            onClick={handleImageClick}
          >
            <img
              src={slide.content.image}
              alt="スライドの画像"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: `${slide.content.imagePosition?.x || 50}% ${slide.content.imagePosition?.y || 50}%`
              }}
            />
            <div 
              className="absolute w-20 h-20 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: `calc(${slide.content.imagePosition?.x || 50}% - 40px)`,
                top: `calc(${slide.content.imagePosition?.y || 50}% - 40px)`,
                boxShadow: '0 0 0 2px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideEditor;