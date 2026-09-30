# Repository placement

Recommended integration into the existing OwnTheTop app (do not replace the established architecture):

```text
app/
  (world)/page.tsx
components/
  brand/
  claim/
  hud/
  profile/
  world/
lib/
  ranking/
  payments/
  realtime/
styles/
  tokens.css
public/
  brand/
  icons/
  3d/
  textures/
  audio/
docs/
  design.md
  3d-spec.md
```

1. Copy `tokens.css` into the app styles layer and preserve token names.
2. Copy SVG assets to `public/brand` / `public/icons`.
3. Copy GLBs to `public/3d` and texture utilities to `public/textures`.
4. Keep listing/rank calculation in domain logic, never inside the 3D component tree.
5. `WorldScene` consumes normalized rank data; it does not compute payment totals.
6. Use Supabase realtime to invalidate/refetch authoritative rank state; reconcile movement by stable listing ID.
7. Razorpay success client callbacks are not authoritative; wait for backend verification/webhook persistence before committing world state.
