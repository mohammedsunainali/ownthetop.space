"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { companies } from "@/mock/companies";
import { RectangularAdvertisement } from "@/world/tower/RectangularAdvertisement";
import { RECTANGULAR_TOWER as b } from "@/world/tower/rectangular-layout";
import { useState } from "react";
const cases = {
  Representative: companies[0],
  "Very short name": {...companies[0],name:"AI"},
  "Two words": {...companies[0],name:"Northstar Foundry"},
  "Long name": {...companies[0],name:"Northstar Manufacturing Intelligence International"},
  "Unbroken token": {...companies[0],name:"N".repeat(60)},
  "60-character name": {...companies[0],name:"Northstar international architectural manufacturing partners!".slice(0,60)},
  "100-character subtitle": {...companies[0],description:"Intelligent manufacturing tools for ambitious global teams building resilient supply chains together.".slice(0,100)},
  "Large decimal amount": {...companies[0],totalPaidMinor:12345678999},
  "Wide logo": {...companies[0],logoUrl:"/brand/ownthetop-logo-primary.svg"},
  "Transparent logo": {...companies[0],logoUrl:"/brand/ownthetop-mascot-flat.svg"},
  "Missing logo": {...companies[0],logoUrl:null},
  "Invalid logo": {...companies[0],logoUrl:"data:image/png;base64,invalid"},
  "Non-hiring": {...companies[0],hiring:false},
};

export default function RectangularFloorValidation() {
 const [selected,setSelected]=useState<keyof typeof cases>("Representative");
 const listing=cases[selected];
 return <main style={{height:"100vh"}}><label style={{position:"absolute",zIndex:2,top:20,left:20,background:"white",padding:12,borderRadius:12}}>Synthetic facade case <select aria-label="Synthetic facade case" value={selected} onChange={event=>setSelected(event.target.value as keyof typeof cases)}>{Object.keys(cases).map(name=><option key={name}>{name}</option>)}</select></label><Canvas camera={{position:[1.2,0.7,8.8],fov:42}}>
  <color attach="background" args={["#87c6e5"]}/><ambientLight intensity={1.5}/><directionalLight position={[4,6,8]} intensity={2}/>
  <mesh><boxGeometry args={[b.width,b.floorHeight,b.depth]}/><meshStandardMaterial color="#163f6a" metalness={0.35} roughness={0.25}/></mesh>
  {[-1,1].map(side=><mesh key={side} position={[0,side*0.675,0]}><boxGeometry args={[7,0.15,4.55]}/><meshStandardMaterial color="#d9e6ec"/></mesh>)}
  <group position={[0,0,b.facadeZ]}><RectangularAdvertisement listing={listing}/></group>
  <group position={[0,0,-b.facadeZ]} rotation={[0,Math.PI,0]}><RectangularAdvertisement listing={listing}/></group>
  <OrbitControls minDistance={6} maxDistance={15}/>
 </Canvas></main>;
}
