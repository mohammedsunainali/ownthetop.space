import type { Vector3Tuple } from "three";

// The approved mascot GLB is not physically present. This boundary intentionally renders nothing.
export function MascotSlot({ position: _position }: { position: Vector3Tuple }) {
  void _position;
  return null;
}
