# OwnTheTop Design System V1

**Product:** OwnTheTop.space  
**Tagline:** Claim your space. Own the top.  
**Status:** production V1 handoff

## Overview
OwnTheTop is a live 3D competitive skyline. One paid listing is one floor. Higher cumulative payment means higher rank; higher rank means higher physical placement and more visibility.

`PAY → RANK → FLOOR → HEIGHT → VISIBILITY → OWN THE TOP`

The product is ambitious, playful, premium, internet-native, architectural, competitive, optimistic, slightly cheeky, highly visual and 3D-first. It is not luxury real estate, crypto, banking, aerospace, a generic SaaS dashboard, a children's game or cyberpunk.

## Brand
The locked identity is the **Skyline / Summit mascot**. The rounded light body carries a deep-navy visor, simple expressive eyes, blue architectural peaks, a central gold summit, rounded blue side appendages and small feet. The summit represents **the top**. The skyline represents climb, city, visibility and ascent.

Reference images remain reference-only. Production mascot derivatives come from the canonical 3D master or from intentional vector geometry based on the approved canonical silhouette.

## Mascot
The canonical editable 3D source is the 3D Jutsu project `d106d253-ecae-43de-933d-946c322d6c53`, revision 3. Its verified scene contains semantic geometry for body, lower body, navy visor, two eyes, five skyline peaks, a gold summit, two side appendages and two feet. The Blender and GLB artifacts are real and non-empty. Turnarounds, ten pose renders and dark/white/monochrome renders were generated from this same source.

The local package also contains a genuine flat vector interpretation built from vector geometry, plus flat pose derivatives for lightweight UI/editorial use. Flat pose PNGs have `-flat` in their filenames so they are never confused with the canonical 3D pose renders.

## Logo
The brand spelling is always **OwnTheTop**. The logo system uses one canonical mascot mark plus one outlined OwnTheTop wordmark. Production SVGs contain vector paths and no embedded raster images. The wordmark SVG is outlined, not font-dependent live text.

Supported lockups: Primary, Horizontal, Stacked, Mascot, Wordmark, Dark, White and Monochrome.

## Color
| Role | Hex | Meaning |
|---|---|---|
| Deep Navy | `#0D1B3D` | authority, ranking, depth |
| Primary Blue | `#1677E8` | world, skyline, climb |
| Sky Blue | `#3FA9F5` | atmosphere and visibility |
| Light Blue | `#8ACBFF` | atmospheric support |
| Summit Gold | `#FFC43D` | top, #1, achievement |
| Soft White | `#F8FAFD` | mascot, clarity |
| Pure White | `#FFFFFF` | high-contrast surface |
| Cream | `#FFF9F0` | editorial canvas |
| Teal | `#35C7A4` | realtime/live |
| Lavender | `#AFA2F5` | discovery |
| Peach | `#FFB084` | community |
| Coral | `#FF6B5A` | alerts/outbid accent |

## Typography
The V1 production-safe type system uses **Inter** for UI/body and an Inter-derived display treatment when a licensed rounded display family is unavailable. Display sizes are 72 / 56 / 40 / 32 px around weight 500, with negative letter spacing. UI/body sizes are 24 / 18 / 16 / 16 / 14 / 13 / 12 px as defined in `tokens/tokens.json`.

## Spacing
4 px base unit. Core spacing values: 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128 px. Major editorial sections use 96 px rhythm on desktop.

## Grid
12 columns, 1280 px maximum content width, 24 px desktop gutter. Desktop margin 64 px, tablet 32 px, mobile 20 px.

## Radius
6 / 8 / 12 / 16 / 24 / 32 / pill. Controls use 12 px by default; content cards 16 px; large feature/3D cards 24 px.

## Elevation
Depth is restrained in the UI. Use hairlines, soft shadows and floating panels sparingly; the 3D world carries most of the visual depth.

## Buttons
Primary is Deep Navy with white text. Secondary is light/cream with navy text and a hairline. OnColor is white on saturated cards. Text is uncontained. Minimum interactive height is 44 px.

## Inputs
Website, Search, Amount, Category and Claim inputs share a 44–49 px control family, 12 px radius, strong focus ring and clear error states. Payment-affecting values must remain DOM-readable.

## Navigation
Marketing/documentation uses a calm cream/white navigation system. Product mode uses a restrained HUD that leaves the world dominant.

