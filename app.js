const state = {
  cols: 8,
  rows: 8,
  tileWidth: 128,
  tileHeight: 64,
  spriteWidth: 128,
  spriteHeight: 128,
  tileMode: "isometric",
  exportCols: 8,
  tiles: [],
  selectedTileId: null,
  tool: "paint",
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
        vertexCount: 5,
        gridDivisions: 8,
        snapToGrid: false,
        lineMode: "smooth",
        feather: 0,
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
    vertexCount: 5,
    gridDivisions: 8,
    snapToGrid: false,
    lineMode: "smooth",
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
  createFeather: document.querySelector("#createFeather"),
  createSplatter: document.querySelector("#createSplatter"),
  createNoise: document.querySelector("#createNoise"),
  createVertexCount: document.querySelector("#createVertexCount"),
  createGridDivisions: document.querySelector("#createGridDivisions"),
  createLineMode: document.querySelector("#createLineMode"),
  createSnapToGrid: document.querySelector("#createSnapToGrid"),
  clearCreateLine: document.querySelector("#clearCreateLine"),
  loadCreatedTile: document.querySelector("#loadCreatedTile"),
  addCreatedTile: document.querySelector("#addCreatedTile"),
  createCanvas: document.querySelector("#createCanvas"),
  createPreviewStatus: document.querySelector("#createPreviewStatus"),
  cullLayerSelect: document.querySelector("#cullLayerSelect"),
  cullEnabled: document.querySelector("#cullEnabled"),
  cullSideUpper: document.querySelector("#cullSideUpper"),
  cullSideLower: document.querySelector("#cullSideLower"),
  cullVertexCount: document.querySelector("#cullVertexCount"),
  cullGridDivisions: document.querySelector("#cullGridDivisions"),
  cullLineMode: document.querySelector("#cullLineMode"),
  cullSnapToGrid: document.querySelector("#cullSnapToGrid"),
  cullFeather: document.querySelector("#cullFeather"),
  clearCullLine: document.querySelector("#clearCullLine"),
  cullCanvas: document.querySelector("#cullCanvas"),
  cullPreviewStatus: document.querySelector("#cullPreviewStatus"),
  paintTool: document.querySelector("#paintTool"),
  dropTool: document.querySelector("#dropTool"),
  eraseTool: document.querySelector("#eraseTool"),
  groupMoveTool: document.querySelector("#groupMoveTool"),
  groupSelectionInfo: document.querySelector("#groupSelectionInfo"),
  moveSelectedGroup: document.querySelector("#moveSelectedGroup"),
  cancelGroupMove: document.querySelector("#cancelGroupMove"),
  clearGrid: document.querySelector("#clearGrid"),
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

function updateExportColumns() {
  state.exportCols = clampNumber(els.exportCols.value, 1, 64, state.exportCols);
  els.exportCols.value = state.exportCols;
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

  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      drawGridCell(gridCtx, x, y);
    }
  }

  if (state.hoverCell) {
    drawGridCell(gridCtx, state.hoverCell.x, state.hoverCell.y, {
      stroke: cssVar("--accent"),
      lineWidth: 2,
      fill: cssVar("--grid-hover")
    });
  }

  for (const layer of visibleLayers()) {
    for (const placement of sortedLayerPlacements(layer)) {
      const tile = state.tiles.find((item) => item.id === placement.tileId);
      if (!tile) continue;
      const rect = tileDrawRect(tile, placement);
      gridCtx.drawImage(tile.image, rect.x, rect.y, rect.width, rect.height);
    }
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
  if (points.length < 2) return null;
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
    points,
    vertexCount: clampNumber(recipe.vertexCount, 2, 24, Math.min(24, Math.max(2, points.length || 5))),
    gridDivisions: clampNumber(recipe.gridDivisions, 2, 32, 8),
    snapToGrid: recipe.snapToGrid === true,
    lineMode: recipe.lineMode === "straight" ? "straight" : "smooth",
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
  els.createFeather.value = state.create.feather;
  els.createSplatter.value = state.create.splatter;
  els.createNoise.value = state.create.noise;
  els.createVertexCount.value = state.create.vertexCount;
  els.createGridDivisions.value = state.create.gridDivisions;
  els.createLineMode.value = state.create.lineMode;
  els.createSnapToGrid.checked = state.create.snapToGrid;
  els.createSideUpper.classList.toggle("is-active", state.create.side === "negative");
  els.createSideLower.classList.toggle("is-active", state.create.side === "positive");
  els.addCreatedTile.disabled = !state.create.tileBId;
  els.loadCreatedTile.disabled = !selectedTile()?.transition;
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
  const points = state.create.points.length >= 2
    ? state.create.points.map((point) => ({ x: point.x * width, y: point.y * height }))
    : defaultCreateLine(width, height);
  return points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x)),
    y: Math.min(height, Math.max(0, point.y))
  }));
}

