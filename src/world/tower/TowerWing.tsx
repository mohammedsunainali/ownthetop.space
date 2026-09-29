interface TowerWingProps {
  angle: number;
  height: number;
  color: string;
}

export function TowerWing({ angle, height, color }: TowerWingProps) {
  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[0, height / 2 + 0.45, 1.15]} castShadow receiveShadow>
        <boxGeometry args={[0.7, height * 0.78, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.12} transparent opacity={0.33} />
      </mesh>
    </group>
  );
}
