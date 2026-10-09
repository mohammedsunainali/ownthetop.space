import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BackSide, Color, Group, Vector3 } from "three";

export function celestialDirection(time: "day" | "sunset" | "night"): [number, number, number] {
  return time === "sunset" ? [-12, 11, 6] : [11, 18, 12];
}
/** Cheap camera-centered sky gradient; horizon agrees with the world's fog color. */
export function SkyAtmosphere({ time, upper, horizon }: { time: "day" | "sunset" | "night"; upper: string; horizon: string }) {
  const sky = useRef<Group>(null);
  const position = new Vector3(...celestialDirection(time)).normalize().multiplyScalar(180);
  useFrame(({ camera }) => { sky.current?.position.copy(camera.position); });
  return <group ref={sky}>
    <mesh renderOrder={-100}>
      <sphereGeometry args={[195, 24, 16]} />
      <shaderMaterial side={BackSide} depthWrite={false} toneMapped={false}
        uniforms={{ upper: { value: new Color(upper) }, horizon: { value: new Color(horizon) } }}
        vertexShader={"varying vec3 skyDirection; void main(){skyDirection=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"}
        fragmentShader={"uniform vec3 upper; uniform vec3 horizon; varying vec3 skyDirection; void main(){float height=smoothstep(-0.08,0.35,normalize(skyDirection).y); gl_FragColor=vec4(mix(horizon,upper,height),1.0);\n#include <colorspace_fragment>\n}"} />
    </mesh>
    <mesh position={position} renderOrder={-90}>
      <sphereGeometry args={[time === "night" ? 2 : 2.7, 16, 12]} />
      <meshBasicMaterial color={time === "night" ? "#dae6f3" : time === "sunset" ? "#ffe0ae" : "#fff6d2"} toneMapped={false} depthWrite={false} />
    </mesh>
  </group>;
}
