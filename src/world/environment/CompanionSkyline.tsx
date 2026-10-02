import { useEffect, useLayoutEffect, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import { tokens } from "@/design/tokens";

const unitBox = new BoxGeometry(1, 1, 1);
const bodyMaterial = new MeshStandardMaterial({ color: tokens.color.brand.white, metalness: 0.32, roughness: 0.45 });
const glassMaterial = new MeshStandardMaterial({ color: tokens.color.brand.navy, metalness: 0.57, roughness: 0.18, emissive: tokens.color.brand.blue, emissiveIntensity: 0.04 });
const roofMaterial = new MeshStandardMaterial({ color: tokens.color.brand.softWhite, metalness: 0.28, roughness: 0.48 });
const locations = Array.from({ length: 34 }, (_, index) => {
  const angle = index * 2.39996;
  const radius = 15.5 + (index % 4) * 1.65;
  return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, height: 1.5 + (index * 7 % 10) * 0.43, width: 1 + index % 3 * 0.35, depth: 1 + index % 2 * 0.4 };
});
const windows = locations.flatMap((building, buildingIndex) => {
  const levels = Math.max(2, Math.floor(building.height / 0.55));
  return Array.from({ length: levels }, (_, level) => level).flatMap((level) => [0, 1, 2].flatMap((column) => [
    { buildingIndex, x: building.x + (column - 1) * building.width * 0.27, y: 0.35 + level * 0.52, z: building.z + building.depth / 2 + 0.009, angle: 0, width: building.width * 0.18 },
    { buildingIndex, x: building.x + building.width / 2 + 0.009, y: 0.35 + level * 0.52, z: building.z + (column - 1) * building.depth * 0.27, angle: Math.PI / 2, width: building.depth * 0.18 },
  ]));
});

/** A quiet, windowed urban backdrop. All bodies, roof caps and panes are instanced. */
export function CompanionSkyline({ mobile, night }: { mobile: boolean; night: boolean }) {
  const bodies = useRef<InstancedMesh>(null);
  const roofs = useRef<InstancedMesh>(null);
  const panes = useRef<InstancedMesh>(null);
  const count = mobile ? 18 : locations.length;
  const paneCount = windows.filter((item) => item.buildingIndex < count).length;
  useEffect(() => { glassMaterial.emissiveIntensity = night ? 0.28 : 0.04; }, [night]);
  useLayoutEffect(() => {
    const body = bodies.current, roof = roofs.current, glass = panes.current;
    if (!body || !roof || !glass) return;
    const matrix = new Matrix4(), rotation = new Quaternion(), pos = new Vector3(), scale = new Vector3();
    const colors = [tokens.color.brand.lightBlue, tokens.color.brand.lavender, tokens.color.brand.softWhite];
    for (let index = 0; index < count; index++) {
      const item = locations[index];
      matrix.makeScale(item.width, item.height, item.depth);
      matrix.setPosition(item.x, item.height / 2, item.z);
      body.setMatrixAt(index, matrix);
      body.setColorAt(index, new Color(colors[index % 3]).lerp(new Color(tokens.color.brand.navy), 0.22));
      matrix.makeScale(item.width + 0.13, 0.11, item.depth + 0.13);
      matrix.setPosition(item.x, item.height + 0.02, item.z);
      roof.setMatrixAt(index, matrix);
    }
    let paneIndex = 0;
    for (const item of windows) {
      if (item.buildingIndex >= count) continue;
      rotation.setFromAxisAngle(new Vector3(0, 1, 0), item.angle);
      pos.set(item.x, item.y, item.z);
      scale.set(item.width, 0.3, 0.014);
      matrix.compose(pos, rotation, scale);
      glass.setMatrixAt(paneIndex, matrix);
      glass.setColorAt(paneIndex, new Color((item.buildingIndex + Math.floor(item.y * 10) + paneIndex) % 5 === 0 ? tokens.color.brand.navy : tokens.color.brand.lightBlue));
      paneIndex++;
    }
    for (const mesh of [body, roof, glass]) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; }
  }, [count]);
  return <>
    <instancedMesh ref={bodies} args={[unitBox, bodyMaterial, count]} castShadow={!mobile} />
    <instancedMesh ref={roofs} args={[unitBox, roofMaterial, count]} />
    <instancedMesh ref={panes} args={[unitBox, glassMaterial, paneCount]} />
  </>;
}
