import {useMemo,useEffect} from "react";
import {CanvasTexture,SRGBColorSpace} from "three";
import {useWorldStore} from "@/state/world-store";
import {districtBuilding} from "./district-inventory";
/** One ephemeral owned texture; never presents a preview as sponsorship. */
export function BuildingPreviewSign(){
  const id=useWorldStore(state=>state.selectedDistrictBuildingId),name=useWorldStore(state=>state.districtPreviewName),mode=useWorldStore(state=>state.cameraMode);
  const texture=useMemo(()=>{if(!name)return null;const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;const context=canvas.getContext("2d");if(context){context.fillStyle="#FFF9F0";context.fillRect(0,0,1024,256);context.fillStyle="#0D1B3D";context.textAlign="center";context.font="700 68px Montserrat, sans-serif";context.fillText(name,512,105,960);context.font="500 36px Montserrat, sans-serif";context.fillText("UNPAID DEMO PREVIEW",512,195,960);}const media=new CanvasTexture(canvas);media.colorSpace=SRGBColorSpace;return media;},[name]);
  useEffect(()=>()=>texture?.dispose(),[texture]);
  const building=districtBuilding(id);if(mode!=="districtBuilding"||!building||!texture)return null;
  return <mesh position={[building.position[0],.9,building.position[2]+building.geometry.depth/2+.03]}><planeGeometry args={[Math.min(2.5,building.geometry.width*.9),.625]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