## Cards
Feature-card roles translate Clay's structural rhythm into OwnTheTop identity: Blue = Visibility/Skyline, Teal = Realtime/Live, Lavender = Discovery, Peach = Community, Gold = Top/Achievement, Cream = supporting content.

## Ranking
Ranking rows show rank, logo/name, amount and movement. States: Default, Movement, Top1, Top2, Top3, New, Up, Down, Same and Outbid. Gold is reserved for winning/top status.

## Floor
A floor is the physical expression of a listing. Fields: logo, name, rank, price, category and status. States: Card, Selected, Top, Hiring, New and Outbid. Floor reflow should preserve spatial continuity when ranks change.

## Claim
The claim experience answers **WHO OWNS THE TOP?** and contains Website, Category and Amount controls plus Current top, Required amount, Estimated position and Claim CTA. States: Default, Focus, Filled, Error, Loading, Payment and Success.

## Listing
Profile/listing variants are Compact, Standard and Expanded. They include logo, rank, name, price, category, location, description, website, hiring and status.

## 3D World
The world is a premium stylized architectural toy city: atmospheric sky, pale horizon, blue water, original tapered towers, rooftop structures, helipad, aircraft, billboards, clouds, roads and trees. Burj references inform verticality, taper, setbacks, spire and skyline dominance only; the supplied `.blend` was preserved as source material and **its internal object/material/camera data was not inspected in this active runtime**.

The generated local world GLB (`3d/environment/ownthetop-world.glb`) is genuine, parseable geometry composed from the separately generated tower, podium, helipad, signage, trees, clouds and aircraft assets.

## Environment
Sky roles: Deep `#6DBCEB`, Mid `#9EDCF7`, Light `#D8F1FC`, Horizon `#F2F9FC`, Cloud `#FFFFFF`, Water `#8DD4F2`.

## Day / Sunset / Night
The local Day, Sunset and Night PNG boards are rendered from the same generated `ownthetop-world.glb` camera/geometry. Environment and motivated light state change; geometry stays identical.

## Motion
Motion is celebratory but non-blocking: mascot hover/bounce/fly-up, rank movement, floor rise, payment confirmation, construction, #1 celebration, outbid reaction, camera movement and day/night transition. Respect `prefers-reduced-motion` and provide a 2D ranking fallback.

## Responsive
- Mobile `<768`: simplified world, stacked/touch-first controls, bottom-sheet claim/profile behavior, fewer environmental objects.
- Tablet `768–1023`: balanced world/UI with side drawer where space allows.
- Desktop `1024–1439`: full world, ranking, HUD and richer atmosphere.
- Wide `1440+`: cinematic spacing within the same 1280 px editorial content discipline.

## Accessibility
Use 44 px minimum touch targets, explicit focus states, semantic text for rank/payment meaning, sufficient contrast and reduced-motion alternatives. Never encode rank/outbid state by color alone.

## Asset Library
The package is separated into Brand, PNG, SVG, 3D, Figma handoff, Website, Documentation, Tokens and Previews. `asset-manifest.json` is canonical for local file existence and remote canonical mascot artifacts.

## Do / Don't
**Do:** keep one mascot character; keep the gold summit dominant; use atmosphere rather than flat bright-blue UI surfaces; let rank mechanics drive spatial motion; distinguish reference-only material from production assets.  
**Don't:** invent animals/rockets/crowns/robots, embed raster images inside SVGs, rename flat renders as 3D renders, copy the Burj geometry, copy Clay identity, or represent screenshots as production assets.

## Known Gaps
The active environment cannot copy the verified Higgsfield canonical mascot `.blend`, `.glb` or canonical 3D render PNG bytes into `/mnt/data` because the sandbox cannot resolve the signed object-storage host. Those artifacts exist and are indexed with exact operation/artifact IDs, but the complete local ZIP therefore contains provenance pointers rather than duplicated mascot binaries. The Figma file contains the 18-page system and local production vectors/components; the remote canonical 3D mascot raster family could not be injected as image fills in this execution for the same transfer reason.

## Source Audit
See `source-audit.md`. The hierarchy is: approved mascot → approved logo reference → OwnTheTop product decisions → OwnTheTop 3D/Burj-inspired references → Clay system structure → Clay visuals → TopFloor mechanics → general design knowledge.
