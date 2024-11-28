import { Slide } from "@/lib/presentation";
import ImageEditor from "./editor/ImageEditor";
import TextEditor from "./editor/TextEditor";
import StepEditor from "./editor/StepEditor";

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
}

const SlideEditor = ({ slide, onUpdate }: SlideEditorProps) => {
  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        [field]: value,
      },
    });
  };

  const handleImageChange = (image: string, imagePosition?: { x: number; y: number }) => {
    onUpdate({
      ...slide,
      content: {
        ...slide.content,
        image,
        imagePosition: imagePosition || { x: 50, y: 50 },
      },
    });
  };

  if (!slide.content) {
    console.error("Slide content is missing:", slide);
    return null;
  }

  // サムネイルテンプレート: タイトルのみ
  if (slide.template === "thumbnail") {
    return (
      <TextEditor
        title={slide.content.title || ""}
        onChange={handleChange}
      />
    );
  }

  // タイトルテンプレート: タイトル + 本文 + 画像
  if (slide.template === "title") {
    return (
      <div className="space-y-4">
        <TextEditor
          title={slide.content.title || ""}
          text={slide.content.text || ""}
          onChange={handleChange}
        />
        <ImageEditor
          image={slide.content.image}
          imagePosition={slide.content.imagePosition}
          onChange={handleImageChange}
        />
      </div>
    );
  }

  // コンテンツテンプレート: タイトル + サブタイトル + 本文
  if (slide.template === "content") {
    return (
      <TextEditor
        title={slide.content.title || ""}
        subtitle={slide.content.subtitle || ""}
        text={slide.content.text || ""}
        onChange={handleChange}
        showSubtitle={true}
      />
    );
  }

  // ステップテンプレート: タイトル + ステップ
  if (slide.template === "steps") {
    return (
      <div className="space-y-4">
        <TextEditor
          title={slide.content.title || ""}
          onChange={handleChange}
        />
        <StepEditor
          steps={slide.content.steps || []}
          onChange={(steps) => handleChange("steps", steps)}
        />
      </div>
    );
  }

  console.error("Unknown template:", slide.template);
  return null;
};

export default SlideEditor;