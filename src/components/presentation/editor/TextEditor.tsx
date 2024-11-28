import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAutoScrollInput, useAutoScrollTextarea } from "@/hooks/useAutoScroll";

interface TextEditorProps {
  title?: string;
  subtitle?: string;
  text?: string;
  onChange: (field: string, value: string) => void;
  showSubtitle?: boolean;
}

const TextEditor = ({ title, subtitle, text, onChange, showSubtitle = false }: TextEditorProps) => {
  const titleInputRef = useAutoScrollInput();
  const subtitleInputRef = useAutoScrollInput();
  const textInputRef = useAutoScrollTextarea();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          ref={titleInputRef}
          value={title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      {showSubtitle && (
        <div>
          <Label htmlFor="subtitle">サブタイトル</Label>
          <Input
            id="subtitle"
            ref={subtitleInputRef}
            value={subtitle || ""}
            onChange={(e) => onChange("subtitle", e.target.value)}
          />
        </div>
      )}
      <div>
        <Label htmlFor="text">本文</Label>
        <Textarea
          id="text"
          ref={textInputRef}
          value={text || ""}
          onChange={(e) => onChange("text", e.target.value)}
        />
      </div>
    </div>
  );
};

export default TextEditor;