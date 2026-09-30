let cachedSupport: boolean | undefined;

export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return true;
  if (new URLSearchParams(window.location.search).has("fallback2d")) return false;
  if (cachedSupport !== undefined) return cachedSupport;

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cachedSupport = context !== null;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}
