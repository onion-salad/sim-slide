export interface Slide {
  id: string;
  template: string;
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
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
    name: "Title Slide",
    preview: "/placeholder.svg",
  },
  {
    id: "content",
    name: "Content Slide",
    preview: "/placeholder.svg",
  },
  {
    id: "image",
    name: "Image Slide",
    preview: "/placeholder.svg",
  },
  {
    id: "split",
    name: "Split Content",
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
    imagePosition: { x: 50, y: 50 }
  },
});