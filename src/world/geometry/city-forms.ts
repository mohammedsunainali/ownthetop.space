import { ExtrudeGeometry, Shape } from "three";
import { softBox } from "./soft-box";

const chamfer = new Shape();
chamfer.moveTo(-0.36, -0.48);
for (const [x, z] of [[0.36,-0.48],[0.48,-0.36],[0.48,0.36],[0.36,0.48],[-0.36,0.48],[-0.48,0.36],[-0.48,-0.36],[-0.36,-0.48]]) chamfer.lineTo(x,z);
const chamferedBlock = new ExtrudeGeometry(chamfer, { depth: 0.96, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1, steps: 1 });
chamferedBlock.rotateX(-Math.PI / 2).translate(0, -0.48, 0);
const rectangle = new Shape();
rectangle.moveTo(-.48,-.48);
rectangle.lineTo(.48,-.48); rectangle.lineTo(.48,.48); rectangle.lineTo(-.48,.48); rectangle.closePath();
const bevelledBox = new ExtrudeGeometry(rectangle, { depth: .96, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 1, steps: 1 });
bevelledBox.rotateX(-Math.PI / 2).translate(0,-.48,0);

/** Three original shared architectural envelopes: soft office, rounded retail, chamfered residential/civic. */
export const cityForms = [bevelledBox, softBox(1,1,1,0.075), chamferedBlock];
export const cityFormIndex = (archetype: number) => [0,2,2,1,1,0,1,2][archetype];
export const cityRoof = bevelledBox;
export const cityTrim = bevelledBox;
const canopySection = new Shape();
canopySection.moveTo(-.5,-.5);
canopySection.quadraticCurveTo(-.5,.5,0,.5);
canopySection.quadraticCurveTo(.5,.5,.5,-.5);
canopySection.lineTo(.4,-.5);
canopySection.quadraticCurveTo(.4,.35,0,.35);
canopySection.quadraticCurveTo(-.4,.35,-.4,-.5);
canopySection.closePath();
export const cityCanopy = new ExtrudeGeometry(canopySection,{depth:1,bevelEnabled:false,curveSegments:4,steps:1});
cityCanopy.translate(0,0,-.5).rotateY(Math.PI/2);
export const isCurvedCanopy = (role: string) => ["retail-canopy","shop-awning","cafe-canopy"].includes(role);
