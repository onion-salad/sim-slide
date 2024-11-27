import { templates } from "@/lib/presentation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TemplateGalleryProps {
  onSelect: (template: string) => void;
  onClose: () => void;
}

const TemplateGallery = ({ onSelect, onClose }: TemplateGalleryProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>テンプレートを選択</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className="aspect-video bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200"
            >
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover rounded"
              />
              <p className="mt-2 text-sm font-medium text-gray-700">
                {template.name}
              </p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;