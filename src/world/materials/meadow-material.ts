import { Color, MeshStandardMaterial } from "three";
import { environmentTokens } from "../environment/environment-tokens";

function createMeadow(night: boolean) {
  const material = new MeshStandardMaterial({color:"#ffffff",roughness:.96});
  material.onBeforeCompile = shader => {
    shader.uniforms.meadowBase = {value:new Color(night ? environmentTokens.lawnNight : environmentTokens.lawn)};
    shader.uniforms.meadowLush = {value:new Color(night ? "#203e37" : "#5fa85d")};
    shader.uniforms.meadowSun = {value:new Color(night ? "#35594a" : "#91c77a")};
    shader.vertexShader = `varying vec2 meadowPosition;\n${shader.vertexShader}`.replace("#include <begin_vertex>", "#include <begin_vertex>\nmeadowPosition=(modelMatrix*vec4(position,1.0)).xz;");
    shader.fragmentShader = `varying vec2 meadowPosition; uniform vec3 meadowBase; uniform vec3 meadowLush; uniform vec3 meadowSun;\n${shader.fragmentShader}`.replace("#include <color_fragment>", `#include <color_fragment>
      float meadowBlend=sin(meadowPosition.x*.21+sin(meadowPosition.y*.17))*cos(meadowPosition.y*.23)*.5+.5;
      vec3 grass=mix(meadowLush,meadowBase,smoothstep(.05,.6,meadowBlend));
      grass=mix(grass,meadowSun,smoothstep(.65,.98,meadowBlend)*.55);
      diffuseColor.rgb*=mix(meadowBase,grass,.55);
    `);
  };
  material.customProgramCacheKey = () => "ott-meadow-v1";
  return material;
}
/** Two module-owned shared materials; no ground textures, displacement or per-frame uniforms. */
const meadows = [createMeadow(false),createMeadow(true)];
export const meadowMaterial = (night: boolean) => meadows[Number(night)];
