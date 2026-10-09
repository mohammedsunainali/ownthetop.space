import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useInspectionFocus } from "./use-inspection-focus";
function Panel({ active }: { active: boolean }) { const heading = useInspectionFocus(active); return active ? <h2 ref={heading} tabIndex={-1}>Inspection</h2> : null; }
describe("inspection panel focus", () => {
  it("announces the panel and restores its connected trigger", () => {
    const trigger = document.createElement("button"); document.body.append(trigger); trigger.focus();
    const view = render(<Panel active={false} />);
    expect(document.activeElement).toBe(trigger);
    view.rerender(<Panel active />); expect(document.activeElement?.textContent).toBe("Inspection");
    view.rerender(<Panel active={false} />); expect(document.activeElement).toBe(trigger);
    view.unmount(); trigger.remove();
  });
});
