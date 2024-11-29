import { useRef, useEffect } from "react";

export const useAutoScrollInput = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleBlur = (e: FocusEvent) => {
      // 次のフォーカス先が入力要素やアコーディオンの場合はスクロールしない
      const nextTarget = e.relatedTarget as HTMLElement;
      if (nextTarget && (
        nextTarget.tagName === 'INPUT' || 
        nextTarget.tagName === 'TEXTAREA' ||
        nextTarget.getAttribute('data-state') === 'closed' // アコーディオンの閉じた状態
      )) {
        return;
      }

      if (window.scrollY > 0) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
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
      return;
    }

    const handleBlur = (e: FocusEvent) => {
      // 次のフォーカス先が入力要素やアコーディオンの場合はスクロールしない
      const nextTarget = e.relatedTarget as HTMLElement;
      if (nextTarget && (
        nextTarget.tagName === 'INPUT' || 
        nextTarget.tagName === 'TEXTAREA' ||
        nextTarget.getAttribute('data-state') === 'closed' // アコーディオンの閉じた状態
      )) {
        return;
      }

      if (window.scrollY > 0) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 100);
      }
    };

    element.addEventListener("blur", handleBlur);
    return () => element.removeEventListener("blur", handleBlur);
  }, []);

  return ref;
};