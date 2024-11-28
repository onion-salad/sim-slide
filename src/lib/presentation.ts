export interface Slide {
  id: string;
  template: string;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    steps?: {
      subtitle: string;
      text: string;
    }[];
    image?: string;
    imagePosition?: {
      x: number;
      y: number;
    };
  };
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
}

export const templates = [
  {
    id: "title",
    name: "タイトルスライド",
    preview: "/placeholder.svg",
  },
  {
    id: "content",
    name: "コンテンツスライド",
    preview: "/placeholder.svg",
  },
  {
    id: "steps",
    name: "ステップスライド",
    preview: "/placeholder.svg",
  },
  {
    id: "thumbnail",
    name: "サムネイル",
    preview: "/placeholder.svg",
  },
];

export const createEmptyPresentation = (): Presentation => ({
  id: crypto.randomUUID(),
  title: "Untitled Presentation",
  slides: [],
});

export const createSlide = (template: string): Slide => ({
  id: crypto.randomUUID(),
  template,
  content: {
    imagePosition: { x: 50, y: 50 },
    steps: template === "steps" ? [
      { subtitle: "ステップ 1", text: "" },
      { subtitle: "ステップ 2", text: "" },
      { subtitle: "ステップ 3", text: "" },
    ] : undefined
  },
});
