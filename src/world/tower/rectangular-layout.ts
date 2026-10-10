/** Shared physical contract; signage, structure, camera and rooftop derive here. */
export const RECTANGULAR_TOWER = {
  width: 6.8, depth: 4.4, clearWidth: 6.4, clearHeight: 1.2,
  floorHeight: 1.2, pitch: 1.35, slabHeight: 0.15,
  podiumHeight: 0.72, roofWidth: 7.8, roofDepth: 6.6, roofHeight: 3.8,
  facadeZ: 2.225,
} as const;
export const RECTANGULAR_AD = {
  width: 2048, height: 384, margin: 48, logo: { x: 48, y: 64, size: 256 },
  identityX: 340, identityRight: 1640, hiringIdentityRight: 1240,
  statsLeft: 1660, statsRight: 2000, nameSize: 94, nameMinimum: 70,
  subtitleSize: 46, subtitleMinimum: 40, statsSize: 96, statsMinimum: 48,
  hiring: { x: 1.30, y: -0.23, z: 0.16, width: 1.04, height: 0.28, mountY: 0.52 },
} as const;
