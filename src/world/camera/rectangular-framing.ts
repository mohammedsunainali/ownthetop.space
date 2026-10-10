import { Box3, Vector3 } from "three";

/** Classify the actual DOM overlay, independently of the GPU quality breakpoint. */
export function isBottomOverlay(rect: { left: number; right: number }, viewportWidth: number): boolean {
  return rect.left < viewportWidth * 0.2 && rect.right - rect.left > viewportWidth * 0.6;
}

/** Fit actual projected bounds inside a usable viewport, with depth clearance. */
export function fitRectangularBounds(bounds:Box3, direction:Vector3, width:number, height:number, usableWidth:number, usableHeight:number, fov=42, occupiedBounds:readonly Box3[]=[bounds]) {
  const forward=direction.clone().normalize();
  const right=new Vector3(0,1,0).cross(forward).normalize();
  const up=forward.clone().cross(right).normalize();
  const center=bounds.getCenter(new Vector3());
  const tanY=Math.tan(fov*Math.PI/360), tanX=tanY*width/height;
  let distance=0;
  for(const occupied of occupiedBounds)for(const x of [occupied.min.x,occupied.max.x])for(const y of [occupied.min.y,occupied.max.y])for(const z of [occupied.min.z,occupied.max.z]){
    const point=new Vector3(x,y,z).sub(center);
    distance=Math.max(distance,Math.abs(point.dot(right))/(tanX*usableWidth/width)+point.dot(forward),Math.abs(point.dot(up))/(tanY*usableHeight/height)+point.dot(forward));
  }
  return {center,distance:Math.max(4,distance*1.06),right,up,forward};
}
