import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

interface ImageEditorProps {
  image?: string;
  imagePosition?: { x: number; y: number };
  onChange: (field: "image" | "imagePosition", value: any) => void;
}

const ImageEditor = ({ image, imagePosition, onChange }: ImageEditorProps) => {
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
      onChange("image", imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    console.log("Delete button clicked"); // デバッグ用ログ
    console.log("Current image value:", image); // 現在の画像値
    console.log("Current imagePosition value:", imagePosition); // 現在の位置情報
    
    onChange("image", undefined);
    console.log("After setting image to undefined"); // 画像削除後
    
    onChange("imagePosition", undefined);
    console.log("After setting imagePosition to undefined"); // 位置情報削除後
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onChange("imagePosition", {
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100)
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">画像</Label>
      <div className="flex gap-2 items-start">
        <Input
          id="image"
          value={image || ""}
          onChange={(e) => onChange("image", e.target.value)}
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
          {image && (
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
      {image && (
        <div 
          className="mt-2 relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
          onClick={handleImageClick}
        >
          <img
            src={image}
            alt="スライドの画像"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: `${imagePosition?.x || 50}% ${imagePosition?.y || 50}%`
            }}
          />
          <div 
            className="absolute w-20 h-20 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: `calc(${imagePosition?.x || 50}% - 40px)`,
              top: `calc(${imagePosition?.y || 50}% - 40px)`,
              boxShadow: '0 0 0 2px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageEditor;