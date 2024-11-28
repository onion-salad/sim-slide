import { useRef, useEffect } from "react";

export const useAutoScrollInput = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleBlur = () => {
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
    if (!element) return;

    const handleBlur = () => {
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