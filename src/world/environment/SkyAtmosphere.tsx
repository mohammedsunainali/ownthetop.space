import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BackSide, Color, Group, Vector3 } from "three";

export function celestialDirection(time: "day" | "sunset" | "night"): [number, number, number] {
  return time === "sunset" ? [-12, 11, 6] : [11, 18, 12];
}
/** Cheap camera-centered sky gradient; horizon agrees with the world's fog color. */
export function SkyAtmosphere({ time, upper, middle, horizon }: { time: "day" | "sunset" | "night"; upper: string; middle: string; horizon: string }) {
  const sky = useRef<Group>(null);
  const position = new Vector3(...celestialDirection(time)).normalize().multiplyScalar(180);
  useFrame(({ camera }) => { sky.current?.position.copy(camera.position); });
  return <group ref={sky}>
    <mesh renderOrder={-100}>
      <sphereGeometry args={[195, 24, 16]} />
      <shaderMaterial side={BackSide} depthWrite={false} toneMapped={false}
        uniforms={{ upper: { value: new Color(upper) }, middle: { value: new Color(middle) }, horizon: { value: new Color(horizon) }, nightSky: {value:time === "night" ? 1 : 0} }}
        vertexShader={"varying vec3 skyDirection; void main(){skyDirection=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"}
        fragmentShader={`uniform vec3 upper; uniform vec3 middle; uniform vec3 horizon; uniform float nightSky; varying vec3 skyDirection;
          void main(){
            vec3 direction=normalize(skyDirection);
            float elevation=direction.y;
            vec3 sky=mix(horizon,middle,smoothstep(-.12,.12,elevation));
            sky=mix(sky,upper,smoothstep(.02,.62,elevation));
            float wisps=smoothstep(.78,.98,sin(direction.x*18.0+direction.z*6.0)*sin(direction.z*15.0-direction.x*4.0));
            sky=mix(sky,horizon,wisps*smoothstep(.02,.15,elevation)*(1.0-smoothstep(.3,.5,elevation))*.13*(1.0-nightSky));
            vec3 cell=floor(direction*190.0);
            float star=fract(sin(dot(cell,vec3(17.13,91.71,43.63)))*43758.54);
            sky+=vec3(.12,.15,.2)*smoothstep(.9985,1.0,star)*smoothstep(.1,.5,elevation)*nightSky;
            gl_FragColor=vec4(sky,1.0);
            #include <colorspace_fragment>
          }` } />
    </mesh>
    <mesh position={position} renderOrder={-90}>
      <sphereGeometry args={[time === "night" ? 2 : 2.7, 16, 12]} />
      <meshBasicMaterial color={time === "night" ? "#dae6f3" : time === "sunset" ? "#ffe0ae" : "#fff6d2"} toneMapped={false} depthWrite={false} />
    </mesh>
  </group>;
}
