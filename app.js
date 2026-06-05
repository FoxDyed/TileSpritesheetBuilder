const state = {
  cols: 8,
  rows: 8,
  tileWidth: 128,
  tileHeight: 64,
  spriteWidth: 128,
  spriteHeight: 128,
  tileMode: "isometric",
  exportCols: 8,
  showPlacementGrid: true,
  tiles: [],
  selectedTileId: null,
  tool: "paint",
  createPreviewScale: 1,
  cullPreviewScale: 1,
  layers: [
    {
      id: "layer-1",
      name: "Layer 1",
      visible: true,
      placements: new Map(),
      cull: {
        enabled: false,
        side: "positive",
        points: [],
        cutLines: [],
        activeLineIndex: 0,
        betweenMode: "exclude",
        vertexCount: 5,
        gridDivisions: 8,
        snapToGrid: false,
        vertexMode: false,
        lineMode: "smooth",
        lineWidth: 3,
        vertexRadius: 5,
        feather: 0,
        splatter: 0,
        noise: 0,
        activeVertexIndex: -1,
        drawing: false,
        draggingVertex: false
      }
    }
  ],
  activeLayerId: "layer-1",
  cullLayerId: "layer-1",
  pickedPlacement: null,
  groupSelection: [],
  groupMoveOrigin: null,
  hoverCell: null,
  viewerScale: 1,
  userSetViewerScale: false,
  create: {
    tileAId: "transparent",
    tileBId: "",
    tileCId: "none",
    decorationOpacity: 45,
    decorationBlend: "source-over",
    side: "positive",
    points: [],
    cutLines: [],
    activeLineIndex: 0,
    betweenMode: "exclude",
    vertexCount: 5,
    gridDivisions: 8,
    snapToGrid: false,
    vertexMode: false,
    lineMode: "smooth",
    lineWidth: 3,
    vertexRadius: 5,
    activeVertexIndex: -1,
    draggingVertex: false,
    feather: 6,
    splatter: 18,
    noise: 8,
    drawing: false
  }
};

const viewerZoomLevels = [0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 3, 4];

const els = {
  controlTabs: [...document.querySelectorAll('[role="tab"]')],
  controlTabPanels: [...document.querySelectorAll('[role="tabpanel"]')],
  contextHelp: document.querySelector("#contextHelp"),
  contextHelpTitle: document.querySelector("#contextHelpTitle"),
  contextHelpBody: document.querySelector("#contextHelpBody"),
  contextHelpDetails: document.querySelector("#contextHelpDetails"),
  gridCols: document.querySelector("#gridCols"),
  gridRows: document.querySelector("#gridRows"),
  tileWidth: document.querySelector("#tileWidth"),
  tileHeight: document.querySelector("#tileHeight"),
  spriteWidth: document.querySelector("#spriteWidth"),
  spriteHeight: document.querySelector("#spriteHeight"),
  tileMode: document.querySelector("#tileMode"),
  exportCols: document.querySelector("#exportCols"),
  applySettings: document.querySelector("#applySettings"),
  saveProject: document.querySelector("#saveProject"),
  projectFileInput: document.querySelector("#projectFileInput"),
  projectStatus: document.querySelector("#projectStatus"),
  fileInput: document.querySelector("#fileInput"),
  sheetFileInput: document.querySelector("#sheetFileInput"),
  palette: document.querySelector("#palette"),
  paletteManager: document.querySelector("#paletteManager"),
  savePalette: document.querySelector("#savePalette"),
  paletteFileInput: document.querySelector("#paletteFileInput"),
  palettePreview: document.querySelector("#palettePreview"),
  paletteSelectedName: document.querySelector("#paletteSelectedName"),
  paletteTileName: document.querySelector("#paletteTileName"),
  renameTile: document.querySelector("#renameTile"),
  cloneTile: document.querySelector("#cloneTile"),
  recropTile: document.querySelector("#recropTile"),
  rotateTileLeft: document.querySelector("#rotateTileLeft"),
  rotateTileRight: document.querySelector("#rotateTileRight"),
  flipTileHorizontal: document.querySelector("#flipTileHorizontal"),
  flipTileVertical: document.querySelector("#flipTileVertical"),
  deleteTile: document.querySelector("#deleteTile"),
  tileTintColor: document.querySelector("#tileTintColor"),
  tileTintStrength: document.querySelector("#tileTintStrength"),
  applyTileTint: document.querySelector("#applyTileTint"),
  transparentTileColor: document.querySelector("#transparentTileColor"),
  transparentTileTolerance: document.querySelector("#transparentTileTolerance"),
  makeTileColorTransparent: document.querySelector("#makeTileColorTransparent"),
  createTileA: document.querySelector("#createTileA"),
  createTileB: document.querySelector("#createTileB"),
  createTileC: document.querySelector("#createTileC"),
  createDecorationOpacity: document.querySelector("#createDecorationOpacity"),
  createDecorationBlend: document.querySelector("#createDecorationBlend"),
  createTileName: document.querySelector("#createTileName"),
  createSideUpper: document.querySelector("#createSideUpper"),
  createSideLower: document.querySelector("#createSideLower"),
  createBetweenMode: document.querySelector("#createBetweenMode"),
  createFeather: document.querySelector("#createFeather"),
  createSplatter: document.querySelector("#createSplatter"),
  createNoise: document.querySelector("#createNoise"),
  createVertexCount: document.querySelector("#createVertexCount"),
  createLineSelect: document.querySelector("#createLineSelect"),
  createGridDivisions: document.querySelector("#createGridDivisions"),
  createLineMode: document.querySelector("#createLineMode"),
  createLineWidth: document.querySelector("#createLineWidth"),
  createVertexRadius: document.querySelector("#createVertexRadius"),
  createSnapToGrid: document.querySelector("#createSnapToGrid"),
  createVertexMode: document.querySelector("#createVertexMode"),
  addCreateLine: document.querySelector("#addCreateLine"),
  deleteCreateLine: document.querySelector("#deleteCreateLine"),
  saveCreatePattern: document.querySelector("#saveCreatePattern"),
  createPatternFileInput: document.querySelector("#createPatternFileInput"),
  clearCreateLine: document.querySelector("#clearCreateLine"),
  loadCreatedTile: document.querySelector("#loadCreatedTile"),
  addCreatedTile: document.querySelector("#addCreatedTile"),
  createCanvas: document.querySelector("#createCanvas"),
  createCanvasWrap: document.querySelector("#createCanvasWrap"),
  createZoomOut: document.querySelector("#createZoomOut"),
  createZoomIn: document.querySelector("#createZoomIn"),
  createZoomReset: document.querySelector("#createZoomReset"),
  createZoomScale: document.querySelector("#createZoomScale"),
  createPanLeft: document.querySelector("#createPanLeft"),
  createPanRight: document.querySelector("#createPanRight"),
  createPanUp: document.querySelector("#createPanUp"),
  createPanDown: document.querySelector("#createPanDown"),
  createPanCenter: document.querySelector("#createPanCenter"),
  createPreviewStatus: document.querySelector("#createPreviewStatus"),
  cullLayerSelect: document.querySelector("#cullLayerSelect"),
  cullEnabled: document.querySelector("#cullEnabled"),
  cullSideUpper: document.querySelector("#cullSideUpper"),
  cullSideLower: document.querySelector("#cullSideLower"),
  cullBetweenMode: document.querySelector("#cullBetweenMode"),
  cullVertexCount: document.querySelector("#cullVertexCount"),
  cullLineSelect: document.querySelector("#cullLineSelect"),
  cullGridDivisions: document.querySelector("#cullGridDivisions"),
  cullLineMode: document.querySelector("#cullLineMode"),
  cullLineWidth: document.querySelector("#cullLineWidth"),
  cullVertexRadius: document.querySelector("#cullVertexRadius"),
  cullSnapToGrid: document.querySelector("#cullSnapToGrid"),
  cullVertexMode: document.querySelector("#cullVertexMode"),
  cullFeather: document.querySelector("#cullFeather"),
  cullSplatter: document.querySelector("#cullSplatter"),
  cullNoise: document.querySelector("#cullNoise"),
  addCullLine: document.querySelector("#addCullLine"),
  deleteCullLine: document.querySelector("#deleteCullLine"),
  saveCullPattern: document.querySelector("#saveCullPattern"),
  cullPatternFileInput: document.querySelector("#cullPatternFileInput"),
  clearCullLine: document.querySelector("#clearCullLine"),
  cullCanvas: document.querySelector("#cullCanvas"),
  cullCanvasWrap: document.querySelector("#cullCanvasWrap"),
  cullZoomOut: document.querySelector("#cullZoomOut"),
  cullZoomIn: document.querySelector("#cullZoomIn"),
  cullZoomReset: document.querySelector("#cullZoomReset"),
  cullZoomScale: document.querySelector("#cullZoomScale"),
  cullPanLeft: document.querySelector("#cullPanLeft"),
  cullPanRight: document.querySelector("#cullPanRight"),
  cullPanUp: document.querySelector("#cullPanUp"),
  cullPanDown: document.querySelector("#cullPanDown"),
  cullPanCenter: document.querySelector("#cullPanCenter"),
  cullPreviewStatus: document.querySelector("#cullPreviewStatus"),
  paintTool: document.querySelector("#paintTool"),
  dropTool: document.querySelector("#dropTool"),
  eraseTool: document.querySelector("#eraseTool"),
  groupMoveTool: document.querySelector("#groupMoveTool"),
  groupSelectionInfo: document.querySelector("#groupSelectionInfo"),
  moveSelectedGroup: document.querySelector("#moveSelectedGroup"),
  cancelGroupMove: document.querySelector("#cancelGroupMove"),
  clearGrid: document.querySelector("#clearGrid"),
  showPlacementGrid: document.querySelector("#showPlacementGrid"),
  themeToggle: document.querySelector("#themeToggle"),
  exportButton: document.querySelector("#exportButton"),
  exportMapButton: document.querySelector("#exportMapButton"),
  exportLayerButton: document.querySelector("#exportLayerButton"),
  layerList: document.querySelector("#layerList"),
  layerName: document.querySelector("#layerName"),
  renameLayer: document.querySelector("#renameLayer"),
  moveLayerUp: document.querySelector("#moveLayerUp"),
  moveLayerDown: document.querySelector("#moveLayerDown"),
  addLayer: document.querySelector("#addLayer"),
  deleteLayer: document.querySelector("#deleteLayer"),
  placedCount: document.querySelector("#placedCount"),
  selectedTileName: document.querySelector("#selectedTileName"),
  placementPreview: document.querySelector("#placementPreview"),
  placementPreviewEmpty: document.querySelector("#placementPreviewEmpty"),
  placementPreviewName: document.querySelector("#placementPreviewName"),
  importedTileCount: document.querySelector("#importedTileCount"),
  importGridSize: document.querySelector("#importGridSize"),
  exportTileCount: document.querySelector("#exportTileCount"),
  exportPlacedCount: document.querySelector("#exportPlacedCount"),
  exportLayerCount: document.querySelector("#exportLayerCount"),
  exportGridSize: document.querySelector("#exportGridSize"),
  hoverCell: document.querySelector("#hoverCell"),
  zoomOut: document.querySelector("#zoomOut"),
  zoomIn: document.querySelector("#zoomIn"),
  zoomReset: document.querySelector("#zoomReset"),
  zoomScale: document.querySelector("#zoomScale"),
  gridCanvas: document.querySelector("#gridCanvas"),
  cropDialog: document.querySelector("#cropDialog"),
  cropTitle: document.querySelector("#cropTitle"),
  cropCanvas: document.querySelector("#cropCanvas"),
  cropWidth: document.querySelector("#cropWidth"),
  cropHeight: document.querySelector("#cropHeight"),
  cropPaddingX: document.querySelector("#cropPaddingX"),
  cropPaddingY: document.querySelector("#cropPaddingY"),
  applyCropSize: document.querySelector("#applyCropSize"),
  autoCropVisible: document.querySelector("#autoCropVisible"),
  cropScaleMode: document.querySelector("#cropScaleMode"),
  cropSourceInfo: document.querySelector("#cropSourceInfo"),
  cropNudgePixels: document.querySelector("#cropNudgePixels"),
  nudgeUp: document.querySelector("#nudgeUp"),
  nudgeDown: document.querySelector("#nudgeDown"),
  nudgeLeft: document.querySelector("#nudgeLeft"),
  nudgeRight: document.querySelector("#nudgeRight"),
  cropZoom: document.querySelector("#cropZoom"),
  setCrop: document.querySelector("#setCrop"),
  saveCrop: document.querySelector("#saveCrop"),
  skipCrop: document.querySelector("#skipCrop")
};

const gridCtx = els.gridCanvas.getContext("2d");
const cropCtx = els.cropCanvas.getContext("2d");
const createCtx = els.createCanvas.getContext("2d");
const cullCtx = els.cullCanvas.getContext("2d");
const pendingFiles = [];
let cropState = null;
let tileCounter = 1;

function clampNumber(value, min, max, fallback) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function displayLineWidth(editor) {
  return clampNumber(editor.lineWidth, 1, 16, 3);
}

function displayVertexRadius(editor) {
  return clampNumber(editor.vertexRadius, 3, 32, 5);
}

function updateExportColumns() {
  state.exportCols = clampNumber(els.exportCols.value, 1, 64, state.exportCols);
  els.exportCols.value = state.exportCols;
}

let lastHelpControlId = null;

const tabHelp = {
  projectTab: {
    title: "Project Setup",
    body: "Set the project projection and dimensions before importing or placing tiles. Tile mode controls the grid geometry, cell size controls the editable map cells, and sprite size controls how sheets are sliced and how palette sprites are prepared."
  },
  importTab: {
    title: "Import Sprites",
    body: "Add source PNGs for the palette. Individual PNGs open the crop tool so oversized art can be aligned to the tile anchor; sprite sheets are sliced using the sprite width and height from Project Setup."
  },
  paletteTab: {
    title: "Manage Palette",
    body: "Use this tab to clean up reusable source sprites. Edits here affect the selected palette tile, so clone a tile first when you want an alternate version without changing the original."
  },
  createTab: {
    title: "Create Transitions",
    body: "Create builds a new single palette tile from Tile A, Tile B, optional decorative Tile C, and one or more editable cut lines. Saving adds a new tile to the palette and leaves the original tiles untouched."
  },
  placeTab: {
    title: "Place Sprites",
    body: "Paint palette tiles onto the project grid. The active layer controls where new placements go, while the current tool controls whether clicks paint, move, erase, or select a group."
  },
  cullTab: {
    title: "Cull Layers",
    body: "Cull applies transition-style cut lines across a whole placed layer instead of a single tile. This is useful for trimming large terrain regions while preserving the palette sprites and placement data."
  },
  exportTab: {
    title: "Export",
    body: "Download the finished assets. Sprite sheet export packs the palette, full scene export renders visible layers together, and active layer export renders just the selected layer on a transparent canvas."
  }
};

const controlHelp = {
  tileMode: ["Tile Mode", "Choose the map projection. Isometric draws diamond cells and matching subgrids, orthographic uses angled tile art on a regular grid, and top-down uses square or rectangular cells for overhead projects."],
  gridCols: ["Columns", "Sets how many cells the project grid has from left to right. More columns give more terrain space but increase the exported scene size."],
  gridRows: ["Rows", "Sets how many cells the project grid has from top to bottom. This affects the Place and Cull tabs and the size of scene or layer exports."],
  tileWidth: ["Cell Width", "Controls the logical width of each grid cell. For isometric projects this is the diamond width; for orthographic and top-down projects it is the cell width."],
  tileHeight: ["Cell Height", "Controls the logical height of each grid cell. Isometric cells usually use a height around half the width, while top-down cells often match the width."],
  spriteWidth: ["Sprite Width", "Controls the width used when slicing sprite sheets and preparing imported tiles. It can be larger than the cell width when art needs overhang."],
  spriteHeight: ["Sprite Height", "Controls the height used when slicing sprite sheets and preparing imported tiles. Increase it for tall objects, walls, cliffs, or sprites that extend above the tile anchor."],
  applySettings: ["Apply Settings", "Applies the project dimensions to the working grid. Existing placements are kept where possible, but changing dimensions can alter how the map is displayed and exported."],
  saveProject: ["Save Project", "Downloads a JSON project file with settings, palette tiles, placements, layers, transition recipes, cut lines, cull lines, and effect values so the work can be restored later."],
  projectFileInput: ["Load Project", "Loads a saved project JSON. This restores the whole workspace, including editable line data and layer cull settings."],
  fileInput: ["Add PNGs", "Imports one or more PNG files as palette tiles. Each file opens the crop editor so the image can be aligned to the project sprite size."],
  sheetFileInput: ["Import Sprite Sheet", "Slices a PNG sheet into tiles using the Project tab sprite width and height. Use this when a sheet already has evenly spaced frames."],
  savePalette: ["Save Palette", "Downloads just the palette as JSON. This is useful for reusing source and transition tiles in a different project."],
  paletteFileInput: ["Load Palette", "Adds tiles from a saved palette JSON into the current project without replacing the grid layout."],
  paletteTileName: ["Sprite Name", "Renames the selected palette tile. Clear, descriptive names make Create, Place, and Cull selections easier to manage."],
  renameTile: ["Rename Tile", "Applies the sprite name field to the selected palette tile."],
  cloneTile: ["Clone Tile", "Duplicates the selected palette tile before edits. Use this before tinting, cropping, or transforming when the original should stay available."],
  recropTile: ["Re-crop", "Reopens the crop editor for the selected tile so its anchor, padding, or visible area can be adjusted."],
  rotateTileLeft: ["Rotate Left", "Rotates the selected palette tile 90 degrees counterclockwise."],
  rotateTileRight: ["Rotate Right", "Rotates the selected palette tile 90 degrees clockwise."],
  flipTileHorizontal: ["Flip Horizontal", "Mirrors the selected palette tile from left to right."],
  flipTileVertical: ["Flip Vertical", "Mirrors the selected palette tile from top to bottom."],
  deleteTile: ["Delete Tile", "Removes the selected tile from the palette. Placements that used the tile may no longer render, so save the project first if unsure."],
  tileTintColor: ["Tint Color", "Chooses the color applied by Minimal recolor. Lower strength keeps more of the original sprite detail."],
  tileTintStrength: ["Tint Strength", "Controls how strongly the tint color is blended into the selected tile."],
  applyTileTint: ["Apply Tint", "Applies the selected tint color and strength to the current palette tile."],
  transparentTileColor: ["Remove Color", "Chooses a color to turn transparent in the selected tile. Use tolerance to catch nearby shades."],
  transparentTileTolerance: ["Transparency Tolerance", "Controls how close pixels must be to the remove color before they become transparent."],
  makeTileColorTransparent: ["Make Transparent", "Removes the chosen color from the selected tile, useful for cleaning solid backgrounds."],
  createTileA: ["Tile A", "Selects the under layer for the transition tile. Choose Transparent background when the cut should reveal empty space instead of another tile."],
  createTileB: ["Tile B", "Selects the over layer used on the kept side of the cut. This is the main sprite that blends into Tile A or transparency."],
  createTileC: ["Layer C", "Adds an optional decorative sprite above the transition, such as pebbles, grass flecks, edge debris, or highlight detail."],
  createDecorationBlend: ["Decoration Blend", "Changes how Layer C combines with the transition. Normal preserves the sprite, while multiply, screen, overlay, and soft light can make decoration blend into the materials below."],
  createDecorationOpacity: ["Decoration Opacity", "Controls how visible Layer C is. Lower values make decorative effects subtle; higher values make them read as a clear top layer."],
  createTileName: ["Output Name", "Names the new transition tile that will be added to the palette. The source tiles are not changed."],
  createSideUpper: ["Upper/Left Side", "Keeps or applies Tile B on the upper or left side of the active cut line, depending on the line direction and tile mode."],
  createSideLower: ["Lower/Right Side", "Keeps or applies Tile B on the lower or right side of the active cut line, depending on the line direction and tile mode."],
  createBetweenMode: ["Between Lines", "When multiple cut lines exist, Exclude removes the area between paired lines while Include keeps only the band between them. This makes paths, rivers, cliffs, and layered borders easier to shape."],
  createFeather: ["Feather", "Softens the cut edge by blending pixels across the boundary. Use small values for crisp tile art and larger values for organic terrain."],
  createSplatter: ["Splatter", "Adds irregular speckling around the cut. This helps grass, dirt, gravel, snow, and other natural materials avoid a perfectly clean edge."],
  createNoise: ["Noise", "Adds small random variation along the edge so the transition feels less uniform."],
  createLineSelect: ["Active Line", "Chooses which saved cut line is currently editable. Each line keeps its own vertices and can be adjusted independently."],
  createVertexCount: ["Vertices", "Changes how many editable points the active line has. More vertices allow a more custom shape; fewer vertices are easier to manage."],
  createGridDivisions: ["Subgrid", "Sets the number of snap divisions drawn over the tile. More divisions give finer vertex placement."],
  createLineMode: ["Segment Mode", "Tangent mode draws smoother curved segments through the vertices. Straight mode connects vertices with hard line segments for precise cuts."],
  createLineWidth: ["Line Width", "Controls how thick Create cut lines are drawn in the preview. Increase it when zoomed out or when a line needs to stand out from detailed tile art."],
  createVertexRadius: ["Vertex Size", "Controls the size of the editable vertex circles in the Create preview. Larger vertices are easier to grab when fine tuning complex paths."],
  createSnapToGrid: ["Snap Vertices To Grid", "Snaps moved vertices to the subgrid. This is helpful when matching edges across related transition tiles."],
  createVertexMode: ["Vertex Mode", "When enabled, touching the preview only manipulates existing vertices. Turn it off when you want to draw a new custom line shape."],
  addCreateLine: ["Add Line", "Adds another editable cut line to the transition. Multiple lines can define bands, channels, borders, and more complex masks."],
  deleteCreateLine: ["Delete Line", "Deletes the active cut line while leaving the other saved lines intact."],
  saveCreatePattern: ["Save Pattern", "Downloads the Create tab line pattern as JSON, including vertices, line mode, snap settings, between-line mode, and natural edge effects."],
  createPatternFileInput: ["Load Pattern", "Loads a saved Create pattern so the same transition shape can be reused on other tile pairs."],
  clearCreateLine: ["Reset Line", "Clears the active Create cut line and returns it to a fresh editable state."],
  loadCreatedTile: ["Load Selected", "If the selected palette tile was created here, this restores its saved transition recipe for fine tuning."],
  addCreatedTile: ["Add Transition", "Renders the current transition as a new palette tile. Original Tile A, Tile B, and Tile C stay unchanged."],
  createCanvas: ["Cut Preview", "Draw or edit the active transition line here. Drag vertices to refine the shape; use vertex mode when you only want edits, not a new line."],
  createZoomOut: ["Create Preview Zoom Out", "Zooms the Create preview out so the whole tile is easier to see while editing cut lines."],
  createZoomIn: ["Create Preview Zoom In", "Zooms the Create preview in for more precise vertex and edge work."],
  createZoomReset: ["Create Preview Reset Zoom", "Returns the Create preview to 1:1 scale."],
  createPanLeft: ["Pan Create Left", "Moves the Create preview viewport left without changing the cut line or tile data."],
  createPanRight: ["Pan Create Right", "Moves the Create preview viewport right so off-center cut details can be brought into view."],
  createPanUp: ["Pan Create Up", "Moves the Create preview viewport upward, useful when zoomed in on a tall sprite or upper transition edge."],
  createPanDown: ["Pan Create Down", "Moves the Create preview viewport downward, useful when zoomed in on lower vertices or bottom-edge cuts."],
  createPanCenter: ["Center Create Preview", "Centers the Create preview inside its viewport. Use this after zooming or panning away from the active work area."],
  paintTool: ["Paint Tool", "Places the selected palette tile onto clicked grid cells on the active layer."],
  dropTool: ["Move Tool", "Picks up an existing placement and drops it somewhere else on the active layer."],
  eraseTool: ["Erase Tool", "Removes placements from clicked cells on the active layer."],
  groupMoveTool: ["Select Group", "Selects multiple placed cells so they can be moved together as a terrain block."],
  moveSelectedGroup: ["Move Selected", "Starts moving the current group selection to a new grid position."],
  cancelGroupMove: ["Cancel Selection", "Clears the current group selection or cancels a group move."],
  layerName: ["Layer Name", "Renames the active layer. Layer names appear in Place, Cull, project saves, and layer exports."],
  renameLayer: ["Rename Layer", "Applies the layer name field to the active layer."],
  moveLayerUp: ["Move Up", "Moves the active layer later in the render order so it appears in front of lower layers."],
  moveLayerDown: ["Move Down", "Moves the active layer earlier in the render order so it appears behind higher layers."],
  addLayer: ["Add Layer", "Creates a new empty placement layer. Use layers to separate ground, props, overlays, or alternate terrain passes."],
  deleteLayer: ["Delete Layer", "Deletes the active layer and its placements. Keep at least one layer in the project."],
  clearGrid: ["Clear Grid", "Removes all placements from the active layer."],
  showPlacementGrid: ["Show Placement Grid", "Toggles the grid overlay in the Place tab editor. Turn it on to line up tiles precisely; turn it off when you want an unobstructed editing preview. Exports stay grid-free either way."],
  zoomOut: ["Zoom Out", "Zooms the placement canvas out so more of the grid is visible."],
  zoomIn: ["Zoom In", "Zooms the placement canvas in for more precise editing."],
  zoomReset: ["Reset Zoom", "Returns the placement canvas to 1:1 scale."],
  gridCanvas: ["Placement Grid", "Click the grid with the active tool. Empty cells remain visible, and the grid shape follows the selected project tile mode."],
  cullLayerSelect: ["Cull Layer", "Chooses which placed layer receives the cull lines. The preview mirrors the Place grid so cuts can be aligned to the terrain layout."],
  cullEnabled: ["Enable Layer Cull", "Turns the selected layer's cull mask on or off without deleting the saved lines."],
  cullSideUpper: ["Upper/Left Side", "Keeps the upper or left side of the active cull line visible for the selected layer."],
  cullSideLower: ["Lower/Right Side", "Keeps the lower or right side of the active cull line visible for the selected layer."],
  cullBetweenMode: ["Between Lines", "Controls how multiple layer cull lines combine. Exclude removes the area between lines; Include keeps only the band between lines."],
  cullFeather: ["Cull Feather", "Softens the layer mask edge. This is useful for larger terrain blends where a hard crop would look artificial."],
  cullSplatter: ["Cull Splatter", "Adds irregular breakup to the layer mask edge so large terrain transitions feel more natural."],
  cullNoise: ["Cull Noise", "Adds edge variation to the layer cull, helping repeated grid shapes feel less mechanical."],
  cullLineSelect: ["Active Cull Line", "Chooses which saved cull line is currently editable on the selected layer."],
  cullVertexCount: ["Cull Vertices", "Changes how many editable points the active cull line has."],
  cullGridDivisions: ["Cull Subgrid", "Sets the subgrid divisions across the full visible placement grid. In isometric projects the subgrid follows the isometric grid."],
  cullLineMode: ["Cull Segment Mode", "Tangent mode makes smoother terrain boundaries; Straight mode makes precise angular cuts."],
  cullLineWidth: ["Cull Line Width", "Controls how thick cull lines are drawn across the layer preview. Increase it when editing a large grid or when tile art makes lines hard to see."],
  cullVertexRadius: ["Cull Vertex Size", "Controls the size of editable vertex circles in the Cull preview. Larger handles are easier to grab while working on a zoomed-out terrain grid."],
  cullSnapToGrid: ["Snap Cull Vertices", "Snaps moved cull vertices to the layer subgrid so cuts align cleanly across the tile grid."],
  cullVertexMode: ["Cull Vertex Mode", "When enabled, touching the cull preview only moves existing vertices instead of starting a new line."],
  addCullLine: ["Add Cull Line", "Adds another editable cull line to the selected layer."],
  deleteCullLine: ["Delete Cull Line", "Deletes the active cull line from the selected layer."],
  saveCullPattern: ["Save Cull Pattern", "Downloads the cull line pattern for reuse, including vertices, line settings, between-line behavior, and edge effects."],
  cullPatternFileInput: ["Load Cull Pattern", "Loads a saved cull pattern onto the selected layer."],
  clearCullLine: ["Reset Cull Line", "Clears the active cull line while keeping the layer and other lines available."],
  cullCanvas: ["Layer Preview", "Draw or adjust layer cull lines over the full grid preview. Empty cells remain visible so cuts can be aligned across the project."],
  cullZoomOut: ["Cull Preview Zoom Out", "Zooms the Cull preview out so more of the full grid is visible."],
  cullZoomIn: ["Cull Preview Zoom In", "Zooms the Cull preview in for more precise layer cut editing."],
  cullZoomReset: ["Cull Preview Reset Zoom", "Returns the Cull preview to 1:1 scale."],
  cullPanLeft: ["Pan Cull Left", "Moves the Cull preview viewport left without changing layer placements or cull lines."],
  cullPanRight: ["Pan Cull Right", "Moves the Cull preview viewport right so off-center terrain cuts can be brought into view."],
  cullPanUp: ["Pan Cull Up", "Moves the Cull preview viewport upward while preserving the current zoom."],
  cullPanDown: ["Pan Cull Down", "Moves the Cull preview viewport downward while preserving the current zoom."],
  cullPanCenter: ["Center Cull Preview", "Centers the Cull preview inside its viewport. Use this after zooming into a large grid."],
  exportCols: ["Sprite Sheet Columns", "Sets how many palette sprites appear in each row of the exported sprite sheet."],
  exportButton: ["Export PNG", "Downloads a packed palette sprite sheet using the current column count."],
  exportMapButton: ["Export Full Scene PNG", "Downloads the visible placed layers as one rendered scene PNG."],
  exportLayerButton: ["Export Active Layer PNG", "Downloads only the active layer on a transparent canvas, including any enabled cull mask."]
};

