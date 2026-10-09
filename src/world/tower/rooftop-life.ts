export function swimmerPose(seconds: number) {
  const phase = seconds * 0.15;
  return { x: 1.4 + Math.sin(phase) * 0.68, z: 1.8 + Math.sin(phase * 2) * 0.19,
    rotation: Math.atan2(Math.cos(phase) * 0.68, Math.cos(phase * 2) * 0.38) };
}
/** Furniture-free interior lane; pauses face the glazing rather than gliding continuously. */
export function showroomResidentPose(seconds: number) {
  const phase = (seconds % 18 + 18) % 18;
  const walking = phase < 6 || phase >= 9 && phase < 15;
  const x = phase < 6 ? -1.75 + phase * 1.3 / 6 : phase < 9 ? -0.45 : phase < 15 ? -0.45 - (phase - 9) * 1.3 / 6 : -1.75;
  return { x, y: 0.31, z: -0.32, rotation: walking ? phase < 6 ? Math.PI / 2 : -Math.PI / 2 : 0, stride: walking ? Math.sin(seconds * 7) * 0.4 : 0 };
}
