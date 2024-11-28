import { useRef, useEffect } from "react";

export const useAutoScrollInput = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      console.log("Input element not found");
      return;
    }

    const handleBlur = () => {
      console.log("Input blur event triggered");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    element.addEventListener("blur", handleBlur);
    return () => element.removeEventListener("blur", handleBlur);
  }, []);

  return ref;
};

export const useAutoScrollTextarea = () => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      console.log("Textarea element not found");
      return;
    }

    const handleBlur = () => {
      console.log("Textarea blur event triggered");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    element.addEventListener("blur", handleBlur);
    return () => element.removeEventListener("blur", handleBlur);
  }, []);

  return ref;
};