function activeControlTabId() {
  return els.controlTabs.find((tab) => tab.classList.contains("is-active"))?.id || "projectTab";
}

function helpTileName(id, transparentLabel = "Transparent") {
  if (id === "transparent") return transparentLabel;
  if (id === "none") return "None";
  return state.tiles.find((tile) => tile.id === id)?.name || "None selected";
}

function lineSummary(editor) {
  const lineCount = Math.max(1, editor.cutLines?.length || 1);
  return `Line ${Math.min(editor.activeLineIndex + 1, lineCount)} of ${lineCount}`;
}

function tabHelpDetails(tabId) {
  const layer = activeLayer();
  const cull = cullLayer().cull;
  const details = {
    projectTab: [
      ["Mode", `${state.tileMode}; ${state.cols} x ${state.rows} cells`],
      ["Cell", `${state.tileWidth} x ${state.tileHeight}px`],
      ["Sprite", `${state.spriteWidth} x ${state.spriteHeight}px`]
    ],
    importTab: [
      ["Imported", `${state.tiles.length} palette sprite${state.tiles.length === 1 ? "" : "s"}`],
      ["Sheet slicing", `${state.spriteWidth} x ${state.spriteHeight}px per sprite`]
    ],
    paletteTab: [
      ["Selected", selectedTileLabel()],
      ["Palette size", `${state.tiles.length} tile${state.tiles.length === 1 ? "" : "s"}`]
    ],
    createTab: [
      ["Tile A", helpTileName(state.create.tileAId)],
      ["Tile B", helpTileName(state.create.tileBId, "Choose Tile B")],
      ["Layer C", helpTileName(state.create.tileCId)],
      ["Lines", `${lineSummary(state.create)}; ${state.create.betweenMode === "include" ? "include between lines" : "exclude between lines"}`],
      ["Effects", `Feather ${state.create.feather}, splatter ${state.create.splatter}, noise ${state.create.noise}`]
    ],
    placeTab: [
      ["Tool", state.tool],
      ["Active layer", `${layer.name} (${layer.placements.size} placed)`],
      ["Selected tile", selectedTileLabel()]
    ],
    cullTab: [
      ["Layer", `${cullLayer().name}; cull ${cull.enabled ? "enabled" : "disabled"}`],
      ["Lines", `${lineSummary(cull)}; ${cull.betweenMode === "include" ? "include between lines" : "exclude between lines"}`],
      ["Effects", `Feather ${cull.feather}, splatter ${cull.splatter}, noise ${cull.noise}`]
    ],
    exportTab: [
      ["Palette", `${state.tiles.length} imported tile${state.tiles.length === 1 ? "" : "s"}`],
      ["Scene", `${placedTileCount()} placed tile${placedTileCount() === 1 ? "" : "s"} across ${state.layers.length} layer${state.layers.length === 1 ? "" : "s"}`],
      ["Export sheet", `${state.exportCols} column${state.exportCols === 1 ? "" : "s"}`]
    ]
  };
  return details[tabId] || [];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHelpDetails(details) {
  els.contextHelpDetails.innerHTML = details
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function controlBelongsToActivePanel(control) {
  const tab = els.controlTabs.find((item) => item.id === activeControlTabId());
  const panel = tab ? document.querySelector(`#${tab.getAttribute("aria-controls")}`) : null;
  return Boolean(panel && control && panel.contains(control));
}

function updateContextHelp(controlId = lastHelpControlId) {
  if (!els.contextHelp) return;
  const tabId = activeControlTabId();
  const control = controlId ? document.getElementById(controlId) : null;
  const controlInfo = controlBelongsToActivePanel(control) ? controlHelp[controlId] : null;
  const tabInfo = tabHelp[tabId] || tabHelp.projectTab;

  lastHelpControlId = controlInfo ? controlId : null;
  els.contextHelpTitle.textContent = controlInfo ? controlInfo[0] : tabInfo.title;
  els.contextHelpBody.textContent = controlInfo ? controlInfo[1] : tabInfo.body;
  renderHelpDetails(tabHelpDetails(tabId));
}

function handleContextHelpEvent(event) {
  const target = event.target.closest?.("button, input, select, canvas");
  if (!target?.id) return;
  updateContextHelp(target.id);
}

function activateControlTab(tabId, focusTab = false) {
  const activeTab = els.controlTabs.find((tab) => tab.id === tabId);
  if (!activeTab) return;

  for (const tab of els.controlTabs) {
    const isActive = tab === activeTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  }

  for (const panel of els.controlTabPanels) {
    panel.hidden = panel.id !== activeTab.getAttribute("aria-controls");
  }

  updateStats();
  updateContextHelp();
  if (focusTab) activeTab.focus();
}

function handleControlTabKeydown(event) {
  const currentIndex = els.controlTabs.indexOf(event.currentTarget);
  if (currentIndex < 0) return;

  let nextIndex = currentIndex;
  if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % els.controlTabs.length;
  if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + els.controlTabs.length) % els.controlTabs.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = els.controlTabs.length - 1;
  if (nextIndex === currentIndex) return;

  event.preventDefault();
  activateControlTab(els.controlTabs[nextIndex].id, true);
}

function placementKey(x, y) {
  return `${x},${y}`;
}

function activeLayer() {
  return state.layers.find((layer) => layer.id === state.activeLayerId) || state.layers[0];
}

function visibleLayers() {
  return state.layers.filter((layer) => layer.visible);
}

function sortedLayerPlacements(layer) {
  return [...layer.placements.values()].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
}

function placedTileCount() {
  return state.layers.reduce((sum, layer) => sum + layer.placements.size, 0);
}

function allPlacementsSorted() {
  return state.layers.flatMap((layer, layerIndex) => {
    return sortedLayerPlacements(layer).map((placement) => ({ ...placement, layerIndex }));
  });
}

function clearPickedPlacement() {
  state.pickedPlacement = null;
}

function clearGroupSelection() {
  state.groupSelection = [];
  state.groupMoveOrigin = null;
}

function setGridTool(tool) {
  if (!["paint", "drop", "erase", "group"].includes(tool)) return;
  state.tool = tool;
  clearPickedPlacement();
  if (tool !== "group") clearGroupSelection();
  updateToolButtons();
  renderGrid();
  updateStats();
}

function readSettings() {
  return {
    cols: clampNumber(els.gridCols.value, 1, 64, state.cols),
    rows: clampNumber(els.gridRows.value, 1, 64, state.rows),
    tileWidth: clampNumber(els.tileWidth.value, 8, 1024, state.tileWidth),
    tileHeight: clampNumber(els.tileHeight.value, 8, 1024, state.tileHeight),
    spriteWidth: clampNumber(els.spriteWidth.value, 8, 2048, state.spriteWidth),
    spriteHeight: clampNumber(els.spriteHeight.value, 8, 2048, state.spriteHeight),
    tileMode: supportedTileMode(els.tileMode.value),
    exportCols: clampNumber(els.exportCols.value, 1, 64, state.exportCols)
  };
}

function syncSettingsControls() {
  els.gridCols.value = state.cols;
  els.gridRows.value = state.rows;
  els.tileWidth.value = state.tileWidth;
  els.tileHeight.value = state.tileHeight;
  els.spriteWidth.value = state.spriteWidth;
  els.spriteHeight.value = state.spriteHeight;
  els.tileMode.value = state.tileMode;
  els.exportCols.value = state.exportCols;
  els.showPlacementGrid.checked = state.showPlacementGrid;
}

function applySettings() {
  const next = readSettings();
  const resolutionChanged = next.spriteWidth !== state.spriteWidth || next.spriteHeight !== state.spriteHeight;
  const gridScaleChanged = next.tileWidth !== state.tileWidth || next.tileHeight !== state.tileHeight || next.tileMode !== state.tileMode;
  const gridChanged = next.cols !== state.cols || next.rows !== state.rows;

  Object.assign(state, next);
  clearGroupSelection();
  syncSettingsControls();

  if (gridChanged || gridScaleChanged) {
    for (const layer of state.layers) {
      for (const [key, placement] of layer.placements) {
        if (placement.x >= state.cols || placement.y >= state.rows) {
          layer.placements.delete(key);
        }
      }
    }
    if (state.pickedPlacement && (state.pickedPlacement.x >= state.cols || state.pickedPlacement.y >= state.rows)) {
      clearPickedPlacement();
    }
  }

  if (resolutionChanged) {
    setStatus("Sprite size changed. Existing palette was preserved; new imports and exports use the updated sprite size.");
  } else if (gridChanged || gridScaleChanged) {
    setStatus(`Grid settings applied for ${tileModeLabel(state.tileMode)} mode.`);
  } else {
    setStatus("Project settings applied.");
  }

  renderPalette();
  renderLayers();
  resizeGridCanvas();
  renderGrid();
  updateViewerZoom();
  updateStats();
  activateControlTab("importTab");
}

function setStatus(message) {
  els.projectStatus.textContent = message;
}

function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  els.themeToggle.textContent = nextTheme === "dark" ? "Light Mode" : "Dark Mode";
  els.themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  localStorage.setItem("tileBuilderTheme", nextTheme);
  renderGrid();
  drawCrop();
  drawCreatePreview();
  drawCullPreview();
}

function initializeTheme() {
  const storedTheme = localStorage.getItem("tileBuilderTheme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(storedTheme || preferredTheme);
}

function supportedTileMode(mode) {
  return ["isometric", "orthographic", "topdown"].includes(mode) ? mode : "isometric";
}

function tileModeLabel(mode = state.tileMode) {
  if (mode === "orthographic") return "orthographic";
  if (mode === "topdown") return "top-down";
  return "isometric";
}

function resizeGridCanvas() {
  const pad = getGridPadding();
  if (state.tileMode === "isometric") {
    els.gridCanvas.width = Math.ceil((state.cols + state.rows) * state.tileWidth / 2 + pad * 2);
    els.gridCanvas.height = Math.ceil((state.cols + state.rows) * state.tileHeight / 2 + state.tileHeight + pad * 2);
    return;
  }
  els.gridCanvas.width = Math.ceil(state.cols * state.tileWidth + pad * 2);
  els.gridCanvas.height = Math.ceil(state.rows * state.tileHeight + pad * 2);
}

function getGridPadding() {
  if (state.tileMode === "isometric") {
    return Math.max(32, Math.ceil(Math.max(state.tileWidth, state.spriteHeight) * 0.35));
  }
  return Math.max(24, Math.ceil(Math.max(state.tileWidth, state.tileHeight, state.spriteWidth, state.spriteHeight) * 0.25));
}

function cellCenter(x, y) {
  const pad = getGridPadding();
  if (state.tileMode !== "isometric") {
    return {
      x: pad + x * state.tileWidth + state.tileWidth / 2,
      y: pad + y * state.tileHeight + state.tileHeight / 2
    };
  }
  const halfW = state.tileWidth / 2;
  const halfH = state.tileHeight / 2;
  return {
    x: pad + (state.rows - 1) * halfW + halfW + (x - y) * halfW,
    y: pad + halfH + (x + y) * halfH
  };
}

function cellFromPoint(px, py) {
  if (state.tileMode !== "isometric") {
    const pad = getGridPadding();
    const x = Math.floor((px - pad) / state.tileWidth);
    const y = Math.floor((py - pad) / state.tileHeight);
    if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null;
    return { x, y };
  }
  const halfW = state.tileWidth / 2;
  const halfH = state.tileHeight / 2;
  const origin = cellCenter(0, 0);
  const a = (px - origin.x) / halfW;
  const b = (py - origin.y) / halfH;
  const x = Math.floor((a + b) / 2 + 0.5);
  const y = Math.floor((b - a) / 2 + 0.5);

  if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return null;

  const center = cellCenter(x, y);
  const inside = Math.abs(px - center.x) / halfW + Math.abs(py - center.y) / halfH <= 1;
  return inside ? { x, y } : null;
}

function drawGridCell(ctx, x, y, options = {}) {
  const center = cellCenter(x, y);
  ctx.beginPath();
  if (state.tileMode === "isometric") {
    const halfW = state.tileWidth / 2;
    const halfH = state.tileHeight / 2;
    ctx.moveTo(center.x, center.y - halfH);
    ctx.lineTo(center.x + halfW, center.y);
    ctx.lineTo(center.x, center.y + halfH);
    ctx.lineTo(center.x - halfW, center.y);
  } else {
    ctx.rect(center.x - state.tileWidth / 2, center.y - state.tileHeight / 2, state.tileWidth, state.tileHeight);
  }
  ctx.closePath();
  ctx.strokeStyle = options.stroke || cssVar("--grid-line");
  ctx.lineWidth = options.lineWidth || 1;
  ctx.stroke();
  if (options.fill) {
    ctx.fillStyle = options.fill;
    ctx.fill();
  }
}

function tileGridBounds() {
  if (state.tileMode !== "isometric") {
    const pad = getGridPadding();
    return {
      left: pad,
      top: pad,
      right: pad + state.cols * state.tileWidth,
      bottom: pad + state.rows * state.tileHeight,
      width: state.cols * state.tileWidth,
      height: state.rows * state.tileHeight
    };
  }

  const halfW = state.tileWidth / 2;
  const halfH = state.tileHeight / 2;
  let left = Infinity;
  let right = -Infinity;
  let top = Infinity;
  let bottom = -Infinity;
  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      const center = cellCenter(x, y);
      left = Math.min(left, center.x - halfW);
      right = Math.max(right, center.x + halfW);
      top = Math.min(top, center.y - halfH);
      bottom = Math.max(bottom, center.y + halfH);
    }
  }
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function traceTileGridFootprint(ctx) {
  if (state.tileMode !== "isometric") {
    const bounds = tileGridBounds();
    ctx.rect(bounds.left, bounds.top, bounds.width, bounds.height);
    return;
  }
  const footprint = isometricGridFootprint();
  ctx.moveTo(footprint.top.x, footprint.top.y);
  ctx.lineTo(footprint.right.x, footprint.right.y);
  ctx.lineTo(footprint.bottom.x, footprint.bottom.y);
  ctx.lineTo(footprint.left.x, footprint.left.y);
  ctx.closePath();
}

function isometricGridFootprint() {
  const halfW = state.tileWidth / 2;
  const halfH = state.tileHeight / 2;
  const top = cellCenter(0, 0);
  const right = cellCenter(state.cols - 1, 0);
  const bottom = cellCenter(state.cols - 1, state.rows - 1);
  const left = cellCenter(0, state.rows - 1);
  return {
    top: { x: top.x, y: top.y - halfH },
    right: { x: right.x + halfW, y: right.y },
    bottom: { x: bottom.x, y: bottom.y + halfH },
    left: { x: left.x - halfW, y: left.y }
  };
}

function drawProjectGrid(ctx) {
  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      drawGridCell(ctx, x, y);
    }
  }
}

function tileDrawRect(tile, cell) {
  const center = cellCenter(cell.x, cell.y);
  const width = tile.width || tile.image.naturalWidth || state.spriteWidth;
  const height = tile.height || tile.image.naturalHeight || state.spriteHeight;
  if (tile.anchor) {
    return {
      x: center.x - tile.anchor.x,
      y: center.y - tile.anchor.y,
      width,
      height
    };
  }
  if (state.tileMode === "topdown") {
    return {
      x: center.x - width / 2,
      y: center.y - height / 2,
      width,
      height
    };
  }
  const bounds = tile.bounds || { x: 0, y: 0, width, height };
  return {
    x: center.x - (bounds.x + bounds.width / 2),
    y: center.y + state.tileHeight / 2 - (bounds.y + bounds.height),
    width,
    height
  };
}

function groupMoveCandidates(targetCell) {
  if (!state.groupMoveOrigin || !targetCell) return [];
  const offsetX = targetCell.x - state.groupMoveOrigin.anchorX;
  const offsetY = targetCell.y - state.groupMoveOrigin.anchorY;
  return state.groupMoveOrigin.placements.map((placement) => ({
    ...placement,
    x: placement.x + offsetX,
    y: placement.y + offsetY
  }));
}

