# OwnTheTop Usage

## Marketing
Use cream editorial canvases, generous whitespace, a strong OwnTheTop headline hierarchy, 3D/architectural hero art and restrained feature-card colors.

## Product
Keep world visibility dominant. Claim, rank, floor and listing UI must communicate the payment/ranking mechanic immediately. Do not turn the product into a dashboard.

## Assets
- Use `svg/` for logos, icons and flat mascot wherever vector delivery is appropriate.
- Use `png/` for raster exports and marketing/application previews.
- Use `3d/` for generated world objects.
- Use `3d/mascot/remote-production-renders.json` to resolve canonical mascot 3D artifacts until a local mirror is available.

## Engineering
Consume semantic values from `tokens/tokens.json`, `tokens/tokens.css` or `tokens/ownthetop_tokens.ts`. Avoid hardcoding brand values when a token exists.
