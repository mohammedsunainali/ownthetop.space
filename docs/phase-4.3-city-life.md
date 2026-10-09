# Phase4.3 city-life refinement

Local implementation, awaiting complete visual/manual acceptance. No commerce, asset downloads or additional physics dependencies.

## Controlled ring road

`traffic-flow.ts` owns deterministic vehicle phases, bounded acceleration/braking, same-lane clearance and two signal-controlled crossings. `TrafficCrossings.tsx` places zebra stripes, stop lines and visible signal lamps on the actual inner ellipse at x±27,z0. The outer grid junctions remain decorative: this implementation does not claim that vehicles drive those streets or obey signals there.

Vehicles stop before crossings during amber/red. Pedestrians wait through vehicle green/amber and a clearance interval before crossing during red, alternating direction each cycle. Pure tests sample multiple cycles for headway and pedestrian signal compliance. Camera sightlines and tower geometry are unchanged; new crossing poles are only1.1world units high outside tower approaches.

`CityLife.tsx` retains14desktop/7mobile vehicles with shared instanced bodies/cabins/wheels/lights and one callback. Six bounded silhouettes distinguish car, compact, bus, truck, van and scooter; scooters have procedural riders. Seeded amber/terracotta/lavender/teal colors. These are lightweight silhouettes, not detailed imported models. Spacing uses actual model length. Local+Z body/headlamp axis follows route tangent. No per-frame React state or per-vehicle Vector3 allocation for scaling.

## People

Shared torso/head/limb instances add walking arm/leg swing, varied clothing and two crossing residents. Garden seating uses a seated leg pose; reduced motion freezes decorative life. These are original procedural stylized people, not downloaded or copied characters. Grounding, waiting, seated pose and motion quality still require production visual acceptance.

## Remaining

Detailed vehicle refinement, outer-road traffic, richer interactions, garden detailing, eight complete massing geometries and matched final performance remain pending. No flyover: safe functional entry/exit routes and composition benefit are not established.
