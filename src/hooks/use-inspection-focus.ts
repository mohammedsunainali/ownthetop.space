import { useEffect, useRef } from "react";
/** Non-modal information panels announce their heading and return focus on dismissal. */
export function useInspectionFocus(active: boolean) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement;
    heading.current?.focus({ preventScroll: true });
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true }); };
  }, [active]);
  return heading;
}
