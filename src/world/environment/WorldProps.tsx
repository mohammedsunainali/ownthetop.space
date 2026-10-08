import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { BoxGeometry, Color, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial } from "three";
import { tokens } from "@/design/tokens";
import { worldMaterials } from "@/world/materials/world-materials";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { districtLayout, routePoint } from "@/world/environment/district-layout";
import { environmentTokens } from "@/world/environment/environment-tokens";

const treeGeometry = new IcosahedronGeometry(0.65, 1);
const trunkGeometry = new CylinderGeometry(0.07, 0.1, 0.9, 6);
const treeMaterial = worldMaterials.leaf;
const cloudGeometry = new IcosahedronGeometry(1, 1);
const shrubGeometry = new IcosahedronGeometry(0.24, 0);
const palmGeometry = new IcosahedronGeometry(0.45, 0);
const palmTrunkGeometry = new CylinderGeometry(0.045, 0.085, 1.5, 5);
const lampPoleGeometry = new CylinderGeometry(0.035, 0.055, 2.15, 6);
const lampHeadGeometry = new BoxGeometry(0.25, 0.11, 0.25);
const lampPoleMaterial = new MeshStandardMaterial({ color: environmentTokens.lampPost, roughness: 0.72 });
const lampHeadMaterial = new MeshStandardMaterial({ color: environmentTokens.lampWarm, emissive: environmentTokens.lampWarm, emissiveIntensity: 0.45, roughness: 0.42 });
const cloudMaterial = worldMaterials.cloud;
const treePlaces = Array.from({ length: 56 }, (_, i) => {
  const cluster = Math.floor(i / 7);
  const angle = cluster * Math.PI / 4 + (i % 7 - 3) * 0.035;
  const radius = 0.72 + (i * 7 % 5) * 0.05;
  return { x: Math.cos(angle) * districtLayout.green.x * radius, z: Math.sin(angle) * districtLayout.green.z * radius };
});
const cloudPlaces = Array.from({ length: 8 }, (_, i) => ({ x: -18 + i * 5.2, y: 11 + i % 3 * 1.7, z: -13 - i % 2 * 5 }));
const shrubPlaces = Array.from({ length: 64 }, (_, i) => {
  const phase = (Math.floor(i / 4) + (i % 4) * 0.014) / 16;
  const [x, z] = routePoint(districtLayout.green.x * 0.87, districtLayout.green.z * 0.87, phase);
  return { x, z };
});
const palmPlaces = Array.from({ length: 8 }, (_, i) => ({ x: (i % 4 - 1.5) * 3.3, z: i < 4 ? 10.1 : -10.1 }));
const lampPlaces = [0.125, 0.375, 0.625, 0.875].map((phase) => {
  const [x, z] = routePoint(districtLayout.walkway.x * 1.09, districtLayout.walkway.z * 1.09, phase);
  return { x, z };
});

