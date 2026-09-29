# Figma / Engineering Handoff

Canonical Figma file:

https://www.figma.com/design/ye3qSatvvE02DXDr1pAr3d

## Page map

```text
01 Cover
02 Brand
03 Mascot
04 Logo
05 Colors
06 Typography
07 Components
08 Product UI
09 3D World
10 Responsive
11 Motion
12 Documentation
13 Assets
```

## Figma foundations

Local variable collections:
- `OTT / Primitives`
- `OTT / Semantic Colors` — Light / Dark
- `OTT / Metrics`
- `OTT / World State` — Day / Sunset / Night

Text styles:
- Display/XL
- Display/Large
- Display/Medium
- Display/Small
- Title/Large
- Title/Medium
- Title/Small
- Body/Medium
- Body/Small
- Caption/Default
- Caption/Uppercase
- Button/Default
- Navigation/Default
- Metric/Price
- Metric/Rank

## Component map

| Figma component | Node | Suggested React component |
|---|---|---|
| Mascot | `4:122` | `Mascot` / R3F character controller |
| Button | `8:204` | `Button` |
| Input/Website | `8:220` | `WebsiteInput` |
| Badge | `8:239` | `Badge` |
| Card/Feature | `8:337` | documentation/marketing-only `FeatureCard` |
| Ranking/Row | `8:368` | `RankingRow` |
| Floor/Card | `8:414` | `FloorCard` |
| Claim/Form | `8:415` | `ClaimForm` |
| Listing/Profile | `8:446` | `ListingProfile` |

## Figma page frames

Review frames are intentionally separate from main component construction assets so designers can inspect the system without disturbing library components.

- Cover `5:2`
- Brand `6:493`
- Mascot `4:123`
- Logo `6:102`
- Colors `6:563`
- Typography `6:652`
- Components `8:447`
- Product UI `9:26`
- 3D World `10:26`
- Responsive `10:614`
- Motion `10:890`
- Documentation `11:26`
- Assets `11:110`
- Long-form design-system website `15:14`

## Responsive frames

- Desktop `10:618`
- Tablet `10:651`
- Mobile `10:688`
- Behavior rules `10:723`

## Code translation

### DOM

Implement readable names, prices, ranks, buttons, forms, profile drawers, badges and accessibility semantics in React/HTML.

### 3D

Implement geometry, materials, lights, water, tower, aircraft, world events and camera in React Three Fiber / Three.js.

### State

Zustand/application state should coordinate:
- active tower
- selected floor/listing
- claim amount
- predicted rank
- payment status
- realtime rank updates
- world state
- camera focus target
- reduced-motion behavior

### Data

Supabase remains the source for persisted listing/rank data. Razorpay handles permitted payment flows. Payment-confirmed state should not be inferred only from the client.

## Figma naming contract

Recommended production design names:

```text
Button/Primary
Button/Secondary
Button/OnColor
Card/Feature/Blue
Card/Feature/Teal
Card/Feature/Lavender
Card/Feature/Peach
Card/Feature/Gold
Card/Feature/Cream
Ranking/Row
Floor/Card
Claim/Form
Listing/Profile
Badge/Live
Badge/Hiring
Badge/Verified
Mascot/Default
Mascot/Outbid
Mascot/Victory
```

## Implementation order

1. tokens
2. typography
3. low-level buttons/inputs/badges
4. ranking/floor/listing UI
5. claim and payment states
6. realtime state choreography
7. R3F world shell
8. procedural tower/floors
9. environment day/sunset/night
10. mascot animation and #1 celebration
11. performance/LOD pass
12. accessibility and reduced-motion QA

## Validation

Before implementation is considered aligned:
- compare production DOM components against Figma review frames
- confirm CSS values come from token aliases
- confirm world values come from `ownthetop_tokens.ts` / `3d-spec.md`
- confirm gold remains achievement-specific
- confirm sample/demo data is never presented as real data
