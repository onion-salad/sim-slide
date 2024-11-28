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
      console.log("Current scroll position:", window.scrollY);
      if (window.scrollY > 0) {
        setTimeout(() => {
          console.log("Attempting to scroll to top");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          console.log("Scroll command executed");
        }, 100);
      } else {
        console.log("Skip scrolling - already at top");
      }
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
      console.log("Current scroll position:", window.scrollY);
      if (window.scrollY > 0) {
        setTimeout(() => {
          console.log("Attempting to scroll to top");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          console.log("Scroll command executed");
        }, 100);
      } else {
        console.log("Skip scrolling - already at top");
      }
    };

    element.addEventListener("blur", handleBlur);
    console.log("Textarea blur event listener added");
    return () => {
      element.removeEventListener("blur", handleBlur);
      console.log("Textarea blur event listener removed");
    };
  }, []);

  return ref;
};