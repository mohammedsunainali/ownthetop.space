"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorldStore } from "@/state/world-store";
import { saveCheckoutDraft } from "@/components/checkout/draft-transfer";

export function FloorPreviewBanner() {
  const preview = useWorldStore(state=>state.floorPreview);
  const clearPreview = useWorldStore(state=>state.clearFloorPreview);
  const router = useRouter();
  const [error,setError] = useState<string|null>(null);
  if (!preview) return null;
  return <aside className="floor-preview-status" aria-label="Floor preview status">
    <strong>PREVIEW MODE</strong>
    <p>Happy with your floor? Continue to checkout to complete your claim.</p>
    <small>Preview only. No payment has been made and your floor is not reserved.</small>
    <div className="floor-preview-actions"><button className="preview-checkout" type="button" onClick={()=>{
      if (!preview.checkoutDraft) { setError("This preview has no checkout draft. Create your floor again to continue."); return; }
      const issue = saveCheckoutDraft(preview.checkoutDraft);
      if (issue) setError(issue); else router.push("/checkout");
    }}>Continue to checkout →</button><button type="button" onClick={clearPreview}>Close preview</button></div>
    {error && <p role="alert">{error}</p>}
  </aside>;
}
