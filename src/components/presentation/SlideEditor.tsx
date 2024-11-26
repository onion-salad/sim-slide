import { Slide } from "@/lib/presentation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const { toast } = useToast();

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "エラー",
        description: "画像サイズは5MB以下にしてください",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "エラー",
        description: "画像ファイルを選択してください",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      handleChange("image", imageDataUrl);
      toast({
        title: "成功",
        description: "画像がアップロードされました",
      });
    };
    reader.readAsDataURL(file);
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
        <Label htmlFor="text">内容</Label>
        <Textarea
          id="text"
          value={slide.content.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="スライドの内容"
          rows={5}
        />
      </div>
      <div>
        <Label htmlFor="image">画像</Label>
        <div className="flex gap-2 items-center">
          <Input
            id="image"
            value={slide.content.image || ""}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="画像URL"
            className="flex-1"
          />
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Button type="button" variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {slide.content.image && (
          <div className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={slide.content.image}
              alt="スライドの画像"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideEditor;