import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, Color, CylinderGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, Vector3 } from "three";
import { tokens } from "@/design/tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";

const carBody = new BoxGeometry(0.68, 0.18, 0.34);
const carRoof = new BoxGeometry(0.34, 0.13, 0.27);
const wheelGeometry = new CylinderGeometry(0.075, 0.075, 0.035, 8);
const personGeometry = new CylinderGeometry(0.045, 0.08, 0.36, 5);
const vehicleMaterial = new MeshStandardMaterial({ color: tokens.color.brand.white, roughness: 0.48, metalness: 0.2 });
const waterMaterial = new MeshStandardMaterial({ color: tokens.color.sky.water, roughness: 0.22, metalness: 0.34, transparent: true, opacity: 0.78 });
const fountainMaterial = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, roughness: 0.12, transparent: true, opacity: 0.7 });
const carCount = 10;
const personCount = 14;
const carPalette = [tokens.color.brand.blue, tokens.color.brand.softWhite, tokens.color.brand.navy, tokens.color.brand.peach];

/** Decorative traffic and pedestrians share a single animation callback and instanced geometry. */
export function CityLife({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const bodies = useRef<InstancedMesh>(null);
  const roofs = useRef<InstancedMesh>(null);
  const people = useRef<InstancedMesh>(null);
  const wheels = useRef<InstancedMesh>(null);
  const matrix = useRef(new Matrix4());
  const carPosition = useRef(new Vector3());
  const activeCars = mobile ? 5 : carCount;
  const activePeople = mobile ? 6 : personCount;

  useLayoutEffect(() => {
    for (let i = 0; i < activeCars; i++) {
      const color = new Color(carPalette[i % carPalette.length]);
      bodies.current?.setColorAt(i, color);
    }
    for (let i = 0; i < activePeople; i++) people.current?.setColorAt(i, new Color(i % 3 === 0 ? tokens.color.brand.blue : tokens.color.brand.navy));
    if (bodies.current?.instanceColor) bodies.current.instanceColor.needsUpdate = true;
    if (people.current?.instanceColor) people.current.instanceColor.needsUpdate = true;
  }, [activeCars, activePeople]);

  useFrame(({ clock }) => {
    const t = reducedMotion ? 0 : clock.elapsedTime;
    for (let i = 0; i < activeCars; i++) {
      const moving = i < 6;
      const phase = i * 0.12 + t * 0.012 * (i % 2 ? -1 : 1);
      const angle = phase * Math.PI * 2;
      const x = moving ? Math.cos(angle) * 12.7 : -9 + (i - 6) * 2.2;
      const z = moving ? Math.sin(angle) * 7.4 : i % 2 ? 7.4 : -7.4;
      carPosition.current.set(x, 0.14, z);
      matrix.current.makeRotationY(moving ? -angle : i % 2 ? Math.PI : 0);
      matrix.current.scale(new Vector3(i % 4 === 0 ? 1.18 : i % 4 === 1 ? 0.85 : 1, i % 4 === 0 ? 1.16 : 1, i % 4 === 1 ? 0.9 : 1));
      matrix.current.setPosition(carPosition.current);
      bodies.current?.setMatrixAt(i, matrix.current);
      carPosition.current.y = 0.29;
      matrix.current.setPosition(carPosition.current);
      roofs.current?.setMatrixAt(i, matrix.current);
      for (let wheel = 0; wheel < 4; wheel++) {
        matrix.current.makeRotationZ(Math.PI / 2);
        matrix.current.setPosition(x + (wheel < 2 ? -0.22 : 0.22), 0.08, z + (wheel % 2 ? -0.17 : 0.17));
        wheels.current?.setMatrixAt(i * 4 + wheel, matrix.current);
      }
    }
    for (let i = 0; i < activePeople; i++) {
      const x = -7 + (i % 7) * 2.2 + (reducedMotion ? 0 : Math.sin(t * 0.35 + i) * 0.18);
      const z = i < 7 ? 5.35 : -5.35;
      matrix.current.makeTranslation(x, 0.25, z);
      people.current?.setMatrixAt(i, matrix.current);
    }
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true;
    if (roofs.current) roofs.current.instanceMatrix.needsUpdate = true;
    if (people.current) people.current.instanceMatrix.needsUpdate = true;
    if (wheels.current) wheels.current.instanceMatrix.needsUpdate = true;
  });

  return <group>
    <instancedMesh ref={bodies} args={[carBody, vehicleMaterial, activeCars]} frustumCulled />
    <instancedMesh ref={roofs} args={[carRoof, worldMaterials.frame, activeCars]} frustumCulled />
    <instancedMesh ref={wheels} args={[wheelGeometry, worldMaterials.frame, activeCars * 4]} frustumCulled />
    <instancedMesh ref={people} args={[personGeometry, vehicleMaterial, activePeople]} frustumCulled />
    <mesh material={worldMaterials.podium} position={[0, 0.015, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.7, 1.8, 1]}><ringGeometry args={[0.87, 1, 48]} /></mesh>
    <mesh material={waterMaterial} position={[0, 0.016, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.12, 1.56, 1]}><circleGeometry args={[1, 48]} /></mesh>
    <mesh material={fountainMaterial} position={[0, 0.08, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.6, 1, 1]}><torusGeometry args={[0.78, 0.02, 4, 28]} /></mesh>
    {[-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1].map((x) => <mesh key={x} material={fountainMaterial} position={[x, 0.28 + (Math.abs(x) < 1 ? 0.1 : 0), 4.4]}><cylinderGeometry args={[0.012, 0.036, 0.45 + (Math.abs(x) < 1 ? 0.2 : 0), 6]} /></mesh>)}
  </group>;
}
