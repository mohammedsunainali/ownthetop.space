import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { BoxGeometry, CanvasTexture, ExtrudeGeometry, Group, MeshStandardMaterial, Shape } from "three";
import type { FloorMediaContent } from "@/world/tower/floor-signs";
import { getHiringSignMaterial } from "@/world/tower/floor-signs";
import { activateRectangularTexture, createRectangularTexture } from "@/world/tower/rectangular-signs";
import { RECTANGULAR_AD as grid, RECTANGULAR_TOWER as building } from "@/world/tower/rectangular-layout";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { tokens } from "@/design/tokens";

const slate = new BoxGeometry(1, 1, 0.045);
const shape = new Shape(); const r = 0.08, s = 0.8;
shape.moveTo(-s/2+r,-s/2);shape.lineTo(s/2-r,-s/2);shape.quadraticCurveTo(s/2,-s/2,s/2,-s/2+r);shape.lineTo(s/2,s/2-r);shape.quadraticCurveTo(s/2,s/2,s/2-r,s/2);shape.lineTo(-s/2+r,s/2);shape.quadraticCurveTo(-s/2,s/2,-s/2,s/2-r);shape.lineTo(-s/2,-s/2+r);shape.quadraticCurveTo(-s/2,-s/2,-s/2+r,-s/2);
const plaque = new ExtrudeGeometry(shape,{depth:0.035,bevelEnabled:false,curveSegments:5});
const plaqueMaterial = new MeshStandardMaterial({color:tokens.color.brand.softWhite,roughness:0.45});

function HiringSlate() {
  const pivot = useRef<Group>(null); const reduced = useReducedMotion();
  const material = useMemo(() => getHiringSignMaterial(), []);
  const sign = grid.hiring; const length = sign.mountY - sign.y;
  useFrame(({clock}) => { if(pivot.current) pivot.current.rotation.z = reduced ? 0 : Math.sin(clock.elapsedTime*0.75)*0.012; });
  return <group position={[sign.x,sign.mountY,sign.z]}>
    <mesh material={worldMaterials.frame} position={[0,0,-0.06]}><boxGeometry args={[sign.width*0.9,0.045,0.20]}/></mesh>
    <group ref={pivot}>
      {[-1,1].map(side=><mesh key={side} material={worldMaterials.podium} position={[side*sign.width*0.36,-(length-sign.height/2)/2,0]}><cylinderGeometry args={[0.008,0.008,length-sign.height/2,5]}/></mesh>)}
      <mesh geometry={slate} material={material} position={[0,-length,0]} scale={[sign.width,sign.height,1]} castShadow />
      {[0,Math.PI].map(angle=><mesh key={angle} rotation={[0,angle,0]} position={[0,-length,angle===0?0.023:-0.023]}><planeGeometry args={[sign.width,sign.height]}/><meshBasicMaterial map={material.map} toneMapped={false}/></mesh>)}
    </group>
  </group>;
}

function AdvertisementSurface({listing,media,logo,onSelect}:{listing:FloorMediaContent;media:CanvasTexture;logo:CanvasTexture;onSelect?:()=>void}) {
  const click=(event:ThreeEvent<MouseEvent>)=>{if(onSelect){event.stopPropagation();onSelect();}};
  return <group onClick={click}>
    <mesh><planeGeometry args={[building.clearWidth,building.clearHeight]}/><meshBasicMaterial map={media} transparent depthWrite={false} toneMapped={false}/></mesh>
    <group position={[-2.65,0,0.045]}>
      <mesh geometry={plaque} material={plaqueMaterial} castShadow />
      <mesh position={[0,0,0.036]}><planeGeometry args={[0.8,0.8]}/><meshBasicMaterial map={logo} transparent depthWrite={false} toneMapped={false}/></mesh>
    </group>
    {listing.hiring?<HiringSlate/>:null}
  </group>;
}

export function RectangularAdvertisement({listing,onSelect}:{listing:FloorMediaContent;onSelect?:()=>void}) {
  const media=useMemo(()=>createRectangularTexture(listing),[listing]);
  const logo=useMemo(()=>createRectangularTexture(listing,true),[listing]);
  useEffect(()=>{activateRectangularTexture(media);activateRectangularTexture(logo);return ()=>{media.dispose();logo.dispose();};},[media,logo]);
  return <AdvertisementSurface listing={listing} media={media} logo={logo} onSelect={onSelect}/>;
}

/** Front and rear share one owned texture set, halving distant GPU allocation. */
export function RectangularAdvertisementPair({listing,detailed}:{listing:FloorMediaContent;detailed:boolean}) {
  const media=useMemo(()=>createRectangularTexture(listing,false,!detailed),[listing,detailed]);
  const logo=useMemo(()=>detailed?createRectangularTexture(listing,true):null,[listing,detailed]);
  useEffect(()=>{activateRectangularTexture(media);if(logo)activateRectangularTexture(logo);return ()=>{media.dispose();logo?.dispose();};},[media,logo]);
  return <>{[0,Math.PI].map(angle=><group key={angle} rotation={[0,angle,0]} position={[0,0,angle===0?building.facadeZ:-building.facadeZ]}>{logo?<AdvertisementSurface listing={listing} media={media} logo={logo}/>:<mesh><planeGeometry args={[building.clearWidth,building.clearHeight]}/><meshBasicMaterial map={media} transparent depthWrite={false} toneMapped={false}/></mesh>}</group>)}</>;
}

/** Bounded 512×96 distant media; high-resolution artwork mounts only near focus. */
export function DistantAdvertisement({listing}:{listing:FloorMediaContent}) {
  const media=useMemo(()=>createRectangularTexture(listing,false,true),[listing]);
  useEffect(()=>{activateRectangularTexture(media);return ()=>media.dispose();},[media]);
  return <mesh><planeGeometry args={[building.clearWidth,building.clearHeight]}/><meshBasicMaterial map={media} transparent depthWrite={false} toneMapped={false}/></mesh>;
}