function canPlaceGroup(candidates) {
  if (!state.groupMoveOrigin || candidates.length === 0) return false;
  const layer = state.layers.find((item) => item.id === state.groupMoveOrigin.layerId);
  if (!layer) return false;
  const selectedKeys = new Set(state.groupMoveOrigin.placements.map((placement) => placement.key));
  return candidates.every((placement) => {
    if (placement.x < 0 || placement.y < 0 || placement.x >= state.cols || placement.y >= state.rows) return false;
    const occupied = layer.placements.get(placementKey(placement.x, placement.y));
    return !occupied || selectedKeys.has(placementKey(placement.x, placement.y));
  });
}

function renderGrid() {
  gridCtx.clearRect(0, 0, els.gridCanvas.width, els.gridCanvas.height);
  gridCtx.fillStyle = cssVar("--canvas-bg");
  gridCtx.fillRect(0, 0, els.gridCanvas.width, els.gridCanvas.height);

  for (const layer of visibleLayers()) {
    for (const placement of sortedLayerPlacements(layer)) {
      const tile = state.tiles.find((item) => item.id === placement.tileId);
      if (!tile) continue;
      const rect = tileDrawRect(tile, placement);
      gridCtx.drawImage(tile.image, rect.x, rect.y, rect.width, rect.height);
    }
  }

  if (state.showPlacementGrid) drawProjectGrid(gridCtx);

  if (state.hoverCell) {
    drawGridCell(gridCtx, state.hoverCell.x, state.hoverCell.y, {
      stroke: cssVar("--accent"),
      lineWidth: 2,
      fill: cssVar("--grid-hover")
    });
  }

  const selectedPlacements = state.groupMoveOrigin && state.hoverCell
    ? groupMoveCandidates(state.hoverCell)
    : state.groupSelection;
  const selectionValid = !state.groupMoveOrigin || !state.hoverCell || canPlaceGroup(selectedPlacements);
  for (const placement of selectedPlacements) {
    if (placement.x < 0 || placement.y < 0 || placement.x >= state.cols || placement.y >= state.rows) continue;
    drawGridCell(gridCtx, placement.x, placement.y, {
      stroke: selectionValid ? cssVar("--accent") : "#a23226",
      lineWidth: 3,
      fill: cssVar("--grid-hover")
    });
  }
}

function renderTileCards(container, emptyText) {
  container.replaceChildren();
  if (state.tiles.length === 0) {
    const empty = document.createElement("p");
    empty.className = "status-text";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  for (const tile of state.tiles) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = container === els.paletteManager ? "manager-tile-card" : "tile-card";
    if (tile.id === state.selectedTileId) card.classList.add("is-selected");
    card.title = tile.name;

    const image = document.createElement("img");
    image.src = tile.url;
    image.alt = tile.name;

    const label = document.createElement("span");
    label.textContent = tile.name;

    card.append(image, label);
    card.addEventListener("click", () => {
      state.selectedTileId = tile.id;
      updateToolButtons();
      renderPalette();
      updateStats();
    });
    container.append(card);
  }
}

function renderPalette() {
  renderTileCards(els.palette, "Add PNGs to build your tile palette.");
  renderTileCards(els.paletteManager, "Import PNGs to begin managing your palette.");
  els.savePalette.disabled = state.tiles.length === 0;
  updatePaletteEditor();
  drawCreatePreview();
}

function selectedTile() {
  return state.tiles.find((tile) => tile.id === state.selectedTileId) || null;
}

function updatePaletteEditor() {
  const tile = selectedTile();
  const controls = [
    els.paletteTileName,
    els.renameTile,
    els.cloneTile,
    els.recropTile,
    els.rotateTileLeft,
    els.rotateTileRight,
    els.flipTileHorizontal,
    els.flipTileVertical,
    els.deleteTile,
    els.tileTintColor,
    els.tileTintStrength,
    els.applyTileTint,
    els.transparentTileColor,
    els.transparentTileTolerance,
    els.makeTileColorTransparent
  ];

  controls.forEach((control) => {
    control.disabled = !tile;
  });
  els.palettePreview.classList.toggle("has-tile", Boolean(tile));
  els.palettePreview.src = tile ? tile.url : "";
  els.palettePreview.alt = tile ? `${tile.name} preview` : "";
  els.paletteSelectedName.textContent = tile ? `${tile.name} (${tile.width}x${tile.height})` : "Select a sprite to edit.";
  els.paletteTileName.value = tile ? tile.name : "";
}

function deserializeTransitionRecipe(recipe) {
  if (!recipe || typeof recipe !== "object") return null;
  const points = Array.isArray(recipe.points)
    ? recipe.points
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
        .map((point) => ({
          x: Math.min(1, Math.max(0, point.x)),
          y: Math.min(1, Math.max(0, point.y))
        }))
    : [];
  const cutLines = normalizeCutLines(recipe.cutLines, points);
  if (points.length < 2 && cutLines.length === 0) return null;
  return {
    version: 1,
    tileAId: typeof recipe.tileAId === "string" ? recipe.tileAId : "transparent",
    tileAName: typeof recipe.tileAName === "string" ? recipe.tileAName : "Transparent background",
    tileBId: typeof recipe.tileBId === "string" ? recipe.tileBId : "",
    tileBName: typeof recipe.tileBName === "string" ? recipe.tileBName : "Tile B",
    tileCId: typeof recipe.tileCId === "string" ? recipe.tileCId : "none",
    tileCName: typeof recipe.tileCName === "string" ? recipe.tileCName : "No decorative layer",
    decorationOpacity: clampNumber(recipe.decorationOpacity, 0, 100, 45),
    decorationBlend: supportedDecorationBlend(recipe.decorationBlend),
    side: recipe.side === "negative" ? "negative" : "positive",
    points: cutLines[0]?.points || points,
    cutLines,
    activeLineIndex: clampNumber(recipe.activeLineIndex, 0, Math.max(0, cutLines.length - 1), 0),
    betweenMode: recipe.betweenMode === "include" ? "include" : "exclude",
    vertexCount: clampNumber(recipe.vertexCount, 2, 24, Math.min(24, Math.max(2, points.length || 5))),
    gridDivisions: clampNumber(recipe.gridDivisions, 2, 32, 8),
    snapToGrid: recipe.snapToGrid === true,
    vertexMode: recipe.vertexMode === true,
    lineMode: recipe.lineMode === "straight" ? "straight" : "smooth",
    lineWidth: clampNumber(recipe.lineWidth, 1, 16, 3),
    vertexRadius: clampNumber(recipe.vertexRadius, 3, 32, 5),
    feather: clampNumber(recipe.feather, 0, 64, 6),
    splatter: clampNumber(recipe.splatter, 0, 100, 18),
    noise: clampNumber(recipe.noise, 0, 100, 8)
  };
}

function supportedDecorationBlend(value) {
  return ["source-over", "multiply", "screen", "overlay", "soft-light"].includes(value) ? value : "source-over";
}

function createTileOptions(select, mode) {
  const previousValue = select.value;
  select.replaceChildren();
  if (mode === "transparent") {
    const transparent = document.createElement("option");
    transparent.value = "transparent";
    transparent.textContent = "Transparent background";
    select.append(transparent);
  } else if (mode === "none") {
    const none = document.createElement("option");
    none.value = "none";
    none.textContent = "No decorative layer";
    select.append(none);
  }
  for (const tile of state.tiles) {
    const option = document.createElement("option");
    option.value = tile.id;
    option.textContent = tile.name;
    select.append(option);
  }
  if ([...select.options].some((option) => option.value === previousValue)) {
    select.value = previousValue;
  } else if (mode === "transparent") {
    select.value = "transparent";
  } else if (mode === "none") {
    select.value = "none";
  } else if (state.selectedTileId && state.tiles.some((tile) => tile.id === state.selectedTileId)) {
    select.value = state.selectedTileId;
  } else {
    select.value = state.tiles[0] ? state.tiles[0].id : "";
  }
}

function syncCreateControlsFromState() {
  createTileOptions(els.createTileA, "transparent");
  createTileOptions(els.createTileB, "tile");
  createTileOptions(els.createTileC, "none");
  if (state.create.tileAId !== "transparent" && !state.tiles.some((tile) => tile.id === state.create.tileAId)) {
    state.create.tileAId = "transparent";
  }
  if (!state.tiles.some((tile) => tile.id === state.create.tileBId)) {
    state.create.tileBId = state.selectedTileId && state.tiles.some((tile) => tile.id === state.selectedTileId)
      ? state.selectedTileId
      : state.tiles[0]?.id || "";
  }
  if (state.create.tileCId !== "none" && !state.tiles.some((tile) => tile.id === state.create.tileCId)) {
    state.create.tileCId = "none";
  }
  els.createTileA.value = state.create.tileAId;
  els.createTileB.value = state.create.tileBId;
  els.createTileC.value = state.create.tileCId;
  els.createDecorationOpacity.value = state.create.decorationOpacity;
  els.createDecorationBlend.value = state.create.decorationBlend;
  els.createBetweenMode.value = state.create.betweenMode === "include" ? "include" : "exclude";
  els.createBetweenMode.disabled = getEditorLines(state.create).length < 2;
  els.createBetweenMode.title = els.createBetweenMode.disabled
    ? "Add a second line to use between-lines masking."
    : "";
  els.createFeather.value = state.create.feather;
  els.createSplatter.value = state.create.splatter;
  els.createNoise.value = state.create.noise;
  populateLineSelect(els.createLineSelect, state.create);
  els.createVertexCount.value = state.create.vertexCount;
  els.createGridDivisions.value = state.create.gridDivisions;
  els.createLineMode.value = state.create.lineMode;
  els.createLineWidth.value = displayLineWidth(state.create);
  els.createVertexRadius.value = displayVertexRadius(state.create);
  els.createSnapToGrid.checked = state.create.snapToGrid;
  els.createVertexMode.checked = state.create.vertexMode;
  els.createSideUpper.classList.toggle("is-active", state.create.side === "negative");
  els.createSideLower.classList.toggle("is-active", state.create.side === "positive");
  els.addCreatedTile.disabled = !state.create.tileBId;
  els.loadCreatedTile.disabled = !selectedTile()?.transition;
  els.deleteCreateLine.disabled = getEditorLines(state.create).length <= 1;
}

function createOutputSize() {
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  const tileA = state.tiles.find((tile) => tile.id === state.create.tileAId);
  const tile = tileB || tileA;
  return {
    width: tile ? tile.width : state.spriteWidth,
    height: tile ? tile.height : state.spriteHeight
  };
}

function defaultCreateLine(width, height) {
  return [
    { x: 0, y: height * 0.65 },
    { x: width, y: height * 0.35 }
  ];
}

function createLinePixels(width, height) {
  return normalizedLinePixels(activeEditorLine(state.create), width, height, defaultCreateLine);
}

function allCreateLinePixels(width, height) {
  syncEditorLegacyPoints(state.create);
  return state.create.cutLines.map((line) => normalizedLinePixels(line, width, height, defaultCreateLine));
}

function activeCreateLinePixels(width, height) {
  const points = createLinePixels(width, height);
  return resamplePath(points, state.create.vertexCount);
}

function storedCreateLinePixels(width, height) {
  return activeEditorLine(state.create).points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x * width)),
    y: Math.min(height, Math.max(0, point.y * height))
  }));
}

function normalizeCreatePoints(points, width, height) {
  return points.map((point) => ({
    x: Math.min(1, Math.max(0, point.x / width)),
    y: Math.min(1, Math.max(0, point.y / height))
  }));
}

function normalizeCutLinePoints(points) {
  return Array.isArray(points)
    ? points
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
        .map((point) => ({
          x: Math.min(1, Math.max(0, point.x)),
          y: Math.min(1, Math.max(0, point.y))
        }))
    : [];
}

function normalizeCutLines(value, fallbackPoints = []) {
  const lines = Array.isArray(value)
    ? value.map((line) => normalizeCutLinePoints(line?.points || line)).filter((points) => points.length > 0)
    : [];
  const fallback = normalizeCutLinePoints(fallbackPoints);
  if (lines.length === 0 && fallback.length > 0) return [{ points: fallback }];
  return lines.map((points) => ({ points }));
}

function getEditorLines(editor) {
  const lines = normalizeCutLines(editor.cutLines, editor.points);
  if (lines.length === 0) return [{ points: [] }];
  return lines;
}

function syncEditorLegacyPoints(editor) {
  const lines = getEditorLines(editor);
  const index = Math.min(Math.max(0, editor.activeLineIndex || 0), lines.length - 1);
  editor.cutLines = lines;
  editor.activeLineIndex = index;
  editor.points = lines[index]?.points || [];
}

function activeEditorLine(editor) {
  syncEditorLegacyPoints(editor);
  return editor.cutLines[editor.activeLineIndex];
}

function setActiveEditorLinePoints(editor, points) {
  const line = activeEditorLine(editor);
  line.points = points;
  editor.points = points;
}

function normalizedLinePixels(line, width, height, fallbackFactory) {
  const points = line?.points?.length >= 2
    ? line.points.map((point) => ({ x: point.x * width, y: point.y * height }))
    : fallbackFactory(width, height);
  return points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x)),
    y: Math.min(height, Math.max(0, point.y))
  }));
}

