# OwnTheTop Asset Map

| Family | Location class | Canonical location | Status |
|---|---|---|---|
| Canonical 3D mascot source | Remote 3D artifact | `3d/mascot/REMOTE-SOURCE.json` | READY remotely; not Git-tracked binary |
| Canonical 3D mascot renders | Remote 3D artifact | `3d/mascot/remote-production-renders.json` | READY remotely; exact artifact IDs recorded |
| Flat mascot | Git-tracked | `svg/mascot/ownthetop-mascot-flat.svg` | READY |
| Mascot flat variants / poses | Git-tracked | `svg/mascot/` | READY |
| Wordmark | Git-tracked | `svg/wordmark/ownthetop-wordmark.svg` | READY |
| Logo lockups | Git-tracked | `svg/logo/` | READY |
| App / favicon / social vectors | Git-tracked | `svg/icons/` | READY |
| 16px favicon PNG | Git-tracked | `png/icons/ownthetop-favicon-16.png` | READY, 16×16 RGBA PNG |
| Broader PNG export family | Download-package-only | build ZIP `png/` and `previews/` | READY in build package; not Git-tracked |
| World GLBs: tower / podium / crown | Download-package-only | build ZIP `3d/towers/` | READY in build package; not Git-tracked |
| Environment GLBs | Download-package-only | build ZIP `3d/environment/` | READY in build package; not Git-tracked |
| Aircraft GLBs | Download-package-only | build ZIP `3d/aircraft/` | READY in build package; not Git-tracked |
| Signage GLBs | Download-package-only | build ZIP `3d/signage/` | READY in build package; not Git-tracked |
| Burj internal scene inventory | SOURCE_REQUIRED | user-supplied `.blend` | Internal hierarchy not audited in this runtime |
| Figma | Figma-hosted | `figma/figma-handoff.json` | Link accessible; pre-approved visual system; audit observation recorded |
| Tokens | Git-tracked | `tokens/` | READY: JSON, CSS, TypeScript |
| Website | Git-tracked | `website/` | READY responsive documentation source |

`design-system/v1/` is the sole canonical repository location for Design System V1. The mirrored files under `documentation/` are package-documentation copies and must stay content-synchronized with their canonical root equivalents.
