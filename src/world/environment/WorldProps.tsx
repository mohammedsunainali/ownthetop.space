import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { BoxGeometry, Color, ConeGeometry, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial } from "three";
import { tokens } from "@/design/tokens";
import { worldMaterials } from "@/world/materials/world-materials";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { districtLayout, routePoint, outsideTowerApproaches } from "@/world/environment/district-layout";
import { environmentTokens } from "@/world/environment/environment-tokens";
import { treePlaces, palmPlaces } from "@/world/environment/vegetation-layout";

const treeGeometry = new IcosahedronGeometry(0.65, 1);
const angularTreeGeometry = new IcosahedronGeometry(0.65, 0);
// Radius/height fit inside the existing conservative0.65 canopy sphere.
const evergreenGeometry = new ConeGeometry(0.38, 1.05, 7);
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
const cloudPlaces = Array.from({ length: 8 }, (_, i) => ({ x: -18 + i * 5.2, y: 11 + i % 3 * 1.7, z: -13 - i % 2 * 5 }));
const shrubPlaces = Array.from({ length: 64 }, (_, i) => {
  const phase = (Math.floor(i / 4) + (i % 4) * 0.014) / 16;
  const [x, z] = routePoint(districtLayout.green.x * 0.87, districtLayout.green.z * 0.87, phase);
  return { x, z };
}).filter(item => outsideTowerApproaches(item));
const lampPlaces = [0.125, 0.375, 0.625, 0.875].map((phase) => {
  const [x, z] = routePoint(districtLayout.walkway.x * 1.09, districtLayout.walkway.z * 1.09, phase);
  return { x, z };
});

export function WorldProps({ mobile, night }: { mobile: boolean; night: boolean }) {
  const reducedMotion = useReducedMotion();
  const logoTexture = useTexture("/brand/ownthetop-logo-primary.svg");
  const trees = useRef<InstancedMesh>(null);
  const angularTrees = useRef<InstancedMesh>(null), evergreens = useRef<InstancedMesh>(null);
  const trunks = useRef<InstancedMesh>(null);
  const clouds = useRef<InstancedMesh>(null);
  const shrubs = useRef<InstancedMesh>(null);
  const palms = useRef<InstancedMesh>(null);
  const palmTrunks = useRef<InstancedMesh>(null);
  const lampPoles = useRef<InstancedMesh>(null);
  const lampHeads = useRef<InstancedMesh>(null);
  useEffect(() => { lampHeadMaterial.emissiveIntensity = night ? 2.2 : 0.12; }, [night]);
  const treeCount = mobile ? Math.min(36, treePlaces.length) : treePlaces.length;
  const cloudCount = mobile ? 4 : cloudPlaces.length;
  const shrubCount = mobile ? 24 : shrubPlaces.length;
  const palmCount = mobile ? 4 : palmPlaces.length;
  useLayoutEffect(() => {
    const matrix = new Matrix4();
    treePlaces.slice(0, treeCount).forEach((item, i) => {
      const size = 0.68 + (i * 3 % 7) * 0.09;
      matrix.makeScale(size, size * (0.92 + i % 3 * 0.14), size);
      matrix.setPosition(item.x, 0.85 + size * 0.54, item.z);
      const canopy = [trees.current, angularTrees.current, evergreens.current][i % 3];
      canopy?.setMatrixAt(Math.floor(i / 3), matrix);
      canopy?.setColorAt(Math.floor(i / 3), new Color(environmentTokens.canopy[i % environmentTokens.canopy.length]));
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
    for (const canopy of [trees.current, angularTrees.current, evergreens.current]) if (canopy) { canopy.instanceMatrix.needsUpdate = true; if (canopy.instanceColor) canopy.instanceColor.needsUpdate = true; canopy.computeBoundingSphere(); }
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
    <instancedMesh ref={trees} args={[treeGeometry, treeMaterial, Math.ceil(treeCount / 3)]} frustumCulled />
    <instancedMesh ref={angularTrees} args={[angularTreeGeometry, treeMaterial, Math.ceil((treeCount - 1) / 3)]} frustumCulled />
    <instancedMesh ref={evergreens} args={[evergreenGeometry, treeMaterial, Math.ceil((treeCount - 2) / 3)]} frustumCulled />
    <instancedMesh ref={trunks} args={[trunkGeometry, worldMaterials.frame, treeCount]} frustumCulled />
    <instancedMesh ref={clouds} args={[cloudGeometry, cloudMaterial, cloudCount * 3]} frustumCulled />
    <instancedMesh ref={shrubs} args={[shrubGeometry, worldMaterials.leaf, shrubCount]} frustumCulled />
    <instancedMesh ref={palms} args={[palmGeometry, worldMaterials.leaf, palmCount]} frustumCulled />
    <instancedMesh ref={palmTrunks} args={[palmTrunkGeometry, worldMaterials.frame, palmCount]} frustumCulled />
    <instancedMesh ref={lampPoles} args={[lampPoleGeometry, lampPoleMaterial, lampPlaces.length]} frustumCulled />
    <instancedMesh ref={lampHeads} args={[lampHeadGeometry, lampHeadMaterial, lampPlaces.length]} frustumCulled />
    {lampPlaces.map((item, index) => <pointLight key={index} position={[item.x, 2.05, item.z]} color={environmentTokens.lampWarm} intensity={night ? 14 : 0} distance={8} decay={2} />)}
    <group position={[0, 0, districtLayout.park.center[2] + 5]}>
      <mesh position={[0, 1.1, 0]} material={worldMaterials.sign}><boxGeometry args={[1.8, 1, 0.12]} /></mesh>
      <mesh position={[0, 1.1, 0.08]} material={worldMaterials.podium}><planeGeometry args={[1.7, 0.44]} /></mesh>
      <mesh position={[0, 1.1, 0.085]}><planeGeometry args={[1.62, 0.35]} /><meshBasicMaterial map={logoTexture} transparent depthWrite={false} /></mesh>
      <mesh position={[0, 0.52, 0]} material={worldMaterials.frame}><boxGeometry args={[0.08, 1.1, 0.08]} /></mesh>
      <pointLight position={[0, 1.3, 0.3]} intensity={night ? 0.8 : 0} color={tokens.color.brand.blue} distance={3} />
    </group>
  </>;
}
