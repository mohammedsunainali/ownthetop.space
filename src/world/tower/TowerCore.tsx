interface TowerCoreProps {
  height: number;
  glass: string;
}

export function TowerCore({ height, glass }: TowerCoreProps) {
  return (
    <mesh position={[0, height / 2 + 0.45, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.72, 1.05, height, 6]} />
      <meshStandardMaterial color={glass} roughness={0.27} metalness={0.18} transparent opacity={0.58} />
    </mesh>
  );
}
