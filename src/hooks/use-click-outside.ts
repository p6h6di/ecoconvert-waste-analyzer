import { useEffect, RefObject } from "react";

const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if the ref is not current or the clicked element is inside the ref
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      // Call the handler if the click is outside the ref
      handler(event);
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup the event listeners when the component unmounts
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
