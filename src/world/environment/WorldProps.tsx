import { useLayoutEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { BoxGeometry, Color, InstancedMesh, Matrix4 } from "three";
import { tokens } from "@/design/tokens";
import { worldMaterials } from "@/world/materials/world-materials";

const treeGeometry = new BoxGeometry(0.46, 1.1, 0.46);
const treeMaterial = worldMaterials.leaf;
const cloudGeometry = new BoxGeometry(2.2, 0.42, 0.9);
const cloudMaterial = worldMaterials.cloud;
const treePlaces = Array.from({ length: 28 }, (_, i) => ({ x: Math.cos(i * 2.1) * (9.5 + i % 3), z: Math.sin(i * 2.1) * (9.5 + i % 3) }));
const cloudPlaces = Array.from({ length: 8 }, (_, i) => ({ x: -18 + i * 5.2, y: 11 + i % 3 * 1.7, z: -13 - i % 2 * 5 }));

export function WorldProps({ mobile, night }: { mobile: boolean; night: boolean }) {
  const logoTexture = useTexture("/brand/ownthetop-logo-primary.svg");
  const trees = useRef<InstancedMesh>(null);
  const clouds = useRef<InstancedMesh>(null);
  const treeCount = mobile ? 12 : treePlaces.length;
  const cloudCount = mobile ? 4 : cloudPlaces.length;
  useLayoutEffect(() => {
    const matrix = new Matrix4();
    const color = new Color(tokens.color.brand.teal);
    treePlaces.slice(0, treeCount).forEach((item, i) => {
      matrix.makeScale(1, 1 + i % 3 * 0.18, 1);
      matrix.setPosition(item.x, 0.5, item.z);
      trees.current?.setMatrixAt(i, matrix);
      trees.current?.setColorAt(i, color);
    });
    cloudPlaces.slice(0, cloudCount).forEach((item, i) => {
      matrix.makeScale(1 + i % 3 * 0.3, 1, 1);
      matrix.setPosition(item.x, item.y, item.z);
      clouds.current?.setMatrixAt(i, matrix);
    });
    if (trees.current) trees.current.instanceMatrix.needsUpdate = true;
    if (clouds.current) clouds.current.instanceMatrix.needsUpdate = true;
  }, [treeCount, cloudCount]);
  return <>
    <instancedMesh ref={trees} args={[treeGeometry, treeMaterial, treeCount]} frustumCulled />
    <instancedMesh ref={clouds} args={[cloudGeometry, cloudMaterial, cloudCount]} frustumCulled />
    {[-1, 1].map((side) => <mesh key={side} position={[0, 0.01, side * 7.4]} material={worldMaterials.road} receiveShadow><boxGeometry args={[23, 0.035, 0.84]} /></mesh>)}
    <mesh position={[-10.8, 1.1, 2.2]} material={worldMaterials.sign}><boxGeometry args={[1.8, 1, 0.12]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.28]} material={worldMaterials.podium}><planeGeometry args={[1.7, 0.44]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.285]}><planeGeometry args={[1.62, 0.35]} /><meshBasicMaterial map={logoTexture} transparent depthWrite={false} /></mesh>
    <mesh position={[-10.8, 0.52, 2.2]} material={worldMaterials.frame}><boxGeometry args={[0.08, 1.1, 0.08]} /></mesh>
    <pointLight position={[-10.8, 1.3, 2.5]} intensity={night ? 0.8 : 0} color={tokens.color.brand.blue} distance={3} />
  </>;
}
