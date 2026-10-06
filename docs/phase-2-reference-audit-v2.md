# Phase 2.1 public reference audit

This audit records only publicly observable behavior from TopFloor.Company and the supplied screenshots. The implementation uses original OwnTheTop geometry, code, procedural assets, copy, and Design System V1 tokens. No TopFloor source, model, texture, character, audio, or artwork was copied or hotlinked.

## Interaction and composition observations

### Reference: public landing experience and supplied overview images

**Observation:** A world-first composition keeps the ranked building as the main spatial object. Claim controls remain available without replacing the 3D scene. Moving into tower exploration reduces competing interface weight.

**OwnTheTop decision:** Preserve the merged Phase 2 skyline and progressive HUD collapse. Keep a restore action for claim controls and retain the existing three-tower category model.

### Reference: public tower traversal

**Observation:** Close exploration benefits from distinct orbit, vertical travel, and zoom gestures. A floor becomes useful when its identity remains readable while travelling through the tower.

**OwnTheTop decision:** Keep vertical wheel/trackpad travel in focused mode, enable OrbitControls zoom, treat Ctrl/Cmd-wheel (including browser trackpad pinch events) as zoom, retain one-finger orbit and two-finger pinch, and keep explicit mobile floor controls.

### Reference: supplied close facade images

**Observation:** The most legible floors use most of the architectural frontage for media, with an image/logo at left, primary identity in the center, and rank/amount at right. Slabs and mullions remain visible around the media.

**OwnTheTop decision:** Make 84% of the usable floor height a premium glass media surface using an 18/58/24 information split. Preserve the OwnTheTop wing form, mullions, slabs, colors, Inter typography, hiring state, and one-listing/one-floor mapping.

### Reference: supplied tall-tower and mid-tower images

**Observation:** Readable information is valuable only near the camera; rendering every label at once would add visual noise and unnecessary DOM/texture work.

**OwnTheTop decision:** Overview renders leader media only. Focused traversal renders at most nine signs around the current rank; selection renders a tighter five-floor window. Other floors retain architectural glass. The CanvasTexture cache is capped at 24 and no per-floor HTML labels are introduced.

### Reference: supplied top-floor images

**Observation:** A transparent top level reads as valuable when furniture, plants, people, structure, and a clear ownership sign are visible through the envelope. The helipad works best as a related shoulder, not as the building itself.

**OwnTheTop decision:** Add an original three-wing transparent sky lounge directly above rank #1, with lounge furniture, plants, stylized occupants, interior light response, and an `OWN THE TOP FLOOR` architectural sign. Keep the corrected crown, spire, and braced shoulder helipad.

### Reference: public sky controls

**Observation:** Day, sunset, and night materially change scene readability and atmosphere. An automatic local-time option is useful when it remains user-controlled.

**OwnTheTop decision:** Add Auto alongside Day/Sunset/Night. First visit stays Day. Auto maps browser-local 06:00–15:59 to Day, 16:00–18:59 to Sunset, and 19:00–05:59 to Night, updating the existing sky, lights, window emissive response, aircraft lights, signs, and water palette.

### Reference: supplied flag and aircraft images

**Observation:** Thin world-space advertising becomes unreadable at common camera distances. Physical double-sided surfaces remain spatially coherent during orbit.

**OwnTheTop decision:** Use a 1.38 × 0.35 high-resolution OwnTheTop pennant and 5.1 × 1.2 physical tow banners with cable, DoubleSide materials, token colors, and restrained procedural motion. No HTML is used for aircraft advertising.

### Reference: supplied character interaction images

**Observation:** A short, anchored speech bubble feels intentional when it points to the character, animates in, and dismisses itself.

**OwnTheTop decision:** Preserve `Bro! Leave me alone.` in a single active Deep Navy glass bubble with a tail, pop entrance, 2.8-second dismissal, and click replay. No third-party character is introduced.

### Reference: public pay-to-rank explanation

**Observation:** The public rules describe payment as ranking power and higher total payment as higher placement, with age as the tie-breaker for equal totals.

**OwnTheTop decision:** Do not change the existing domain/ranking implementation. Rendering continues to consume ranked listings: one listing equals one floor, rank #1 is physically highest, listing count determines tower height, and money never determines floor count.

## Asset and IP decision

All new visible assets are original procedural geometry or locally authored deterministic SVG marks using canonical Design System V1 colors. The supplied TopFloor images are comparison references only. The repository and supplied local asset folders contain no approved canonical OwnTheTop mascot GLB; integration remains `MASCOT GLB — SOURCE_REQUIRED`.

## OwnTheTop Floor Advertising System V2 (recovery branch)

This section supersedes the earlier full-sign-per-face composition, 84% media-height and 24-texture-cache statements above. The approved Burj-inspired footprint, taper, floor height, gaps, setbacks, crown and rank placement are unchanged. One ranked `Listing` still owns exactly one architectural floor. Rendering distributes that listing across facade roles, not duplicate listing objects: one primary identity surface, minimal brand-continuation surfaces, and status/performance surfaces. Every surface selects the same listing ID.

`floor-signs.ts` is the single proportional token and texture-layout source. The usable front and outer-side bays derive from the existing glazing instance dimensions; the inner side segment is excluded before the Y/core junction. Each media surface uses 92% of its usable width, 72% of the clear glazing height and a 0.012-unit z-fighting offset. The front identity has a separate shallow logo plaque, sized to 46% of the bay height with 18% internal image padding; missing/failed images retain the plaque and deterministic initials. Primary text uses measured, bounded shrink-before-ellipsis. Status uses a fixed rank/value block. Hiring exists only when true as a compact teal badge; there is no empty placeholder or dangling paid-floor sign. Rank #1 preserves tower-blue architecture and limits summit gold to rank/value and thin trim. Selection preserves architectural color and uses a fine three-wing edge; hover/selected media brightness is 1.07/1.12 without scale animation.

The facade remains WebGL/CanvasTexture, while the source-backed profile drawer remains DOM/CSS. It displays logo or initials, rank, cumulative amount, category, optional location, description, website, and a valid claimed date. Hiring adds a full-width `HIRING ACTIVELY` header. It does not invent category rank, ownership/payment confirmation, or missing metadata. Claim-content preview feeds the same floor media renderer and does not mutate the ranking domain.

Only the bounded focused window (at most nine detailed listings) receives facade textures. The LRU cache is capped at 56 textures, including role textures and a logo texture, and disposed on eviction or preview replacement. Structural floors remain instanced. The supplied V2 anatomy board is visual direction, not a copied asset. Acceptance requires front and oblique seam checks, selected and rank-#1 checks, hiring/non-hiring/long-name checks, mobile and stress-mode inspection, and renderer measurements; those results must be recorded before approval.

Development-browser renderer snapshots from this recovery pass (calls / triangles / geometries / textures; instantaneous samples, not physical-device FPS): normal overview 601 / 150,294 / 286 / 72; normal focused 249 / 108,802 / 326 / 63; 220-floor overview 572 / 277,254 / 259 / 18; 220-floor focused 143 / 112,240 / 339 / 63. Values vary with visibility and active animation. Captured checks include 375, 390 and 430px layouts, desktop facade/preview, long-name and long-subtitle preview, local PNG upload with monogram fallback, 220-floor mode, and the 2D fallback. Full 360-degree angle and physical-device gesture review remain for manual approval.
