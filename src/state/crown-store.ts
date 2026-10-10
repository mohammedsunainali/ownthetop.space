import { create } from "zustand";
import { crownPreviewName } from "@/domain/crown";
/** Ephemeral visual preview only; cannot mutate ranked floors or book inventory. */
export const useCrownStore = create<{ previewName: string; preview: (name:string)=>void; clear:()=>void }>(set=>({
  previewName:"", preview:name=>set({previewName:crownPreviewName(name)}), clear:()=>set({previewName:""}),
}));
