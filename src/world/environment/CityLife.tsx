import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, CylinderGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, Sphere, SphereGeometry, Vector3 } from "three";
import { tokens } from "@/design/tokens";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { worldMaterials } from "@/world/materials/world-materials";
import { districtLayout, routePoint } from "@/world/environment/district-layout";
import { plazaPerson } from "./plaza-life";
import { createTraffic, crossingPerson, stepTraffic, vehicleArchetypes, vehicleHeading } from "./traffic-flow";
import { TrafficCrossings } from "./TrafficCrossings";

import { softBox } from "@/world/geometry/soft-box";

const carBody = softBox(1, 1, 1, .12);
const carRoof = softBox(1, 1, 1, .18);
const roofPanel = softBox(1, 1, 1, .12);
const lampGeometry = new BoxGeometry(0.07, 0.045, 0.025);
const wheelGeometry = new CylinderGeometry(0.075, 0.075, 0.035, 12);
const personGeometry = softBox(.15, .22, .11, .028);
const limbGeometry = softBox(0.037, 0.18, 0.043, .012).clone();
limbGeometry.translate(0, -.09, 0);
const skinMaterial = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.85 });
const headGeometry = new SphereGeometry(0.079, 10, 7);
const hairGeometry = new SphereGeometry(.081, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
const tireMaterial = new MeshStandardMaterial({ color: "#26323e", roughness: .9 });
const cabinMaterial = new MeshStandardMaterial({ color: "#234858", roughness: .26, metalness: .22 });
const hairMaterial = new MeshStandardMaterial({ color: "#ffffff", roughness: .92 });
const skinPalette = ["#dca07b", "#986342", "#efc5a0", "#b67e55"];
const hairPalette = ["#342c29", "#62503d", "#bda371", "#57596a"];
const vehicleMaterial = new MeshStandardMaterial({ color: tokens.color.brand.white, roughness: 0.52, metalness: 0.12 });
const waterMaterial = new MeshStandardMaterial({ color: tokens.color.sky.water, roughness: 0.22, metalness: 0.34, transparent: true, opacity: 0.78 });
const fountainMaterial = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, roughness: 0.12, transparent: true, opacity: 0.7 });
const carCount = 14;
const personCount = 30;
const carPalette = ["#FFB844", "#F0805B", tokens.color.brand.blue, "#1DA99A", "#7764C9", tokens.color.brand.softWhite];

