import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useAutoScrollInput } from "@/hooks/useAutoScroll";

interface ImageEditorProps {
  image?: string;
  imagePosition?: { x: number; y: number };
  onChange: (image: string, imagePosition?: { x: number; y: number }) => void;
}

const ImageEditor = ({ image, imagePosition, onChange }: ImageEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageUrlInputRef = useAutoScrollInput();
  const [isValidImage, setIsValidImage] = useState<boolean>(false);

  // 画像の有効性をチェック
  useEffect(() => {
    if (!image) {
      setIsValidImage(false);
      return;
    }

    const img = new Image();
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
    img.src = image;
  }, [image]);

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
      onChange(imageDataUrl, imagePosition);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isValidImage) {
      onChange("", undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isValidImage) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onChange(image || "", {
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100)
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, imagePosition);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label htmlFor="image">画像</Label>
      <div className="flex gap-2 items-start">
        <Input
          id="image"
          ref={imageUrlInputRef}
          value={image || ""}
          onChange={handleUrlChange}
          placeholder="画像URL"
          className="flex-1"
        />
        <div className="flex gap-2">
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
              style={{ zIndex: 1 }}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              className="pointer-events-none"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {isValidImage && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleImageDelete}
              className="relative z-10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {isValidImage && (
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