function activeCreateLinePixels(width, height) {
  const points = createLinePixels(width, height);
  return resamplePath(points, state.create.vertexCount);
}

function storedCreateLinePixels(width, height) {
  return state.create.points.map((point) => ({
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

function snapCreatePoint(point, width, height) {
  if (!state.create.snapToGrid) return point;
  const divisions = Math.max(2, state.create.gridDivisions);
  const cellW = width / divisions;
  const cellH = height / divisions;
  return {
    x: Math.min(width, Math.max(0, Math.round(point.x / cellW) * cellW)),
    y: Math.min(height, Math.max(0, Math.round(point.y / cellH) * cellH))
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

function drawCreateSubgrid(width, height) {
  const divisions = Math.max(2, state.create.gridDivisions);
  createCtx.save();
  createCtx.strokeStyle = state.create.snapToGrid ? "rgba(32, 118, 109, 0.42)" : "rgba(32, 118, 109, 0.18)";
  createCtx.lineWidth = 1;
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
  const radius = Math.max(5, Math.ceil(Math.max(els.createCanvas.width, els.createCanvas.height) / 48));
  createCtx.save();
  points.forEach((point, index) => {
    const active = index === state.create.activeVertexIndex;
    createCtx.beginPath();
    createCtx.arc(point.x, point.y, active ? radius + 2 : radius, 0, Math.PI * 2);
    createCtx.fillStyle = active ? cssVar("--accent-strong") : cssVar("--panel");
    createCtx.strokeStyle = cssVar("--accent-strong");
    createCtx.lineWidth = active ? 3 : 2;
    createCtx.fill();
    createCtx.stroke();
  });
  createCtx.restore();
}

function createMaskCanvas(width, height, points, side, feather) {
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d");
  const cutPoints = extendedCutPoints(width, height, simplifyStrokePoints(points));
  const orientation = lineOrientation(cutPoints);
  const margin = Math.max(width, height) * 3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  traceCreatePath(ctx, cutPoints);
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

function applyMaskEffects(mask, points, splatter, noise) {
  if (splatter === 0 && noise === 0) return mask;
  const ctx = mask.getContext("2d");
  const imageData = ctx.getImageData(0, 0, mask.width, mask.height);
  const pixels = imageData.data;
  const splatterRadius = Math.max(1, Math.max(mask.width, mask.height) * 0.18 * (splatter / 100));
  const seed = points.reduce((sum, point) => sum + point.x * 0.13 + point.y * 0.17, 11);

  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      const index = (y * mask.width + x) * 4 + 3;
      let alpha = pixels[index];
      if (noise > 0 && alpha > 0 && alpha < 255) {
        alpha += (seededNoise(x, y, seed) - 0.5) * 255 * (noise / 100);
      }
      if (splatter > 0 && distanceToLine(x, y, points) <= splatterRadius) {
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
  const points = activeCreateLinePixels(width, height);
  const mask = applyMaskEffects(
    createMaskCanvas(width, height, points, state.create.side, state.create.feather),
    points,
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
  els.createCanvas.width = width;
  els.createCanvas.height = height;
  createCtx.clearRect(0, 0, width, height);
  createCtx.drawImage(buildTransitionCanvas(), 0, 0);

  const points = activeCreateLinePixels(width, height);
  drawCreateSubgrid(width, height);
  createCtx.save();
  createCtx.strokeStyle = cssVar("--accent-strong") || "#20766d";
  createCtx.lineWidth = Math.max(2, Math.ceil(Math.max(width, height) / 96));
  createCtx.setLineDash([8, 5]);
  createCtx.beginPath();
  traceCreatePath(createCtx, simplifyStrokePoints(points));
  createCtx.stroke();
  createCtx.restore();
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
  state.create.feather = clampNumber(els.createFeather.value, 0, 64, state.create.feather);
  state.create.splatter = clampNumber(els.createSplatter.value, 0, 100, state.create.splatter);
  state.create.noise = clampNumber(els.createNoise.value, 0, 100, state.create.noise);
  state.create.gridDivisions = clampNumber(els.createGridDivisions.value, 2, 32, state.create.gridDivisions);
  state.create.lineMode = els.createLineMode.value === "straight" ? "straight" : "smooth";
  state.create.snapToGrid = els.createSnapToGrid.checked;
  drawCreatePreview();
}

function transitionRecipeForCurrentTile() {
  const tileA = state.create.tileAId === "transparent" ? null : state.tiles.find((tile) => tile.id === state.create.tileAId);
  const tileB = state.tiles.find((tile) => tile.id === state.create.tileBId);
  const tileC = state.create.tileCId === "none" ? null : state.tiles.find((tile) => tile.id === state.create.tileCId);
  const { width, height } = createOutputSize();
  const points = normalizeCreatePoints(activeCreateLinePixels(width, height), width, height);
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
    vertexCount: state.create.vertexCount,
    gridDivisions: state.create.gridDivisions,
    snapToGrid: state.create.snapToGrid,
    lineMode: state.create.lineMode,
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

function resetCreateLine() {
  state.create.points = [];
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
    vertexCount: restored.vertexCount,
    gridDivisions: restored.gridDivisions,
    snapToGrid: restored.snapToGrid,
    lineMode: restored.lineMode,
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
    vertexCount: 5,
    gridDivisions: 8,
    snapToGrid: false,
    lineMode: "smooth",
    feather: 0,
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
  return {
    enabled: cull.enabled === true,
    side: cull.side === "negative" ? "negative" : "positive",
    points,
    vertexCount: clampNumber(cull.vertexCount, 2, 24, Math.min(24, Math.max(2, points.length || 5))),
    gridDivisions: clampNumber(cull.gridDivisions, 2, 32, 8),
    snapToGrid: cull.snapToGrid === true,
    lineMode: cull.lineMode === "straight" ? "straight" : "smooth",
    feather: clampNumber(cull.feather, 0, 96, 0),
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
  const points = cull.points.length >= 2
    ? cull.points.map((point) => ({ x: point.x * width, y: point.y * height }))
    : defaultCullLine(width, height);
  return points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x)),
    y: Math.min(height, Math.max(0, point.y))
  }));
}

function activeCullLinePixels(cull, width, height) {
  return resamplePath(cullLinePixels(cull, width, height), cull.vertexCount);
}

function storedCullLinePixels(cull, width, height) {
  return cull.points.map((point) => ({
    x: Math.min(width, Math.max(0, point.x * width)),
    y: Math.min(height, Math.max(0, point.y * height))
  }));
}

function snapCullPoint(point, cull, width, height) {
  if (!cull.snapToGrid) return point;
  const divisions = Math.max(2, cull.gridDivisions);
  const cellW = width / divisions;
  const cellH = height / divisions;
  return {
    x: Math.min(width, Math.max(0, Math.round(point.x / cellW) * cellW)),
    y: Math.min(height, Math.max(0, Math.round(point.y / cellH) * cellH))
  };
}

function setCullPointsFromPixels(cull, points, width = els.cullCanvas.width, height = els.cullCanvas.height) {
  cull.points = normalizeCreatePoints(points, width, height);
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
  els.cullVertexCount.value = cull.vertexCount;
  els.cullGridDivisions.value = cull.gridDivisions;
  els.cullLineMode.value = cull.lineMode;
  els.cullSnapToGrid.checked = cull.snapToGrid;
  els.cullFeather.value = cull.feather;
  els.cullSideUpper.classList.toggle("is-active", cull.side === "negative");
  els.cullSideLower.classList.toggle("is-active", cull.side === "positive");
}

function drawCullSubgrid(width, height, cull) {
  const divisions = Math.max(2, cull.gridDivisions);
  cullCtx.save();
  cullCtx.strokeStyle = cull.snapToGrid ? "rgba(32, 118, 109, 0.42)" : "rgba(32, 118, 109, 0.18)";
  cullCtx.lineWidth = 1;
  for (let index = 1; index < divisions; index += 1) {
    const x = width * index / divisions;
    const y = height * index / divisions;
    cullCtx.beginPath();
    cullCtx.moveTo(x, 0);
    cullCtx.lineTo(x, height);
    cullCtx.stroke();
    cullCtx.beginPath();
    cullCtx.moveTo(0, y);
    cullCtx.lineTo(width, y);
    cullCtx.stroke();
  }
  cullCtx.restore();
}

function drawCullVertices(points, cull) {
  const radius = Math.max(5, Math.ceil(Math.max(els.cullCanvas.width, els.cullCanvas.height) / 90));
  cullCtx.save();
  points.forEach((point, index) => {
    const active = index === cull.activeVertexIndex;
    cullCtx.beginPath();
    cullCtx.arc(point.x, point.y, active ? radius + 2 : radius, 0, Math.PI * 2);
    cullCtx.fillStyle = active ? cssVar("--accent-strong") : cssVar("--panel");
    cullCtx.strokeStyle = cssVar("--accent-strong");
    cullCtx.lineWidth = active ? 3 : 2;
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
  els.cullCanvas.width = els.gridCanvas.width;
  els.cullCanvas.height = els.gridCanvas.height;
  cullCtx.clearRect(0, 0, els.cullCanvas.width, els.cullCanvas.height);
  cullCtx.fillStyle = cssVar("--canvas-bg");
  cullCtx.fillRect(0, 0, els.cullCanvas.width, els.cullCanvas.height);
  renderSingleLayerToCanvas(layer, cullCtx);
  const points = activeCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
  drawCullSubgrid(els.cullCanvas.width, els.cullCanvas.height, cull);
  cullCtx.save();
  cullCtx.strokeStyle = cssVar("--accent-strong") || "#20766d";
  cullCtx.lineWidth = Math.max(2, Math.ceil(Math.max(els.cullCanvas.width, els.cullCanvas.height) / 360));
  cullCtx.setLineDash([10, 6]);
  cullCtx.beginPath();
  traceCreatePath(cullCtx, simplifyStrokePoints(points), cull.lineMode);
  cullCtx.stroke();
  cullCtx.restore();
  drawCullVertices(points, cull);
  const placementCount = layer.placements.size;
  els.cullPreviewStatus.textContent = `${layer.name}: ${placementCount} placed tile${placementCount === 1 ? "" : "s"}. ${cull.enabled ? "Cull enabled for exports." : "Cull disabled for exports."}`;
}

function createCullMaskCanvas(width, height, cull) {
  const points = activeCullLinePixels(cull, width, height);
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const ctx = mask.getContext("2d");
  const cutPoints = extendedCutPoints(width, height, simplifyStrokePoints(points));
  const orientation = lineOrientation(cutPoints);
  const margin = Math.max(width, height) * 3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  traceCreatePath(ctx, cutPoints, cull.lineMode);
  if (orientation === "horizontal") {
    if (cull.side === "positive") {
      ctx.lineTo(width + margin, height + margin);
      ctx.lineTo(-margin, height + margin);
    } else {
      ctx.lineTo(width + margin, -margin);
      ctx.lineTo(-margin, -margin);
    }
  } else if (cull.side === "positive") {
    ctx.lineTo(width + margin, height + margin);
    ctx.lineTo(width + margin, -margin);
  } else {
    ctx.lineTo(-margin, height + margin);
    ctx.lineTo(-margin, -margin);
  }
  ctx.closePath();
  ctx.fill();
  if (cull.feather > 0) {
    const blurred = document.createElement("canvas");
    blurred.width = width;
    blurred.height = height;
    const blurCtx = blurred.getContext("2d");
    blurCtx.filter = `blur(${cull.feather}px)`;
    blurCtx.drawImage(mask, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(blurred, 0, 0);
  }
  return mask;
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
      exportCols: state.exportCols
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
        vertexCount: layer.cull.vertexCount,
        gridDivisions: layer.cull.gridDivisions,
        snapToGrid: layer.cull.snapToGrid,
        lineMode: layer.cull.lineMode,
        feather: layer.cull.feather
      } : null
    })),
    selectedTileId: state.selectedTileId,
    activeLayerId: state.activeLayerId,
    tool: state.tool,
    viewerScale: state.viewerScale
  });
  setStatus(`Saved project with ${state.tiles.length} palette tile${state.tiles.length === 1 ? "" : "s"}, ${state.layers.length} layer${state.layers.length === 1 ? "" : "s"}, and ${placedTileCount()} placement${placedTileCount() === 1 ? "" : "s"}.`);
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
    exportCols: clampNumber(settings.exportCols, 1, 64, 8)
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
    if (layer.cull && layer.cull.enabled && layer.cull.points.length >= 2) {
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
  return {
    x: Math.min(els.createCanvas.width, Math.max(0, (event.clientX - rect.left) * (els.createCanvas.width / rect.width))),
    y: Math.min(els.createCanvas.height, Math.max(0, (event.clientY - rect.top) * (els.createCanvas.height / rect.height)))
  };
}

function setCreatePointsFromPixels(points, width = els.createCanvas.width, height = els.createCanvas.height) {
  state.create.points = normalizeCreatePoints(points, width, height);
}

function nearestCreateVertex(point) {
  const points = activeCreateLinePixels(els.createCanvas.width, els.createCanvas.height);
  const radius = Math.max(12, Math.ceil(Math.max(els.createCanvas.width, els.createCanvas.height) / 20));
  let closest = { index: -1, distance: Infinity };
  points.forEach((vertex, index) => {
    const distance = Math.hypot(point.x - vertex.x, point.y - vertex.y);
    if (distance < closest.distance) closest = { index, distance };
  });
  return closest.distance <= radius ? closest.index : -1;
}

function setCreateVertexCount() {
  const nextCount = clampNumber(els.createVertexCount.value, 2, 24, state.create.vertexCount);
  const points = activeCreateLinePixels(els.createCanvas.width, els.createCanvas.height);
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
  state.create.snapToGrid = els.createSnapToGrid.checked;
  els.createGridDivisions.value = state.create.gridDivisions;
  if (state.create.snapToGrid && (!previousSnap || state.create.points.length > 0)) {
    const points = activeCreateLinePixels(els.createCanvas.width, els.createCanvas.height)
      .map((point) => snapCreatePoint(point, els.createCanvas.width, els.createCanvas.height));
    setCreatePointsFromPixels(points);
  }
  drawCreatePreview();
}

function beginCreateStroke(event) {
  if (!state.create.tileBId) return;
  const point = snapCreatePoint(createPointer(event), els.createCanvas.width, els.createCanvas.height);
  const vertexIndex = nearestCreateVertex(point);
  if (vertexIndex >= 0) {
    state.create.activeVertexIndex = vertexIndex;
    state.create.draggingVertex = true;
    state.create.drawing = false;
    els.createCanvas.setPointerCapture(event.pointerId);
    drawCreatePreview();
    return;
  }
  state.create.drawing = true;
  state.create.draggingVertex = false;
  state.create.activeVertexIndex = -1;
  setCreatePointsFromPixels([point]);
  els.createCanvas.setPointerCapture(event.pointerId);
  drawCreatePreview();
}

function continueCreateStroke(event) {
  if (!state.create.drawing && !state.create.draggingVertex) return;
  const point = snapCreatePoint(createPointer(event), els.createCanvas.width, els.createCanvas.height);
  if (state.create.draggingVertex) {
    const points = activeCreateLinePixels(els.createCanvas.width, els.createCanvas.height);
    points[state.create.activeVertexIndex] = point;
    setCreatePointsFromPixels(points);
    drawCreatePreview();
    return;
  }
  const points = storedCreateLinePixels(els.createCanvas.width, els.createCanvas.height);
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
    const points = storedCreateLinePixels(els.createCanvas.width, els.createCanvas.height);
    if (points.length < 2) {
      points.push({ x: els.createCanvas.width - points[0].x, y: els.createCanvas.height - points[0].y });
    }
    const resampled = resamplePath(points, state.create.vertexCount)
      .map((point) => snapCreatePoint(point, els.createCanvas.width, els.createCanvas.height));
    setCreatePointsFromPixels(resampled);
  }
  state.create.drawing = false;
  state.create.draggingVertex = false;
  els.createCanvas.releasePointerCapture(event.pointerId);
  drawCreatePreview();
}

function cullPointer(event) {
  const rect = els.cullCanvas.getBoundingClientRect();
  return {
    x: Math.min(els.cullCanvas.width, Math.max(0, (event.clientX - rect.left) * (els.cullCanvas.width / rect.width))),
    y: Math.min(els.cullCanvas.height, Math.max(0, (event.clientY - rect.top) * (els.cullCanvas.height / rect.height)))
  };
}

function nearestCullVertex(point, cull) {
  const points = activeCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
  const radius = Math.max(14, Math.ceil(Math.max(els.cullCanvas.width, els.cullCanvas.height) / 45));
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
  const point = snapCullPoint(cullPointer(event), cull, els.cullCanvas.width, els.cullCanvas.height);
  const vertexIndex = nearestCullVertex(point, cull);
  if (vertexIndex >= 0) {
    cull.activeVertexIndex = vertexIndex;
    cull.draggingVertex = true;
    cull.drawing = false;
    els.cullCanvas.setPointerCapture(event.pointerId);
    drawCullPreview();
    return;
  }
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
  const point = snapCullPoint(cullPointer(event), cull, els.cullCanvas.width, els.cullCanvas.height);
  if (cull.draggingVertex) {
    const points = activeCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
    points[cull.activeVertexIndex] = point;
    setCullPointsFromPixels(cull, points);
    drawCullPreview();
    return;
  }
  const points = storedCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
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
    const points = storedCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
    if (points.length < 2) {
      points.push({ x: els.cullCanvas.width - points[0].x, y: els.cullCanvas.height - points[0].y });
    }
    const resampled = resamplePath(points, cull.vertexCount)
      .map((point) => snapCullPoint(point, cull, els.cullCanvas.width, els.cullCanvas.height));
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

function setCullSide(side) {
  cullLayer().cull.side = side === "negative" ? "negative" : "positive";
  drawCullPreview();
}

function updateCullControls() {
  const cull = cullLayer().cull;
  cull.enabled = els.cullEnabled.checked;
  cull.gridDivisions = clampNumber(els.cullGridDivisions.value, 2, 32, cull.gridDivisions);
  cull.lineMode = els.cullLineMode.value === "straight" ? "straight" : "smooth";
  cull.snapToGrid = els.cullSnapToGrid.checked;
  cull.feather = clampNumber(els.cullFeather.value, 0, 96, cull.feather);
  els.cullGridDivisions.value = cull.gridDivisions;
  els.cullFeather.value = cull.feather;
  if (cull.snapToGrid && cull.points.length > 0) {
    const points = activeCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height)
      .map((point) => snapCullPoint(point, cull, els.cullCanvas.width, els.cullCanvas.height));
    setCullPointsFromPixels(cull, points);
  }
  drawCullPreview();
}

function setCullVertexCount() {
  const cull = cullLayer().cull;
  const nextCount = clampNumber(els.cullVertexCount.value, 2, 24, cull.vertexCount);
  const points = activeCullLinePixels(cull, els.cullCanvas.width, els.cullCanvas.height);
  cull.vertexCount = nextCount;
  els.cullVertexCount.value = nextCount;
  setCullPointsFromPixels(cull, resamplePath(points, nextCount));
  cull.activeVertexIndex = Math.min(cull.activeVertexIndex, nextCount - 1);
  drawCullPreview();
}

function clearCullLine() {
  const cull = cullLayer().cull;
  cull.points = [];
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
els.createFeather.addEventListener("input", readCreateEffectControls);
els.createSplatter.addEventListener("input", readCreateEffectControls);
els.createNoise.addEventListener("input", readCreateEffectControls);
els.createVertexCount.addEventListener("input", setCreateVertexCount);
els.createGridDivisions.addEventListener("input", updateCreatePathControls);
els.createLineMode.addEventListener("change", updateCreatePathControls);
els.createSnapToGrid.addEventListener("change", updateCreatePathControls);
els.createSideUpper.addEventListener("click", () => setCreateSide("negative"));
els.createSideLower.addEventListener("click", () => setCreateSide("positive"));
els.clearCreateLine.addEventListener("click", resetCreateLine);
els.loadCreatedTile.addEventListener("click", loadSelectedTransitionRecipe);
els.addCreatedTile.addEventListener("click", addCreatedTransitionTile);
els.cullLayerSelect.addEventListener("change", () => setCullLayer(els.cullLayerSelect.value));
els.cullEnabled.addEventListener("change", updateCullControls);
els.cullSideUpper.addEventListener("click", () => setCullSide("negative"));
els.cullSideLower.addEventListener("click", () => setCullSide("positive"));
els.cullVertexCount.addEventListener("input", setCullVertexCount);
els.cullGridDivisions.addEventListener("input", updateCullControls);
els.cullLineMode.addEventListener("change", updateCullControls);
els.cullSnapToGrid.addEventListener("change", updateCullControls);
els.cullFeather.addEventListener("input", updateCullControls);
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
window.addEventListener("resize", applyResponsiveViewerScale);
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
      viewerScale: state.viewerScale,
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
          vertexCount: layer.cull.vertexCount,
          gridDivisions: layer.cull.gridDivisions,
          snapToGrid: layer.cull.snapToGrid,
          lineMode: layer.cull.lineMode,
          feather: layer.cull.feather
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
        vertexCount: state.create.vertexCount,
        gridDivisions: state.create.gridDivisions,
        snapToGrid: state.create.snapToGrid,
        lineMode: state.create.lineMode,
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
