import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshBasicMaterial, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import { tokens } from "@/design/tokens";
import { environmentTokens } from "@/world/environment/environment-tokens";
import { neighborhoodBuildings } from "./neighborhood-layout";
import { cityArchetypes } from "./city-archetypes";
import {useWorldStore} from "@/state/world-store";
import {BuildingPreviewSign} from "./BuildingPreviewSign";
import { cityDetails } from "./city-details";

import { cityForms, cityFormIndex, cityRoof, cityTrim, cityCanopy, isCurvedCanopy } from "@/world/geometry/city-forms";
import { architecturalGlass } from "@/world/materials/architectural-glass";

const unitBox = new BoxGeometry(1, 1, 1);
const bodyMaterial = new MeshStandardMaterial({ color: tokens.color.brand.white, metalness: 0.08, roughness: 0.68 });
const glassMaterial = architecturalGlass;
const roofMaterial = new MeshStandardMaterial({ color: tokens.color.brand.softWhite, metalness: 0.08, roughness: 0.62 });
const nightGlass = new MeshStandardMaterial({ color: tokens.color.brand.white, metalness: .3, roughness: .35 });
const nightLitGlass = new MeshBasicMaterial({ color: tokens.color.brand.white, toneMapped: false });
const locations = neighborhoodBuildings;
const windows = locations.flatMap((building, buildingIndex) => {
  const levels = Math.max(2, Math.floor(building.height / 0.55));
  return Array.from({ length: levels }, (_, level) => level).flatMap((level) => [0, 1, 2].flatMap((column) => [
    { buildingIndex, x: building.x + (column - 1) * building.width * 0.27, y: 0.35 + level * 0.52, z: building.z + building.depth / 2 + 0.009, angle: 0, width: building.width * 0.18 },
    { buildingIndex, x: building.x + building.width / 2 + 0.009, y: 0.35 + level * 0.52, z: building.z + (column - 1) * building.depth * 0.27, angle: Math.PI / 2, width: building.depth * 0.18 },
  ]));
}).map((item,index)=>({...item,lit:(item.buildingIndex+Math.floor(item.y*10)+index)%5===0}));

