import { Slide } from "@/lib/presentation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const handleChange = (
    field: keyof typeof slide.content,
    value: string
  ) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={slide.content.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Slide title"
        />
      </div>
      <div>
        <Label htmlFor="text">Content</Label>
        <Textarea
          id="text"
          value={slide.content.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Slide content"
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={slide.content.image || ""}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  );
};

export default SlideEditor;