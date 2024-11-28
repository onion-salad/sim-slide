import { Presentation } from "@/lib/presentation";

const STORAGE_KEY = "presentation_data";

export const savePresentation = (presentation: Presentation): void => {
  try {
    const serializedData = JSON.stringify(presentation);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Failed to save presentation:", error);
  }
};

export const loadPresentation = (): Presentation | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) return null;
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Failed to load presentation:", error);
    return null;
  }
};