function populateLineSelect(select, editor) {
  const previousValue = String(editor.activeLineIndex || 0);
  syncEditorLegacyPoints(editor);
  select.replaceChildren();
  editor.cutLines.forEach((line, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Line ${index + 1}`;
    select.append(option);
  });
  select.value = [...select.options].some((option) => option.value === previousValue)
    ? previousValue
    : String(editor.activeLineIndex || 0);
}

function snapCreatePoint(point, width, height) {
  if (!state.create.snapToGrid) return point;
  const divisions = Math.max(2, state.create.gridDivisions);
  if (state.tileMode === "isometric") {
    return snapIsometricCreatePoint(point, width, height, divisions);
  }
  const cellW = width / divisions;
  const cellH = height / divisions;
  return {
    x: Math.min(width, Math.max(0, Math.round(point.x / cellW) * cellW)),
    y: Math.min(height, Math.max(0, Math.round(point.y / cellH) * cellH))
  };
}

function createIsometricFootprint(width, height) {
  const targetRatio = state.tileHeight / Math.max(1, state.tileWidth);
  const maxDiamondWidth = width;
  const maxDiamondHeight = Math.min(height, maxDiamondWidth * targetRatio);
  const diamondWidth = Math.min(maxDiamondWidth, maxDiamondHeight / Math.max(0.01, targetRatio));
  const diamondHeight = diamondWidth * targetRatio;
  const centerX = width / 2;
  const centerY = height / 2;
  return {
    top: { x: centerX, y: centerY - diamondHeight / 2 },
    right: { x: centerX + diamondWidth / 2, y: centerY },
    bottom: { x: centerX, y: centerY + diamondHeight / 2 },
    left: { x: centerX - diamondWidth / 2, y: centerY }
  };
}

function traceCreateSubgridFootprint(ctx, width, height) {
  if (state.tileMode === "isometric") {
    const footprint = createIsometricFootprint(width, height);
    ctx.moveTo(footprint.top.x, footprint.top.y);
    ctx.lineTo(footprint.right.x, footprint.right.y);
    ctx.lineTo(footprint.bottom.x, footprint.bottom.y);
    ctx.lineTo(footprint.left.x, footprint.left.y);
    ctx.closePath();
    return;
  }
  ctx.rect(0, 0, width, height);
}

function snapIsometricCreatePoint(point, width, height, divisions) {
  const footprint = createIsometricFootprint(width, height);
  const origin = footprint.top;
  const axisU = {
    x: footprint.right.x - footprint.top.x,
    y: footprint.right.y - footprint.top.y
  };
  const axisV = {
    x: footprint.left.x - footprint.top.x,
    y: footprint.left.y - footprint.top.y
  };
  const determinant = axisU.x * axisV.y - axisU.y * axisV.x;
  if (Math.abs(determinant) < 0.0001) return point;
  const relative = {
    x: point.x - origin.x,
    y: point.y - origin.y
  };
  const u = (relative.x * axisV.y - relative.y * axisV.x) / determinant;
  const v = (axisU.x * relative.y - axisU.y * relative.x) / determinant;
  const snappedU = Math.min(1, Math.max(0, Math.round(u * divisions) / divisions));
  const snappedV = Math.min(1, Math.max(0, Math.round(v * divisions) / divisions));
  return {
    x: origin.x + axisU.x * snappedU + axisV.x * snappedV,
    y: origin.y + axisU.y * snappedU + axisV.y * snappedV
  };
}

function pathLength(points) {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    length += Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
  }
  return length;
}

function pointAtPathDistance(points, targetDistance) {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1 || targetDistance <= 0) return { ...points[0] };
  let walked = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);
    if (segmentLength === 0) continue;
    if (walked + segmentLength >= targetDistance) {
      const t = (targetDistance - walked) / segmentLength;
      return {
        x: previous.x + (current.x - previous.x) * t,
        y: previous.y + (current.y - previous.y) * t
      };
    }
    walked += segmentLength;
  }
  return { ...points[points.length - 1] };
}

function resamplePath(points, count) {
  const targetCount = Math.max(2, Math.min(24, count));
  if (points.length === 0) return [];
  if (points.length === targetCount) return points.map((point) => ({ ...point }));
  if (points.length === 1) return Array.from({ length: targetCount }, () => ({ ...points[0] }));
  const totalLength = pathLength(points);
  if (totalLength === 0) return Array.from({ length: targetCount }, () => ({ ...points[0] }));
  return Array.from({ length: targetCount }, (_, index) => {
    return pointAtPathDistance(points, totalLength * (index / (targetCount - 1)));
  });
}

function simplifyStrokePoints(points) {
  const simplified = [];
  for (const point of points) {
    const previous = simplified[simplified.length - 1];
    if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 1.5) continue;
    simplified.push(point);
  }
  return simplified;
}

function drawTileToCanvas(ctx, tile, width, height) {
  if (!tile) return;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tile.image, 0, 0, width, height);
}

function drawDecorationLayer(ctx, tile, width, height) {
  if (!tile || state.create.decorationOpacity <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.create.decorationOpacity / 100;
  ctx.globalCompositeOperation = supportedDecorationBlend(state.create.decorationBlend);
  drawTileToCanvas(ctx, tile, width, height);
  ctx.restore();
}

function lineOrientation(points) {
  const first = points[0];
  const last = points[points.length - 1];
  return Math.abs(last.x - first.x) >= Math.abs(last.y - first.y) ? "horizontal" : "vertical";
}

function extendedCutPoints(width, height, points) {
  if (points.length < 2) return points;
  const margin = Math.max(width, height) * 3;
  const first = points[0];
  const second = points[1];
  const beforeLast = points[points.length - 2];
  const last = points[points.length - 1];
  const firstLength = Math.hypot(first.x - second.x, first.y - second.y) || 1;
  const lastLength = Math.hypot(last.x - beforeLast.x, last.y - beforeLast.y) || 1;
  const extendedFirst = {
    x: first.x + (first.x - second.x) / firstLength * margin,
    y: first.y + (first.y - second.y) / firstLength * margin
  };
  const extendedLast = {
    x: last.x + (last.x - beforeLast.x) / lastLength * margin,
    y: last.y + (last.y - beforeLast.y) / lastLength * margin
  };
  return [extendedFirst, ...points, extendedLast];
}

function traceCreatePath(ctx, points, lineMode = state.create.lineMode) {
  ctx.moveTo(points[0].x, points[0].y);
  if (lineMode === "straight" || points.length < 3) {
    points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    return;
  }
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

const editorLineColors = [
  "#20766d",
  "#b44b2d",
  "#6b62c7",
  "#c28f1f",
  "#2f82c7",
  "#a34891",
  "#4f8f35",
  "#cf5f6b"
];

function editorLineColor(index, active = false) {
  const color = editorLineColors[index % editorLineColors.length];
  if (active) return color;
  const hex = color.replace("#", "");
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.72)`;
}

function drawCreateSubgrid(width, height) {
  const divisions = Math.max(2, state.create.gridDivisions);
  createCtx.save();
  createCtx.beginPath();
  traceCreateSubgridFootprint(createCtx, width, height);
  createCtx.clip();
  createCtx.strokeStyle = state.create.snapToGrid ? "rgba(32, 118, 109, 0.42)" : "rgba(32, 118, 109, 0.18)";
  createCtx.lineWidth = 1;
  if (state.tileMode === "isometric") {
    const footprint = createIsometricFootprint(width, height);
    for (let index = 1; index < divisions; index += 1) {
      const t = index / divisions;
      const leftEdgePoint = interpolatePoint(footprint.top, footprint.left, t);
      const rightEdgePoint = interpolatePoint(footprint.right, footprint.bottom, t);
      createCtx.beginPath();
      createCtx.moveTo(leftEdgePoint.x, leftEdgePoint.y);
      createCtx.lineTo(rightEdgePoint.x, rightEdgePoint.y);
      createCtx.stroke();

      const topEdgePoint = interpolatePoint(footprint.top, footprint.right, t);
      const bottomEdgePoint = interpolatePoint(footprint.left, footprint.bottom, t);
      createCtx.beginPath();
      createCtx.moveTo(topEdgePoint.x, topEdgePoint.y);
      createCtx.lineTo(bottomEdgePoint.x, bottomEdgePoint.y);
      createCtx.stroke();
    }
    createCtx.restore();
    return;
  }
  for (let index = 1; index < divisions; index += 1) {
    const x = width * index / divisions;
    const y = height * index / divisions;
    createCtx.beginPath();
    createCtx.moveTo(x, 0);
    createCtx.lineTo(x, height);
    createCtx.stroke();
    createCtx.beginPath();
    createCtx.moveTo(0, y);
    createCtx.lineTo(width, y);
    createCtx.stroke();
  }
  createCtx.restore();
}

function drawCreateVertices(points) {
  const radius = displayVertexRadius(state.create);
  createCtx.save();
  points.forEach((point, index) => {
    const active = index === state.create.activeVertexIndex;
    createCtx.beginPath();
    createCtx.arc(point.x, point.y, active ? radius + 2 : radius, 0, Math.PI * 2);
    createCtx.fillStyle = active ? cssVar("--accent-strong") : cssVar("--panel");
    createCtx.strokeStyle = cssVar("--accent-strong");
    createCtx.lineWidth = active ? Math.max(2, Math.ceil(radius / 3)) : Math.max(1, Math.ceil(radius / 4));
    createCtx.fill();
    createCtx.stroke();
  });
  createCtx.restore();
}

function createMaskCanvas(width, height, points, side, feather, lineMode = state.create.lineMode) {
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d");
  const cutPoints = extendedCutPoints(width, height, simplifyStrokePoints(points));
  const orientation = lineOrientation(cutPoints);
  const margin = Math.max(width, height) * 3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  traceCreatePath(ctx, cutPoints, lineMode);
  if (orientation === "horizontal") {
    if (side === "positive") {
      ctx.lineTo(width + margin, height + margin);
      ctx.lineTo(-margin, height + margin);
    } else {
      ctx.lineTo(width + margin, -margin);
      ctx.lineTo(-margin, -margin);
    }
  } else if (side === "positive") {
    ctx.lineTo(width + margin, height + margin);
    ctx.lineTo(width + margin, -margin);
  } else {
    ctx.lineTo(-margin, height + margin);
    ctx.lineTo(-margin, -margin);
  }
  ctx.closePath();
  ctx.fill();

  if (feather > 0) {
    const blurred = document.createElement("canvas");
    blurred.width = width;
    blurred.height = height;
    const blurCtx = blurred.getContext("2d");
    blurCtx.filter = `blur(${feather}px)`;
    blurCtx.drawImage(mask, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(blurred, 0, 0);
  }

  return mask;
}

function lineValueAt(points, target, orientation) {
  const coordinate = orientation === "horizontal" ? "x" : "y";
  const valueCoordinate = orientation === "horizontal" ? "y" : "x";
  const sorted = [...points].sort((a, b) => a[coordinate] - b[coordinate]);
  if (target <= sorted[0][coordinate]) return sorted[0][valueCoordinate];
  if (target >= sorted[sorted.length - 1][coordinate]) return sorted[sorted.length - 1][valueCoordinate];
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    if (target < previous[coordinate] || target > current[coordinate]) continue;
    const span = current[coordinate] - previous[coordinate];
    const t = span === 0 ? 0 : (target - previous[coordinate]) / span;
    return previous[valueCoordinate] + (current[valueCoordinate] - previous[valueCoordinate]) * t;
  }
  return sorted[sorted.length - 1][valueCoordinate];
}

function createBetweenLinesMask(width, height, lineA, lineB, lineMode) {
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d");
  const pointsA = simplifyStrokePoints(lineA);
  const pointsB = simplifyStrokePoints(lineB);
  if (pointsA.length < 2 || pointsB.length < 2) return mask;
  const orientation = lineOrientation(pointsA);
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const target = orientation === "horizontal" ? x : y;
      const a = lineValueAt(pointsA, target, orientation);
      const b = lineValueAt(pointsB, target, orientation);
      const value = orientation === "horizontal" ? y : x;
      if (value < Math.min(a, b) || value > Math.max(a, b)) continue;
      data[(y * width + x) * 4 + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return mask;
}

function combineLineMasks(width, height, lineSets, side, feather, lineMode, betweenMode) {
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const outputCtx = output.getContext("2d");
  const drawableLines = lineSets
    .map((line) => simplifyStrokePoints(line))
    .filter((line) => line.length >= 2);
  if (drawableLines.length === 0) return output;

  for (const line of drawableLines) {
    const mask = createMaskCanvas(width, height, line, side, feather, lineMode);
    outputCtx.drawImage(mask, 0, 0);
  }

  if (drawableLines.length >= 2) {
    const between = createBetweenLinesMask(width, height, drawableLines[0], drawableLines[1], lineMode);
    if (betweenMode === "include") {
      outputCtx.clearRect(0, 0, width, height);
      outputCtx.drawImage(between, 0, 0);
    } else {
      outputCtx.globalCompositeOperation = "destination-out";
      outputCtx.drawImage(between, 0, 0);
      outputCtx.globalCompositeOperation = "source-over";
    }
  }
  return output;
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function distanceToLine(px, py, points) {
  let distance = Infinity;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    distance = Math.min(distance, distanceToSegment(px, py, a.x, a.y, b.x, b.y));
  }
  return distance;
}

function seededNoise(x, y, seed) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function applyMaskEffects(mask, lineSets, splatter, noise) {
  if (splatter === 0 && noise === 0) return mask;
  const lines = (Array.isArray(lineSets?.[0]) ? lineSets : [lineSets]).filter((line) => line.length >= 2);
  if (lines.length === 0) return mask;
  const seedPoints = lines.flat();
  const ctx = mask.getContext("2d");
  const imageData = ctx.getImageData(0, 0, mask.width, mask.height);
  const pixels = imageData.data;
  const splatterRadius = Math.max(1, Math.max(mask.width, mask.height) * 0.18 * (splatter / 100));
  const seed = seedPoints.reduce((sum, point) => sum + point.x * 0.13 + point.y * 0.17, 11);

  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      const index = (y * mask.width + x) * 4 + 3;
      let alpha = pixels[index];
      if (noise > 0 && alpha > 0 && alpha < 255) {
        alpha += (seededNoise(x, y, seed) - 0.5) * 255 * (noise / 100);
      }
      if (splatter > 0 && lines.some((points) => distanceToLine(x, y, points) <= splatterRadius)) {
        const chance = splatter / 100 * 0.34;
        if (seededNoise(x, y, seed + 19) < chance) {
          alpha = seededNoise(x, y, seed + 29) < 0.5 ? 0 : 255;
        }
      }
      pixels[index] = Math.min(255, Math.max(0, Math.round(alpha)));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return mask;
}

function buildTransitionCanvas() {
  const tileA = state.create.tileAId === "transparent" ? null : state.tiles.find((tile) => tile.id === state.create.tileAId);
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  const tileC = state.create.tileCId === "none" ? null : state.tiles.find((tile) => tile.id === state.create.tileCId);
  const { width, height } = createOutputSize();
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const outputCtx = output.getContext("2d");
  outputCtx.clearRect(0, 0, width, height);
  drawTileToCanvas(outputCtx, tileA, width, height);

  if (!tileB) return output;
  const lineSets = allCreateLinePixels(width, height).map((points) => resamplePath(points, state.create.vertexCount));
  const drawableLineSets = lineSets.filter((points) => points.length >= 2);
  const mask = applyMaskEffects(
    combineLineMasks(width, height, drawableLineSets, state.create.side, state.create.feather, state.create.lineMode, state.create.betweenMode),
    drawableLineSets,
    state.create.splatter,
    state.create.noise
  );
  const overlay = document.createElement("canvas");
  overlay.width = width;
  overlay.height = height;
  const overlayCtx = overlay.getContext("2d");
  drawTileToCanvas(overlayCtx, tileB, width, height);

  const overlayData = overlayCtx.getImageData(0, 0, width, height);
  const maskData = mask.getContext("2d").getImageData(0, 0, width, height).data;
  for (let index = 0; index < overlayData.data.length; index += 4) {
    overlayData.data[index + 3] = Math.round(overlayData.data[index + 3] * (maskData[index + 3] / 255));
  }
  overlayCtx.putImageData(overlayData, 0, 0);
  outputCtx.drawImage(overlay, 0, 0);
  drawDecorationLayer(outputCtx, tileC, width, height);
  return output;
}

function drawCreatePreview() {
  if (!els.createCanvas) return;
  syncCreateControlsFromState();
  const { width, height } = createOutputSize();
  configurePreviewCanvas("create", width, height);
  createCtx.setTransform(state.createPreviewScale, 0, 0, state.createPreviewScale, 0, 0);
  createCtx.clearRect(0, 0, width, height);
  createCtx.drawImage(buildTransitionCanvas(), 0, 0);

  const lineSets = allCreateLinePixels(width, height).map((points) => resamplePath(points, state.create.vertexCount));
  const points = activeCreateLinePixels(width, height);
  drawCreateSubgrid(width, height);
  lineSets.forEach((line, index) => {
    if (line.length < 2) return;
    createCtx.save();
    const active = index === state.create.activeLineIndex;
    createCtx.strokeStyle = editorLineColor(index, active);
    createCtx.lineWidth = active ? displayLineWidth(state.create) : Math.max(1, displayLineWidth(state.create) - 1);
    createCtx.setLineDash([8, 5]);
    createCtx.beginPath();
    traceCreatePath(createCtx, simplifyStrokePoints(line), state.create.lineMode);
    createCtx.stroke();
    createCtx.restore();
  });
  drawCreateVertices(points);

  const tileA = state.create.tileAId === "transparent"
    ? "transparent"
    : state.tiles.find((tile) => tile.id === state.create.tileAId)?.name || "missing";
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  const tileC = state.create.tileCId === "none" ? null : state.tiles.find((tile) => tile.id === state.create.tileCId);
  const decoration = tileC ? ` with ${tileC.name} decoration` : "";
  els.createPreviewStatus.textContent = tileB
    ? `Previewing ${tileB.name} over ${tileA}${decoration}. Add Transition creates a new palette tile.`
    : "Import at least one tile, then choose Tile B.";
}

function readCreateEffectControls() {
  state.create.tileAId = els.createTileA.value || "transparent";
  state.create.tileBId = els.createTileB.value || "";
  state.create.tileCId = els.createTileC.value || "none";
  state.create.decorationOpacity = clampNumber(els.createDecorationOpacity.value, 0, 100, state.create.decorationOpacity);
  state.create.decorationBlend = supportedDecorationBlend(els.createDecorationBlend.value);
  state.create.betweenMode = els.createBetweenMode.value === "include" ? "include" : "exclude";
  state.create.feather = clampNumber(els.createFeather.value, 0, 64, state.create.feather);
  state.create.splatter = clampNumber(els.createSplatter.value, 0, 100, state.create.splatter);
  state.create.noise = clampNumber(els.createNoise.value, 0, 100, state.create.noise);
  state.create.gridDivisions = clampNumber(els.createGridDivisions.value, 2, 32, state.create.gridDivisions);
  state.create.lineMode = els.createLineMode.value === "straight" ? "straight" : "smooth";
  state.create.lineWidth = clampNumber(els.createLineWidth.value, 1, 16, displayLineWidth(state.create));
  state.create.vertexRadius = clampNumber(els.createVertexRadius.value, 3, 32, displayVertexRadius(state.create));
  state.create.snapToGrid = els.createSnapToGrid.checked;
  state.create.vertexMode = els.createVertexMode.checked;
  drawCreatePreview();
}

function transitionRecipeForCurrentTile() {
  const tileA = state.create.tileAId === "transparent" ? null : state.tiles.find((tile) => tile.id === state.create.tileAId);
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  const tileC = state.create.tileCId === "none" ? null : state.tiles.find((tile) => tile.id === state.create.tileCId);
  const { width, height } = createOutputSize();
  const points = normalizeCreatePoints(activeCreateLinePixels(width, height), width, height);
  const cutLines = allCreateLinePixels(width, height).map((line) => ({
    points: normalizeCreatePoints(resamplePath(line, state.create.vertexCount), width, height)
  }));
  return {
    version: 1,
    tileAId: state.create.tileAId,
    tileAName: tileA ? tileA.name : "Transparent background",
    tileBId: state.create.tileBId,
    tileBName: tileB ? tileB.name : "Tile B",
    tileCId: state.create.tileCId,
    tileCName: tileC ? tileC.name : "No decorative layer",
    decorationOpacity: state.create.decorationOpacity,
    decorationBlend: supportedDecorationBlend(state.create.decorationBlend),
    side: state.create.side,
    points,
    cutLines,
    activeLineIndex: state.create.activeLineIndex,
    betweenMode: state.create.betweenMode,
    vertexCount: state.create.vertexCount,
    gridDivisions: state.create.gridDivisions,
    snapToGrid: state.create.snapToGrid,
    vertexMode: state.create.vertexMode,
    lineMode: state.create.lineMode,
    lineWidth: displayLineWidth(state.create),
    vertexRadius: displayVertexRadius(state.create),
    feather: state.create.feather,
    splatter: state.create.splatter,
    noise: state.create.noise
  };
}

async function addCreatedTransitionTile() {
  readCreateEffectControls();
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  if (!tileB) {
    setStatus("Choose Tile B before creating a transition.");
    return;
  }
  const name = uniqueTileName((els.createTileName.value.trim() || "transition.png").replace(/\.png$/i, "") + ".png");
  const output = buildTransitionCanvas();
  const tile = await addTileFromCanvas(output, name, {
    anchor: cropAnchor(output.width, output.height),
    transition: transitionRecipeForCurrentTile()
  });
  renderPalette();
  updateStats();
  drawCreatePreview();
  setStatus(`Added ${tile.name} as a new transition tile. Source tiles were left unchanged.`);
}

function setCreateSide(side) {
  state.create.side = side === "negative" ? "negative" : "positive";
  drawCreatePreview();
}

function setCreateLine(index) {
  syncEditorLegacyPoints(state.create);
  state.create.activeLineIndex = Math.min(Math.max(0, index), state.create.cutLines.length - 1);
  state.create.activeVertexIndex = -1;
  state.create.points = activeEditorLine(state.create).points;
  drawCreatePreview();
}

function addCreateLine() {
  const { width, height } = createOutputSize();
  syncEditorLegacyPoints(state.create);
  const offset = Math.min(0.18, 0.05 * state.create.cutLines.length);
  const points = normalizeCreatePoints(defaultCreateLine(width, height).map((point) => ({
    x: point.x,
    y: Math.min(height, Math.max(0, point.y + height * offset))
  })), width, height);
  state.create.cutLines.push({ points });
  state.create.activeLineIndex = state.create.cutLines.length - 1;
  state.create.points = points;
  drawCreatePreview();
}

function deleteCreateLine() {
  syncEditorLegacyPoints(state.create);
  if (state.create.cutLines.length <= 1) return;
  state.create.cutLines.splice(state.create.activeLineIndex, 1);
  state.create.activeLineIndex = Math.min(state.create.activeLineIndex, state.create.cutLines.length - 1);
  state.create.points = activeEditorLine(state.create).points;
  drawCreatePreview();
}

function resetCreateLine() {
  const line = activeEditorLine(state.create);
  line.points = [];
  state.create.points = line.points;
  state.create.activeVertexIndex = -1;
  drawCreatePreview();
  setStatus("Transition cut line reset.");
}

function loadSelectedTransitionRecipe() {
  const recipe = selectedTile()?.transition;
  if (!recipe) {
    setStatus("Select a transition tile with saved recipe data first.");
    return;
  }
  const restored = deserializeTransitionRecipe(recipe);
  if (!restored) {
    setStatus("The selected tile does not have editable transition data.");
    return;
  }
  Object.assign(state.create, {
    tileAId: restored.tileAId,
    tileBId: restored.tileBId,
    tileCId: restored.tileCId,
    decorationOpacity: restored.decorationOpacity,
    decorationBlend: restored.decorationBlend,
    side: restored.side,
    points: restored.points,
    cutLines: restored.cutLines,
    activeLineIndex: restored.activeLineIndex,
    betweenMode: restored.betweenMode,
    vertexCount: restored.vertexCount,
    gridDivisions: restored.gridDivisions,
    snapToGrid: restored.snapToGrid,
    vertexMode: restored.vertexMode,
    lineMode: restored.lineMode,
    lineWidth: restored.lineWidth,
    vertexRadius: restored.vertexRadius,
    feather: restored.feather,
    splatter: restored.splatter,
    noise: restored.noise
  });
  els.createTileName.value = uniqueTileName(selectedTile().name);
  drawCreatePreview();
  setStatus(`Loaded transition settings from ${selectedTile().name}.`);
}

function defaultCullState() {
  return {
    enabled: false,
    side: "positive",
    points: [],
    cutLines: [],
    activeLineIndex: 0,
    betweenMode: "exclude",
    vertexCount: 5,
    gridDivisions: 8,
    snapToGrid: false,
    vertexMode: false,
    lineMode: "smooth",
    lineWidth: 3,
    vertexRadius: 5,
    feather: 0,
    splatter: 0,
    noise: 0,
    activeVertexIndex: -1,
    drawing: false,
    draggingVertex: false
  };
}

function normalizeCull(cull) {
  if (!cull || typeof cull !== "object") return defaultCullState();
  const points = Array.isArray(cull.points)
    ? cull.points
        .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
        .map((point) => ({
          x: Math.min(1, Math.max(0, point.x)),
          y: Math.min(1, Math.max(0, point.y))
        }))
    : [];
  const cutLines = normalizeCutLines(cull.cutLines, points);
  return {
    enabled: cull.enabled === true,
    side: cull.side === "negative" ? "negative" : "positive",
    points: cutLines[0]?.points || points,
    cutLines,
    activeLineIndex: clampNumber(cull.activeLineIndex, 0, Math.max(0, cutLines.length - 1), 0),
    betweenMode: cull.betweenMode === "include" ? "include" : "exclude",
    vertexCount: clampNumber(cull.vertexCount, 2, 24, Math.min(24, Math.max(2, points.length || 5))),
    gridDivisions: clampNumber(cull.gridDivisions, 2, 32, 8),
    snapToGrid: cull.snapToGrid === true,
    vertexMode: cull.vertexMode === true,
    lineMode: cull.lineMode === "straight" ? "straight" : "smooth",
    lineWidth: clampNumber(cull.lineWidth, 1, 16, 3),
    vertexRadius: clampNumber(cull.vertexRadius, 3, 32, 5),
    feather: clampNumber(cull.feather, 0, 96, 0),
    splatter: clampNumber(cull.splatter, 0, 100, 0),
    noise: clampNumber(cull.noise, 0, 100, 0),
    activeVertexIndex: -1,
    drawing: false,
    draggingVertex: false
  };
}

function cullLayer() {
  const layer = state.layers.find((item) => item.id === state.cullLayerId) || activeLayer();
  state.cullLayerId = layer.id;
  if (!layer.cull) layer.cull = defaultCullState();
  return layer;
}

function defaultCullLine(width, height) {
  return [
    { x: width * 0.15, y: height * 0.65 },
    { x: width * 0.85, y: height * 0.35 }
  ];
}

function cullLinePixels(cull, width, height) {
  return normalizedLinePixels(activeEditorLine(cull), width, height, defaultCullLine);
}

function allCullLinePixels(cull, width, height) {
  syncEditorLegacyPoints(cull);
  return cull.cutLines.map((line) => normalizedLinePixels(line, width, height, defaultCullLine));
}

function activeCullLinePixels(cull, width, height) {
  return resamplePath(cullLinePixels(cull, width, height), cull.vertexCount);
}

function storedCullLinePixels(cull, width, height) {
  return activeEditorLine(cull).points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x * width)),
    y: Math.min(height, Math.max(0, point.y * height))
  }));
}

function snapCullPoint(point, cull, width, height) {
  if (!cull.snapToGrid) return point;
  const divisions = Math.max(2, cull.gridDivisions);
  if (state.tileMode === "isometric") return snapIsometricCullPoint(point, divisions);
  const bounds = tileGridBounds();
  const cellW = bounds.width / divisions;
  const cellH = bounds.height / divisions;
  return {
    x: Math.min(bounds.right, Math.max(bounds.left, bounds.left + Math.round((point.x - bounds.left) / cellW) * cellW)),
    y: Math.min(bounds.bottom, Math.max(bounds.top, bounds.top + Math.round((point.y - bounds.top) / cellH) * cellH))
  };
}

function setCullPointsFromPixels(cull, points, width = previewLogicalWidth(els.cullCanvas), height = previewLogicalHeight(els.cullCanvas)) {
  setActiveEditorLinePoints(cull, normalizeCreatePoints(points, width, height));
}

function interpolatePoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
}

function snapIsometricCullPoint(point, divisions) {
  const footprint = isometricGridFootprint();
  const origin = footprint.top;
  const axisU = {
    x: footprint.right.x - footprint.top.x,
    y: footprint.right.y - footprint.top.y
  };
  const axisV = {
    x: footprint.left.x - footprint.top.x,
    y: footprint.left.y - footprint.top.y
  };
  const determinant = axisU.x * axisV.y - axisU.y * axisV.x;
  if (Math.abs(determinant) < 0.0001) return point;

  const relative = {
    x: point.x - origin.x,
    y: point.y - origin.y
  };
  const u = (relative.x * axisV.y - relative.y * axisV.x) / determinant;
  const v = (axisU.x * relative.y - axisU.y * relative.x) / determinant;
  const snappedU = Math.min(1, Math.max(0, Math.round(u * divisions) / divisions));
  const snappedV = Math.min(1, Math.max(0, Math.round(v * divisions) / divisions));
  return {
    x: origin.x + axisU.x * snappedU + axisV.x * snappedV,
    y: origin.y + axisU.y * snappedU + axisV.y * snappedV
  };
}

function syncCullControlsFromState() {
  const previousValue = els.cullLayerSelect.value;
  els.cullLayerSelect.replaceChildren();
  for (const layer of state.layers) {
    if (!layer.cull) layer.cull = defaultCullState();
    const option = document.createElement("option");
    option.value = layer.id;
    option.textContent = layer.name;
    els.cullLayerSelect.append(option);
  }
  if (state.layers.some((layer) => layer.id === previousValue)) {
    state.cullLayerId = previousValue;
  }
  const layer = cullLayer();
  const cull = layer.cull;
  els.cullLayerSelect.value = layer.id;
  els.cullEnabled.checked = cull.enabled;
  els.cullBetweenMode.value = cull.betweenMode === "include" ? "include" : "exclude";
  els.cullBetweenMode.disabled = getEditorLines(cull).length < 2;
  els.cullBetweenMode.title = els.cullBetweenMode.disabled
    ? "Add a second line to use between-lines masking."
    : "";
  populateLineSelect(els.cullLineSelect, cull);
  els.cullVertexCount.value = cull.vertexCount;
  els.cullGridDivisions.value = cull.gridDivisions;
  els.cullLineMode.value = cull.lineMode;
  els.cullLineWidth.value = displayLineWidth(cull);
  els.cullVertexRadius.value = displayVertexRadius(cull);
  els.cullSnapToGrid.checked = cull.snapToGrid;
  els.cullVertexMode.checked = cull.vertexMode;
  els.cullFeather.value = cull.feather;
  els.cullSplatter.value = cull.splatter;
  els.cullNoise.value = cull.noise;
  els.deleteCullLine.disabled = getEditorLines(cull).length <= 1;
  els.cullSideUpper.classList.toggle("is-active", cull.side === "negative");
  els.cullSideLower.classList.toggle("is-active", cull.side === "positive");
}

function drawCullSubgrid(width, height, cull) {
  const divisions = Math.max(2, cull.gridDivisions);
  const bounds = tileGridBounds();
  cullCtx.save();
  cullCtx.beginPath();
  traceTileGridFootprint(cullCtx);
  cullCtx.clip();
  cullCtx.strokeStyle = cull.snapToGrid ? "rgba(32, 118, 109, 0.42)" : "rgba(32, 118, 109, 0.18)";
  cullCtx.lineWidth = 1;
  if (state.tileMode === "isometric") {
    const footprint = isometricGridFootprint();
    for (let index = 1; index < divisions; index += 1) {
      const t = index / divisions;
      const leftEdgePoint = interpolatePoint(footprint.top, footprint.left, t);
      const rightEdgePoint = interpolatePoint(footprint.right, footprint.bottom, t);
      cullCtx.beginPath();
      cullCtx.moveTo(leftEdgePoint.x, leftEdgePoint.y);
      cullCtx.lineTo(rightEdgePoint.x, rightEdgePoint.y);
      cullCtx.stroke();

      const topEdgePoint = interpolatePoint(footprint.top, footprint.right, t);
      const bottomEdgePoint = interpolatePoint(footprint.left, footprint.bottom, t);
      cullCtx.beginPath();
      cullCtx.moveTo(topEdgePoint.x, topEdgePoint.y);
      cullCtx.lineTo(bottomEdgePoint.x, bottomEdgePoint.y);
      cullCtx.stroke();
    }
    cullCtx.restore();
    return;
  }
  for (let index = 1; index < divisions; index += 1) {
    const x = bounds.left + bounds.width * index / divisions;
    const y = bounds.top + bounds.height * index / divisions;
    cullCtx.beginPath();
    cullCtx.moveTo(x, bounds.top);
    cullCtx.lineTo(x, bounds.bottom);
    cullCtx.stroke();
    cullCtx.beginPath();
    cullCtx.moveTo(bounds.left, y);
    cullCtx.lineTo(bounds.right, y);
    cullCtx.stroke();
  }
  cullCtx.restore();
}

