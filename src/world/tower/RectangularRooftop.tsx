import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, Group, MeshStandardMaterial, PointLight, SRGBColorSpace } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials as materials } from "@/world/materials/world-materials";
import { HELIPAD_LOCAL_ANCHOR } from "@/world/tower/tower-layout";
import { RooftopPool } from "./RooftopPool";
import { MascotSlot } from "@/world/mascot/MascotSlot";
import { crownCopy, crownStatus } from "@/domain/crown";
import { useCrownStore } from "@/state/crown-store";
import { useWorldStore } from "@/state/world-store";
import type { TowerId } from "@/domain/tower";
import { showroomResidentPose } from "./rooftop-life";
const villaGlass = new MeshStandardMaterial({color:"#b9e4ef",transparent:true,opacity:0.14,depthWrite:false,metalness:0.05,roughness:0.14});
const showroomFloor = new MeshStandardMaterial({color:"#EEE4D6",roughness:0.65});
const showroomSeat = new MeshStandardMaterial({color:"#7764C9",roughness:0.8});

function ShowroomResident() {
  const ref=useRef<Group>(null), limbs=useRef<(Group|null)[]>([]), reduced=useReducedMotion();
  useFrame(({clock},delta)=>{if(ref.current){const pose=showroomResidentPose(reduced?7:clock.elapsedTime);ref.current.position.set(pose.x,pose.y,pose.z);const angle=Math.atan2(Math.sin(pose.rotation-ref.current.rotation.y),Math.cos(pose.rotation-ref.current.rotation.y));ref.current.rotation.y+=angle*Math.min(1,delta*6);limbs.current.forEach((limb,index)=>{if(limb)limb.rotation.x=pose.stride*(index%2?-1:1)*(index<2?1:-1);});}});
  return <group ref={ref} position={[-1.1,.31,-.32]}><mesh position={[0,.24,0]}><boxGeometry args={[.14,.27,.11]}/><meshStandardMaterial color="#FFB844"/></mesh><mesh position={[0,.44,0]}><sphereGeometry args={[.075,8,6]}/><meshStandardMaterial color="#bd8e69"/></mesh>{[-1,1].map((side,index)=><group key={side} ref={value=>{limbs.current[index]=value;}} position={[side*.04,.15,0]}><mesh position={[0,-.075,0]} material={materials.frame}><boxGeometry args={[.04,.15,.055]}/></mesh></group>)}{[-1,1].map((side,index)=><group key={side} ref={value=>{limbs.current[index+2]=value;}} position={[side*.1,.34,0]}><mesh position={[0,-.075,0]} material={showroomSeat}><boxGeometry args={[.035,.15,.04]}/></mesh></group>)}</group>;
}

function Walker({index}:{index:number}) {
  const ref=useRef<Group>(null); const reduced=useReducedMotion();
  useFrame(({clock})=>{if(ref.current && !reduced)ref.current.position.x=-2.4+Math.sin(clock.elapsedTime*0.18+index*2)*0.7;});
  return <group ref={ref} position={[-2.4,0.22,1.1+index*0.6]}>
    <mesh position={[0,0.24,0]}><boxGeometry args={[0.13,0.28,0.10]}/><meshStandardMaterial color={index?"#b7a3ff":"#ffc85f"}/></mesh>
    <mesh position={[0,0.44,0]}><boxGeometry args={[0.12,0.12,0.12]}/><meshStandardMaterial color="#bd8e69"/></mesh>
    {[-1,1].map(side=><mesh key={side} position={[side*0.035,0.07,0]} material={materials.frame}><boxGeometry args={[0.035,0.18,0.05]}/></mesh>)}
  </group>;
}

