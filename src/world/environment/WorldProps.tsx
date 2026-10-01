import { useLayoutEffect, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { Color, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Matrix4 } from "three";
import { tokens } from "@/design/tokens";
import { worldMaterials } from "@/world/materials/world-materials";

const treeGeometry = new IcosahedronGeometry(0.65, 1);
const trunkGeometry = new CylinderGeometry(0.07, 0.1, 0.9, 6);
const treeMaterial = worldMaterials.leaf;
const cloudGeometry = new IcosahedronGeometry(1, 1);
const shrubGeometry = new IcosahedronGeometry(0.24, 0);
const palmGeometry = new IcosahedronGeometry(0.45, 0);
const palmTrunkGeometry = new CylinderGeometry(0.045, 0.085, 1.5, 5);
const cloudMaterial = worldMaterials.cloud;
const treePlaces = Array.from({ length: 28 }, (_, i) => ({ x: Math.cos(i * 2.1) * (9.5 + i % 3), z: Math.sin(i * 2.1) * (9.5 + i % 3) }));
const cloudPlaces = Array.from({ length: 8 }, (_, i) => ({ x: -18 + i * 5.2, y: 11 + i % 3 * 1.7, z: -13 - i % 2 * 5 }));
const shrubPlaces = Array.from({ length: 36 }, (_, i) => ({ x: (i % 9 - 4) * 2.15 + (i % 3) * 0.2, z: (Math.floor(i / 9) - 1.5) * 5.2 + (i % 2) * 0.25 }));
const palmPlaces = Array.from({ length: 8 }, (_, i) => ({ x: (i % 4 - 1.5) * 3.3, z: i < 4 ? 10.1 : -10.1 }));

export function WorldProps({ mobile, night }: { mobile: boolean; night: boolean }) {
  const logoTexture = useTexture("/brand/ownthetop-logo-primary.svg");
  const trees = useRef<InstancedMesh>(null);
  const trunks = useRef<InstancedMesh>(null);
  const clouds = useRef<InstancedMesh>(null);
  const shrubs = useRef<InstancedMesh>(null);
  const palms = useRef<InstancedMesh>(null);
  const palmTrunks = useRef<InstancedMesh>(null);
  const treeCount = mobile ? 12 : treePlaces.length;
  const cloudCount = mobile ? 4 : cloudPlaces.length;
  const shrubCount = mobile ? 18 : shrubPlaces.length;
  const palmCount = mobile ? 4 : palmPlaces.length;
  useLayoutEffect(() => {
    const matrix = new Matrix4();
    const color = new Color(tokens.color.brand.teal);
    treePlaces.slice(0, treeCount).forEach((item, i) => {
      matrix.makeScale(1, 0.8 + i % 3 * 0.15, 1);
      matrix.setPosition(item.x, 1.25, item.z);
      trees.current?.setMatrixAt(i, matrix);
      trees.current?.setColorAt(i, color);
      matrix.makeScale(1, 1, 1);
      matrix.setPosition(item.x, 0.45, item.z);
      trunks.current?.setMatrixAt(i, matrix);
    });
    cloudPlaces.slice(0, cloudCount).forEach((item, i) => {
      for (let lobe = 0; lobe < 3; lobe++) {
        matrix.makeScale(1.05 + (i + lobe) % 3 * 0.22, 0.32 + lobe * 0.04, 0.49);
        matrix.setPosition(item.x + (lobe - 1) * 0.83, item.y + (lobe === 1 ? 0.16 : 0), item.z + lobe * 0.12);
        clouds.current?.setMatrixAt(i * 3 + lobe, matrix);
      }
    });
    shrubPlaces.slice(0, shrubCount).forEach((item, i) => { matrix.makeScale(0.8 + i % 3 * 0.14, 0.65 + i % 4 * 0.08, 0.8); matrix.setPosition(item.x, 0.17, item.z); shrubs.current?.setMatrixAt(i, matrix); });
    palmPlaces.slice(0, palmCount).forEach((item, i) => {
      matrix.makeScale(1, 1, 1); matrix.setPosition(item.x, 0.75, item.z); palmTrunks.current?.setMatrixAt(i, matrix);
      matrix.makeScale(1, 0.62, 1); matrix.setPosition(item.x, 1.6, item.z); palms.current?.setMatrixAt(i, matrix);
    });
    if (trees.current) trees.current.instanceMatrix.needsUpdate = true;
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (clouds.current) clouds.current.instanceMatrix.needsUpdate = true;
    if (shrubs.current) shrubs.current.instanceMatrix.needsUpdate = true;
    if (palms.current) palms.current.instanceMatrix.needsUpdate = true;
    if (palmTrunks.current) palmTrunks.current.instanceMatrix.needsUpdate = true;
  }, [treeCount, cloudCount, shrubCount, palmCount]);
  return <>
    <instancedMesh ref={trees} args={[treeGeometry, treeMaterial, treeCount]} frustumCulled />
    <instancedMesh ref={trunks} args={[trunkGeometry, worldMaterials.frame, treeCount]} frustumCulled />
    <instancedMesh ref={clouds} args={[cloudGeometry, cloudMaterial, cloudCount * 3]} frustumCulled />
    <instancedMesh ref={shrubs} args={[shrubGeometry, worldMaterials.leaf, shrubCount]} frustumCulled />
    <instancedMesh ref={palms} args={[palmGeometry, worldMaterials.leaf, palmCount]} frustumCulled />
    <instancedMesh ref={palmTrunks} args={[palmTrunkGeometry, worldMaterials.frame, palmCount]} frustumCulled />
    {[-1, 1].map((side) => <mesh key={side} position={[0, 0.01, side * 7.4]} material={worldMaterials.road} receiveShadow><boxGeometry args={[23, 0.035, 0.84]} /></mesh>)}
    <mesh position={[-10.8, 1.1, 2.2]} material={worldMaterials.sign}><boxGeometry args={[1.8, 1, 0.12]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.28]} material={worldMaterials.podium}><planeGeometry args={[1.7, 0.44]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.285]}><planeGeometry args={[1.62, 0.35]} /><meshBasicMaterial map={logoTexture} transparent depthWrite={false} /></mesh>
    <mesh position={[-10.8, 0.52, 2.2]} material={worldMaterials.frame}><boxGeometry args={[0.08, 1.1, 0.08]} /></mesh>
    <pointLight position={[-10.8, 1.3, 2.5]} intensity={night ? 0.8 : 0} color={tokens.color.brand.blue} distance={3} />
  </>;
}