/** A quiet, windowed urban backdrop. All bodies, roof caps and panes are instanced. */
export function CompanionSkyline({ mobile, night }: { mobile: boolean; night: boolean }) {
  const bodies = useRef<(InstancedMesh | null)[]>([]);
  const roofs = useRef<InstancedMesh>(null);
  const panes = useRef<InstancedMesh>(null);
  const litPanes = useRef<InstancedMesh>(null);
  const details = useRef<InstancedMesh>(null);
  const architecture = useRef<InstancedMesh>(null);
  const canopies = useRef<InstancedMesh>(null);
  const count = mobile ? Math.min(36, locations.length) : locations.length;
  const paneCount = windows.filter((item) => item.buildingIndex < count&&!item.lit).length;
  const litPaneCount = windows.filter((item) => item.buildingIndex < count&&item.lit).length;
  const architectureCount = cityDetails.filter(item => item.buildingIndex < count && !isCurvedCanopy(item.role)).length;
  const canopyCount = cityDetails.filter(item => item.buildingIndex < count && isCurvedCanopy(item.role)).length;
  useLayoutEffect(() => {
    const roof = roofs.current, glass = panes.current, detail = details.current;
    if (!roof || !glass || !detail) return;
    const matrix = new Matrix4(), rotation = new Quaternion(), pos = new Vector3(), scale = new Vector3();
    const formCounts = [0, 0, 0];
    for (let index = 0; index < count; index++) {
      const item = locations[index];
      const palette=cityArchetypes[item.archetype];
      matrix.makeScale(item.width, item.height, item.depth);
      matrix.setPosition(item.x, item.height / 2, item.z);
      const form = cityFormIndex(item.archetype), body = bodies.current[form], formIndex = formCounts[form]++;
      body?.setMatrixAt(formIndex, matrix);
      body?.setColorAt(formIndex, new Color(palette.body));
      const roofHeight = item.style === 2 ? 0.20 : 0.11;
      matrix.makeScale(item.width + 0.13, roofHeight, item.depth + 0.13);
      matrix.setPosition(item.x, item.height + roofHeight / 2 - 0.035, item.z);
      roof.setMatrixAt(index, matrix);
      roof.setColorAt(index,new Color(palette.roof));
      // Low shop awnings, residential balcony bands, and office rooftop equipment.
      matrix.makeScale(item.style === 2 ? item.width * 0.35 : item.width * 0.85, item.style === 2 ? 0.3 : 0.1, item.style === 2 ? item.depth * 0.3 : 0.35);
      matrix.setPosition(item.x, item.style === 2 ? item.height + 0.2 : item.style === 1 ? item.height * 0.55 : 0.8, item.style === 2 ? item.z : item.z + item.depth / 2 + 0.15);
      detail.setMatrixAt(index, matrix);
      detail.setColorAt(index, new Color(palette.accent));
    }
    let paneIndex = 0,litPaneIndex=0;
    for (const item of windows) {
      if (item.buildingIndex >= count) continue;
      rotation.setFromAxisAngle(new Vector3(0, 1, 0), item.angle);
      pos.set(item.x, item.y, item.z);
      scale.set(item.width, 0.3, 0.014);
      matrix.compose(pos, rotation, scale);
      const target=item.lit?litPanes.current:glass,index=item.lit?litPaneIndex++:paneIndex++;
      target?.setMatrixAt(index, matrix);
      target?.setColorAt(index, new Color(night ? item.lit ? environmentTokens.lampWarm : tokens.color.brand.navy : item.lit ? "#93b0ba" : "#65899a"));
    }
    let architectureIndex = 0, canopyIndex = 0;
    for (const item of cityDetails) if (item.buildingIndex < count) {
      matrix.makeScale(...item.size).setPosition(...item.position);
      const target = isCurvedCanopy(item.role) ? canopies.current : architecture.current;
      const index = isCurvedCanopy(item.role) ? canopyIndex++ : architectureIndex++;
      target?.setMatrixAt(index, matrix);
      target?.setColorAt(index, new Color(item.color));
    }
    if (architecture.current) { architecture.current.instanceMatrix.needsUpdate = true; architecture.current.computeBoundingSphere(); if (architecture.current.instanceColor) architecture.current.instanceColor.needsUpdate = true; }
    if (canopies.current) { canopies.current.instanceMatrix.needsUpdate = true; canopies.current.computeBoundingSphere(); if (canopies.current.instanceColor) canopies.current.instanceColor.needsUpdate = true; }
    for (const mesh of [...bodies.current, roof, glass, detail,litPanes.current]) if(mesh) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; }
  }, [count, night]);
  return <group>
    {cityForms.map((geometry, form) => {
      const members = locations.slice(0, count).filter(item => cityFormIndex(item.archetype) === form);
      return <instancedMesh key={form} ref={mesh => { bodies.current[form] = mesh; }} args={[geometry, bodyMaterial, members.length]} castShadow={!mobile} receiveShadow onClick={event => { const building = members[event.instanceId ?? -1]; if (building?.style === 0) { event.stopPropagation(); useWorldStore.getState().selectDistrictBuilding(building.id); } }} />;
    })}
    <instancedMesh ref={roofs} args={[cityRoof, roofMaterial, count]} />
    <instancedMesh ref={panes} args={[unitBox, glassMaterial, paneCount]} material={night?nightGlass:glassMaterial} />
    <instancedMesh ref={litPanes} args={[unitBox, glassMaterial, litPaneCount]} material={night?nightLitGlass:glassMaterial} />
    <instancedMesh ref={details} args={[cityTrim, roofMaterial, count]} />
    <instancedMesh ref={architecture} args={[cityTrim, roofMaterial, architectureCount]} />
    <instancedMesh ref={canopies} args={[cityCanopy, roofMaterial, canopyCount]} />
    <BuildingPreviewSign/>
  </group>;
}
