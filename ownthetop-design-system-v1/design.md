# OwnTheTop Design System V1

> **Canonical visual source of truth**  
> Claim your space. Own the top.

Figma source: https://www.figma.com/design/ye3qSatvvE02DXDr1pAr3d

## Overview

OwnTheTop is a live 3D competitive skyline. One paid listing equals one floor. Cumulative amount determines rank; rank determines physical altitude; altitude determines visibility.

**Core loop:** `ENTER → CHOOSE → PAY → CLIMB → RISE → BE SEEN → OWN THE TOP`

**Core mechanic:** `PAY → RANK → FLOOR → HEIGHT → VISIBILITY`

The interface must make payment visually meaningful. A successful transaction should change the world, not merely update a database row.

## Brand philosophy

OwnTheTop is ambitious, playful, premium, futuristic, friendly, internet-native and slightly cheeky. It is not luxury real estate, a crypto product, a game, a bank, or an aerospace brand.

Design principle:

> **UI should be quiet. The 3D world should be loud.**

Visual formula:

`WARM CANVAS + BLUE SKYLINE + NAVY UI + SUMMIT GOLD + 3D MASCOT + PLAYFUL COMPETITION`

## Mascot

The approved and locked character is the **Skyline / Summit Mascot**.

Required anatomy:
- rounded light body
- deep navy face visor
- two minimal expressive eyes
- blue architectural peaks
- one central gold summit
- rounded blue side appendages
- small feet

The mascot represents skyline + summit + top + ascent + achievement. Do not replace it with a rocket, eagle, bird, crown or alternate character.

Supported personality: friendly, confident, ambitious, optimistic, playful, slightly cheeky.

Supported launch pose family: Default, Flying, Celebration, Waving, Happy, Thinking, Surprised, Outbid, Victory #1.

## Logo

Primary lockup: `[Mascot] OwnTheTop`.

Brand spelling is always **OwnTheTop**.

Variants:
- horizontal
- stacked
- mascot-only
- wordmark-only
- app icon
- favicon
- social avatar
- monochrome dark
- monochrome white

Minimum mascot size: 24px digital / 12mm print. Use the simplified summit symbol at 16–32px.

Clear space: at least one visor-height around the lockup.

## Color

Primary brand roles:
- Navy `#0D1B3D` — authority, rank, depth
- Blue `#1677E8` — world, climb, active state
- Sky `#3FA9F5` — atmosphere, illustration
- Light Blue `#8ACBFF` — depth and secondary sky
- Summit Gold `#FFC43D` — **the top**, #1 and achievement
- Teal `#35C7A4` — realtime / live
- Lavender `#AFA2F5` — discovery / intelligence
- Peach `#FFB084` — people / community
- Coral `#FF6B5A` — outbid / attention
- Cream `#FFF9F0` — editorial canvas

Gold is semantic, not decorative. Do not turn every CTA gold.

## Typography

Display: **Instrument Sans Medium**.  
UI/body: **Geist**.  
Data: **Geist Mono**.

Display hierarchy: 72 / 56 / 40 / 32. Titles: 24 / 18 / 16. Body: 16 / 14. Caption: 13 / 12.

Use concise copy: “Own the top.” “Who’s climbing?” “Your floor. Your rank.” “You just took #1.”

## Spacing / grid

Base unit: 4px. Core scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128.

- max content width: 1280px
- editorial grid: 12 columns
- major section rhythm: 96px
- hero section padding: 96–144px
- feature-card padding: 24–32px

## Radius

6 / 8 / 12 / 16 / 24 / 32 / pill.

Buttons and inputs: 12px. Content cards: 16px. Feature cards: 24px. Hero artwork: 32px.

## Elevation

Avoid heavy SaaS shadows. Depth comes from world geometry, color contrast, atmospheric perspective and soft 3D shadows. DOM cards use hairlines first; shadows are restrained.

## Buttons

Families: Primary, Secondary, OnColor, Text, Destructive; Gold is restricted to #1 / achievement / claim-top moments.

Minimum target: 44px.

## Inputs

Website input, amount input, search, category selector, profile input and claim form use 12px radius and 44–48px height. Required states: default, focused, filled, error, disabled, loading.

## Navigation

