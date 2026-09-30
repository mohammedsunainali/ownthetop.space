import { useLayoutEffect, useRef } from "react";
import { BoxGeometry, Color, InstancedMesh, Matrix4, MeshStandardMaterial } from "three";
import { tokens } from "@/design/tokens";

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshStandardMaterial({ color: tokens.color.brand.lightBlue, metalness: 0.25, roughness: 0.5 });
const locations = Array.from({ length: 34 }, (_, index) => {
  const angle = index * 2.39996;
  const radius = 15.5 + (index % 4) * 1.65;
  return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, height: 1.3 + (index * 7 % 10) * 0.44 };
});

export function CompanionSkyline({ mobile, night }: { mobile: boolean; night: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const count = mobile ? 18 : locations.length;
  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new Matrix4();
    const color = new Color();
    for (let index = 0; index < count; index++) {
      const item = locations[index];
      matrix.makeScale(1 + index % 3 * 0.35, item.height, 1 + index % 2 * 0.4);
      matrix.setPosition(item.x, item.height / 2, item.z);
      ref.current.setMatrixAt(index, matrix);
      color.set(index % 3 === 0 ? tokens.color.brand.lavender : index % 3 === 1 ? tokens.color.brand.lightBlue : tokens.color.brand.softWhite);
      ref.current.setColorAt(index, color);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [count]);
  return <instancedMesh ref={ref} args={[geometry, material, count]} frustumCulled castShadow={!mobile} material-emissive={night ? tokens.color.brand.blue : tokens.color.brand.navy} material-emissiveIntensity={night ? 0.11 : 0} />;
}
