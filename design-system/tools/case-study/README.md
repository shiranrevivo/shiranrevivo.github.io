# Case-study image tools

Small Swift command-line tools for preparing case-study images (macOS only, no PIL / ImageMagick).
Build once per machine: `bash design-system/tools/case-study/build.sh` → binaries in `bin/`.

| Tool | Usage | What it does |
|---|---|---|
| `alpha` | `alpha file …` | Prints size, % transparent pixels and corner alpha. Run it first: is the file already a transparent PNG? |
| `solid` | `solid in out maxW [lo hi]` | **The default for transparent mockups.** Drops soft shadows / haze (alpha < lo=150 → 0, > hi=235 → solid), trims to the device. |
| `lift` | `lift in out maxW [x y w h]` | Vision "lift subject" (like Photos): removes any background, keeps the object. For mockups that only exist on a coloured backdrop. Local, nothing is uploaded. |
| `polish` | `polish in out [sharpen] [feather] [maxW]` | After `lift`: gentle unsharp mask + a soft, feathered edge (no jagged cut, no dark fringe). |
| `crop` | `crop in out x y w h maxW [bx by bw bh …]` | Crops (source pixels, top-left origin) and downsizes. Each `[bx by bw bh]` rect is erased by blending between the rows above and below — removes a slide title that sits on a gradient. |
| `blackkey` | `blackkey in out maxW [lo hi]` | Pure-black backdrop → transparent. **Only** for flat boards (components, UI kit). Never on mockups with dark screens: it punches holes in them. |
| `trim` | `trim in out maxW [x y w h]` | Trims transparent margins (optional pre-crop). |
| `erase` | `erase in out x y w h … [--preview dark.png]` | Makes rectangles fully transparent, e.g. to cut the star out of a logo. `--preview` renders it on a dark background to check white art. |
| `center` | `center in out` | Pads a transparent PNG so its solid part sits in the middle (when a shadow pulls the visual centre aside). |
| `whiten` | `whiten in out` | Turns grey/black (low-saturation) pixels white, keeps coloured pixels and alpha. For a logo whose wordmark is dark (Green Man Gaming, Instant Gaming) so it reads on the dark site. A one-colour black SVG/PDF logo: CSS `filter: invert(1)` instead. |

Preferred order for a mockup: **a transparent original from Shiran → `solid`**. Only if there is none: `lift` from the slide → `polish`.
