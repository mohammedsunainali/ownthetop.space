import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, Color, CylinderGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { tokens } from "@/design/tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { districtLayout, routeHeading, routePoint } from "@/world/environment/district-layout";

const carBody = new BoxGeometry(0.68, 0.18, 0.34);
const carRoof = new BoxGeometry(0.34, 0.13, 0.27);
const wheelGeometry = new CylinderGeometry(0.075, 0.075, 0.035, 8);
const personGeometry = new CylinderGeometry(0.045, 0.08, 0.36, 5);
const headGeometry = new SphereGeometry(0.072, 6, 5);
const vehicleMaterial = new MeshStandardMaterial({ color: tokens.color.brand.white, roughness: 0.48, metalness: 0.2 });
const waterMaterial = new MeshStandardMaterial({ color: tokens.color.sky.water, roughness: 0.22, metalness: 0.34, transparent: true, opacity: 0.78 });
const fountainMaterial = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, roughness: 0.12, transparent: true, opacity: 0.7 });
const carCount = 14;
const personCount = 30;
const carPalette = [tokens.color.brand.blue, tokens.color.brand.softWhite, tokens.color.brand.navy, tokens.color.brand.peach];

/** Decorative traffic and pedestrians share a single animation callback and instanced geometry. */
export function CityLife({ mobile }: { mobile: boolean }) {
  const reducedMotion = useReducedMotion();
  const bodies = useRef<InstancedMesh>(null);
  const roofs = useRef<InstancedMesh>(null);
  const people = useRef<InstancedMesh>(null);
  const heads = useRef<InstancedMesh>(null);
  const wheels = useRef<InstancedMesh>(null);
  const matrix = useRef(new Matrix4());
  const carPosition = useRef(new Vector3());
  const activeCars = mobile ? 7 : carCount;
  const activePeople = mobile ? 11 : personCount;
  const wheelOffsets = useRef([[-0.22, -0.06, -0.17], [-0.22, -0.06, 0.17], [0.22, -0.06, -0.17], [0.22, -0.06, 0.17]].map(([x, y, z]) => new Matrix4().makeRotationZ(Math.PI / 2).setPosition(x, y, z)));
  const wheelMatrix = useRef(new Matrix4());

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
      const direction = i % 2 ? -1 : 1;
      const phase = ((i / activeCars + direction * t * (0.0065 + i % 3 * 0.0014)) % 1 + 1) % 1;
      const lane = direction === 1 ? 0.983 : 1.017;
      const xRadius = districtLayout.road.x * lane;
      const zRadius = districtLayout.road.z * lane;
      const [x, z] = routePoint(xRadius, zRadius, phase);
      carPosition.current.set(x, 0.12, z);
      matrix.current.makeRotationY(routeHeading(xRadius, zRadius, phase, direction));
      matrix.current.scale(new Vector3(i % 4 === 0 ? 1.14 : i % 4 === 1 ? 0.87 : 1, 1, 1));
      matrix.current.setPosition(carPosition.current);
      bodies.current?.setMatrixAt(i, matrix.current);
      carPosition.current.y = 0.27;
      matrix.current.setPosition(carPosition.current);
      roofs.current?.setMatrixAt(i, matrix.current);
      carPosition.current.y = 0.12;
      matrix.current.setPosition(carPosition.current);
      for (let wheel = 0; wheel < 4; wheel++) {
        wheelMatrix.current.multiplyMatrices(matrix.current, wheelOffsets.current[wheel]);
        wheels.current?.setMatrixAt(i * 4 + wheel, wheelMatrix.current);
      }
    }
    for (let i = 0; i < activePeople; i++) {
      const direction = i % 3 === 0 ? -1 : 1;
      const phase = ((i / activePeople + direction * t * (0.0038 + i % 4 * 0.0006)) % 1 + 1) % 1;
      const [x, z] = routePoint(districtLayout.walkway.x, districtLayout.walkway.z, phase);
      matrix.current.makeRotationY(routeHeading(districtLayout.walkway.x, districtLayout.walkway.z, phase, direction));
      matrix.current.setPosition(x, 0.17, z);
      people.current?.setMatrixAt(i, matrix.current);
      matrix.current.setPosition(x, 0.42, z);
      heads.current?.setMatrixAt(i, matrix.current);
    }
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true;
    if (roofs.current) roofs.current.instanceMatrix.needsUpdate = true;
    if (people.current) people.current.instanceMatrix.needsUpdate = true;
    if (heads.current) heads.current.instanceMatrix.needsUpdate = true;
    if (wheels.current) wheels.current.instanceMatrix.needsUpdate = true;
  });

  return <group>
    <instancedMesh ref={bodies} args={[carBody, vehicleMaterial, activeCars]} frustumCulled />
    <instancedMesh ref={roofs} args={[carRoof, worldMaterials.frame, activeCars]} frustumCulled />
    <instancedMesh ref={wheels} args={[wheelGeometry, worldMaterials.frame, activeCars * 4]} frustumCulled />
    <instancedMesh ref={people} args={[personGeometry, vehicleMaterial, activePeople]} frustumCulled />
    <instancedMesh ref={heads} args={[headGeometry, worldMaterials.podium, activePeople]} frustumCulled />
    <mesh material={worldMaterials.podium} position={[0, 0.015, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.7, 1.8, 1]}><ringGeometry args={[0.87, 1, 48]} /></mesh>
    <mesh material={waterMaterial} position={[0, 0.016, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.12, 1.56, 1]}><circleGeometry args={[1, 48]} /></mesh>
    <mesh material={fountainMaterial} position={[0, 0.08, 4.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.6, 1, 1]}><torusGeometry args={[0.78, 0.02, 4, 28]} /></mesh>
    {[-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1].map((x) => <mesh key={x} material={fountainMaterial} position={[x, 0.28 + (Math.abs(x) < 1 ? 0.1 : 0), 4.4]}><cylinderGeometry args={[0.012, 0.036, 0.45 + (Math.abs(x) < 1 ? 0.2 : 0), 6]} /></mesh>)}
  </group>;
}