export function RectangularRooftop({y,premium,towerId,floorCount}:{y:number;premium:boolean;towerId:TowerId;floorCount:number}) {
  const flag=useRef<Group>(null); const reduced=useReducedMotion();
  const interiorLight = useRef<PointLight>(null);
  const previewName=useCrownStore(state=>state.previewName);
  const inspectCrown=()=>{const state=useWorldStore.getState();state.selectTower("companies");state.focusRooftop();};
  const billboard=useMemo(()=>{
    const canvas=document.createElement("canvas");canvas.width=2048;canvas.height=384;
    const context=canvas.getContext("2d");
    const paint=()=>{if(!context)return;context.fillStyle="#f0f7ff";context.fillRect(0,0,2048,384);context.fillStyle="#091b3b";context.textAlign="center";context.textBaseline="middle";if(premium){const copy=crownCopy(crownStatus,previewName);context.font="800 48px Montserrat, sans-serif";context.fillText("OWNTHETOP · CROWN SHOWROOM",1024,48,1900);context.font="800 108px Montserrat, sans-serif";context.fillText(copy.title,1024,148,1900);context.font="500 48px Montserrat, sans-serif";context.fillText(copy.subtitle,1024,246,1900);context.font="700 42px Montserrat, sans-serif";context.fillText(`${copy.label} · Explore the Crown`,1024,326,1900);}else{context.font="800 164px Montserrat, sans-serif";context.fillText("OwnTheTop.space",1024,150,1900);context.font="500 64px Montserrat, sans-serif";context.fillText("Claim your space. Own the top.",1024,292,1900);}};
    paint();const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
    let disposed=false;texture.addEventListener("dispose",()=>{disposed=true;});
    void document.fonts.load("800 164px Montserrat").then(()=>{if(!disposed){paint();texture.needsUpdate=true;}});
    return texture;
  },[premium,previewName]);
  useEffect(()=>()=>billboard.dispose(),[billboard]);
  useFrame(({clock})=>{if(flag.current)flag.current.rotation.y=reduced?0:Math.sin(clock.elapsedTime*1.2)*0.04;if(interiorLight.current)interiorLight.current.intensity=Math.max(0,materials.windowLight.emissiveIntensity-0.03)*14;});
  return <group position={[0,y,0]}>
    <mesh material={materials.podium} position={[0,0.10,0]} castShadow receiveShadow><boxGeometry args={[7.8,0.2,6.6]}/></mesh>
    <mesh material={materials.windowLight} position={[0,0.19,3.29]}><boxGeometry args={[7.6,0.035,0.025]}/></mesh>
    {/* Compact villa at the rear-left; terrace and pad occupy independent zones. */}
    <mesh position={[-1.4,1.1,-2.65]} material={villaGlass}><boxGeometry args={[3.5,1.8,0.025]}/></mesh>
    {[-3.15,0.35].map(x=><mesh key={x} position={[x,1.1,-1.35]} material={villaGlass}><boxGeometry args={[0.025,1.8,2.6]}/></mesh>)}
    <mesh position={[-1.4,1.1,-0.015]} material={villaGlass}><boxGeometry args={[3.4,1.72,0.025]}/></mesh>
    {[-.56,-.49].map(x=><mesh key={x} position={[x,1.05,.025]} material={materials.frame}><boxGeometry args={[.018,.24,.025]}/></mesh>)}
    <mesh position={[-1.4,0.26,-1.35]} material={showroomFloor}><boxGeometry args={[3.4,0.10,2.5]}/></mesh>
    <mesh position={[-1.4,1.945,-1.35]} material={materials.windowLight}><boxGeometry args={[2.8,0.035,1.9]}/></mesh>
    <pointLight ref={interiorLight} position={[-1.4,1.6,-1.3]} color="#ffcf89" intensity={0} distance={4} decay={2} />
    <mesh position={[-1.9,0.53,-1.6]} material={showroomSeat}><boxGeometry args={[1.35,0.42,0.52]}/></mesh>
    <mesh position={[-1.9,0.77,-1.82]} material={showroomSeat}><boxGeometry args={[1.35,0.28,0.12]}/></mesh>
    <mesh position={[-1.7,0.47,-0.76]} material={materials.frame}><boxGeometry args={[0.75,0.09,0.4]}/></mesh>
    {[-1.95,-1.45].map(x=><mesh key={x} position={[x,0.37,-0.76]} material={materials.frame}><boxGeometry args={[0.045,0.11,0.25]}/></mesh>)}
    <mesh position={[-0.27,1.0,0.015]} material={materials.frame}><boxGeometry args={[0.08,0.10,0.06]}/></mesh>
    {/* Thin corner posts keep all four glazed elevations open; footprint unchanged. */}
    {[-3.15,.35].flatMap(x=>[-2.65,0].map(z=><mesh key={`${x}:${z}`} position={[x,1.1,z]} material={materials.frame}><boxGeometry args={[.045,1.8,.045]}/></mesh>))}
    <mesh position={[-.45,.56,-2.05]} material={showroomFloor}><cylinderGeometry args={[.3,.3,.07,16]}/></mesh>
    <mesh position={[-.45,.43,-2.05]} material={materials.frame}><cylinderGeometry args={[.035,.055,.22,8]}/></mesh>
    {[-.9,0].map(x=><group key={x} position={[x,.43,-2.05]}><mesh material={showroomSeat}><boxGeometry args={[.25,.1,.3]}/></mesh><mesh position={[0,.13,-.12]} material={showroomSeat}><boxGeometry args={[.25,.25,.045]}/></mesh><mesh position={[0,-.08,0]} material={materials.frame}><boxGeometry args={[.1,.16,.14]}/></mesh></group>)}
    <group position={[-.9,.48,-2.05]}><mesh position={[0,.12,0]}><boxGeometry args={[.13,.22,.1]}/><meshStandardMaterial color="#1DA99A"/></mesh><mesh position={[0,.3,0]}><sphereGeometry args={[.07,8,6]}/><meshStandardMaterial color="#bd8e69"/></mesh>{[-1,1].map(side=><group key={side}><mesh position={[side*.035,-.015,.07]} material={materials.frame}><boxGeometry args={[.04,.05,.16]}/></mesh><mesh position={[side*.035,-.09,.135]} material={materials.frame}><boxGeometry args={[.04,.17,.045]}/></mesh></group>)}</group>
    <ShowroomResident />
    <mesh material={materials.podium} position={[-1.4,2.05,-1.35]} castShadow><boxGeometry args={[3.9,0.18,3]}/></mesh>
    {[-3.1,-2.2,-1.3,-0.4,0.3].map(x=><mesh key={x} material={materials.facade} position={[x,1.1,-0.02]}><boxGeometry args={[0.06,1.8,0.10]}/></mesh>)}
    {[-3.45,3.45].map(x=><mesh key={x} material={materials.facade} position={[x,-0.35,-2.4]} rotation={[0,0,x<0?-0.3:0.3]}><boxGeometry args={[0.12,1.1,0.12]}/></mesh>)}
    {premium?<>
      <mesh material={materials.facade} position={[1.4,0.24,1.8]}><boxGeometry args={[2.5,0.12,1.7]}/></mesh>
      <RooftopPool />
      <Walker index={0}/><Walker index={1}/>
      {[-0.7,0].map(x=><group key={x} position={[x,0.3,1.2]} rotation={[0,-0.15,0]}><mesh material={materials.podium}><boxGeometry args={[0.45,0.12,1]}/></mesh><mesh material={materials.facade} position={[0,0.15,-0.35]} rotation={[-0.45,0,0]}><boxGeometry args={[0.45,0.08,0.45]}/></mesh></group>)}
      <group position={[HELIPAD_LOCAL_ANCHOR[0],HELIPAD_LOCAL_ANCHOR[1]-0.24,HELIPAD_LOCAL_ANCHOR[2]]}>
        <mesh material={materials.frame}><cylinderGeometry args={[1.25,1.25,0.08,24]}/></mesh>
        <mesh material={materials.summit} position={[0,0.045,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.03,1.08,24]}/></mesh>
        {[-1,1].map(side=><mesh key={side} material={materials.facade} position={[side*0.25,0.05,0]}><boxGeometry args={[0.09,0.015,0.75]}/></mesh>)}
        <mesh material={materials.facade} position={[0,0.05,0]}><boxGeometry args={[0.5,0.015,0.09]}/></mesh>
      </group>
    </>:null}
    <MascotSlot position={[-1.4,0.20,2.6]} towerId={towerId} floorCount={floorCount}/>
    {[-3.35,-2.3,2.8,3.35].map((x,index)=><group key={x} position={[x,0.33,index<2?2.7:2.9]}><mesh material={materials.podium}><boxGeometry args={[0.45,0.25,0.45]}/></mesh><mesh material={materials.leaf} position={[0,0.3,0]}><icosahedronGeometry args={[0.3,0]}/></mesh></group>)}
    {[-1,1].map(side=><mesh key={side} material={materials.frame} position={[side*3.78,0.55,0]}><boxGeometry args={[0.045,0.055,6.35]}/></mesh>)}
    <mesh material={materials.frame} position={[0,0.55,3.18]}><boxGeometry args={[7.5,0.055,0.045]}/></mesh>
    {[-3.7,-2.5,-1.25,0,1.25,2.5,3.7].map(x=><mesh key={x} material={materials.frame} position={[x,0.37,3.18]}><boxGeometry args={[0.035,0.36,0.035]}/></mesh>)}
    {[-2.6,0.2].map(x=><mesh key={x} material={materials.frame} position={[x,2.58,-1.3]}><boxGeometry args={[0.10,1.1,0.10]}/></mesh>)}
    <mesh material={materials.frame} position={[-0.9,3.22,-1.3]}><boxGeometry args={[5.9,1.04,0.12]}/></mesh>
    {[0,Math.PI].map(angle=><mesh key={angle} position={[-0.9,3.22,-1.3+(angle===0?0.065:-0.065)]} rotation={[0,angle,0]} onClick={premium?event=>{event.stopPropagation();inspectCrown();}:undefined}><planeGeometry args={[5.7,0.97]}/><meshBasicMaterial map={billboard} toneMapped={false}/></mesh>)}
    <mesh material={materials.frame} position={[-3.25,2.45,-2.4]}><cylinderGeometry args={[0.018,0.018,0.9,6]}/></mesh>
    <group ref={flag} position={[-2.85,2.72,-2.4]}>{[0,Math.PI].map(angle=><mesh key={angle} rotation={[0,angle,0]} position={[0,0,angle===0?0.004:-0.004]}><planeGeometry args={[0.8,0.15]}/><meshBasicMaterial map={billboard} toneMapped={false}/></mesh>)}</group>
  </group>;
}
