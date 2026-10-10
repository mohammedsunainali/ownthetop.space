import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, InstancedMesh, Matrix4 } from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { districtLayout } from "./district-layout";
import { trafficLight } from "./traffic-flow";
const colors = { green: new Color("#30dba8"), amber: new Color("#FFB844"), red: new Color("#f15a61") };
/** These signals govern the actual inner ring, not the decorative outer junctions. */
export function TrafficCrossings() {
  const lamps = useRef<InstancedMesh>(null), matrix = useRef(new Matrix4());
  const reduced = useReducedMotion();
  useFrame(({ clock }) => {
    for (let i = 0; i < 2; i++) {
      const x = (i === 0 ? 1 : -1) * (districtLayout.road.x + 1.2);
      matrix.current.makeTranslation(x, 0.97, 1.5);
      lamps.current?.setMatrixAt(i, matrix.current);
      lamps.current?.setColorAt(i, colors[trafficLight(reduced ? 0 : clock.elapsedTime, i)]);
    }
    if (lamps.current) {
      lamps.current.instanceMatrix.needsUpdate = true;
      if (lamps.current.instanceColor) lamps.current.instanceColor.needsUpdate = true;
    }
  });
  return <group>
    {[-1, 1].map(side => <group key={side} position={[side * districtLayout.road.x, 0, 0]}>
      {[-0.6, -0.3, 0, 0.3, 0.6].map(z => <mesh key={z} material={worldMaterials.facade} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, z]}><planeGeometry args={[1.5, 0.15]} /></mesh>)}
      {[-1.95, 1.95].map(z => <mesh key={z} material={worldMaterials.facade} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, z]}><planeGeometry args={[1.5, 0.09]} /></mesh>)}
      <mesh material={worldMaterials.frame} position={[side * 1.2, 0.48, 1.5]}><cylinderGeometry args={[0.03, 0.04, 0.96, 6]} /></mesh>
      <mesh material={worldMaterials.frame} position={[side * 1.2, 0.96, 1.5]}><boxGeometry args={[0.18, 0.28, 0.12]} /></mesh>
    </group>)}
    <instancedMesh ref={lamps} args={[undefined, undefined, 2]} frustumCulled={false}><sphereGeometry args={[0.055, 8, 6]} /><meshBasicMaterial toneMapped={false} /></instancedMesh>
  </group>;
}
