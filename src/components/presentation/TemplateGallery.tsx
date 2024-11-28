import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateGalleryProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

const TemplateGallery = ({ onSelect, onClose }: TemplateGalleryProps) => {
  const templates = ["title", "content", "steps", "thumbnail"];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>テンプレートを選択</DialogTitle>
          <DialogDescription>
            スライドに追加するテンプレートを選択してください
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4">
          <div className="grid grid-cols-2 gap-4 p-4">
            {templates.map((template) => (
              <Button
                key={template}
                variant="outline"
                className="h-24 capitalize"
                onClick={() => onSelect(template)}
              >
                {template}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;