import type { ThreeEvent } from "@react-three/fiber";
import type { Listing } from "@/domain/listing";
import { FLOOR_HEIGHT } from "@/world/tower/tower-layout";

interface FloorProps {
  listing: Listing;
  y: number;
  accent: string;
  selected: boolean;
  exploded: boolean;
  onSelect: (listing: Listing) => void;
}

export function Floor({ listing, y, accent, selected, exploded, onSelect }: FloorProps) {
  const radialOffset = exploded ? 0.34 : 0;
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(listing);
  };

  return (
    <group position={[0, y, 0]}>
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle) => (
        <group key={angle} rotation={[0, angle, 0]}>
          <mesh
            position={[0, 0, 1.38 + radialOffset]}
            scale={selected ? [1.08, 1.32, 1.08] : 1}
            castShadow
            receiveShadow
            onClick={handleClick}
          >
            <boxGeometry args={[1.28, FLOOR_HEIGHT, 2.25]} />
            <meshStandardMaterial
              color={selected ? "#ffffff" : accent}
              emissive={selected ? accent : "#000000"}
              emissiveIntensity={selected ? 0.72 : 0}
              metalness={0.22}
              roughness={0.32}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