function drawCullVertices(points, cull) {
  const radius = displayVertexRadius(cull);
  cullCtx.save();
  points.forEach((point, index) => {
    const active = index === cull.activeVertexIndex;
    cullCtx.beginPath();
    cullCtx.arc(point.x, point.y, active ? radius + 2 : radius, 0, Math.PI * 2);
    cullCtx.fillStyle = active ? cssVar("--accent-strong") : cssVar("--panel");
    cullCtx.strokeStyle = cssVar("--accent-strong");
    cullCtx.lineWidth = active ? Math.max(2, Math.ceil(radius / 3)) : Math.max(1, Math.ceil(radius / 4));
    cullCtx.fill();
    cullCtx.stroke();
  });
  cullCtx.restore();
}

function renderSingleLayerToCanvas(layer, targetCtx) {
  targetCtx.imageSmoothingEnabled = false;
  for (const placement of sortedLayerPlacements(layer)) {
    const tile = state.tiles.find((item) => item.id === placement.tileId);
    if (!tile) continue;
    const rect = tileDrawRect(tile, placement);
    targetCtx.drawImage(tile.image, rect.x, rect.y, rect.width, rect.height);
  }
}

function drawCullPreview() {
  if (!els.cullCanvas) return;
  syncCullControlsFromState();
  const layer = cullLayer();
  const cull = layer.cull;
  const width = els.gridCanvas.width;
  const height = els.gridCanvas.height;
  configurePreviewCanvas("cull", width, height);
  cullCtx.setTransform(state.cullPreviewScale, 0, 0, state.cullPreviewScale, 0, 0);
  cullCtx.clearRect(0, 0, width, height);
  renderSingleLayerToCanvas(layer, cullCtx);
  if (cull.enabled && hasDrawableCullLines(cull)) {
    const mask = createCullMaskCanvas(width, height, cull);
    cullCtx.save();
    cullCtx.globalCompositeOperation = "destination-in";
    cullCtx.drawImage(mask, 0, 0);
    cullCtx.restore();
  }
  drawProjectGrid(cullCtx);
  const lineSets = allCullLinePixels(cull, width, height)
    .map((points) => resamplePath(points, cull.vertexCount));
  const points = activeCullLinePixels(cull, width, height);
  drawCullSubgrid(width, height, cull);
  lineSets.forEach((line, index) => {
    if (line.length < 2) return;
    cullCtx.save();
    const active = index === cull.activeLineIndex;
    cullCtx.strokeStyle = editorLineColor(index, active);
    cullCtx.lineWidth = active ? displayLineWidth(cull) : Math.max(1, displayLineWidth(cull) - 1);
    cullCtx.setLineDash([10, 6]);
    cullCtx.beginPath();
    traceCreatePath(cullCtx, simplifyStrokePoints(line), cull.lineMode);
    cullCtx.stroke();
    cullCtx.restore();
  });
  drawCullVertices(points, cull);
  const placementCount = layer.placements.size;
  els.cullPreviewStatus.textContent = `${layer.name}: ${placementCount} placed tile${placementCount === 1 ? "" : "s"}. ${cull.enabled ? "Cull enabled for preview and exports." : "Cull disabled for exports."}`;
}

function createCullMaskCanvas(width, height, cull) {
  const lineSets = allCullLinePixels(cull, width, height)
    .map((points) => resamplePath(points, cull.vertexCount))
    .filter((points) => points.length >= 2);
  return applyMaskEffects(
    combineLineMasks(width, height, lineSets, cull.side, cull.feather, cull.lineMode, cull.betweenMode),
    lineSets,
    cull.splatter,
    cull.noise
  );
}

function hasDrawableCullLines(cull) {
  syncEditorLegacyPoints(cull);
  return cull.cutLines.some((line) => normalizeCutLinePoints(line.points).length >= 2);
}

function selectedTileLabel() {
  if (state.groupSelection.length > 0) {
    return state.groupMoveOrigin ? `Moving ${state.groupSelection.length} tiles` : `${state.groupSelection.length} tiles selected`;
  }
  if (state.pickedPlacement) {
    const tile = state.tiles.find((item) => item.id === state.pickedPlacement.tileId);
    return tile ? `Moving ${tile.name}` : "Moving tile";
  }
  const selected = state.tiles.find((tile) => tile.id === state.selectedTileId);
  return selected ? selected.name : "None";
}

function updatePlacementPreview() {
  const tile = state.pickedPlacement
    ? state.tiles.find((item) => item.id === state.pickedPlacement.tileId)
    : selectedTile();
  const moving = Boolean(tile && state.pickedPlacement);
  els.placementPreview.classList.toggle("has-tile", Boolean(tile));
  els.placementPreview.src = tile ? tile.url : "";
  els.placementPreview.alt = tile ? `${tile.name} placement preview` : "";
  els.placementPreviewEmpty.hidden = Boolean(tile);
  els.placementPreviewName.textContent = state.groupSelection.length > 0
    ? `${state.groupMoveOrigin ? "Moving" : "Selected"} ${state.groupSelection.length} tiles`
    : tile ? `${moving ? "Moving " : ""}${tile.name}` : "None selected.";
}

