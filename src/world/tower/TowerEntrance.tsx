import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, InstancedMesh, Matrix4, MeshStandardMaterial } from "three";
import type { TowerId } from "@/domain/tower";
import { tokens } from "@/design/tokens";
import { towerVisuals } from "./tower-layout";
import { worldMaterials } from "@/world/materials/world-materials";
const glass = new MeshStandardMaterial({ color: "#9AAECC", metalness: 0.4, roughness: 0.2 });
const geometry = new BoxGeometry(1, 1, 1);
const accents = Object.fromEntries(["blue", "lavender", "teal"].map(key => [key, new MeshStandardMaterial({ color: tokens.color.brand[key as "blue" | "lavender" | "teal"], roughness: 0.32, metalness: 0.45 })]));
export const entranceBounds = { maxY: 0.71, halfWidth: 0.82, faceZ: 2.413 };
/** Lobby detailing is entirely below the first advertisement's content rectangle. */
export function TowerEntrance({ towerId, onSelect }: { towerId: TowerId; onSelect: () => void }) {
  const doors=useRef<InstancedMesh>(null),frames=useRef<InstancedMesh>(null),lintels=useRef<InstancedMesh>(null),handles=useRef<InstancedMesh>(null);
  useLayoutEffect(()=>{
    const matrix=new Matrix4();
    for(let face=0;face<2;face++){
      const side=face?-1:1;
      matrix.makeScale(1.45,.54,.012).setPosition(0,.36,entranceBounds.faceZ*side);doors.current?.setMatrixAt(face,matrix);
      for(let frame=0;frame<3;frame++){matrix.makeScale(.025,.56,.012).setPosition((frame-1)*.73*side,.36,(entranceBounds.faceZ+.012)*side);frames.current?.setMatrixAt(face*3+frame,matrix);}
      matrix.makeScale(1.64,.04,.025).setPosition(0,.69,entranceBounds.faceZ*side);lintels.current?.setMatrixAt(face,matrix);
      matrix.makeScale(.014,.14,.015).setPosition(.06*side,.36,(entranceBounds.faceZ+.018)*side);handles.current?.setMatrixAt(face,matrix);
    }
    for(const mesh of [doors.current,frames.current,lintels.current,handles.current])if(mesh){mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();}
  },[]);
  return <group onClick={event => { event.stopPropagation(); onSelect(); }}>
    <instancedMesh ref={doors} args={[geometry,glass,2]} />
    <instancedMesh ref={frames} args={[geometry,worldMaterials.frame,6]} />
    <instancedMesh ref={lintels} args={[geometry,accents[towerVisuals[towerId].accent],2]} />
    <instancedMesh ref={handles} args={[geometry,worldMaterials.summit,2]} />
  </group>;
}
