import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import type { TowerId } from "@/domain/tower";
import { useWorldStore } from "@/state/world-store";
import { getTowerHeight, towerLocalToWorld } from "@/world/tower/tower-layout";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { placeSpeech, type SpeechRect } from "./speech-layout";
export function CharacterSpeechBubble({message,onDismiss,towerId,floorCount}:{message:string;onDismiss:()=>void;towerId:TowerId;floorCount:number}) {
  const reducedMotion = useReducedMotion();
  const anchor=useRef<Group>(null),node=useRef<HTMLDivElement>(null),point=useRef(new Vector3());
  const correction=useRef({x:0,y:0}),elapsed=useRef(0),[closing,setClosing]=useState(false);
  const dismiss=useCallback(()=>setClosing(true),[]);
  useEffect(()=>{const timer=window.setTimeout(()=>{dismiss();},5500);return()=>window.clearTimeout(timer);},[dismiss]);
  useEffect(()=>{if(!closing)return;const timer=window.setTimeout(onDismiss,reducedMotion?0:160);return()=>window.clearTimeout(timer);},[closing,onDismiss,reducedMotion]);
  useFrame(({gl,camera},delta)=>{
    elapsed.current+=delta;if(elapsed.current<.08||!node.current||!anchor.current)return;elapsed.current=0;
    anchor.current.getWorldPosition(point.current);point.current.project(camera);
    const visible=point.current.z>=-1&&point.current.z<=1&&Math.abs(point.current.x)<1&&Math.abs(point.current.y)<1;
    const view=gl.domElement.getBoundingClientRect(),box=node.current.getBoundingClientRect();
    const rect={left:box.left-correction.current.x,right:box.right-correction.current.x,top:box.top-correction.current.y,bottom:box.bottom-correction.current.y};
    const obstacles:SpeechRect[]=[];
    for(const selector of [".claim-panel",".profile-drawer",".world-controls"]){const element=document.querySelector(selector);if(element instanceof HTMLElement&&element.offsetWidth&&getComputedStyle(element).visibility==="visible")obstacles.push(element.getBoundingClientRect());}
    const state=useWorldStore.getState();
    if(state.cameraMode==="selectedFloor"&&state.selectedTowerId===towerId){
      const roof=getTowerHeight(floorCount,state.floorsExploded);
      const points=[-3.5,3.5].flatMap(x=>[.8,roof-.2].flatMap(y=>[-2.3,2.3].map(z=>new Vector3(...towerLocalToWorld(towerId,[x,y,z])).project(camera))));
      obstacles.push({left:view.left+(Math.min(...points.map(p=>p.x))+1)*view.width/2,right:view.left+(Math.max(...points.map(p=>p.x))+1)*view.width/2,top:view.top+(1-Math.max(...points.map(p=>p.y)))*view.height/2,bottom:view.top+(1-Math.min(...points.map(p=>p.y)))*view.height/2});
    }
    const result=placeSpeech(rect,{left:view.left+12,right:view.right-12,top:view.top+75,bottom:view.bottom-12},obstacles);
    correction.current=result;node.current.style.transform=`translate(${result.x}px,${result.y}px)`;
    node.current.style.visibility=visible&&result.visible?"visible":"hidden";
  });
  return <group ref={anchor} position={[0,.85,0]}><Html center zIndexRange={[30,20]}><div ref={node} className={`character-speech${closing?" character-speech--closing":""}`} onPointerDown={event=>event.stopPropagation()} onPointerUp={event=>event.stopPropagation()} onClick={event=>event.stopPropagation()} onWheel={event=>event.stopPropagation()} onKeyDown={event=>{event.stopPropagation();if(event.key==="Escape")dismiss();}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))dismiss();}}><span role="status" aria-live="polite" aria-atomic="true">{message}</span></div></Html></group>;
}