function renderLayers() {
  const layer = activeLayer();
  state.activeLayerId = layer.id;
  els.layerList.replaceChildren();

  for (const listedLayer of [...state.layers].reverse()) {
    const item = document.createElement("div");
    item.className = "layer-list-item";
    item.classList.toggle("is-active", listedLayer.id === layer.id);

    const select = document.createElement("button");
    select.className = "layer-list-select";
    select.type = "button";
    select.dataset.layerId = listedLayer.id;
    select.setAttribute("aria-pressed", String(listedLayer.id === layer.id));

    const name = document.createElement("span");
    name.className = "layer-list-name";
    name.textContent = listedLayer.name;

    const count = document.createElement("span");
    count.className = "layer-list-count";
    count.textContent = `${listedLayer.placements.size} tile${listedLayer.placements.size === 1 ? "" : "s"}`;

    const visibility = document.createElement("label");
    visibility.className = "layer-list-visible";
    visibility.title = `Show ${listedLayer.name}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = listedLayer.visible;
    checkbox.setAttribute("aria-label", `Show ${listedLayer.name}`);
    checkbox.addEventListener("change", () => setLayerVisibility(listedLayer.id, checkbox.checked));

    const visibilityText = document.createElement("span");
    visibilityText.textContent = "Visible";

    select.addEventListener("click", () => setActiveLayer(listedLayer.id));
    select.append(name, count);
    visibility.append(checkbox, visibilityText);
    item.append(select, visibility);
    els.layerList.append(item);
  }

  els.layerName.value = layer.name;
  const layerIndex = state.layers.findIndex((item) => item.id === layer.id);
  els.moveLayerUp.disabled = layerIndex === state.layers.length - 1;
  els.moveLayerDown.disabled = layerIndex === 0;
  els.deleteLayer.disabled = state.layers.length === 1;
  drawCullPreview();
}

function updateToolButtons() {
  els.paintTool.classList.toggle("is-active", state.tool === "paint");
  els.dropTool.classList.toggle("is-active", state.tool === "drop");
  els.eraseTool.classList.toggle("is-active", state.tool === "erase");
  els.groupMoveTool.classList.toggle("is-active", state.tool === "group");
  els.groupSelectionInfo.textContent = state.groupMoveOrigin
    ? `Moving ${state.groupSelection.length} selected tiles. Click a new anchor cell.`
    : state.groupSelection.length > 0
      ? `${state.groupSelection.length} tile${state.groupSelection.length === 1 ? "" : "s"} selected.`
      : "No group selected.";
  els.moveSelectedGroup.disabled = state.groupSelection.length === 0 || Boolean(state.groupMoveOrigin);
  els.cancelGroupMove.disabled = state.groupSelection.length === 0;
}

function updateStats() {
  const placements = placedTileCount();
  const gridSize = `${tileModeLabel(state.tileMode)} · ${state.cols} x ${state.rows}`;
  els.placedCount.textContent = String(placements);
  els.selectedTileName.textContent = selectedTileLabel();
  els.importedTileCount.textContent = String(state.tiles.length);
  els.importGridSize.textContent = gridSize;
  els.exportTileCount.textContent = String(state.tiles.length);
  els.exportPlacedCount.textContent = String(placements);
  els.exportLayerCount.textContent = String(state.layers.length);
  els.exportGridSize.textContent = gridSize;
  els.gridCanvas.setAttribute("aria-label", `${tileModeLabel(state.tileMode)} placement grid`);
  updatePaletteEditor();
  updatePlacementPreview();
  updateToolButtons();
  drawCullPreview();
}

function viewerScaleLabel() {
  const percent = Math.round(state.viewerScale * 100);
  return state.viewerScale === 1 ? `Scale: ${percent}% (1:1)` : `Scale: ${percent}% (preview scaled)`;
}

function updateViewerZoom() {
  els.gridCanvas.style.transform = `scale(${state.viewerScale})`;
  els.gridCanvas.style.width = `${els.gridCanvas.width}px`;
  els.gridCanvas.style.height = `${els.gridCanvas.height}px`;
  els.gridCanvas.style.marginRight = `${Math.max(0, els.gridCanvas.width * state.viewerScale - els.gridCanvas.width)}px`;
  els.gridCanvas.style.marginBottom = `${Math.max(0, els.gridCanvas.height * state.viewerScale - els.gridCanvas.height)}px`;
  els.zoomScale.textContent = viewerScaleLabel();
  els.zoomScale.classList.toggle("is-scaled", state.viewerScale !== 1);
  els.zoomOut.disabled = state.viewerScale === viewerZoomLevels[0];
  els.zoomIn.disabled = state.viewerScale === viewerZoomLevels[viewerZoomLevels.length - 1];
}

function setViewerScale(nextScale, userInitiated = true) {
  state.viewerScale = Number(nextScale.toFixed(2));
  if (userInitiated) state.userSetViewerScale = true;
  updateViewerZoom();
}

function stepViewerZoom(direction) {
  const currentIndex = viewerZoomLevels.findIndex((level) => level === state.viewerScale);
  const fallbackIndex = viewerZoomLevels.reduce((best, level, index) => {
    return Math.abs(level - state.viewerScale) < Math.abs(viewerZoomLevels[best] - state.viewerScale) ? index : best;
  }, 0);
  const index = currentIndex === -1 ? fallbackIndex : currentIndex;
  const nextIndex = Math.min(viewerZoomLevels.length - 1, Math.max(0, index + direction));
  setViewerScale(viewerZoomLevels[nextIndex]);
}

function setPlacementGridVisibility(visible) {
  state.showPlacementGrid = visible === true;
  els.showPlacementGrid.checked = state.showPlacementGrid;
  renderGrid();
  updateContextHelp("showPlacementGrid");
  setStatus(`Placement grid ${state.showPlacementGrid ? "shown" : "hidden"} in the editor. Exports stay grid-free.`);
}

function previewScaleLabel(scale) {
  const percent = Math.round(scale * 100);
  return scale === 1 ? `Scale: ${percent}% (1:1)` : `Scale: ${percent}%`;
}

function previewZoomConfig(kind) {
  return kind === "cull"
    ? {
        stateKey: "cullPreviewScale",
        canvas: els.cullCanvas,
        wrap: els.cullCanvasWrap,
        out: els.cullZoomOut,
        in: els.cullZoomIn,
        reset: els.cullZoomReset,
        label: els.cullZoomScale
      }
    : {
        stateKey: "createPreviewScale",
        canvas: els.createCanvas,
        wrap: els.createCanvasWrap,
        out: els.createZoomOut,
        in: els.createZoomIn,
        reset: els.createZoomReset,
        label: els.createZoomScale
      };
}

function panPreview(kind, directionX, directionY) {
  const { wrap } = previewZoomConfig(kind);
  const step = Math.max(48, Math.round(Math.min(wrap.clientWidth, wrap.clientHeight) * 0.25));
  wrap.scrollLeft += directionX * step;
  wrap.scrollTop += directionY * step;
}

function centerPreview(kind) {
  const { wrap } = previewZoomConfig(kind);
  wrap.scrollLeft = Math.max(0, Math.round((wrap.scrollWidth - wrap.clientWidth) / 2));
  wrap.scrollTop = Math.max(0, Math.round((wrap.scrollHeight - wrap.clientHeight) / 2));
}

function previewLogicalWidth(canvas) {
  return Number.parseFloat(canvas.dataset.logicalWidth) || canvas.width;
}

function previewLogicalHeight(canvas) {
  return Number.parseFloat(canvas.dataset.logicalHeight) || canvas.height;
}

function configurePreviewCanvas(kind, logicalWidth = null, logicalHeight = null) {
  const config = previewZoomConfig(kind);
  const scale = state[config.stateKey];
  const width = logicalWidth ?? previewLogicalWidth(config.canvas);
  const height = logicalHeight ?? previewLogicalHeight(config.canvas);
  config.canvas.dataset.logicalWidth = String(width);
  config.canvas.dataset.logicalHeight = String(height);
  config.canvas.width = Math.max(1, Math.ceil(width * scale));
  config.canvas.height = Math.max(1, Math.ceil(height * scale));
  config.canvas.style.width = `${config.canvas.width}px`;
  config.canvas.style.height = `${config.canvas.height}px`;
  config.canvas.style.marginRight = "0";
  config.canvas.style.marginBottom = "0";
  config.canvas.style.transform = "none";
  config.label.textContent = previewScaleLabel(scale);
  config.label.classList.toggle("is-scaled", scale !== 1);
  config.out.disabled = scale === viewerZoomLevels[0];
  config.in.disabled = scale === viewerZoomLevels[viewerZoomLevels.length - 1];
}

function setPreviewScale(kind, nextScale) {
  const config = previewZoomConfig(kind);
  state[config.stateKey] = Number(nextScale.toFixed(2));
  if (kind === "cull") drawCullPreview();
  else drawCreatePreview();
}

function stepPreviewZoom(kind, direction) {
  const config = previewZoomConfig(kind);
  const currentScale = state[config.stateKey];
  const currentIndex = viewerZoomLevels.findIndex((level) => level === currentScale);
  const fallbackIndex = viewerZoomLevels.reduce((best, level, index) => {
    return Math.abs(level - currentScale) < Math.abs(viewerZoomLevels[best] - currentScale) ? index : best;
  }, 0);
  const index = currentIndex === -1 ? fallbackIndex : currentIndex;
  const nextIndex = Math.min(viewerZoomLevels.length - 1, Math.max(0, index + direction));
  setPreviewScale(kind, viewerZoomLevels[nextIndex]);
}

function defaultViewerScaleForViewport() {
  if (window.matchMedia("(max-height: 480px) and (orientation: landscape)").matches) return 0.5;
  if (window.matchMedia("(max-width: 420px)").matches) return 0.5;
  if (window.matchMedia("(max-width: 700px)").matches) return 0.67;
  return 1;
}

function applyResponsiveViewerScale() {
  if (state.userSetViewerScale) return;
  setViewerScale(defaultViewerScaleForViewport(), false);
}

async function readImageFile(file) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return { image, url };
}

async function enqueueFiles(files) {
  const pngFiles = [...files].filter((file) => file.type === "image/png" || file.name.toLowerCase().endsWith(".png"));
  pendingFiles.push(...pngFiles);
  if (!cropState) processNextCrop();
}

function addTileFromCanvas(canvas, name, updates = {}) {
  return new Promise((resolve) => {
    const url = canvas.toDataURL("image/png");
    const bounds = visiblePixelBounds(canvas);
    const image = new Image();
    image.onload = () => {
      const tile = {
        id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `tile-${Date.now()}-${tileCounter}`,
        name,
        url,
        image,
        width: canvas.width,
        height: canvas.height,
        bounds,
        ...updates
      };
      tileCounter += 1;
      state.tiles.push(tile);
      state.selectedTileId = tile.id;
      resolve(tile);
    };
    image.src = url;
  });
}

function imageToCanvas(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);
  return canvas;
}

function replaceTileFromCanvas(tile, canvas, message, updates = {}) {
  return new Promise((resolve) => {
    const url = canvas.toDataURL("image/png");
    const image = new Image();
    image.onload = () => {
      Object.assign(tile, {
        url,
        image,
        width: canvas.width,
        height: canvas.height,
        bounds: visiblePixelBounds(canvas),
        ...updates
      });
      renderPalette();
      renderGrid();
      updateStats();
      setStatus(message);
      resolve(tile);
    };
    image.src = url;
  });
}

function transformSelectedTile(transform, message) {
  const tile = selectedTile();
  if (!tile) return;
  const source = imageToCanvas(tile.image);
  const output = document.createElement("canvas");
  const isQuarterTurn = transform === "rotate-left" || transform === "rotate-right";
  output.width = isQuarterTurn ? source.height : source.width;
  output.height = isQuarterTurn ? source.width : source.height;
  const ctx = output.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  if (transform === "rotate-left" || transform === "rotate-right") {
    ctx.translate(output.width / 2, output.height / 2);
    ctx.rotate(transform === "rotate-left" ? -Math.PI / 2 : Math.PI / 2);
    ctx.drawImage(source, -source.width / 2, -source.height / 2);
  } else {
    ctx.translate(transform === "flip-horizontal" ? output.width : 0, transform === "flip-vertical" ? output.height : 0);
    ctx.scale(transform === "flip-horizontal" ? -1 : 1, transform === "flip-vertical" ? -1 : 1);
    ctx.drawImage(source, 0, 0);
  }

  replaceTileFromCanvas(tile, output, `${message} ${tile.name}.`, {
    anchor: transformedTileAnchor(tile.anchor, transform, source.width, source.height)
  });
}

function transformedTileAnchor(anchor, transform, width, height) {
  if (!anchor) return null;
  if (transform === "rotate-left") return { x: anchor.y, y: width - anchor.x };
  if (transform === "rotate-right") return { x: height - anchor.y, y: anchor.x };
  if (transform === "flip-horizontal") return { x: width - anchor.x, y: anchor.y };
  if (transform === "flip-vertical") return { x: anchor.x, y: height - anchor.y };
  return { ...anchor };
}

function hexToRgb(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  return {
    red: Number.parseInt(match[1].slice(0, 2), 16),
    green: Number.parseInt(match[1].slice(2, 4), 16),
    blue: Number.parseInt(match[1].slice(4, 6), 16)
  };
}

function applyTileTint() {
  const tile = selectedTile();
  const tint = hexToRgb(els.tileTintColor.value);
  if (!tile || !tint) return;
  const strength = clampNumber(els.tileTintStrength.value, 0, 100, 20);
  els.tileTintStrength.value = strength;
  const amount = strength / 100;
  const canvas = imageToCanvas(tile.image);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    pixels[index] = Math.round(pixels[index] * (1 - amount) + tint.red * amount);
    pixels[index + 1] = Math.round(pixels[index + 1] * (1 - amount) + tint.green * amount);
    pixels[index + 2] = Math.round(pixels[index + 2] * (1 - amount) + tint.blue * amount);
  }

  ctx.putImageData(imageData, 0, 0);
  replaceTileFromCanvas(tile, canvas, `Applied ${strength}% tint to ${tile.name}.`);
}

function makeTileColorTransparent() {
  const tile = selectedTile();
  const remove = hexToRgb(els.transparentTileColor.value);
  if (!tile || !remove) return;
  const tolerance = clampNumber(els.transparentTileTolerance.value, 0, 255, 0);
  els.transparentTileTolerance.value = tolerance;
  const canvas = imageToCanvas(tile.image);
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let changed = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    if (
      Math.abs(pixels[index] - remove.red) <= tolerance
      && Math.abs(pixels[index + 1] - remove.green) <= tolerance
      && Math.abs(pixels[index + 2] - remove.blue) <= tolerance
    ) {
      if (pixels[index + 3] !== 0) changed += 1;
      pixels[index + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  replaceTileFromCanvas(tile, canvas, `Made ${changed} pixel${changed === 1 ? "" : "s"} transparent in ${tile.name}.`);
}

function serializeTiles() {
  return state.tiles.map((tile) => ({
      id: tile.id,
      name: tile.name,
      url: tile.url,
      width: tile.width,
      height: tile.height,
      bounds: tile.bounds,
      anchor: tile.anchor,
      transition: tile.transition || null
    }));
}

function downloadJson(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

function savePalette() {
  if (state.tiles.length === 0) {
    setStatus("Import at least one tile before saving a palette.");
    return;
  }
  downloadJson("isometric-tile-palette.json", {
    format: "isometric-tile-palette",
    version: 1,
    tiles: serializeTiles()
  });
  setStatus(`Saved ${state.tiles.length} palette tile${state.tiles.length === 1 ? "" : "s"}.`);
}

function saveProject() {
  downloadJson("isometric-tile-project.json", {
    format: "isometric-tile-project",
    version: 1,
    settings: {
      cols: state.cols,
      rows: state.rows,
      tileWidth: state.tileWidth,
      tileHeight: state.tileHeight,
      spriteWidth: state.spriteWidth,
      spriteHeight: state.spriteHeight,
      tileMode: state.tileMode,
      exportCols: state.exportCols,
      showPlacementGrid: state.showPlacementGrid
    },
    tiles: serializeTiles(),
    layers: state.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      placements: sortedLayerPlacements(layer),
      cull: layer.cull ? {
        enabled: layer.cull.enabled,
        side: layer.cull.side,
        points: layer.cull.points,
        cutLines: layer.cull.cutLines,
        activeLineIndex: layer.cull.activeLineIndex,
        betweenMode: layer.cull.betweenMode,
        vertexCount: layer.cull.vertexCount,
        gridDivisions: layer.cull.gridDivisions,
        snapToGrid: layer.cull.snapToGrid,
        vertexMode: layer.cull.vertexMode,
        lineMode: layer.cull.lineMode,
        lineWidth: displayLineWidth(layer.cull),
        vertexRadius: displayVertexRadius(layer.cull),
        feather: layer.cull.feather,
        splatter: layer.cull.splatter,
        noise: layer.cull.noise
      } : null
    })),
    selectedTileId: state.selectedTileId,
    activeLayerId: state.activeLayerId,
    tool: state.tool,
    viewerScale: state.viewerScale
  });
  setStatus(`Saved project with ${state.tiles.length} palette tile${state.tiles.length === 1 ? "" : "s"}, ${state.layers.length} layer${state.layers.length === 1 ? "" : "s"}, and ${placedTileCount()} placement${placedTileCount() === 1 ? "" : "s"}.`);
}

function linePatternFromEditor(editor, target) {
  syncEditorLegacyPoints(editor);
  return {
    format: "tile-builder-line-pattern",
    version: 1,
    target,
    side: editor.side,
    cutLines: editor.cutLines.map((line) => ({ points: normalizeCutLinePoints(line.points) })),
    activeLineIndex: editor.activeLineIndex,
    betweenMode: editor.betweenMode === "include" ? "include" : "exclude",
    vertexCount: editor.vertexCount,
    gridDivisions: editor.gridDivisions,
    snapToGrid: editor.snapToGrid === true,
    vertexMode: editor.vertexMode === true,
    lineMode: editor.lineMode === "straight" ? "straight" : "smooth",
    lineWidth: displayLineWidth(editor),
    vertexRadius: displayVertexRadius(editor),
    feather: editor.feather,
    splatter: editor.splatter || 0,
    noise: editor.noise || 0
  };
}

function normalizeLinePattern(pattern, expectedTarget) {
  if (!pattern || pattern.format !== "tile-builder-line-pattern" || pattern.version !== 1) {
    throw new Error("Unsupported line pattern.");
  }
  if (pattern.target !== expectedTarget) {
    throw new Error("Line pattern target does not match this tab.");
  }
  const cutLines = normalizeCutLines(pattern.cutLines, pattern.points);
  if (cutLines.length === 0) throw new Error("Line pattern does not contain cut lines.");
  return {
    side: pattern.side === "negative" ? "negative" : "positive",
    cutLines,
    points: cutLines[Math.min(Math.max(0, pattern.activeLineIndex || 0), cutLines.length - 1)].points,
    activeLineIndex: clampNumber(pattern.activeLineIndex, 0, cutLines.length - 1, 0),
    betweenMode: pattern.betweenMode === "include" ? "include" : "exclude",
    vertexCount: clampNumber(pattern.vertexCount, 2, 24, 5),
    gridDivisions: clampNumber(pattern.gridDivisions, 2, 32, 8),
    snapToGrid: pattern.snapToGrid === true,
    vertexMode: pattern.vertexMode === true,
    lineMode: pattern.lineMode === "straight" ? "straight" : "smooth",
    lineWidth: clampNumber(pattern.lineWidth, 1, 16, 3),
    vertexRadius: clampNumber(pattern.vertexRadius, 3, 32, 5),
    feather: clampNumber(pattern.feather, 0, expectedTarget === "cull" ? 96 : 64, expectedTarget === "cull" ? 0 : 6),
    splatter: clampNumber(pattern.splatter, 0, 100, expectedTarget === "cull" ? 0 : 18),
    noise: clampNumber(pattern.noise, 0, 100, expectedTarget === "cull" ? 0 : 8)
  };
}

function saveCreatePattern() {
  downloadJson("create-line-pattern.json", linePatternFromEditor(state.create, "create"));
  setStatus("Saved Create line pattern.");
}

function saveCullPattern() {
  downloadJson("cull-line-pattern.json", linePatternFromEditor(cullLayer().cull, "cull"));
  setStatus("Saved Cull line pattern.");
}

async function loadCreatePattern(file) {
  if (!file) return;
  try {
    const pattern = normalizeLinePattern(JSON.parse(await file.text()), "create");
    Object.assign(state.create, pattern, { activeVertexIndex: -1, draggingVertex: false, drawing: false });
    drawCreatePreview();
    setStatus(`Loaded Create line pattern from ${file.name}.`);
  } catch (error) {
    console.error(error);
    setStatus(`Could not load Create line pattern from ${file.name}.`);
  }
}

async function loadCullPattern(file) {
  if (!file) return;
  try {
    const pattern = normalizeLinePattern(JSON.parse(await file.text()), "cull");
    const cull = cullLayer().cull;
    Object.assign(cull, pattern, { enabled: true, activeVertexIndex: -1, draggingVertex: false, drawing: false });
    drawCullPreview();
    setStatus(`Loaded Cull line pattern from ${file.name}.`);
  } catch (error) {
    console.error(error);
    setStatus(`Could not load Cull line pattern from ${file.name}.`);
  }
}

function imageFromDataUrl(url) {
  return new Promise((resolve, reject) => {
    if (typeof url !== "string" || !url.startsWith("data:image/png")) {
      reject(new Error("Palette tile is not a PNG data URL."));
      return;
    }
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Palette tile image could not be loaded."));
    image.src = url;
  });
}

async function deserializeTiles(serializedTiles, requireStableIds = false) {
  if (!Array.isArray(serializedTiles)) throw new Error("Tiles are missing.");
  const ids = new Set();
  const tiles = await Promise.all(serializedTiles.map(async (tile, index) => {
    const image = await imageFromDataUrl(tile.url);
    const hasStableId = typeof tile.id === "string" && tile.id && !ids.has(tile.id);
    if (requireStableIds && !hasStableId) throw new Error("Project tile IDs must be unique.");
    const id = hasStableId ? tile.id : `tile-${Date.now()}-${tileCounter + index}`;
    ids.add(id);
    return {
      id,
      name: typeof tile.name === "string" && tile.name.trim() ? tile.name.trim() : `Tile ${tileCounter + index}`,
      url: tile.url,
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      bounds: visibleImageBounds(image),
      anchor: tile.anchor && Number.isFinite(tile.anchor.x) && Number.isFinite(tile.anchor.y)
        ? { x: tile.anchor.x, y: tile.anchor.y }
        : null,
      transition: deserializeTransitionRecipe(tile.transition)
    };
  }));
  return { tiles, ids };
}

async function loadPalette(file) {
  if (!file) return;
  try {
    const palette = JSON.parse(await file.text());
    if (palette.format !== "isometric-tile-palette" || palette.version !== 1 || !Array.isArray(palette.tiles)) {
      throw new Error("Unsupported palette file.");
    }
    const { tiles, ids } = await deserializeTiles(palette.tiles);
    let removedPlacements = 0;
    for (const layer of state.layers) {
      for (const [key, placement] of layer.placements) {
        if (ids.has(placement.tileId)) continue;
        layer.placements.delete(key);
        removedPlacements += 1;
      }
    }
    if (state.pickedPlacement && !ids.has(state.pickedPlacement.tileId)) clearPickedPlacement();
    clearGroupSelection();
    state.tiles = tiles;
    state.selectedTileId = tiles[0] ? tiles[0].id : null;
    tileCounter += tiles.length;
    renderPalette();
    renderLayers();
    renderGrid();
    updateStats();
    const removalMessage = removedPlacements
      ? ` Removed ${removedPlacements} placement${removedPlacements === 1 ? "" : "s"} that did not match the loaded palette.`
      : "";
    setStatus(`Loaded ${tiles.length} palette tile${tiles.length === 1 ? "" : "s"} from ${file.name}.${removalMessage}`);
  } catch (error) {
    console.error(error);
    setStatus(`Could not load palette from ${file.name}.`);
  }
}

function deserializeProjectSettings(settings) {
  if (!settings || typeof settings !== "object") throw new Error("Project settings are missing.");
  return {
    cols: clampNumber(settings.cols, 1, 64, 8),
    rows: clampNumber(settings.rows, 1, 64, 8),
    tileWidth: clampNumber(settings.tileWidth, 8, 1024, 128),
    tileHeight: clampNumber(settings.tileHeight, 8, 1024, 64),
    spriteWidth: clampNumber(settings.spriteWidth, 8, 2048, 128),
    spriteHeight: clampNumber(settings.spriteHeight, 8, 2048, 128),
    tileMode: supportedTileMode(settings.tileMode),
    exportCols: clampNumber(settings.exportCols, 1, 64, 8),
    showPlacementGrid: settings.showPlacementGrid !== false
  };
}

function deserializeProjectLayers(serializedLayers, tileIds, settings) {
  if (!Array.isArray(serializedLayers) || serializedLayers.length === 0) {
    throw new Error("Project layers are missing.");
  }

  const layerIds = new Set();
  const layers = serializedLayers.map((layer, layerIndex) => {
    if (typeof layer.id !== "string" || !layer.id || layerIds.has(layer.id)) {
      throw new Error("Project layer IDs must be unique.");
    }
    if (!Array.isArray(layer.placements)) throw new Error("Project layer placements are missing.");
    layerIds.add(layer.id);
    const placements = new Map();
    for (const placement of layer.placements) {
      const validPlacement = Number.isInteger(placement.x)
        && Number.isInteger(placement.y)
        && placement.x >= 0
        && placement.y >= 0
        && placement.x < settings.cols
        && placement.y < settings.rows
        && tileIds.has(placement.tileId);
      if (!validPlacement) throw new Error("Project placement is invalid.");
      placements.set(placementKey(placement.x, placement.y), {
        x: placement.x,
        y: placement.y,
        tileId: placement.tileId
      });
    }
    return {
      id: layer.id,
      name: typeof layer.name === "string" && layer.name.trim() ? layer.name.trim() : `Layer ${layerIndex + 1}`,
      visible: layer.visible !== false,
      placements,
      cull: normalizeCull(layer.cull)
    };
  });
  return { layers, layerIds };
}

async function loadProject(file) {
  if (!file) return;
  try {
    const project = JSON.parse(await file.text());
    if (project.format !== "isometric-tile-project" || project.version !== 1) {
      throw new Error("Unsupported project file.");
    }

    const settings = deserializeProjectSettings(project.settings);
    const { tiles, ids: tileIds } = await deserializeTiles(project.tiles, true);
    const { layers, layerIds } = deserializeProjectLayers(project.layers, tileIds, settings);
    const selectedTileId = tileIds.has(project.selectedTileId) ? project.selectedTileId : (tiles[0] ? tiles[0].id : null);
    const activeLayerId = layerIds.has(project.activeLayerId) ? project.activeLayerId : layers[0].id;
    const tool = ["paint", "drop", "erase"].includes(project.tool) ? project.tool : "paint";
    const viewerScale = Number.isFinite(project.viewerScale)
      ? Math.min(viewerZoomLevels[viewerZoomLevels.length - 1], Math.max(viewerZoomLevels[0], project.viewerScale))
      : 1;

    pendingFiles.splice(0);
    if (cropState) releaseCropSource(cropState);
    cropState = null;
    if (els.cropDialog.open) els.cropDialog.close();
    Object.assign(state, settings, {
      tiles,
      layers,
      selectedTileId,
      activeLayerId,
      cullLayerId: activeLayerId,
      tool,
      viewerScale,
      userSetViewerScale: viewerScale !== 1,
      pickedPlacement: null,
      groupSelection: [],
      groupMoveOrigin: null,
      hoverCell: null
    });
    tileCounter += tiles.length;
    els.hoverCell.textContent = "Cell: none";
    syncSettingsControls();
    renderPalette();
    renderLayers();
    resizeGridCanvas();
    renderGrid();
    updateViewerZoom();
    updateToolButtons();
    updateStats();
    activateControlTab("projectTab");
    setStatus(`Loaded project from ${file.name}: ${tiles.length} palette tile${tiles.length === 1 ? "" : "s"}, ${layers.length} layer${layers.length === 1 ? "" : "s"}, and ${placedTileCount()} placement${placedTileCount() === 1 ? "" : "s"}.`);
  } catch (error) {
    console.error(error);
    setStatus(`Could not load project from ${file.name}.`);
  }
}

function uniqueTileName(name) {
  const extensionIndex = name.lastIndexOf(".");
  const hasExtension = extensionIndex > 0;
  const baseName = hasExtension ? name.slice(0, extensionIndex) : name;
  const extension = hasExtension ? name.slice(extensionIndex) : "";
  const names = new Set(state.tiles.map((tile) => tile.name));
  if (!names.has(name)) return name;
  let copyNumber = 1;
  let candidate = `${baseName} copy${extension}`;

  while (names.has(candidate)) {
    copyNumber += 1;
    candidate = `${baseName} copy ${copyNumber}${extension}`;
  }
  return candidate;
}

function cloneSelectedTile() {
  const tile = selectedTile();
  if (!tile) return;
  const image = new Image();
  image.onload = () => {
    const clone = {
      id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `tile-${Date.now()}-${tileCounter}`,
      name: uniqueTileName(tile.name),
      url: tile.url,
      image,
      width: tile.width,
      height: tile.height,
      bounds: tile.bounds ? { ...tile.bounds } : null,
      anchor: tile.anchor ? { ...tile.anchor } : null,
      transition: tile.transition ? structuredClone(tile.transition) : null
    };
    tileCounter += 1;
    state.tiles.push(clone);
    state.selectedTileId = clone.id;
    renderPalette();
    updateStats();
    setStatus(`Cloned ${tile.name} as ${clone.name}.`);
  };
  image.src = tile.url;
}

function renameSelectedTile() {
  const tile = selectedTile();
  if (!tile) return;
  const nextName = els.paletteTileName.value.trim();
  if (!nextName) {
    els.paletteTileName.value = tile.name;
    setStatus("Enter a name before renaming the tile.");
    return;
  }
  const previousName = tile.name;
  tile.name = nextName;
  renderPalette();
  updateStats();
  setStatus(`Renamed ${previousName} to ${tile.name}.`);
}

function deleteSelectedTile() {
  const tile = selectedTile();
  if (!tile) return;
  state.tiles = state.tiles.filter((item) => item.id !== tile.id);
  for (const layer of state.layers) {
    for (const [key, placement] of layer.placements) {
      if (placement.tileId === tile.id) layer.placements.delete(key);
    }
  }
  if (state.pickedPlacement && state.pickedPlacement.tileId === tile.id) clearPickedPlacement();
  clearGroupSelection();
  state.selectedTileId = state.tiles[0] ? state.tiles[0].id : null;
  renderPalette();
  renderLayers();
  renderGrid();
  updateStats();
  setStatus(`Deleted ${tile.name} from the palette and removed its placements.`);
}

function visiblePixelBounds(canvas) {
  const ctx = canvas.getContext("2d");
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = pixels[(y * canvas.width + x) * 4 + 3];
      if (alpha === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX === -1) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function visibleImageBounds(image) {
  return visiblePixelBounds(imageToCanvas(image));
}

function expandedCropBounds(bounds, paddingX, paddingY) {
  const width = Math.min(2048, Math.max(bounds.width + paddingX * 2, state.tileWidth));
  const height = Math.min(2048, Math.max(bounds.height + paddingY * 2, state.tileHeight));
  return {
    x: bounds.x - Math.floor((width - bounds.width) / 2),
    y: bounds.y - Math.floor((height - bounds.height) / 2),
    width,
    height
  };
}

function anchorCropPadding() {
  return {
    x: Math.max(8, Math.ceil(state.tileWidth / 4)),
    y: Math.max(8, Math.ceil(state.tileHeight / 2))
  };
}

async function importSpritesheet(file) {
  if (!file) return;
  try {
    const { image, url } = await readImageFile(file);
    const columns = Math.floor(image.width / state.spriteWidth);
    const rows = Math.floor(image.height / state.spriteHeight);
    if (columns < 1 || rows < 1) {
      setStatus(`Sprite sheet is smaller than ${state.spriteWidth}x${state.spriteHeight}.`);
      URL.revokeObjectURL(url);
      return;
    }

    const baseName = file.name.replace(/\.png$/i, "");
    let imported = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = state.spriteWidth;
        tileCanvas.height = state.spriteHeight;
        const tileCtx = tileCanvas.getContext("2d");
        tileCtx.imageSmoothingEnabled = false;
        tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
        tileCtx.drawImage(
          image,
          column * state.spriteWidth,
          row * state.spriteHeight,
          state.spriteWidth,
          state.spriteHeight,
          0,
          0,
          state.spriteWidth,
          state.spriteHeight
        );
        if (!visiblePixelBounds(tileCanvas)) continue;
        await addTileFromCanvas(tileCanvas, `${baseName}_${row + 1}_${column + 1}.png`);
        imported += 1;
      }
    }

    URL.revokeObjectURL(url);
    renderPalette();
    updateStats();
    setStatus(`Imported ${imported} tiles from ${file.name} using ${state.spriteWidth}x${state.spriteHeight} sprite cells.`);
    if (imported > 0) activateControlTab("paletteTab");
  } catch (error) {
    console.error(error);
    setStatus(`Could not import ${file.name}.`);
  }
}

async function processNextCrop() {
  const file = pendingFiles.shift();
  if (!file) {
    cropState = null;
    return;
  }

  try {
    const { image, url } = await readImageFile(file);
    openCropEditor({ file, image, sourceUrl: url });
  } catch (error) {
    console.error(error);
    setStatus(`Could not load ${file.name}.`);
    processNextCrop();
  }
}

function openCropEditor({ file, image, sourceUrl = null, editTileId = null, outputWidth = state.spriteWidth, outputHeight = state.spriteHeight }) {
  cropState = {
    file,
    image,
    sourceUrl,
    editTileId,
    sourceBounds: visibleImageBounds(image),
    outputWidth,
    outputHeight,
    scale: 1,
    scaleMode: els.cropScaleMode.value,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    settingCrop: false
  };
  els.cropTitle.textContent = file.name;
  els.cropWidth.value = cropState.outputWidth;
  els.cropHeight.value = cropState.outputHeight;
  els.cropPaddingX.value = 0;
  els.cropPaddingY.value = 0;
  els.setCrop.disabled = false;
  els.saveCrop.disabled = false;
  setupCropCanvas();
  centerCropImage();
  els.cropDialog.showModal();
}

function recropSelectedTile() {
  const tile = selectedTile();
  if (!tile) return;
  openCropEditor({
    file: { name: tile.name },
    image: tile.image,
    editTileId: tile.id,
    outputWidth: tile.width,
    outputHeight: tile.height
  });
  setStatus(`Re-cropping ${tile.name}.`);
}

function releaseCropSource(crop) {
  if (crop && crop.sourceUrl && crop.sourceUrl.startsWith("blob:")) {
    URL.revokeObjectURL(crop.sourceUrl);
  }
}

function setupCropCanvas() {
  const aspect = cropState ? cropState.outputWidth / cropState.outputHeight : state.spriteWidth / state.spriteHeight;
  let width = 560;
  let height = width / aspect;
  if (height > 380) {
    height = 380;
    width = height * aspect;
  }
  if (width < 180) {
    width = 180;
    height = width / aspect;
  }
  if (height < 120) {
    height = 120;
    width = height * aspect;
  }
  els.cropCanvas.width = Math.round(width);
  els.cropCanvas.height = Math.round(height);
}

function setCropWindowSize(width, height) {
  cropState.outputWidth = clampNumber(width, 1, 2048, cropState.outputWidth);
  cropState.outputHeight = clampNumber(height, 1, 2048, cropState.outputHeight);
  els.cropWidth.value = cropState.outputWidth;
  els.cropHeight.value = cropState.outputHeight;
  setupCropCanvas();
}

function applyCustomCropSize() {
  if (!cropState) return;
  setCropWindowSize(els.cropWidth.value, els.cropHeight.value);
  centerCropImage();
  setStatus(`Crop window set to ${cropState.outputWidth}x${cropState.outputHeight}. Drag the image to position the crop.`);
}

function updateCropZoomRange() {
  if (!cropState) return;
  const scaleX = els.cropCanvas.width / cropState.image.width;
  const scaleY = els.cropCanvas.height / cropState.image.height;
  els.cropZoom.min = String(Math.max(0.05, Math.min(scaleX, scaleY) * 0.5));
  els.cropZoom.max = String(Math.max(4, cropState.scale * 4));
}

function autoCropVisiblePixels() {
  if (!cropState) return;
  if (!cropState.sourceBounds) {
    setStatus(`${cropState.file.name} has no visible pixels to crop.`);
    return;
  }

  const extraPaddingX = clampNumber(els.cropPaddingX.value, 0, 256, 0);
  const extraPaddingY = clampNumber(els.cropPaddingY.value, 0, 256, 0);
  const anchorPadding = anchorCropPadding();
  els.cropPaddingX.value = extraPaddingX;
  els.cropPaddingY.value = extraPaddingY;
  const bounds = expandedCropBounds(
    cropState.sourceBounds,
    anchorPadding.x + extraPaddingX,
    anchorPadding.y + extraPaddingY
  );
  setCropWindowSize(bounds.width, bounds.height);
  cropState.scaleMode = "1";
  cropState.scale = cropScaleForMode("1");
  cropState.offsetX = -bounds.x * cropState.scale;
  cropState.offsetY = -bounds.y * cropState.scale;
  updateCropZoomRange();
  syncCropControls();
  drawCrop();
  setStatus(`Auto crop set to ${bounds.width}x${bounds.height} with ${anchorPadding.x}px X / ${anchorPadding.y}px Y anchor padding and ${extraPaddingX}px X / ${extraPaddingY}px Y extra padding.`);
}

function centerCropImage() {
  if (!cropState) return;
  cropState.scale = cropScaleForMode(cropState.scaleMode || "free");
  cropState.offsetX = (els.cropCanvas.width - cropState.image.width * cropState.scale) / 2;
  cropState.offsetY = (els.cropCanvas.height - cropState.image.height * cropState.scale) / 2;
  updateCropZoomRange();
  syncCropControls();
  drawCrop();
}

function cropScaleForMode(mode) {
  if (!cropState) return 1;
  const scaleX = els.cropCanvas.width / cropState.image.width;
  const scaleY = els.cropCanvas.height / cropState.image.height;
  if (mode === "fit") return Math.min(scaleX, scaleY);
  if (mode === "free") return Math.max(scaleX, scaleY);
  const sourceScale = Number.parseFloat(mode);
  if (!Number.isFinite(sourceScale) || sourceScale <= 0) return Math.max(scaleX, scaleY);
  return els.cropCanvas.width / ((cropState ? cropState.outputWidth : state.spriteWidth) / sourceScale);
}

function syncCropControls() {
  if (!cropState) return;
  els.cropScaleMode.value = cropState.scaleMode || "free";
  els.cropZoom.value = String(cropState.scale);
  els.cropZoom.disabled = cropState.scaleMode !== "free";
  updateCropSourceInfo();
}

function updateCropSourceInfo() {
  if (!cropState) {
    els.cropSourceInfo.textContent = "Crop source: auto";
    return;
  }
  const sourceWidth = Math.round(els.cropCanvas.width / cropState.scale);
  const sourceHeight = Math.round(els.cropCanvas.height / cropState.scale);
  const modeText = cropState.scaleMode === "free" ? "free zoom" : cropState.scaleMode === "fit" ? "fit image" : `${cropState.scaleMode}x locked`;
  els.cropSourceInfo.textContent = `Crop source: ${sourceWidth}x${sourceHeight}px (${modeText})`;
}

function setCropScaleMode(mode) {
  if (!cropState) return;
  const previousScale = cropState.scale;
  const centerX = els.cropCanvas.width / 2;
  const centerY = els.cropCanvas.height / 2;
  const imagePointX = (centerX - cropState.offsetX) / previousScale;
  const imagePointY = (centerY - cropState.offsetY) / previousScale;
  cropState.scaleMode = mode;
  cropState.scale = cropScaleForMode(mode);
  cropState.offsetX = centerX - imagePointX * cropState.scale;
  cropState.offsetY = centerY - imagePointY * cropState.scale;
  syncCropControls();
  drawCrop();
}

function nudgeCrop(deltaX, deltaY) {
  if (!cropState) return;
  const pixels = clampNumber(els.cropNudgePixels.value, 1, 2048, 1);
  els.cropNudgePixels.value = pixels;
  cropState.offsetX += deltaX * pixels * cropState.scale;
  cropState.offsetY += deltaY * pixels * cropState.scale;
  drawCrop();
}

function drawCrop() {
  if (!cropState) return;
  cropCtx.clearRect(0, 0, els.cropCanvas.width, els.cropCanvas.height);
  cropCtx.drawImage(
    cropState.image,
    cropState.offsetX,
    cropState.offsetY,
    cropState.image.width * cropState.scale,
    cropState.image.height * cropState.scale
  );
  drawCropGridOverlay();
  cropCtx.strokeStyle = cssVar("--accent");
  cropCtx.lineWidth = 3;
  cropCtx.strokeRect(1.5, 1.5, els.cropCanvas.width - 3, els.cropCanvas.height - 3);
  updateCropSourceInfo();
}

function cropAnchor(width = cropState.outputWidth, height = cropState.outputHeight) {
  return {
    x: width / 2,
    y: height / 2
  };
}

function drawCropGridOverlay() {
  const anchor = cropAnchor();
  const scaleX = els.cropCanvas.width / cropState.outputWidth;
  const scaleY = els.cropCanvas.height / cropState.outputHeight;
  const centerX = anchor.x * scaleX;
  const centerY = anchor.y * scaleY;
  cropCtx.save();
  cropCtx.beginPath();
  if (state.tileMode === "isometric") {
    const halfWidth = state.tileWidth / 2 * scaleX;
    const halfHeight = state.tileHeight / 2 * scaleY;
    cropCtx.moveTo(centerX, centerY - halfHeight);
    cropCtx.lineTo(centerX + halfWidth, centerY);
    cropCtx.lineTo(centerX, centerY + halfHeight);
    cropCtx.lineTo(centerX - halfWidth, centerY);
  } else {
    cropCtx.rect(
      centerX - state.tileWidth / 2 * scaleX,
      centerY - state.tileHeight / 2 * scaleY,
      state.tileWidth * scaleX,
      state.tileHeight * scaleY
    );
  }
  cropCtx.closePath();
  cropCtx.fillStyle = cssVar("--grid-hover");
  cropCtx.strokeStyle = cssVar("--accent");
  cropCtx.lineWidth = 2;
  cropCtx.fill();
  cropCtx.stroke();
  cropCtx.restore();
}

function currentCropCanvas() {
  const output = document.createElement("canvas");
  output.width = cropState.outputWidth;
  output.height = cropState.outputHeight;
  const outputCtx = output.getContext("2d");
  outputCtx.imageSmoothingEnabled = false;

  const sx = -cropState.offsetX / cropState.scale;
  const sy = -cropState.offsetY / cropState.scale;
  const sw = els.cropCanvas.width / cropState.scale;
  const sh = els.cropCanvas.height / cropState.scale;
  outputCtx.clearRect(0, 0, output.width, output.height);
  outputCtx.drawImage(cropState.image, sx, sy, sw, sh, 0, 0, output.width, output.height);
  return output;
}

function setCurrentCrop() {
  if (!cropState || cropState.settingCrop) return;
  const activeCrop = cropState;
  const output = currentCropCanvas();
  const image = new Image();
  cropState.settingCrop = true;
  els.setCrop.disabled = true;
  els.saveCrop.disabled = true;
  image.onload = () => {
    if (cropState !== activeCrop) return;
    cropState.image = image;
    cropState.sourceBounds = visiblePixelBounds(output);
    cropState.scaleMode = "1";
    cropState.scale = cropScaleForMode("1");
    cropState.offsetX = 0;
    cropState.offsetY = 0;
    updateCropZoomRange();
    syncCropControls();
    drawCrop();
    cropState.settingCrop = false;
    els.setCrop.disabled = false;
    els.saveCrop.disabled = false;
    setStatus(`Crop set to ${output.width}x${output.height}. Keep adjusting or add the tile.`);
  };
  image.src = output.toDataURL("image/png");
}

function saveCurrentCrop() {
  if (!cropState || cropState.settingCrop) return;
  const activeCrop = cropState;
  const output = currentCropCanvas();
  const url = output.toDataURL("image/png");
  const bounds = visiblePixelBounds(output);
  const image = new Image();
  image.onload = () => {
    if (cropState !== activeCrop) return;
    let tile = state.tiles.find((item) => item.id === activeCrop.editTileId);
    const wasEditing = Boolean(tile);
    const anchor = cropAnchor(output.width, output.height);
    if (tile) {
      Object.assign(tile, { url, image, width: output.width, height: output.height, bounds, anchor });
    } else {
      tile = {
        id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `tile-${Date.now()}-${tileCounter}`,
        name: activeCrop.file.name || `Tile ${tileCounter}`,
        url,
        image,
        width: output.width,
        height: output.height,
        bounds,
        anchor
      };
      tileCounter += 1;
      state.tiles.push(tile);
    }
    state.selectedTileId = tile.id;
    releaseCropSource(activeCrop);
    cropState = null;
    els.cropDialog.close();
    renderPalette();
    renderGrid();
    updateStats();
    setStatus(`${wasEditing ? "Updated" : "Added"} ${tile.name} at ${output.width}x${output.height}.`);
    activateControlTab("paletteTab");
    processNextCrop();
  };
  image.src = url;
}

function skipCurrentCrop() {
  releaseCropSource(cropState);
  cropState = null;
  els.cropDialog.close();
  processNextCrop();
}

function canvasPointFromEvent(event) {
  const rect = els.gridCanvas.getBoundingClientRect();
  const scaleX = els.gridCanvas.width / rect.width;
  const scaleY = els.gridCanvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function handleGridPointerMove(event) {
  const point = canvasPointFromEvent(event);
  const cell = cellFromPoint(point.x, point.y);
  const changed = JSON.stringify(cell) !== JSON.stringify(state.hoverCell);
  state.hoverCell = cell;
  els.hoverCell.textContent = cell ? `Cell: ${cell.x}, ${cell.y}` : "Cell: none";
  if (changed) renderGrid();
}

function toggleGroupPlacement(layer, key, placement) {
  const selectionIndex = state.groupSelection.findIndex((item) => item.layerId === layer.id && item.key === key);
  if (selectionIndex >= 0) {
    state.groupSelection.splice(selectionIndex, 1);
  } else {
    state.groupSelection.push({ ...placement, key, layerId: layer.id });
  }
  renderGrid();
  updateStats();
  setStatus(state.groupSelection.length > 0
    ? `Selected ${state.groupSelection.length} tile${state.groupSelection.length === 1 ? "" : "s"} for a group move.`
    : "Group selection cleared.");
}

function beginGroupMove() {
  if (state.groupSelection.length === 0 || state.groupMoveOrigin) return;
  const [anchor] = state.groupSelection;
  state.groupMoveOrigin = {
    layerId: anchor.layerId,
    anchorX: anchor.x,
    anchorY: anchor.y,
    placements: state.groupSelection.map((placement) => ({ ...placement }))
  };
  renderGrid();
  updateStats();
  setStatus(`Moving ${state.groupSelection.length} selected tile${state.groupSelection.length === 1 ? "" : "s"}. Click a new anchor cell.`);
}

function cancelGroupMove(message = "Group selection canceled.") {
  clearGroupSelection();
  renderGrid();
  updateStats();
  setStatus(message);
}

function finishGroupMove(targetCell) {
  const origin = state.groupMoveOrigin;
  if (!origin) return;
  const layer = state.layers.find((item) => item.id === origin.layerId);
  const candidates = groupMoveCandidates(targetCell);
  const outsideGrid = candidates.some((placement) => {
    return placement.x < 0 || placement.y < 0 || placement.x >= state.cols || placement.y >= state.rows;
  });
  if (!layer || outsideGrid) {
    cancelGroupMove("Group move canceled. The selected tiles were restored because part of the group would leave the grid.");
    return;
  }
  if (!canPlaceGroup(candidates)) {
    cancelGroupMove("Group move canceled. The selected tiles were restored because another tile blocks the destination.");
    return;
  }

  for (const placement of origin.placements) {
    layer.placements.delete(placement.key);
  }
  for (const placement of candidates) {
    layer.placements.set(placementKey(placement.x, placement.y), {
      x: placement.x,
      y: placement.y,
      tileId: placement.tileId
    });
  }
  const movedCount = candidates.length;
  clearGroupSelection();
  renderGrid();
  renderLayers();
  updateStats();
  setStatus(`Moved ${movedCount} tiles together.`);
}

function handleGroupMoveClick(cell, layer, key) {
  if (state.groupMoveOrigin) {
    finishGroupMove(cell);
    return;
  }
  const placement = layer.placements.get(key);
  if (!placement) {
    setStatus("Select placed tiles on the active layer, then choose Move Selected.");
    return;
  }
  toggleGroupPlacement(layer, key, placement);
}

function handleGridClick(event) {
  const point = canvasPointFromEvent(event);
  const cell = cellFromPoint(point.x, point.y);
  if (!cell) return;

  const key = placementKey(cell.x, cell.y);
  const layer = activeLayer();
  if (state.tool === "group") {
    handleGroupMoveClick(cell, layer, key);
    return;
  } else if (state.tool === "erase") {
    layer.placements.delete(key);
    if (state.pickedPlacement && state.pickedPlacement.layerId === layer.id && state.pickedPlacement.key === key) {
      clearPickedPlacement();
    }
  } else if (state.tool === "drop") {
    const existing = layer.placements.get(key);
    if (state.pickedPlacement) {
      if (existing) {
        setStatus("Drop mode only moves tiles into empty spots.");
        return;
      }
      const sourceLayer = state.layers.find((item) => item.id === state.pickedPlacement.layerId);
      if (!sourceLayer) {
        clearPickedPlacement();
        setStatus("The picked tile is no longer available.");
        return;
      }
      sourceLayer.placements.delete(state.pickedPlacement.key);
      layer.placements.set(key, { x: cell.x, y: cell.y, tileId: state.pickedPlacement.tileId });
      const tile = state.tiles.find((item) => item.id === state.pickedPlacement.tileId);
      clearPickedPlacement();
      setStatus(`Moved ${tile ? tile.name : "tile"} to ${cell.x}, ${cell.y}.`);
    } else if (existing) {
      state.pickedPlacement = {
        layerId: layer.id,
        key,
        x: existing.x,
        y: existing.y,
        tileId: existing.tileId
      };
      const tile = state.tiles.find((item) => item.id === existing.tileId);
      setStatus(`Picked up ${tile ? tile.name : "tile"}. Choose an empty spot.`);
    } else if (!state.selectedTileId) {
      setStatus("Click a placed tile to pick it up, or select a palette tile to drop.");
      return;
    } else {
      layer.placements.set(key, { x: cell.x, y: cell.y, tileId: state.selectedTileId });
      setStatus(`Dropped tile at ${cell.x}, ${cell.y}.`);
    }
  } else if (state.selectedTileId) {
    if (state.pickedPlacement) clearPickedPlacement();
    layer.placements.set(key, { x: cell.x, y: cell.y, tileId: state.selectedTileId });
  } else {
    if (state.pickedPlacement) {
      setStatus("Finish moving the picked tile before painting.");
      return;
    }
    setStatus("Select a tile before painting the grid.");
    return;
  }

  renderGrid();
  renderLayers();
  updateStats();
}

function clearGrid() {
  activeLayer().placements.clear();
  clearPickedPlacement();
  clearGroupSelection();
  renderGrid();
  renderLayers();
  updateStats();
  setStatus(`${activeLayer().name} cleared.`);
}

function addLayer() {
  const nextNumber = state.layers.length + 1;
  const layer = {
    id: globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `layer-${Date.now()}-${nextNumber}`,
    name: `Layer ${nextNumber}`,
    visible: true,
    placements: new Map(),
    cull: defaultCullState()
  };
  state.layers.push(layer);
  state.activeLayerId = layer.id;
  state.cullLayerId = layer.id;
  clearPickedPlacement();
  clearGroupSelection();
  renderLayers();
  renderGrid();
  updateStats();
  setStatus(`${layer.name} added.`);
}

function deleteActiveLayer() {
  if (state.layers.length === 1) {
    setStatus("At least one layer is required.");
    return;
  }
  const layer = activeLayer();
  const index = state.layers.findIndex((item) => item.id === layer.id);
  state.layers.splice(index, 1);
  state.activeLayerId = state.layers[Math.max(0, index - 1)].id;
  if (state.cullLayerId === layer.id) state.cullLayerId = state.activeLayerId;
  if (state.pickedPlacement && state.pickedPlacement.layerId === layer.id) clearPickedPlacement();
  clearGroupSelection();
  renderLayers();
  renderGrid();
  updateStats();
  setStatus(`${layer.name} deleted.`);
}

function setActiveLayer(layerId) {
  if (!state.layers.some((layer) => layer.id === layerId)) return;
  state.activeLayerId = layerId;
  clearPickedPlacement();
  clearGroupSelection();
  renderLayers();
  setStatus(`${activeLayer().name} selected.`);
}

function renameActiveLayer() {
  const layer = activeLayer();
  const nextName = els.layerName.value.trim();
  if (!nextName) {
    els.layerName.value = layer.name;
    setStatus("Enter a layer name before renaming.");
    return;
  }

  const previousName = layer.name;
  layer.name = nextName;
  renderLayers();
  setStatus(`${previousName} renamed to ${nextName}.`);
}

function moveActiveLayer(direction) {
  const layer = activeLayer();
  const index = state.layers.findIndex((item) => item.id === layer.id);
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.layers.length) return;
  state.layers.splice(index, 1);
  state.layers.splice(nextIndex, 0, layer);
  renderLayers();
  renderGrid();
  updateStats();
  setStatus(`${layer.name} moved ${direction > 0 ? "up" : "down"}.`);
}

function setLayerVisibility(layerId, visible) {
  const layer = state.layers.find((item) => item.id === layerId);
  if (!layer) return;
  layer.visible = visible;
  renderLayers();
  renderGrid();
  setStatus(`${layer.name} ${visible ? "shown" : "hidden"}.`);
}

function exportSpritesheet() {
  updateExportColumns();
  const placements = allPlacementsSorted();

  if (placements.length === 0) {
    setStatus("Place at least one tile before exporting.");
    return;
  }

  const columns = Math.max(1, Math.min(state.exportCols, placements.length));
  const rows = Math.ceil(placements.length / columns);
  const sheet = document.createElement("canvas");
  sheet.width = columns * state.spriteWidth;
  sheet.height = rows * state.spriteHeight;
  const ctx = sheet.getContext("2d");
  ctx.clearRect(0, 0, sheet.width, sheet.height);
  ctx.imageSmoothingEnabled = false;

  placements.forEach((placement, index) => {
    const tile = state.tiles.find((item) => item.id === placement.tileId);
    if (!tile) return;
    const x = index % columns;
    const y = Math.floor(index / columns);
    ctx.drawImage(tile.image, x * state.spriteWidth, y * state.spriteHeight, state.spriteWidth, state.spriteHeight);
  });

  const link = document.createElement("a");
  link.download = `godot-tileset-${state.spriteWidth}x${state.spriteHeight}.png`;
  link.href = sheet.toDataURL("image/png");
  link.click();
  setStatus(`Exported ${placements.length} tiles as ${sheet.width}x${sheet.height} PNG.`);
}

function renderSceneLayers(layers) {
  const placements = layers.flatMap((layer, layerIndex) => {
    return sortedLayerPlacements(layer).map((placement) => ({ ...placement, layerIndex }));
  });

  const map = document.createElement("canvas");
  map.width = els.gridCanvas.width;
  map.height = els.gridCanvas.height;
  const ctx = map.getContext("2d");
  ctx.clearRect(0, 0, map.width, map.height);
  ctx.imageSmoothingEnabled = false;

  layers.forEach((layer) => {
    const layerCanvas = document.createElement("canvas");
    layerCanvas.width = map.width;
    layerCanvas.height = map.height;
    const layerCtx = layerCanvas.getContext("2d");
    layerCtx.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
    renderSingleLayerToCanvas(layer, layerCtx);
    if (layer.cull && layer.cull.enabled && hasDrawableCullLines(layer.cull)) {
      const mask = createCullMaskCanvas(layerCanvas.width, layerCanvas.height, layer.cull);
      layerCtx.save();
      layerCtx.globalCompositeOperation = "destination-in";
      layerCtx.drawImage(mask, 0, 0);
      layerCtx.restore();
    }
    ctx.drawImage(layerCanvas, 0, 0);
  });

  return { map, placements };
}

function downloadSceneImage(map, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = map.toDataURL("image/png");
  link.click();
}

function exportMapImage() {
  const { map, placements } = renderSceneLayers(visibleLayers());
  if (placements.length === 0) {
    setStatus("Paint at least one visible tile before exporting the full scene.");
    return;
  }

  downloadSceneImage(map, `${filenameSlug(tileModeLabel())}-map-${state.cols}x${state.rows}.png`);
  setStatus(`Exported full scene as ${map.width}x${map.height} PNG from ${placements.length} visible tiles.`);
}

function filenameSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "layer";
}

function exportActiveLayerImage() {
  const layer = activeLayer();
  const { map, placements } = renderSceneLayers([layer]);
  if (placements.length === 0) {
    setStatus(`Paint at least one tile on ${layer.name} before exporting it.`);
    return;
  }

  downloadSceneImage(map, `${filenameSlug(tileModeLabel())}-layer-${filenameSlug(layer.name)}-${state.cols}x${state.rows}.png`);
  setStatus(`Exported ${layer.name} as ${map.width}x${map.height} PNG from ${placements.length} tiles.`);
}

function handleCropZoom() {
  if (!cropState) return;
  cropState.scaleMode = "free";
  const previousScale = cropState.scale;
  const nextScale = Number.parseFloat(els.cropZoom.value);
  const centerX = els.cropCanvas.width / 2;
  const centerY = els.cropCanvas.height / 2;
  const imagePointX = (centerX - cropState.offsetX) / previousScale;
  const imagePointY = (centerY - cropState.offsetY) / previousScale;
  cropState.scale = nextScale;
  cropState.offsetX = centerX - imagePointX * nextScale;
  cropState.offsetY = centerY - imagePointY * nextScale;
  syncCropControls();
  drawCrop();
}

function cropPointer(event) {
  const rect = els.cropCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (els.cropCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (els.cropCanvas.height / rect.height)
  };
}

function createPointer(event) {
  const rect = els.createCanvas.getBoundingClientRect();
  const width = previewLogicalWidth(els.createCanvas);
  const height = previewLogicalHeight(els.createCanvas);
  return {
    x: Math.min(width, Math.max(0, (event.clientX - rect.left) * (width / rect.width))),
    y: Math.min(height, Math.max(0, (event.clientY - rect.top) * (height / rect.height)))
  };
}

function setCreatePointsFromPixels(points, width = previewLogicalWidth(els.createCanvas), height = previewLogicalHeight(els.createCanvas)) {
  setActiveEditorLinePoints(state.create, normalizeCreatePoints(points, width, height));
}

function nearestCreateVertex(point) {
  const width = previewLogicalWidth(els.createCanvas);
  const height = previewLogicalHeight(els.createCanvas);
  const points = activeCreateLinePixels(width, height);
  const radius = Math.max(12, displayVertexRadius(state.create) + 4);
  let closest = { index: -1, distance: Infinity };
  points.forEach((vertex, index) => {
    const distance = Math.hypot(point.x - vertex.x, point.y - vertex.y);
    if (distance < closest.distance) closest = { index, distance };
  });
  return closest.distance <= radius ? closest.index : -1;
}

function setCreateVertexCount() {
  const nextCount = clampNumber(els.createVertexCount.value, 2, 24, state.create.vertexCount);
  const width = previewLogicalWidth(els.createCanvas);
  const height = previewLogicalHeight(els.createCanvas);
  const points = activeCreateLinePixels(width, height);
  state.create.vertexCount = nextCount;
  els.createVertexCount.value = nextCount;
  setCreatePointsFromPixels(resamplePath(points, nextCount));
  state.create.activeVertexIndex = Math.min(state.create.activeVertexIndex, nextCount - 1);
  drawCreatePreview();
}

function updateCreatePathControls() {
  const previousSnap = state.create.snapToGrid;
  state.create.gridDivisions = clampNumber(els.createGridDivisions.value, 2, 32, state.create.gridDivisions);
  state.create.lineMode = els.createLineMode.value === "straight" ? "straight" : "smooth";
  state.create.lineWidth = clampNumber(els.createLineWidth.value, 1, 16, displayLineWidth(state.create));
  state.create.vertexRadius = clampNumber(els.createVertexRadius.value, 3, 32, displayVertexRadius(state.create));
  state.create.snapToGrid = els.createSnapToGrid.checked;
  state.create.vertexMode = els.createVertexMode.checked;
  els.createGridDivisions.value = state.create.gridDivisions;
  els.createLineWidth.value = state.create.lineWidth;
  els.createVertexRadius.value = state.create.vertexRadius;
  if (state.create.snapToGrid && (!previousSnap || state.create.points.length > 0)) {
    const width = previewLogicalWidth(els.createCanvas);
    const height = previewLogicalHeight(els.createCanvas);
    const points = activeCreateLinePixels(width, height)
      .map((point) => snapCreatePoint(point, width, height));
    setCreatePointsFromPixels(points);
  }
  drawCreatePreview();
}

function beginCreateStroke(event) {
  if (!state.create.tileBId) return;
  const width = previewLogicalWidth(els.createCanvas);
  const height = previewLogicalHeight(els.createCanvas);
  const rawPoint = createPointer(event);
  const vertexIndex = nearestCreateVertex(rawPoint);
  if (vertexIndex >= 0) {
    state.create.activeVertexIndex = vertexIndex;
    state.create.draggingVertex = true;
    state.create.drawing = false;
    els.createCanvas.setPointerCapture(event.pointerId);
    drawCreatePreview();
    return;
  }
  if (state.create.vertexMode) return;
  const point = snapCreatePoint(rawPoint, width, height);
  state.create.drawing = true;
  state.create.draggingVertex = false;
  state.create.activeVertexIndex = -1;
  setCreatePointsFromPixels([point]);
  els.createCanvas.setPointerCapture(event.pointerId);
  drawCreatePreview();
}

function continueCreateStroke(event) {
  if (!state.create.drawing && !state.create.draggingVertex) return;
  const width = previewLogicalWidth(els.createCanvas);
  const height = previewLogicalHeight(els.createCanvas);
  const point = snapCreatePoint(createPointer(event), width, height);
  if (state.create.draggingVertex) {
    const points = activeCreateLinePixels(width, height);
    points[state.create.activeVertexIndex] = point;
    setCreatePointsFromPixels(points);
    drawCreatePreview();
    return;
  }
  const points = storedCreateLinePixels(width, height);
  const previous = points[points.length - 1];
  if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 3) return;
  points.push(point);
  setCreatePointsFromPixels(points);
  drawCreatePreview();
}

function endCreateStroke(event) {
  if (!state.create.drawing && !state.create.draggingVertex) return;
  continueCreateStroke(event);
  if (state.create.drawing) {
    const width = previewLogicalWidth(els.createCanvas);
    const height = previewLogicalHeight(els.createCanvas);
    const points = storedCreateLinePixels(width, height);
    if (points.length < 2) {
      points.push({ x: width - points[0].x, y: height - points[0].y });
    }
    const resampled = resamplePath(points, state.create.vertexCount)
      .map((point) => snapCreatePoint(point, width, height));
    setCreatePointsFromPixels(resampled);
  }
  state.create.drawing = false;
  state.create.draggingVertex = false;
  els.createCanvas.releasePointerCapture(event.pointerId);
  drawCreatePreview();
}

function cullPointer(event) {
  const rect = els.cullCanvas.getBoundingClientRect();
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  return {
    x: Math.min(width, Math.max(0, (event.clientX - rect.left) * (width / rect.width))),
    y: Math.min(height, Math.max(0, (event.clientY - rect.top) * (height / rect.height)))
  };
}

function nearestCullVertex(point, cull) {
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  const points = activeCullLinePixels(cull, width, height);
  const radius = Math.max(14, displayVertexRadius(cull) + 4);
  let closest = { index: -1, distance: Infinity };
  points.forEach((vertex, index) => {
    const distance = Math.hypot(point.x - vertex.x, point.y - vertex.y);
    if (distance < closest.distance) closest = { index, distance };
  });
  return closest.distance <= radius ? closest.index : -1;
}

function beginCullStroke(event) {
  const layer = cullLayer();
  const cull = layer.cull;
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  const rawPoint = cullPointer(event);
  const vertexIndex = nearestCullVertex(rawPoint, cull);
  if (vertexIndex >= 0) {
    cull.activeVertexIndex = vertexIndex;
    cull.draggingVertex = true;
    cull.drawing = false;
    els.cullCanvas.setPointerCapture(event.pointerId);
    drawCullPreview();
    return;
  }
  if (cull.vertexMode) return;
  const point = snapCullPoint(rawPoint, cull, width, height);
  cull.drawing = true;
  cull.draggingVertex = false;
  cull.activeVertexIndex = -1;
  setCullPointsFromPixels(cull, [point]);
  cull.enabled = true;
  els.cullCanvas.setPointerCapture(event.pointerId);
  drawCullPreview();
}

function continueCullStroke(event) {
  const cull = cullLayer().cull;
  if (!cull.drawing && !cull.draggingVertex) return;
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  const point = snapCullPoint(cullPointer(event), cull, width, height);
  if (cull.draggingVertex) {
    const points = activeCullLinePixels(cull, width, height);
    points[cull.activeVertexIndex] = point;
    setCullPointsFromPixels(cull, points);
    drawCullPreview();
    return;
  }
  const points = storedCullLinePixels(cull, width, height);
  const previous = points[points.length - 1];
  if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 3) return;
  points.push(point);
  setCullPointsFromPixels(cull, points);
  drawCullPreview();
}

function endCullStroke(event) {
  const cull = cullLayer().cull;
  if (!cull.drawing && !cull.draggingVertex) return;
  continueCullStroke(event);
  if (cull.drawing) {
    const width = previewLogicalWidth(els.cullCanvas);
    const height = previewLogicalHeight(els.cullCanvas);
    const points = storedCullLinePixels(cull, width, height);
    if (points.length < 2) {
      points.push({ x: width - points[0].x, y: height - points[0].y });
    }
    const resampled = resamplePath(points, cull.vertexCount)
      .map((point) => snapCullPoint(point, cull, width, height));
    setCullPointsFromPixels(cull, resampled);
  }
  cull.drawing = false;
  cull.draggingVertex = false;
  els.cullCanvas.releasePointerCapture(event.pointerId);
  drawCullPreview();
}

function setCullLayer(layerId) {
  if (!state.layers.some((layer) => layer.id === layerId)) return;
  state.cullLayerId = layerId;
  drawCullPreview();
}

function setCullLine(index) {
  const cull = cullLayer().cull;
  syncEditorLegacyPoints(cull);
  cull.activeLineIndex = Math.min(Math.max(0, index), cull.cutLines.length - 1);
  cull.activeVertexIndex = -1;
  cull.points = activeEditorLine(cull).points;
  drawCullPreview();
}

function addCullLine() {
  const cull = cullLayer().cull;
  syncEditorLegacyPoints(cull);
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  const offset = Math.min(0.18, 0.05 * cull.cutLines.length);
  const points = normalizeCreatePoints(defaultCullLine(width, height).map((point) => ({
    x: point.x,
    y: Math.min(height, Math.max(0, point.y + height * offset))
  })), width, height);
  cull.cutLines.push({ points });
  cull.activeLineIndex = cull.cutLines.length - 1;
  cull.points = points;
  cull.enabled = true;
  drawCullPreview();
}

function deleteCullLine() {
  const cull = cullLayer().cull;
  syncEditorLegacyPoints(cull);
  if (cull.cutLines.length <= 1) return;
  cull.cutLines.splice(cull.activeLineIndex, 1);
  cull.activeLineIndex = Math.min(cull.activeLineIndex, cull.cutLines.length - 1);
  cull.points = activeEditorLine(cull).points;
  drawCullPreview();
}

function setCullSide(side) {
  cullLayer().cull.side = side === "negative" ? "negative" : "positive";
  drawCullPreview();
}

function updateCullControls() {
  const cull = cullLayer().cull;
  cull.enabled = els.cullEnabled.checked;
  cull.betweenMode = els.cullBetweenMode.value === "include" ? "include" : "exclude";
  cull.gridDivisions = clampNumber(els.cullGridDivisions.value, 2, 32, cull.gridDivisions);
  cull.lineMode = els.cullLineMode.value === "straight" ? "straight" : "smooth";
  cull.lineWidth = clampNumber(els.cullLineWidth.value, 1, 16, displayLineWidth(cull));
  cull.vertexRadius = clampNumber(els.cullVertexRadius.value, 3, 32, displayVertexRadius(cull));
  cull.snapToGrid = els.cullSnapToGrid.checked;
  cull.vertexMode = els.cullVertexMode.checked;
  cull.feather = clampNumber(els.cullFeather.value, 0, 96, cull.feather);
  cull.splatter = clampNumber(els.cullSplatter.value, 0, 100, cull.splatter);
  cull.noise = clampNumber(els.cullNoise.value, 0, 100, cull.noise);
  els.cullGridDivisions.value = cull.gridDivisions;
  els.cullLineWidth.value = cull.lineWidth;
  els.cullVertexRadius.value = cull.vertexRadius;
  els.cullFeather.value = cull.feather;
  els.cullSplatter.value = cull.splatter;
  els.cullNoise.value = cull.noise;
  if (cull.snapToGrid && cull.points.length > 0) {
    const width = previewLogicalWidth(els.cullCanvas);
    const height = previewLogicalHeight(els.cullCanvas);
    const points = activeCullLinePixels(cull, width, height)
      .map((point) => snapCullPoint(point, cull, width, height));
    setCullPointsFromPixels(cull, points);
  }
  drawCullPreview();
}

function setCullVertexCount() {
  const cull = cullLayer().cull;
  const nextCount = clampNumber(els.cullVertexCount.value, 2, 24, cull.vertexCount);
  const width = previewLogicalWidth(els.cullCanvas);
  const height = previewLogicalHeight(els.cullCanvas);
  const points = activeCullLinePixels(cull, width, height);
  cull.vertexCount = nextCount;
  els.cullVertexCount.value = nextCount;
  setCullPointsFromPixels(cull, resamplePath(points, nextCount));
  cull.activeVertexIndex = Math.min(cull.activeVertexIndex, nextCount - 1);
  drawCullPreview();
}

function clearCullLine() {
  const cull = cullLayer().cull;
  const line = activeEditorLine(cull);
  line.points = [];
  cull.points = line.points;
  cull.enabled = false;
  cull.activeVertexIndex = -1;
  cull.drawing = false;
  cull.draggingVertex = false;
  drawCullPreview();
  setStatus(`${cullLayer().name} cull line reset.`);
}

for (const tab of els.controlTabs) {
  tab.addEventListener("click", () => activateControlTab(tab.id));
  tab.addEventListener("keydown", handleControlTabKeydown);
}
els.applySettings.addEventListener("click", applySettings);
els.saveProject.addEventListener("click", saveProject);
els.projectFileInput.addEventListener("change", (event) => {
  loadProject(event.target.files[0]);
  event.target.value = "";
});
els.fileInput.addEventListener("change", (event) => {
  enqueueFiles(event.target.files);
  event.target.value = "";
});
els.sheetFileInput.addEventListener("change", (event) => {
  importSpritesheet(event.target.files[0]);
  event.target.value = "";
});
els.savePalette.addEventListener("click", savePalette);
els.paletteFileInput.addEventListener("change", (event) => {
  loadPalette(event.target.files[0]);
  event.target.value = "";
});
els.paintTool.addEventListener("click", () => {
  setGridTool("paint");
});
els.dropTool.addEventListener("click", () => {
  setGridTool("drop");
});
els.eraseTool.addEventListener("click", () => {
  setGridTool("erase");
});
els.groupMoveTool.addEventListener("click", () => setGridTool("group"));
els.moveSelectedGroup.addEventListener("click", beginGroupMove);
els.cancelGroupMove.addEventListener("click", () => cancelGroupMove());
els.clearGrid.addEventListener("click", clearGrid);
els.showPlacementGrid.addEventListener("change", () => setPlacementGridVisibility(els.showPlacementGrid.checked));
els.themeToggle.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});
els.exportButton.addEventListener("click", exportSpritesheet);
els.exportMapButton.addEventListener("click", exportMapImage);
els.exportLayerButton.addEventListener("click", exportActiveLayerImage);
els.exportCols.addEventListener("change", updateExportColumns);
els.cloneTile.addEventListener("click", cloneSelectedTile);
els.renameTile.addEventListener("click", renameSelectedTile);
els.paletteTileName.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  renameSelectedTile();
});
els.recropTile.addEventListener("click", recropSelectedTile);
els.rotateTileLeft.addEventListener("click", () => transformSelectedTile("rotate-left", "Rotated left"));
els.rotateTileRight.addEventListener("click", () => transformSelectedTile("rotate-right", "Rotated right"));
els.flipTileHorizontal.addEventListener("click", () => transformSelectedTile("flip-horizontal", "Flipped horizontally"));
els.flipTileVertical.addEventListener("click", () => transformSelectedTile("flip-vertical", "Flipped vertically"));
els.deleteTile.addEventListener("click", deleteSelectedTile);
els.applyTileTint.addEventListener("click", applyTileTint);
els.makeTileColorTransparent.addEventListener("click", makeTileColorTransparent);
els.createTileA.addEventListener("change", readCreateEffectControls);
els.createTileB.addEventListener("change", readCreateEffectControls);
els.createTileC.addEventListener("change", readCreateEffectControls);
els.createDecorationOpacity.addEventListener("input", readCreateEffectControls);
els.createDecorationBlend.addEventListener("change", readCreateEffectControls);
els.createBetweenMode.addEventListener("change", readCreateEffectControls);
els.createFeather.addEventListener("input", readCreateEffectControls);
els.createSplatter.addEventListener("input", readCreateEffectControls);
els.createNoise.addEventListener("input", readCreateEffectControls);
els.createLineSelect.addEventListener("change", () => setCreateLine(Number.parseInt(els.createLineSelect.value, 10)));
els.createVertexCount.addEventListener("input", setCreateVertexCount);
els.createGridDivisions.addEventListener("input", updateCreatePathControls);
els.createLineMode.addEventListener("change", updateCreatePathControls);
els.createLineWidth.addEventListener("input", updateCreatePathControls);
els.createVertexRadius.addEventListener("input", updateCreatePathControls);
els.createSnapToGrid.addEventListener("change", updateCreatePathControls);
els.createVertexMode.addEventListener("change", updateCreatePathControls);
els.createSideUpper.addEventListener("click", () => setCreateSide("negative"));
els.createSideLower.addEventListener("click", () => setCreateSide("positive"));
els.addCreateLine.addEventListener("click", addCreateLine);
els.deleteCreateLine.addEventListener("click", deleteCreateLine);
els.saveCreatePattern.addEventListener("click", saveCreatePattern);
els.createPatternFileInput.addEventListener("change", (event) => {
  loadCreatePattern(event.target.files[0]);
  event.target.value = "";
});
els.clearCreateLine.addEventListener("click", resetCreateLine);
els.loadCreatedTile.addEventListener("click", loadSelectedTransitionRecipe);
els.addCreatedTile.addEventListener("click", addCreatedTransitionTile);
els.cullLayerSelect.addEventListener("change", () => setCullLayer(els.cullLayerSelect.value));
els.cullEnabled.addEventListener("change", updateCullControls);
els.cullBetweenMode.addEventListener("change", updateCullControls);
els.cullSideUpper.addEventListener("click", () => setCullSide("negative"));
els.cullSideLower.addEventListener("click", () => setCullSide("positive"));
els.cullLineSelect.addEventListener("change", () => setCullLine(Number.parseInt(els.cullLineSelect.value, 10)));
els.cullVertexCount.addEventListener("input", setCullVertexCount);
els.cullGridDivisions.addEventListener("input", updateCullControls);
els.cullLineMode.addEventListener("change", updateCullControls);
els.cullLineWidth.addEventListener("input", updateCullControls);
els.cullVertexRadius.addEventListener("input", updateCullControls);
els.cullSnapToGrid.addEventListener("change", updateCullControls);
els.cullVertexMode.addEventListener("change", updateCullControls);
els.cullFeather.addEventListener("input", updateCullControls);
els.cullSplatter.addEventListener("input", updateCullControls);
els.cullNoise.addEventListener("input", updateCullControls);
els.addCullLine.addEventListener("click", addCullLine);
els.deleteCullLine.addEventListener("click", deleteCullLine);
els.saveCullPattern.addEventListener("click", saveCullPattern);
els.cullPatternFileInput.addEventListener("change", (event) => {
  loadCullPattern(event.target.files[0]);
  event.target.value = "";
});
els.clearCullLine.addEventListener("click", clearCullLine);
els.renameLayer.addEventListener("click", renameActiveLayer);
els.layerName.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  renameActiveLayer();
});
els.moveLayerUp.addEventListener("click", () => moveActiveLayer(1));
els.moveLayerDown.addEventListener("click", () => moveActiveLayer(-1));
els.addLayer.addEventListener("click", addLayer);
els.deleteLayer.addEventListener("click", deleteActiveLayer);
els.zoomOut.addEventListener("click", () => stepViewerZoom(-1));
els.zoomIn.addEventListener("click", () => stepViewerZoom(1));
els.zoomReset.addEventListener("click", () => setViewerScale(1));
els.createZoomOut.addEventListener("click", () => stepPreviewZoom("create", -1));
els.createZoomIn.addEventListener("click", () => stepPreviewZoom("create", 1));
els.createZoomReset.addEventListener("click", () => setPreviewScale("create", 1));
els.createPanLeft.addEventListener("click", () => panPreview("create", -1, 0));
els.createPanRight.addEventListener("click", () => panPreview("create", 1, 0));
els.createPanUp.addEventListener("click", () => panPreview("create", 0, -1));
els.createPanDown.addEventListener("click", () => panPreview("create", 0, 1));
els.createPanCenter.addEventListener("click", () => centerPreview("create"));
els.cullZoomOut.addEventListener("click", () => stepPreviewZoom("cull", -1));
els.cullZoomIn.addEventListener("click", () => stepPreviewZoom("cull", 1));
els.cullZoomReset.addEventListener("click", () => setPreviewScale("cull", 1));
els.cullPanLeft.addEventListener("click", () => panPreview("cull", -1, 0));
els.cullPanRight.addEventListener("click", () => panPreview("cull", 1, 0));
els.cullPanUp.addEventListener("click", () => panPreview("cull", 0, -1));
els.cullPanDown.addEventListener("click", () => panPreview("cull", 0, 1));
els.cullPanCenter.addEventListener("click", () => centerPreview("cull"));
window.addEventListener("resize", applyResponsiveViewerScale);
document.addEventListener("focusin", handleContextHelpEvent);
document.addEventListener("input", handleContextHelpEvent);
document.addEventListener("change", handleContextHelpEvent);
document.addEventListener("click", handleContextHelpEvent);
els.gridCanvas.addEventListener("pointermove", handleGridPointerMove);
els.gridCanvas.addEventListener("pointerleave", () => {
  state.hoverCell = null;
  els.hoverCell.textContent = "Cell: none";
  renderGrid();
});
els.gridCanvas.addEventListener("click", handleGridClick);
els.createCanvas.addEventListener("pointerdown", beginCreateStroke);
els.createCanvas.addEventListener("pointermove", continueCreateStroke);
els.createCanvas.addEventListener("pointerup", endCreateStroke);
els.createCanvas.addEventListener("pointercancel", () => {
  state.create.drawing = false;
  state.create.draggingVertex = false;
});
els.cullCanvas.addEventListener("pointerdown", beginCullStroke);
els.cullCanvas.addEventListener("pointermove", continueCullStroke);
els.cullCanvas.addEventListener("pointerup", endCullStroke);
els.cullCanvas.addEventListener("pointercancel", () => {
  const cull = cullLayer().cull;
  cull.drawing = false;
  cull.draggingVertex = false;
});

els.cropZoom.addEventListener("input", handleCropZoom);
els.applyCropSize.addEventListener("click", applyCustomCropSize);
els.autoCropVisible.addEventListener("click", autoCropVisiblePixels);
els.cropScaleMode.addEventListener("change", () => setCropScaleMode(els.cropScaleMode.value));
els.nudgeUp.addEventListener("click", () => nudgeCrop(0, -1));
els.nudgeDown.addEventListener("click", () => nudgeCrop(0, 1));
els.nudgeLeft.addEventListener("click", () => nudgeCrop(-1, 0));
els.nudgeRight.addEventListener("click", () => nudgeCrop(1, 0));
els.setCrop.addEventListener("click", setCurrentCrop);
els.saveCrop.addEventListener("click", saveCurrentCrop);
els.skipCrop.addEventListener("click", skipCurrentCrop);
els.cropCanvas.addEventListener("pointerdown", (event) => {
  if (!cropState) return;
  const point = cropPointer(event);
  cropState.dragging = true;
  cropState.dragStartX = point.x;
  cropState.dragStartY = point.y;
  cropState.startOffsetX = cropState.offsetX;
  cropState.startOffsetY = cropState.offsetY;
  els.cropCanvas.setPointerCapture(event.pointerId);
});
els.cropCanvas.addEventListener("pointermove", (event) => {
  if (!cropState || !cropState.dragging) return;
  const point = cropPointer(event);
  cropState.offsetX = cropState.startOffsetX + point.x - cropState.dragStartX;
  cropState.offsetY = cropState.startOffsetY + point.y - cropState.dragStartY;
  drawCrop();
});
els.cropCanvas.addEventListener("pointerup", (event) => {
  if (!cropState) return;
  cropState.dragging = false;
  els.cropCanvas.releasePointerCapture(event.pointerId);
});
els.cropCanvas.addEventListener("pointercancel", () => {
  if (cropState) cropState.dragging = false;
});

initializeTheme();
resizeGridCanvas();
renderPalette();
renderLayers();
renderGrid();
applyResponsiveViewerScale();
updateStats();
updateContextHelp();
setStatus("Ready. Configure the project, then import sprites to build your palette.");

window.__tileBuilderDebug = {
  getState() {
    return {
      cols: state.cols,
      rows: state.rows,
      tileWidth: state.tileWidth,
      tileHeight: state.tileHeight,
      spriteWidth: state.spriteWidth,
      spriteHeight: state.spriteHeight,
      tileMode: state.tileMode,
      exportCols: state.exportCols,
      showPlacementGrid: state.showPlacementGrid,
      viewerScale: state.viewerScale,
      createPreviewScale: state.createPreviewScale,
      cullPreviewScale: state.cullPreviewScale,
      placedCount: placedTileCount(),
      layerCount: state.layers.length,
      activeLayerId: state.activeLayerId,
      activeLayerName: activeLayer().name,
      layerPlacements: state.layers.map((layer, order) => ({
        id: layer.id,
        name: layer.name,
        count: layer.placements.size,
        visible: layer.visible,
        order,
        placements: sortedLayerPlacements(layer),
        cull: layer.cull ? {
          enabled: layer.cull.enabled,
          side: layer.cull.side,
          points: layer.cull.points,
          cutLines: layer.cull.cutLines,
          activeLineIndex: layer.cull.activeLineIndex,
          betweenMode: layer.cull.betweenMode,
          vertexCount: layer.cull.vertexCount,
          gridDivisions: layer.cull.gridDivisions,
          snapToGrid: layer.cull.snapToGrid,
          vertexMode: layer.cull.vertexMode,
          lineMode: layer.cull.lineMode,
          lineWidth: layer.cull.lineWidth,
          vertexRadius: layer.cull.vertexRadius,
          feather: layer.cull.feather,
          splatter: layer.cull.splatter,
          noise: layer.cull.noise
        } : null
      })),
      pickedPlacement: state.pickedPlacement,
      groupSelection: state.groupSelection,
      groupMoveOrigin: state.groupMoveOrigin,
      selectedTileId: state.selectedTileId,
      create: {
        tileAId: state.create.tileAId,
        tileBId: state.create.tileBId,
        tileCId: state.create.tileCId,
        decorationOpacity: state.create.decorationOpacity,
        decorationBlend: state.create.decorationBlend,
        side: state.create.side,
        points: state.create.points,
        cutLines: state.create.cutLines,
        activeLineIndex: state.create.activeLineIndex,
        betweenMode: state.create.betweenMode,
        vertexCount: state.create.vertexCount,
        gridDivisions: state.create.gridDivisions,
        snapToGrid: state.create.snapToGrid,
        vertexMode: state.create.vertexMode,
        lineMode: state.create.lineMode,
        lineWidth: state.create.lineWidth,
        vertexRadius: state.create.vertexRadius,
        activeVertexIndex: state.create.activeVertexIndex,
        feather: state.create.feather,
        splatter: state.create.splatter,
        noise: state.create.noise
      },
      tiles: state.tiles.map((tile) => ({
        id: tile.id,
        name: tile.name,
        width: tile.width,
        height: tile.height,
        anchor: tile.anchor,
        transition: tile.transition || null
      }))
    };
  }
};
