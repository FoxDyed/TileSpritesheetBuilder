# Tile Spritesheet Builder

A static GitHub Pages tool for turning individual PNG tiles into Godot-ready
spritesheets, maps, and terrain-layer exports.

Live site: <https://foxdyed.github.io/BlenderTextureExporting/>

## Features

- Work through separate Project, Import, Palette, Create, Place, Cull, and Export screens while project data stays shared.
- Build projects in isometric diamond, orthographic grid, or top-down grid modes.
- Upload one or more PNG files.
- Crop each incoming PNG with a custom, draggable crop window.
- Set an intermediate crop and continue refining it before adding the tile to the palette.
- Auto-crop transparent margins with anchor workspace and optional symmetric X/Y padding while keeping the result editable.
- Lock crop source scale and nudge or drag tall or wide source images before
  cropping.
- Align manually cropped sprites against a mode-aware grid overlay so oversized art keeps its intended map anchor.
- Import sprite sheets as reusable tile-library entries.
- Manage palette tiles by cloning, renaming, deleting, re-cropping, rotating, flipping, tinting, or making a chosen color transparent.
- Keep palette tiles when project settings change, and save or load a palette as a portable JSON file.
- Save or load a complete project JSON file with settings, palette sprites, layers, and placements.
- Paint layered tile maps, rename or reorder layers, and move placed tiles between empty grid cells.
- Select multiple placements on the active layer and move them together while preserving their relative positions.
- Preview the currently selected or moving tile while working in the placement grid.
- Place cropped tiles onto a custom isometric, orthographic, or top-down grid.
- Erase or replace placed tiles.
- Create transition tiles from palette sprites with editable cut vertices, subgrid snapping, feathering, splatter, noise, and optional decorative top layers.
- Cull placed layers with editable cut paths so larger terrain sets can be trimmed non-destructively before scene or layer export.
- Export placed tiles as a packed transparent PNG spritesheet sorted by grid
  row (`y`) and then column (`x`).
- Export the visible full scene or the selected layer as a transparent PNG.

## Use Locally

Open `index.html` in a browser. No build step or server is required.

## Batch Terrain Sets

For asset packs that already use a directional naming pattern such as
`Ground A1_N.png`, `Ground A1_E.png`, `Ground A1_S.png`, and `Ground A1_W.png`,
use the CLI helper to crop the alpha bounds, build a Godot-ready sheet, and
write a missing-parts report:

```bash
npm run build:terrain-set -- --source "C:\path\to\Environment" --set "Ground A1"
```

By default this creates `<source>\Ground A1 edited` with cropped sprites, a
one-row terrain sheet, and `missing_tiles_report.md`.

To turn every directional `Ground` tile into one terrain sheet with fixed
Godot-friendly cells:

```bash
npm run build:terrain-set -- --source "C:\path\to\Environment" --prefix Ground --tile-size 128x128
```

This creates `<source>\Ground edited` with every cropped sprite, a full terrain
sheet, `ground_terrain_sheet_map.csv`, and `missing_tiles_report.md`.

## Tests

Install dependencies and run the Playwright suite:

```bash
npm install
npm run install:browsers
npm test
```

The tests open the static page, verify custom grid and mode settings, exercise
PNG cropping and grid placement, and inspect exported PNGs.

## GitHub Pages

The repository includes a GitHub Actions workflow that deploys the static app to
GitHub Pages from `main`.

If Pages is not already enabled, set **Settings -> Pages -> Build and deployment
-> Source** to **GitHub Actions**. After the workflow finishes, the app will be
available at <https://foxdyed.github.io/BlenderTextureExporting/>.

## Godot

After export, import the PNG into Godot and slice it using the same tile width
and height that were selected in the app.
