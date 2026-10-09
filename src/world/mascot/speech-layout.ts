export interface SpeechRect { left:number; top:number; right:number; bottom:number }
export function overlaps(a:SpeechRect,b:SpeechRect){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;}
export function placeSpeech(rect:SpeechRect,safe:SpeechRect,obstacles:SpeechRect[]) {
  const width=rect.right-rect.left,height=rect.bottom-rect.top;
  const left=Math.max(safe.left,Math.min(rect.left,safe.right-width));
  let top=Math.max(safe.top,Math.min(rect.top,safe.bottom-height));
  for(const obstacle of obstacles)if(overlaps({left,right:left+width,top,bottom:top+height},obstacle))top=obstacle.top-height-12;
  const placed={left,right:left+width,top,bottom:top+height};
  return {x:left-rect.left,y:top-rect.top,visible:width<=safe.right-safe.left&&top>=safe.top&&!obstacles.some(obstacle=>overlaps(placed,obstacle))};
}