Recommended launch navigation: Product, How it works, Explore, Rankings, About. Right side: Sign in, Claim a floor.

Keep navigation sparse.

## Cards

Feature-card semantic rhythm:
- Blue — Skyline / Visibility
- Teal — Realtime / Live
- Lavender — Discovery / Intelligence
- Peach — Community / People
- Gold — Top / Rank / Achievement
- Cream — Supporting information

Do not repeat the same saturated card color consecutively in editorial sequences.

## Ranking

Rank components show amount, rank, floor, movement, category and status. Required states: up, down, new, same, #1, outbid.

Movement must not rely on color alone.

## Floor

Floor hierarchy: **Rank + Name + Amount**. Everything else is secondary.

Launch floor states: Standard, #1, Selected, Hiring, New, Featured, Newly claimed, Recently outbid, Empty, Construction.

## Claim

The reusable claim system must make these facts obvious before checkout:
- current top
- user amount
- expected position
- required amount
- actual amount charged
- what the user receives

Example: `Current top: $99` / `You need $100 to take #1.`

Existing tenant upgrades pay only the difference.

## Payment success

Signature sequence:

`Payment → Construction → Floor appears → Floor rises → Ranks reorder → Tower updates → Mascot celebrates`

At #1, the camera rises, the crown/top region highlights, the environment briefly focuses and the message reads **YOU OWN THE TOP.**

## Profile / listing

Launch profile fields: logo, rank, name, amount, category, location, description, hiring, website. Founder/contact may appear when product data supports them.

## 3D world

The world is a premium stylized architectural toy world, not a meadow and not photoreal Dubai.

Modules: TowerBase, Podium, Core, WingA/B/C, FloorStack, Setback, Crown, Spire, Helipad, Rooftop, Billboard, Facade, WindowModule.

Environmental family: hero tower, companion buildings, water, roads, trees, clouds, aircraft, helicopter, drone, billboards, helipad and tower sign.

The uploaded Burj reference informs verticality, tapering, setbacks and spire logic. OwnTheTop geometry remains original.

## Mascot 3D

Soft rounded geometry, subtle bevels, satin/plastic material, gentle AO, clean studio highlights, minimal texture noise. Avoid chrome, photorealism and cheap toy gloss.

## Environment / day-night

World states: Day, Sunset, Night. They use identical geometry and interpolate sky, ambient/directional light, water, windows, clouds, aircraft lights, signage and mascot highlight.

Do not hard-cut the world state.

## Motion

Durations: 80ms fast, 160ms standard, 240ms emphasis, 420ms world, 720ms celebration.

Motion explains state first and adds delight second. Reduced-motion mode replaces large travel with immediate state changes plus restrained opacity/scale feedback.

## Responsive

- Mobile `<768`: single column, simplified 3D, reduced DPR, fewer environmental objects, bottom controls, bottom-sheet profiles.
- Tablet `768–1024`: balanced scene + controls.
- Desktop `1024–1440`: full scene + navigation + side drawers.
- Wide `>1440`: cinematic world; content remains capped at 1280px.

## Accessibility

- 44px minimum touch targets
- keyboard navigation
- visible focus states
- semantic labels
- reduced motion
- non-color rank indicators
- screen-reader compatible DOM for names, ranks and prices
- 2D fallback for WebGL failure

## Asset library

Never label a GLB, audio file, screenshot or production model as READY unless it exists. Use:
- **READY** — real artifact exists
- **PROPOSED** — implementation-ready specification
- **SOURCE REQUIRED** — production source is unavailable

## Do / don’t

Do preserve the mascot, summit, visor, blue skyline hierarchy and gold semantic meaning. Do keep product UI restrained. Do use product UI fragments inside editorial visual cards.

Do not drift into generic SaaS, fintech, gaming, cyberpunk, rainbow branding or photoreal 3D. Do not copy TopFloor’s fox, UI, tower geometry or visual assets. Do not copy Clay branding, copy, mascots or product UI.

## Known gaps

- Production GLB/GLTF exports require a 3D-capable build pipeline.
- The provided `.blend` file must be internally inspected by Blender before its scene hierarchy can be documented as fact.
- Production audio is specification-only until licensed/original files are produced.
- No demo metric is to be presented as real product data.
