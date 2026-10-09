import { MeshBasicMaterial, PlaneGeometry } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RECTANGULAR_TOWER } from "./rectangular-layout";
import { SIDE_AD, SIDE_FACES } from "./side-signs";

// Sampled approved day backing (#0d284a); unlit so new sun/reflections cannot recolor transparent artwork.
export const advertisementBackingMaterial = new MeshBasicMaterial({ color: "#0d284a", toneMapped: false });
const planes = [0,Math.PI].map(angle => new PlaneGeometry(RECTANGULAR_TOWER.clearWidth,RECTANGULAR_TOWER.clearHeight)
  .rotateY(angle).translate(0,0,(angle === 0 ? 1 : -1) * (RECTANGULAR_TOWER.facadeZ - .002)));
for (const face of SIDE_FACES) planes.push(new PlaneGeometry(SIDE_AD.worldWidth,SIDE_AD.worldHeight)
  .rotateY(face.angle).translate(face.x - Math.sign(face.x) * .002,0,0));
export const advertisementBackplates = mergeGeometries(planes)!;
planes.forEach(geometry => geometry.dispose());