export function WorldProps({ mobile, night }: { mobile: boolean; night: boolean }) {
  const reducedMotion = useReducedMotion();
  const logoTexture = useTexture("/brand/ownthetop-logo-primary.svg");
  const trees = useRef<InstancedMesh>(null);
  const trunks = useRef<InstancedMesh>(null);
  const clouds = useRef<InstancedMesh>(null);
  const shrubs = useRef<InstancedMesh>(null);
  const palms = useRef<InstancedMesh>(null);
  const palmTrunks = useRef<InstancedMesh>(null);
  const lampPoles = useRef<InstancedMesh>(null);
  const lampHeads = useRef<InstancedMesh>(null);
  useEffect(() => { lampHeadMaterial.emissiveIntensity = night ? 2.2 : 0.12; }, [night]);
  const treeCount = mobile ? 22 : treePlaces.length;
  const cloudCount = mobile ? 4 : cloudPlaces.length;
  const shrubCount = mobile ? 24 : shrubPlaces.length;
  const palmCount = mobile ? 4 : palmPlaces.length;
  useLayoutEffect(() => {
    const matrix = new Matrix4();
    treePlaces.slice(0, treeCount).forEach((item, i) => {
      const size = 0.68 + (i * 3 % 7) * 0.09;
      matrix.makeScale(size, size * (0.92 + i % 3 * 0.14), size);
      matrix.setPosition(item.x, 0.85 + size * 0.54, item.z);
      trees.current?.setMatrixAt(i, matrix);
      trees.current?.setColorAt(i, new Color(environmentTokens.canopy[i % environmentTokens.canopy.length]));
      matrix.makeScale(1, 1, 1);
      matrix.setPosition(item.x, 0.34, item.z);
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
    lampPlaces.forEach((item, i) => {
      matrix.makeTranslation(item.x, 1.075, item.z);
      lampPoles.current?.setMatrixAt(i, matrix);
      matrix.makeTranslation(item.x, 2.19, item.z);
      lampHeads.current?.setMatrixAt(i, matrix);
    });
    if (trees.current) { trees.current.instanceMatrix.needsUpdate = true; trees.current.instanceColor!.needsUpdate = true; trees.current.computeBoundingSphere(); }
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (clouds.current) clouds.current.instanceMatrix.needsUpdate = true;
    if (shrubs.current) shrubs.current.instanceMatrix.needsUpdate = true;
    if (palms.current) palms.current.instanceMatrix.needsUpdate = true;
    if (palmTrunks.current) palmTrunks.current.instanceMatrix.needsUpdate = true;
    if (lampPoles.current) lampPoles.current.instanceMatrix.needsUpdate = true;
    if (lampHeads.current) lampHeads.current.instanceMatrix.needsUpdate = true;
  }, [treeCount, cloudCount, shrubCount, palmCount]);
  useFrame(({ clock }) => {
    if (clouds.current && !reducedMotion) clouds.current.position.x = Math.sin(clock.elapsedTime * 0.035) * 0.28;
  });
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.048, 0]} scale={[districtLayout.green.x, districtLayout.green.z, 1]} receiveShadow><circleGeometry args={[1, 96]} /><meshStandardMaterial color={night ? environmentTokens.lawnNight : environmentTokens.lawn} roughness={0.95} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.041, 0]} scale={[districtLayout.plaza.x, districtLayout.plaza.z, 1]} receiveShadow><circleGeometry args={[1, 96]} /><meshStandardMaterial color={night ? environmentTokens.plazaNight : environmentTokens.plaza} roughness={0.95} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} scale={[districtLayout.walkway.x, districtLayout.walkway.z, 1]} receiveShadow><ringGeometry args={[0.93, 1.07, 96]} /><meshStandardMaterial color={night ? environmentTokens.pathNight : environmentTokens.path} roughness={0.92} side={2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.027, 0]} scale={[districtLayout.road.x, districtLayout.road.z, 1]} receiveShadow><ringGeometry args={[0.89, 1.11, 96]} /><meshStandardMaterial color={night ? environmentTokens.sidewalkNight : environmentTokens.sidewalk} roughness={0.94} side={2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.021, 0]} scale={[districtLayout.road.x, districtLayout.road.z, 1]} receiveShadow><ringGeometry args={[0.955, 1.045, 96]} /><meshStandardMaterial color={night ? environmentTokens.roadNight : environmentTokens.road} roughness={0.87} side={2} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.017, 0]} scale={[districtLayout.road.x, districtLayout.road.z, 1]}><ringGeometry args={[0.999, 1.001, 96]} /><meshBasicMaterial color={environmentTokens.lane} transparent opacity={0.56} side={2} /></mesh>
    <instancedMesh ref={trees} args={[treeGeometry, treeMaterial, treeCount]} frustumCulled />
    <instancedMesh ref={trunks} args={[trunkGeometry, worldMaterials.frame, treeCount]} frustumCulled />
    <instancedMesh ref={clouds} args={[cloudGeometry, cloudMaterial, cloudCount * 3]} frustumCulled />
    <instancedMesh ref={shrubs} args={[shrubGeometry, worldMaterials.leaf, shrubCount]} frustumCulled />
    <instancedMesh ref={palms} args={[palmGeometry, worldMaterials.leaf, palmCount]} frustumCulled />
    <instancedMesh ref={palmTrunks} args={[palmTrunkGeometry, worldMaterials.frame, palmCount]} frustumCulled />
    <instancedMesh ref={lampPoles} args={[lampPoleGeometry, lampPoleMaterial, lampPlaces.length]} frustumCulled />
    <instancedMesh ref={lampHeads} args={[lampHeadGeometry, lampHeadMaterial, lampPlaces.length]} frustumCulled />
    {lampPlaces.map((item, index) => <pointLight key={index} position={[item.x, 2.05, item.z]} color={environmentTokens.lampWarm} intensity={night ? 14 : 0} distance={8} decay={2} />)}
    <mesh position={[-10.8, 1.1, 2.2]} material={worldMaterials.sign}><boxGeometry args={[1.8, 1, 0.12]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.28]} material={worldMaterials.podium}><planeGeometry args={[1.7, 0.44]} /></mesh>
    <mesh position={[-10.8, 1.1, 2.285]}><planeGeometry args={[1.62, 0.35]} /><meshBasicMaterial map={logoTexture} transparent depthWrite={false} /></mesh>
    <mesh position={[-10.8, 0.52, 2.2]} material={worldMaterials.frame}><boxGeometry args={[0.08, 1.1, 0.08]} /></mesh>
    <pointLight position={[-10.8, 1.3, 2.5]} intensity={night ? 0.8 : 0} color={tokens.color.brand.blue} distance={3} />
  </>;
}
