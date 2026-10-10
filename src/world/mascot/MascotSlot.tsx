import { Html, useGLTF } from "@react-three/drei";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Vector3Tuple } from "three";
import { useWorldStore } from "@/state/world-store";
import { normalizeMascot } from "./mascot-layout";
import type { TowerId } from "@/domain/tower";
import { CharacterSpeechBubble } from "./CharacterSpeechBubble";
const dialogue:Record<TowerId,string[]>={companies:["Building something big? You're in the right tower.","I take rooftop networking very literally."],products:["Got a product worth showing off?","Your next launch deserves a skyline."],people:["Your personal brand called. It wants a better view.","The sky's a pretty good place to introduce yourself."]};

export function MascotSlot({ position,towerId,floorCount }: { position: Vector3Tuple;towerId:TowerId;floorCount:number }) {
  const { nodes } = useGLTF("/brand/ownthetop-mascot-approved.glb");
  const source = nodes.OTT_Mascot_Root;
  const root = useMemo(() => source ? normalizeMascot(source) : null, [source]);
  const [speech,setSpeech]=useState<{index:number;scope:string}|null>(null);
  const next = useRef(0),trigger=useRef<HTMLButtonElement>(null),returnFocus=useRef(false);
  const mode = useWorldStore(state => state.cameraMode);
  const selectedId=useWorldStore(state=>state.selectedListingId),selectedTower=useWorldStore(state=>state.selectedTowerId);
  const scope=`${mode}:${selectedId??""}:${selectedTower??""}`;
  const speak=()=>{returnFocus.current=document.activeElement===trigger.current;setSpeech({index:next.current++%dialogue[towerId].length,scope});};
  const dismiss=useCallback(()=>{const restore=returnFocus.current && (document.activeElement===trigger.current || document.activeElement===document.body);setSpeech(null);if(restore)window.requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}));},[]);
  if (!root) return null;
  return <group position={position} onClick={event => { event.stopPropagation(); speak(); }}>
    <primitive object={root} dispose={null} />
    {speech?.scope===scope?<CharacterSpeechBubble key={`${scope}:${speech.index}`} message={dialogue[towerId][speech.index]} onDismiss={dismiss} towerId={towerId} floorCount={floorCount}/>:null}
    {mode==="rooftop"&&(selectedTower??"companies")===towerId?<Html position={[0,.7,0]} center zIndexRange={[30,20]}><button ref={trigger} className="character-talk" style={{visibility:speech?.scope===scope?"hidden":"visible"}} aria-label={`Talk to ${towerId} mascot`} onPointerDown={event=>event.stopPropagation()} onPointerUp={event=>event.stopPropagation()} onClick={event=>{event.stopPropagation();speak();}}>Say hello</button></Html>:null}
  </group>;
}
