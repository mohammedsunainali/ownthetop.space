import { ExtrudeGeometry, Shape } from "three";
import { roundedPlanBox } from "./soft-box";

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

/** Four original shared architectural envelopes: soft office, rounded retail, chamfered residential/civic. */
export const cityForms = [bevelledBox, roundedPlanBox(1,1,1,.14), chamferedBlock, roundedPlanBox(1,1,1,.21)];
export const cityFormIndex = (archetype: number) => [0,2,2,1,1,3,1,2][archetype];
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

const gable = new Shape();
gable.moveTo(-.5,-.5); gable.lineTo(.5,-.5); gable.lineTo(0,.5); gable.closePath();
export const pitchedCityRoof = new ExtrudeGeometry(gable,{depth:1,bevelEnabled:false,steps:1});
pitchedCityRoof.translate(0,0,-.5);
export const hasPitchedRoof = (archetype:number, style:number) => style === 0 && [1,2,6].includes(archetype);
export const cityBodyHeight = (height:number, archetype:number, style:number) => height - (hasPitchedRoof(archetype,style) ? .38 : 0);
