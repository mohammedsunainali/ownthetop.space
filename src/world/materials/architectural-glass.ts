import { MeshStandardMaterial } from "three";

/** An inset painted surround on secondary panes. No texture, extra mesh or advertisement shader change. */
export const architecturalGlass = new MeshStandardMaterial({ color: "#ffffff", metalness: 0.22, roughness: 0.3 });
architecturalGlass.onBeforeCompile = shader => {
  shader.vertexShader = "varying vec2 paneUv;\n" + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace("#include <uv_vertex>", "#include <uv_vertex>\npaneUv = uv;");
  shader.fragmentShader = "varying vec2 paneUv;\n" + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
    float edgeDistance = min(min(paneUv.x, 1.0-paneUv.x), min(paneUv.y, 1.0-paneUv.y));
    float surround = 1.0-smoothstep(0.035,0.07,edgeDistance);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.58,0.64,0.66), surround*0.65);`);
};
architecturalGlass.customProgramCacheKey = () => "ott-inset-secondary-pane-v1";