/** Decorative traffic and pedestrians share a single animation callback and instanced geometry. */
export function CityLife({ mobile, night = false }: { mobile: boolean; night?: boolean }) {
  const reducedMotion = useReducedMotion();
  const bodies = useRef<InstancedMesh>(null);
  const roofs = useRef<InstancedMesh>(null);
  const roofPanels = useRef<InstancedMesh>(null);
  const hair = useRef<InstancedMesh>(null);
  const people = useRef<InstancedMesh>(null);
  const heads = useRef<InstancedMesh>(null);
  const wheels = useRef<InstancedMesh>(null);
  const limbs = useRef<InstancedMesh>(null);
  const headlights = useRef<InstancedMesh>(null), taillights = useRef<InstancedMesh>(null);
  const matrix = useRef(new Matrix4());
  const carPosition = useRef(new Vector3());
  const activeCars = mobile ? 7 : carCount;
  const traffic = useMemo(() => createTraffic(activeCars), [activeCars]);
  const vehicleScale = useRef(new Vector3());
  const baseMatrix = useRef(new Matrix4());
  const activePeople = mobile ? 11 : personCount;
  const parkPeople = mobile ? 3 : 6;
  const wheelOffsets = useMemo(()=>vehicleArchetypes.map(spec=>[-1,1].flatMap(side=>[-1,1].map(end=>new Matrix4().makeRotationZ(Math.PI/2).setPosition(spec.kind==="scooter"?0:side*spec.width/2,.075,end*spec.length*.32)))),[]);
  const lampOffsets = useMemo(()=>vehicleArchetypes.map(spec=>[-1,1].flatMap(side=>[new Matrix4().makeTranslation(side*spec.width*.3,.14,spec.length/2+.015),new Matrix4().makeTranslation(side*spec.width*.3,.14,-spec.length/2-.015)])),[]);
  const wheelMatrix = useRef(new Matrix4());
  const limbMatrix = useRef(new Matrix4());
  const panelOffsets = useMemo(() => vehicleArchetypes.map(spec => new Matrix4().makeScale(spec.cabin[0] * .92, .025, spec.cabin[2] * .88).setPosition(0,.075+spec.height+spec.cabin[1],spec.cabinZ)), []);
  const totalPeople = activePeople + parkPeople + 2 + Math.floor(activeCars / 6);
  const diagnosticElapsed = useRef(0);
  const diagnostics = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("diagnostics") === "1", []);

  function placePerson(index: number, x: number, y: number, z: number, rotation: number, t: number, walking: boolean, seated = false) {
    matrix.current.makeRotationY(rotation).setPosition(x, y + 0.13, z);
    people.current?.setMatrixAt(index, matrix.current);
    for (let limb = 0; limb < 4; limb++) {
      const leg = limb < 2, side = limb % 2 === 0 ? -1 : 1;
      const swing = walking ? Math.sin(t * 7 + index) * 0.48 * side * (leg ? 1 : -1) : 0;
      limbMatrix.current.makeRotationX(seated && leg ? -Math.PI / 2 : swing);
      limbMatrix.current.setPosition(side * (leg ? 0.04 : 0.1), leg ? (seated ? -0.11 : -0.11) : 0.09, seated && leg ? 0.02 : 0);
      wheelMatrix.current.multiplyMatrices(matrix.current, limbMatrix.current);
      limbs.current?.setMatrixAt(index * 4 + limb, wheelMatrix.current);
    }
    matrix.current.setPosition(x, y + 0.36, z);
    heads.current?.setMatrixAt(index, matrix.current);
    hair.current?.setMatrixAt(index, matrix.current);
  }

  useLayoutEffect(() => {
    for (let i = 0; i < activeCars; i++) {
      const color = new Color(carPalette[i % carPalette.length]);
      bodies.current?.setColorAt(i, color);
      roofPanels.current?.setColorAt(i, color);
    }
    for (let i = 0; i < totalPeople; i++) {
      people.current?.setColorAt(i, new Color(carPalette[i % carPalette.length]));
      heads.current?.setColorAt(i, new Color(skinPalette[i % skinPalette.length]));
      hair.current?.setColorAt(i, new Color(hairPalette[i % hairPalette.length]));
    }
    for (const mesh of [roofPanels.current, heads.current, hair.current]) if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
    if (bodies.current?.instanceColor) bodies.current.instanceColor.needsUpdate = true;
    if (people.current?.instanceColor) people.current.instanceColor.needsUpdate = true;
    // Route envelope avoids stale first-frame bounds without rescanning instances per frame.
    const radius = Math.max(districtLayout.road.x, districtLayout.road.z) * 1.04 + 1;
    for (const mesh of [bodies.current, roofs.current, roofPanels.current, hair.current, wheels.current, people.current, heads.current, limbs.current, headlights.current, taillights.current]) if (mesh) mesh.boundingSphere = new Sphere(new Vector3(), radius);
  }, [activeCars, totalPeople]);

  useFrame(({ clock, gl }, delta) => {
    const t = reducedMotion ? 0 : clock.elapsedTime;
    if (!reducedMotion) stepTraffic(traffic, delta, t);
    for (let i = 0; i < activeCars; i++) {
      const { direction, phase, length } = traffic[i];
      const model=i%vehicleArchetypes.length,spec=vehicleArchetypes[model];
      const lane = direction === 1 ? 0.983 : 1.017;
      const xRadius = districtLayout.road.x * lane;
      const zRadius = districtLayout.road.z * lane;
      const [x, z] = routePoint(xRadius, zRadius, phase);
      carPosition.current.set(x, .075+spec.height/2, z);
      matrix.current.makeRotationY(vehicleHeading(xRadius, zRadius, phase, direction));
      baseMatrix.current.copy(matrix.current).setPosition(x,0,z);
      vehicleScale.current.set(spec.width,spec.height,length);
      matrix.current.scale(vehicleScale.current);
      matrix.current.setPosition(carPosition.current);
      bodies.current?.setMatrixAt(i, matrix.current);
      matrix.current.copy(baseMatrix.current);vehicleScale.current.set(spec.cabin[0],spec.cabin[1],spec.cabin[2]);matrix.current.scale(vehicleScale.current);
      carPosition.current.set(0,.075+spec.height+spec.cabin[1]/2,spec.cabinZ).applyMatrix4(baseMatrix.current);
      matrix.current.setPosition(carPosition.current);
      roofs.current?.setMatrixAt(i, matrix.current);
      wheelMatrix.current.multiplyMatrices(baseMatrix.current, panelOffsets[model]);
      roofPanels.current?.setMatrixAt(i, wheelMatrix.current);
      for (let wheel = 0; wheel < 4; wheel++) {
        wheelMatrix.current.multiplyMatrices(baseMatrix.current, wheelOffsets[model][wheel]);
        if (spec.kind === "scooter" && wheel >= 2) wheelMatrix.current.makeScale(0,0,0);
        wheels.current?.setMatrixAt(i * 4 + wheel, wheelMatrix.current);
      }
      for (let side = 0; side < 2; side++) {
        wheelMatrix.current.multiplyMatrices(baseMatrix.current, lampOffsets[model][side * 2]); headlights.current?.setMatrixAt(i * 2 + side, wheelMatrix.current);
        wheelMatrix.current.multiplyMatrices(baseMatrix.current, lampOffsets[model][side * 2 + 1]); taillights.current?.setMatrixAt(i * 2 + side, wheelMatrix.current);
      }
      if(spec.kind==="scooter") placePerson(activePeople+parkPeople+2+Math.floor(i/6),x,.25,z,vehicleHeading(xRadius,zRadius,phase,direction),t,false,true);
    }
    for (let i = 0; i < activePeople; i++) {
      const direction = i % 3 === 0 ? -1 : 1;
      const phase = ((i / activePeople + direction * t * (0.0038 + i % 4 * 0.0006)) % 1 + 1) % 1;
      const [x, z] = routePoint(districtLayout.walkway.x, districtLayout.walkway.z, phase);
      placePerson(i, x, 0.17, z, vehicleHeading(districtLayout.walkway.x, districtLayout.walkway.z, phase, direction), t, !reducedMotion);
    }
    for (let i = 0; i < parkPeople; i++) {
      const person = plazaPerson(t, i);
      placePerson(activePeople + i, person.x, person.y, person.z, person.rotation, t, !reducedMotion && !person.seated && t % 20 < 17, person.seated);
    }
    for (let i = 0; i < 2; i++) {
      const person = crossingPerson(t, i);
      placePerson(activePeople + parkPeople + i, person.x, 0.17, person.z, person.rotation, t, !reducedMotion && person.walking);
    }
    if (bodies.current) bodies.current.instanceMatrix.needsUpdate = true;
    if (roofs.current) roofs.current.instanceMatrix.needsUpdate = true;
    if (roofPanels.current) roofPanels.current.instanceMatrix.needsUpdate = true;
    if (hair.current) hair.current.instanceMatrix.needsUpdate = true;
    if (people.current) people.current.instanceMatrix.needsUpdate = true;
    if (heads.current) heads.current.instanceMatrix.needsUpdate = true;
    if (limbs.current) limbs.current.instanceMatrix.needsUpdate = true;
    if (wheels.current) wheels.current.instanceMatrix.needsUpdate = true;
    if (headlights.current) headlights.current.instanceMatrix.needsUpdate = true;
    if (taillights.current) taillights.current.instanceMatrix.needsUpdate = true;
    if (diagnostics) diagnosticElapsed.current += delta;
    if (diagnostics && diagnosticElapsed.current > 1) {
      diagnosticElapsed.current = 0;
      gl.domElement.dataset.ottTraffic = JSON.stringify({ time: t, vehicles: traffic.map(car => ({ phase: car.phase, speed: car.speed, direction: car.direction })), pedestrians: [crossingPerson(t, 0), crossingPerson(t, 1)] });
    }
  });

  return <group>
    <TrafficCrossings />
    <instancedMesh ref={bodies} args={[carBody, vehicleMaterial, activeCars]} frustumCulled />
    <instancedMesh ref={roofs} args={[carRoof, cabinMaterial, activeCars]} frustumCulled />
    <instancedMesh ref={roofPanels} args={[roofPanel, vehicleMaterial, activeCars]} frustumCulled />
    <instancedMesh ref={wheels} args={[wheelGeometry, tireMaterial, activeCars * 4]} frustumCulled />
    <instancedMesh ref={headlights} args={[lampGeometry, undefined, activeCars * 2]} visible={night} frustumCulled><meshBasicMaterial color="#ffedc3" toneMapped={false} /></instancedMesh>
    <instancedMesh ref={taillights} args={[lampGeometry, undefined, activeCars * 2]} visible={night} frustumCulled><meshBasicMaterial color="#ff6658" toneMapped={false} /></instancedMesh>
    <instancedMesh ref={people} args={[personGeometry, vehicleMaterial, totalPeople]} frustumCulled />
    <instancedMesh ref={heads} args={[headGeometry, skinMaterial, totalPeople]} frustumCulled />
    <instancedMesh ref={hair} args={[hairGeometry, hairMaterial, totalPeople]} frustumCulled />
    <instancedMesh ref={limbs} args={[limbGeometry, worldMaterials.frame, totalPeople * 4]} frustumCulled />
    <group position={districtLayout.park.center}>
      <mesh material={worldMaterials.podium} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.7, 1.8, 1]}><ringGeometry args={[0.87, 1, 48]} /></mesh>
      <mesh material={waterMaterial} position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.12, 1.56, 1]}><circleGeometry args={[1, 48]} /></mesh>
      <mesh material={fountainMaterial} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.6, 1, 1]}><torusGeometry args={[0.78, 0.02, 4, 28]} /></mesh>
      {[-2.1, -1.4, -0.7, 0, 0.7, 1.4, 2.1].map((x) => <mesh key={x} material={fountainMaterial} position={[x, 0.28 + (Math.abs(x) < 1 ? 0.1 : 0), 0]}><cylinderGeometry args={[0.012, 0.036, 0.45 + (Math.abs(x) < 1 ? 0.2 : 0), 6]} /></mesh>)}
    </group>
  </group>;
}
