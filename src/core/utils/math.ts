import { IRectType } from "../types";
import { Point2d } from "./primitives/Point2d";

export function computRect(rect1?: IRectType, rect2?: IRectType){
    if(rect1 && rect2){
      const x = Math.min(rect1?.x,rect2.x);
      const y = Math.min(rect1?.y,rect2.y);
      const maxX = Math.max(rect1.x+rect1.w, rect2.x+rect2.w); 
      const maxY = Math.max(rect1.y+rect1.h, rect2.y+rect2.h); 
      const w = maxX - x;
      const h = maxY - y;
      return {x,y,w,h}
    }
    return rect2 || rect1;
}
export function getRectFromPoints(points:Point2d[], offset:number = 0) {
  const rect = {x:0, y:0, w:0, h:0};
  let minX = rect.x;
  let minY = rect.y;
  let maxX = rect.x;
  let maxY = rect.y;
  points.forEach(p=>{
    const [x,y] = p.XY;
    minX = Math.min(minX, x - offset);
    minY = Math.min(minY, y - offset);
    maxX = Math.max(maxX, x + offset);
    maxY = Math.max(maxY, y + offset);
  })
  rect.x = minX;
  rect.y = minY;
  rect.w = maxX - minX;
  rect.h = maxY - minY;
  return rect;
}