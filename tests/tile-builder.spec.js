const { test, expect } = require("playwright/test");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const zlib = require("zlib");

const appUrl = `file://${path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/")}`;

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function createSolidPng([red, green, blue, alpha]) {
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const rawPixels = Buffer.from([0, red, green, blue, alpha]);
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(rawPixels)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function createVerticalSplitPng(width, height, topColor, bottomColor) {
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 4;
  const rawPixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const color = y < height / 2 ? topColor : bottomColor;
    const rowStart = y * stride;
    rawPixels[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const pixelStart = rowStart + 1 + x * 4;
      rawPixels[pixelStart] = color[0];
      rawPixels[pixelStart + 1] = color[1];
      rawPixels[pixelStart + 2] = color[2];
      rawPixels[pixelStart + 3] = color[3];
    }
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(rawPixels)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function createTileGridPng(tileWidth, tileHeight, colors) {
  const columns = colors[0].length;
  const rows = colors.length;
  const width = columns * tileWidth;
  const height = rows * tileHeight;
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 4;
  const rawPixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    rawPixels[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const color = colors[Math.floor(y / tileHeight)][Math.floor(x / tileWidth)];
      const pixelStart = rowStart + 1 + x * 4;
      rawPixels[pixelStart] = color[0];
      rawPixels[pixelStart + 1] = color[1];
      rawPixels[pixelStart + 2] = color[2];
      rawPixels[pixelStart + 3] = color[3];
    }
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(rawPixels)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function createPaddedTilePng(width, height, top, bottom, color) {
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 4;
  const rawPixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    rawPixels[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const pixelStart = rowStart + 1 + x * 4;
      if (y >= top && y <= bottom) {
        rawPixels[pixelStart] = color[0];
        rawPixels[pixelStart + 1] = color[1];
        rawPixels[pixelStart + 2] = color[2];
        rawPixels[pixelStart + 3] = color[3];
      }
    }
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(rawPixels)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function createTransparentRectPng(width, height, bounds, color) {
  const signature = Buffer.from("89504e470d0a1a0a", "hex");
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 4;
  const rawPixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    rawPixels[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) continue;
      const pixelStart = rowStart + 1 + x * 4;
      rawPixels[pixelStart] = color[0];
      rawPixels[pixelStart + 1] = color[1];
      rawPixels[pixelStart + 2] = color[2];
      rawPixels[pixelStart + 3] = color[3];
    }
  }

  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(rawPixels)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function readPngSize(buffer) {
  expect(buffer.subarray(0, 8)).toEqual(Buffer.from("89504e470d0a1a0a", "hex"));
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

const pngs = {
  red: createSolidPng([255, 0, 0, 255]),
  blue: createSolidPng([0, 0, 255, 255]),
  splitTall: createVerticalSplitPng(128, 256, [255, 0, 0, 255], [0, 0, 255, 255]),
  twoTileSheet: createTileGridPng(64, 32, [[[255, 0, 0, 255], [0, 0, 255, 255]]])
};

async function openApp(page) {
  await page.goto(appUrl);
  await expect(page).toHaveTitle("Isometric Tile Spritesheet Builder");
  await expect(page.locator("#projectScreen")).toBeVisible();
  await expect(page.locator("#gridCanvas")).toBeHidden();
}

async function selectControlTab(page, name) {
  await page.getByRole("tab", { name }).click();
}

async function clickExport(page, name) {
  await selectControlTab(page, "6. Export");
  await page.getByRole("button", { name }).click();
}

async function setProject(page, {
  cols = 4,
  rows = 3,
  tileWidth = 64,
  tileHeight = 32,
  spriteWidth = tileWidth,
  spriteHeight = tileHeight,
  exportCols = 2
} = {}) {
  await page.locator("#gridCols").fill(String(cols));
  await page.locator("#gridRows").fill(String(rows));
  await page.locator("#tileWidth").fill(String(tileWidth));
  await page.locator("#tileHeight").fill(String(tileHeight));
  await page.locator("#spriteWidth").fill(String(spriteWidth));
  await page.locator("#spriteHeight").fill(String(spriteHeight));
  await page.getByRole("button", { name: "Apply Settings" }).click();
  await selectControlTab(page, "6. Export");
  await page.locator("#exportCols").fill(String(exportCols));
  await page.locator("#exportCols").blur();
  await selectControlTab(page, "2. Import");
}

async function addTile(page, name, buffer, { openPlace = true } = {}) {
  await page.locator("#fileInput").setInputFiles({
    name,
    mimeType: "image/png",
    buffer
  });

  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#cropTitle")).toHaveText(name);
  await page.getByRole("button", { name: "Add Tile" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", false);
  await expect(page.locator("#selectedTileName")).toHaveText(name);
  if (openPlace) await selectControlTab(page, "5. Place");
}

async function clickCell(page, x, y) {
  await page.locator("#gridCanvas").scrollIntoViewIfNeeded();
  await page.locator("#gridCanvas").evaluate((canvas, cell) => {
    const state = window.__tileBuilderDebug.getState();
    const rect = canvas.getBoundingClientRect();
    const pad = Math.max(32, Math.ceil(Math.max(state.tileWidth, state.spriteHeight) * 0.35));
    const halfW = state.tileWidth / 2;
    const halfH = state.tileHeight / 2;
    const canvasX = pad + (state.rows - 1) * halfW + halfW + (cell.x - cell.y) * halfW;
    const canvasY = pad + halfH + (cell.x + cell.y) * halfH;
    const clientX = rect.left + (canvasX / canvas.width) * rect.width;
    const clientY = rect.top + (canvasY / canvas.height) * rect.height;

    canvas.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY
    }));
  }, { x, y });
}

async function captureExport(page) {
  await page.addInitScript(() => {
    window.__lastTileDownload = null;
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function interceptedClick() {
      if (this.download && this.href.startsWith("data:image/png")) {
        window.__lastTileDownload = {
          download: this.download,
          href: this.href
        };
        return;
      }
      return originalClick.call(this);
    };
  });
}

test.beforeEach(async ({ page }) => {
  await captureExport(page);
});

test("loads the static page and applies custom project settings", async ({ page }) => {
  await openApp(page);
  await setProject(page);

  await expect(page.locator("#projectStatus")).toHaveText(
    "Sprite size changed. Existing palette was preserved; new imports and exports use the updated sprite size."
  );

  await expect(page.locator("#gridCanvas")).toHaveJSProperty("width", 288);
  await expect(page.locator("#gridCanvas")).toHaveJSProperty("height", 208);
});

test("preserves palette tiles across settings changes and saves and reloads palettes", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red);
  await clickCell(page, 1, 1);
  await selectControlTab(page, "3. Palette");
  await page.locator("#paletteTileName").fill("hero.png");
  await page.getByRole("button", { name: "Rename Tile" }).click();

  await selectControlTab(page, "1. Project");
  await page.locator("#spriteWidth").fill("80");
  await page.locator("#spriteHeight").fill("40");
  await page.getByRole("button", { name: "Apply Settings" }).click();
  await expect(page.locator("#projectStatus")).toHaveText(
    "Sprite size changed. Existing palette was preserved; new imports and exports use the updated sprite size."
  );
  await expect(page.locator("#importedTileCount")).toHaveText("1");
  await expect(page.locator("#placedCount")).toHaveText("1");

  await selectControlTab(page, "3. Palette");
  await expect(page.locator(".manager-tile-card")).toHaveCount(1);
  await expect(page.locator("#paletteSelectedName")).toHaveText("hero.png (64x32)");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save Palette" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("isometric-tile-palette.json");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const savedPalette = Buffer.concat(chunks);
  const paletteJson = JSON.parse(savedPalette.toString("utf8"));
  expect(paletteJson.tiles).toHaveLength(1);
  expect(paletteJson.tiles[0].name).toBe("hero.png");
  expect(paletteJson.tiles[0].url).toMatch(/^data:image\/png/);
  expect(paletteJson.tiles[0].anchor).toEqual({ x: 32, y: 16 });

  await page.getByRole("button", { name: "Delete Tile" }).click();
  await expect(page.locator(".manager-tile-card")).toHaveCount(0);
  await page.locator("#paletteFileInput").setInputFiles({
    name: "saved-palette.json",
    mimeType: "application/json",
    buffer: savedPalette
  });
  await expect(page.locator(".manager-tile-card")).toHaveCount(1);
  await expect(page.locator("#paletteSelectedName")).toHaveText("hero.png (64x32)");
  await expect(page.locator("#projectStatus")).toHaveText("Loaded 1 palette tile from saved-palette.json.");
});

test("saves and reloads a complete project with settings, sprites, layers, and placements", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 5, rows: 4, tileWidth: 64, tileHeight: 32, exportCols: 3 });
  await addTile(page, "red.png", pngs.red);
  await clickCell(page, 1, 1);
  await addTile(page, "blue.png", pngs.blue);
  await page.getByRole("button", { name: "Add Layer" }).click();
  await page.locator("#layerName").fill("Foreground");
  await page.getByRole("button", { name: "Rename Layer" }).click();
  await clickCell(page, 2, 1);
  await page.getByRole("checkbox", { name: "Show Layer 1" }).uncheck();

  await selectControlTab(page, "1. Project");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save Project" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("isometric-tile-project.json");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const savedProject = Buffer.concat(chunks);
  const projectJson = JSON.parse(savedProject.toString("utf8"));
  expect(projectJson.settings).toMatchObject({ cols: 5, rows: 4, tileWidth: 64, tileHeight: 32, exportCols: 3 });
  expect(projectJson.tiles.map((tile) => tile.name)).toEqual(["red.png", "blue.png"]);
  expect(projectJson.layers.map((layer) => ({ name: layer.name, visible: layer.visible, placements: layer.placements.length }))).toEqual([
    { name: "Layer 1", visible: false, placements: 1 },
    { name: "Foreground", visible: true, placements: 1 }
  ]);

  await selectControlTab(page, "5. Place");
  await page.getByRole("button", { name: "Delete Layer" }).click();
  await selectControlTab(page, "3. Palette");
  await page.getByRole("button", { name: "Delete Tile" }).click();
  await selectControlTab(page, "1. Project");
  await page.locator("#gridCols").fill("2");
  await page.getByRole("button", { name: "Apply Settings" }).click();
  await selectControlTab(page, "1. Project");
  await page.locator("#projectFileInput").setInputFiles({
    name: "saved-project.json",
    mimeType: "application/json",
    buffer: savedProject
  });

  await expect(page.locator("#projectStatus")).toHaveText(
    "Loaded project from saved-project.json: 2 palette tiles, 2 layers, and 2 placements."
  );
  expect(await page.evaluate(() => window.__tileBuilderDebug.getState())).toMatchObject({
    cols: 5,
    rows: 4,
    tileWidth: 64,
    tileHeight: 32,
    exportCols: 3,
    placedCount: 2,
    layerCount: 2,
    activeLayerName: "Foreground",
    layerPlacements: [
      { name: "Layer 1", count: 1, visible: false, order: 0 },
      { name: "Foreground", count: 1, visible: true, order: 1 }
    ],
    tiles: [
      { name: "red.png" },
      { name: "blue.png" }
    ]
  });
  await selectControlTab(page, "5. Place");
  await expect(page.locator(".layer-list-name")).toHaveText(["Foreground", "Layer 1"]);
  await expect(page.getByRole("checkbox", { name: "Show Layer 1" })).not.toBeChecked();
});

test("organizes the workflow into separate project, import, palette, create, place, and export screens", async ({ page }) => {
  await openApp(page);

  await expect(page.getByRole("tab", { name: "1. Project" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Apply Settings" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save Project" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeHidden();
  await expect(page.locator("#gridCanvas")).toBeHidden();
  await expect(page.locator("#placementPreviewEmpty")).toHaveText("Select a tile to preview.");
  await expect(page.locator("#placementPreviewName")).toHaveText("None selected.");
  await selectControlTab(page, "2. Import");
  await expect(page.getByRole("button", { name: "Apply Settings" })).toBeHidden();

  await addTile(page, "red.png", pngs.red, { openPlace: false });
  await expect(page.getByRole("tab", { name: "3. Palette" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".manager-tile-card", { hasText: "red.png" })).toBeVisible();
  await selectControlTab(page, "4. Create");
  await expect(page.getByRole("button", { name: "Add Transition" })).toBeVisible();
  await expect(page.locator("#createCanvas")).toBeVisible();
  await selectControlTab(page, "5. Place");
  await expect(page.locator(".tile-card", { hasText: "red.png" })).toBeVisible();
  await expect(page.locator("#placementPreview")).toHaveAttribute("alt", "red.png placement preview");
  await expect(page.locator("#placementPreview")).toHaveClass(/has-tile/);
  await expect(page.locator("#placementPreviewName")).toHaveText("red.png");
  await expect(page.locator("#gridCanvas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply Settings" })).toBeHidden();
  await clickCell(page, 1, 1);

  await selectControlTab(page, "6. Export");
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export Full Scene PNG" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Export Active Layer PNG" })).toBeVisible();
  await expect(page.locator("#gridCanvas")).toBeHidden();
  await expect(page.locator("#exportTileCount")).toHaveText("1");
  await expect(page.locator("#exportPlacedCount")).toHaveText("1");
});

test("creates a non-destructive transition tile with reloadable cut settings", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red, { openPlace: false });
  await addTile(page, "blue.png", pngs.blue, { openPlace: false });
  await addTile(page, "sparkle.png", pngs.red, { openPlace: false });

  await selectControlTab(page, "4. Create");
  const ids = await page.evaluate(() => {
    return Object.fromEntries(window.__tileBuilderDebug.getState().tiles.map((tile) => [tile.name, tile.id]));
  });
  await page.locator("#createTileA").selectOption(ids["red.png"]);
  await page.locator("#createTileB").selectOption(ids["blue.png"]);
  await page.locator("#createTileC").selectOption(ids["sparkle.png"]);
  await page.locator("#createDecorationOpacity").fill("35");
  await page.locator("#createDecorationBlend").selectOption("overlay");
  await page.locator("#createTileName").fill("red-to-blue.png");
  await page.locator("#createFeather").fill("4");
  await page.locator("#createSplatter").fill("0");
  await page.locator("#createNoise").fill("0");
  await page.locator("#createCanvas").evaluate((canvas) => {
    const rect = canvas.getBoundingClientRect();
    const point = (x, y) => ({
      clientX: rect.left + x / canvas.width * rect.width,
      clientY: rect.top + y / canvas.height * rect.height
    });
    canvas.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, ...point(8, canvas.height * 0.62) }));
    canvas.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, ...point(canvas.width * 0.28, canvas.height * 0.34) }));
    canvas.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, ...point(canvas.width * 0.58, canvas.height * 0.58) }));
    canvas.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, ...point(canvas.width * 0.82, canvas.height * 0.42) }));
    canvas.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1, ...point(canvas.width - 8, canvas.height * 0.52) }));
  });
  await page.getByRole("button", { name: "Add Transition" }).click();

  await expect(page.locator(".manager-tile-card")).toHaveCount(4);
  await expect(page.locator("#projectStatus")).toHaveText(
    "Added red-to-blue.png as a new transition tile. Source tiles were left unchanged."
  );
  const transition = await page.evaluate(() => {
    const state = window.__tileBuilderDebug.getState();
    return {
      names: state.tiles.map((tile) => tile.name),
      tile: state.tiles.find((tile) => tile.name === "red-to-blue.png")
    };
  });
  expect(transition.names).toEqual(["red.png", "blue.png", "sparkle.png", "red-to-blue.png"]);
  expect(transition.tile.transition).toMatchObject({
    tileAName: "red.png",
    tileBName: "blue.png",
    tileCName: "sparkle.png",
    decorationOpacity: 35,
    decorationBlend: "overlay",
    feather: 4,
    splatter: 0,
    noise: 0
  });
  expect(transition.tile.transition.points.length).toBeGreaterThanOrEqual(5);

  await page.locator("#createFeather").fill("20");
  await page.locator("#createDecorationOpacity").fill("80");
  await page.getByRole("button", { name: "Load Selected" }).click();
  await expect(page.locator("#createFeather")).toHaveValue("4");
  await expect(page.locator("#createDecorationOpacity")).toHaveValue("35");
  await expect(page.locator("#createDecorationBlend")).toHaveValue("overlay");
  await expect(page.locator("#projectStatus")).toHaveText("Loaded transition settings from red-to-blue.png.");
});

test("manages palette tiles with clone, rename, transforms, re-cropping, recolor, transparency, and delete", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red);
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("1");

  await selectControlTab(page, "3. Palette");
  await expect(page.locator(".manager-tile-card")).toHaveCount(1);
  await expect(page.locator("#paletteSelectedName")).toHaveText("red.png (64x32)");
  const editorColumns = await page.locator(".palette-editor-layout").evaluate((layout) => {
    const preview = layout.querySelector(".palette-editor-preview-column").getBoundingClientRect();
    const controls = layout.querySelector(".palette-editor-controls").getBoundingClientRect();
    return { previewTop: preview.top, previewRight: preview.right, controlsTop: controls.top, controlsLeft: controls.left };
  });
  expect(Math.abs(editorColumns.previewTop - editorColumns.controlsTop)).toBeLessThan(2);
  expect(editorColumns.controlsLeft).toBeGreaterThanOrEqual(editorColumns.previewRight);

  await page.locator("#paletteTileName").fill("hero.png");
  await page.getByRole("button", { name: "Rename Tile" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Renamed red.png to hero.png.");
  await expect(page.locator("#paletteSelectedName")).toHaveText("hero.png (64x32)");

  await page.getByRole("button", { name: "Clone Tile" }).click();
  await expect(page.locator(".manager-tile-card")).toHaveCount(2);
  await expect(page.locator("#projectStatus")).toHaveText("Cloned hero.png as hero copy.png.");
  await expect(page.locator("#paletteTileName")).toHaveValue("hero copy.png");
  await page.locator(".manager-tile-card").filter({ hasText: "hero.png" }).click();

  await page.getByRole("button", { name: "Rotate Right" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Rotated right hero.png.");
  await expect(page.locator("#paletteSelectedName")).toHaveText("hero.png (32x64)");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().tiles.find((tile) => tile.name === "hero.png").anchor))
    .resolves.toEqual({ x: 16, y: 32 });
  await page.getByRole("button", { name: "Rotate Left" }).click();
  await expect(page.locator("#paletteSelectedName")).toHaveText("hero.png (64x32)");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().tiles.find((tile) => tile.name === "hero.png").anchor))
    .resolves.toEqual({ x: 32, y: 16 });
  await page.getByRole("button", { name: "Flip Horizontal" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Flipped horizontally hero.png.");
  await page.getByRole("button", { name: "Flip Vertical" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Flipped vertically hero.png.");

  await page.getByRole("button", { name: "Re-crop" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await page.getByRole("button", { name: "Add Tile" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", false);
  await expect(page.locator(".manager-tile-card")).toHaveCount(2);
  await expect(page.locator("#projectStatus")).toHaveText("Updated hero.png at 64x32.");

  await page.locator("#tileTintColor").fill("#0000ff");
  await page.locator("#tileTintStrength").fill("100");
  await page.getByRole("button", { name: "Apply Tint" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Applied 100% tint to hero.png.");
  let sample = await page.locator("#palettePreview").evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(1, 1, 1, 1).data];
  });
  expect(sample).toEqual([0, 0, 255, 255]);

  await page.locator("#transparentTileColor").fill("#0000ff");
  await page.getByRole("button", { name: "Make Transparent" }).click();
  await expect(page.locator("#projectStatus")).toHaveText("Made 2048 pixels transparent in hero.png.");
  sample = await page.locator("#palettePreview").evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(1, 1, 1, 1).data];
  });
  expect(sample[3]).toBe(0);

  await page.getByRole("button", { name: "Delete Tile" }).click();
  await expect(page.locator(".manager-tile-card")).toHaveCount(1);
  await expect(page.locator("#placedCount")).toHaveText("0");
  await page.getByRole("button", { name: "Delete Tile" }).click();
  await expect(page.locator(".manager-tile-card")).toHaveCount(0);
  await expect(page.locator("#placedCount")).toHaveText("0");
});

test("zooms the grid viewer and labels non-1:1 preview scale", async ({ page }) => {
  await openApp(page);
  await selectControlTab(page, "5. Place");
  await expect(page.locator("#zoomScale")).toHaveText("Scale: 100% (1:1)");
  await expect(page.locator("#zoomScale")).not.toHaveClass(/is-scaled/);

  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.locator("#zoomScale")).toHaveText("Scale: 125% (preview scaled)");
  await expect(page.locator("#zoomScale")).toHaveClass(/is-scaled/);
  await expect(page.locator("#gridCanvas")).toHaveCSS("transform", /matrix\(1\.25/);

  await page.getByRole("button", { name: "1:1" }).click();
  await expect(page.locator("#zoomScale")).toHaveText("Scale: 100% (1:1)");
  await expect(page.locator("#zoomScale")).not.toHaveClass(/is-scaled/);

  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect(page.locator("#zoomScale")).toHaveText("Scale: 75% (preview scaled)");
  await expect(page.locator("#zoomScale")).toHaveClass(/is-scaled/);
});

test("toggles dark mode and persists the display preference", async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem("tileBuilderTheme"));
  await page.reload();
  await expect(page.getByRole("button", { name: "Dark Mode" })).toBeVisible();

  const lightBackground = await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor);
  await page.getByRole("button", { name: "Dark Mode" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Light Mode" })).toHaveAttribute("aria-pressed", "true");
  const darkBackground = await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);
  expect(await page.evaluate(() => localStorage.getItem("tileBuilderTheme"))).toBe("dark");

  await page.reload();
  await expect(page.locator("body")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Light Mode" })).toBeVisible();

  await setProject(page);
  await addTile(page, "red.png", pngs.red);
  await clickCell(page, 1, 0);
  await clickExport(page, "Export PNG");

  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  const sampled = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(32, 16, 1, 1).data];
  }, exported.href);
  expect(sampled[0]).toBeGreaterThan(sampled[2]);
});

test("keeps controls usable on a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openApp(page);

  await expect(page.locator("#zoomScale")).toHaveText("Scale: 50% (preview scaled)");
  await expect(page.locator("#zoomScale")).toHaveClass(/is-scaled/);
  await expect(page.getByRole("tab", { name: "6. Export" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply Settings" })).toBeVisible();
  await expect(page.locator("#gridCanvas")).toBeHidden();

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    headerHeight: document.querySelector(".app-header").getBoundingClientRect().height,
    screenTop: document.querySelector("#projectScreen").getBoundingClientRect().top,
    navHeight: document.querySelector(".workflow-nav").getBoundingClientRect().height
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.headerHeight).toBeLessThan(120);
  expect(layout.screenTop).toBeGreaterThanOrEqual(0);
  expect(layout.navHeight).toBeLessThan(120);

  await selectControlTab(page, "6. Export");
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeVisible();
  await selectControlTab(page, "1. Project");
  await setProject(page, { cols: 3, rows: 3, tileWidth: 64, tileHeight: 32, exportCols: 2 });
  await addTile(page, "red.png", pngs.red);
  await expect(page.locator("#gridCanvas")).toBeVisible();
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("1");

  await page.getByRole("button", { name: "1:1" }).click();
  await expect(page.locator("#zoomScale")).toHaveText("Scale: 100% (1:1)");
});

test("keeps controls compact on a short mobile landscape viewport", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await openApp(page);

  await expect(page.locator("#zoomScale")).toHaveText("Scale: 50% (preview scaled)");
  await expect(page.locator("#zoomScale")).toHaveClass(/is-scaled/);
  await expect(page.getByRole("tab", { name: "6. Export" })).toBeVisible();
  await expect(page.locator("#gridCanvas")).toBeHidden();

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    headerHeight: document.querySelector(".app-header").getBoundingClientRect().height,
    navHeight: document.querySelector(".workflow-nav").getBoundingClientRect().height,
    screenTop: document.querySelector("#projectScreen").getBoundingClientRect().top
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
  expect(layout.headerHeight).toBeLessThan(64);
  expect(layout.navHeight).toBeLessThan(60);
  expect(layout.screenTop).toBeGreaterThanOrEqual(0);

  await selectControlTab(page, "6. Export");
  await expect(page.getByRole("button", { name: "Export PNG" })).toBeVisible();
  await selectControlTab(page, "1. Project");
  await setProject(page, { cols: 3, rows: 3, tileWidth: 64, tileHeight: 32, exportCols: 2 });
  await addTile(page, "red.png", pngs.red);
  const placementLayout = await page.evaluate(() => ({
    panelWidth: document.querySelector(".control-panel").getBoundingClientRect().width,
    panelHeight: document.querySelector(".control-panel").getBoundingClientRect().height,
    toolbarHeight: document.querySelector(".canvas-toolbar").getBoundingClientRect().height,
    workspaceLeft: document.querySelector(".workspace").getBoundingClientRect().left,
    canvasTop: document.querySelector("#gridCanvas").getBoundingClientRect().top
  }));
  expect(placementLayout.panelWidth).toBeLessThan(300);
  expect(placementLayout.panelHeight).toBeLessThanOrEqual(335);
  expect(placementLayout.toolbarHeight).toBeLessThan(48);
  expect(placementLayout.workspaceLeft).toBeGreaterThan(placementLayout.panelWidth - 1);
  expect(placementLayout.canvasTop).toBeLessThan(165);
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("1");
});

test("uploads, crops, places, erases, and clears a PNG tile", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red);

  await expect(page.locator(".tile-card")).toHaveCount(1);
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("1");
  await expect(page.locator("#hoverCell")).toContainText("Cell:");

  await page.getByRole("button", { name: "Erase" }).click();
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("0");

  await page.getByRole("button", { name: "Paint" }).click();
  await clickCell(page, 2, 1);
  await expect(page.locator("#placedCount")).toHaveText("1");
  await page.getByRole("button", { name: "Clear Grid" }).click();
  await expect(page.locator("#placedCount")).toHaveText("0");
});

test("drop mode moves placed tiles only into empty grid cells", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red);
  await addTile(page, "blue.png", pngs.blue);

  await page.locator(".tile-card", { hasText: "red.png" }).click();
  await clickCell(page, 1, 1);
  await page.locator(".tile-card", { hasText: "blue.png" }).click();
  await clickCell(page, 2, 1);
  await expect(page.locator("#placedCount")).toHaveText("2");

  await page.getByRole("button", { name: "Move", exact: true }).click();
  await expect(page.getByRole("button", { name: "Move", exact: true })).toHaveClass(/is-active/);

  await clickCell(page, 1, 1);
  await expect(page.locator("#projectStatus")).toHaveText("Picked up red.png. Choose an empty spot.");
  await expect(page.locator("#selectedTileName")).toHaveText("Moving red.png");
  await expect(page.locator("#placementPreview")).toHaveAttribute("alt", "red.png placement preview");
  await expect(page.locator("#placementPreviewName")).toHaveText("Moving red.png");

  await clickCell(page, 2, 1);
  await expect(page.locator("#placedCount")).toHaveText("2");
  await expect(page.locator("#projectStatus")).toHaveText("Drop mode only moves tiles into empty spots.");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().pickedPlacement)).resolves.not.toBeNull();

  await clickCell(page, 0, 1);
  await expect(page.locator("#placedCount")).toHaveText("2");
  await expect(page.locator("#projectStatus")).toHaveText("Moved red.png to 0, 1.");
  await expect(page.locator("#selectedTileName")).toHaveText("blue.png");
  await expect(page.locator("#placementPreview")).toHaveAttribute("alt", "blue.png placement preview");
  await expect(page.locator("#placementPreviewName")).toHaveText("blue.png");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().pickedPlacement)).resolves.toBeNull();

  await clickExport(page, "Export PNG");
  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return {
      first: [...ctx.getImageData(32, 16, 1, 1).data],
      second: [...ctx.getImageData(96, 16, 1, 1).data]
    };
  }, exported.href);

  expect(inspected.first[0]).toBeGreaterThan(inspected.first[2]);
  expect(inspected.second[2]).toBeGreaterThan(inspected.second[0]);
});

test("moves a selected tile group together and restores it when the destination leaves the grid", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 4, rows: 3, tileWidth: 64, tileHeight: 32 });
  await addTile(page, "red.png", pngs.red);
  await addTile(page, "blue.png", pngs.blue);

  await page.locator(".tile-card", { hasText: "red.png" }).click();
  await clickCell(page, 0, 0);
  await page.locator(".tile-card", { hasText: "blue.png" }).click();
  await clickCell(page, 1, 0);

  await page.getByRole("button", { name: "Select Group" }).click();
  await clickCell(page, 0, 0);
  await clickCell(page, 1, 0);
  await expect(page.locator("#groupSelectionInfo")).toHaveText("2 tiles selected.");
  await expect(page.locator("#selectedTileName")).toHaveText("2 tiles selected");
  await page.getByRole("button", { name: "Move Selected" }).click();
  await expect(page.locator("#groupSelectionInfo")).toHaveText("Moving 2 selected tiles. Click a new anchor cell.");
  await clickCell(page, 1, 1);
  await expect(page.locator("#projectStatus")).toHaveText("Moved 2 tiles together.");
  await expect(page.locator("#groupSelectionInfo")).toHaveText("No group selected.");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().layerPlacements[0].placements))
    .resolves.toEqual([
      expect.objectContaining({ x: 1, y: 1 }),
      expect.objectContaining({ x: 2, y: 1 })
    ]);

  await clickCell(page, 1, 1);
  await clickCell(page, 2, 1);
  await page.getByRole("button", { name: "Move Selected" }).click();
  await clickCell(page, 3, 1);
  await expect(page.locator("#projectStatus")).toHaveText(
    "Group move canceled. The selected tiles were restored because part of the group would leave the grid."
  );
  await expect(page.locator("#groupSelectionInfo")).toHaveText("No group selected.");
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().layerPlacements[0].placements))
    .resolves.toEqual([
      expect.objectContaining({ x: 1, y: 1 }),
      expect.objectContaining({ x: 2, y: 1 })
    ]);
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().groupMoveOrigin)).resolves.toBeNull();
});

test("locks crop source scale and nudges to the bottom half of a tall PNG", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 2, rows: 2, tileWidth: 128, tileHeight: 128, exportCols: 1 });

  await page.locator("#fileInput").setInputFiles({
    name: "split-tall.png",
    mimeType: "image/png",
    buffer: pngs.splitTall
  });

  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await page.locator("#cropScaleMode").selectOption("1");
  await expect(page.locator("#cropSourceInfo")).toHaveText("Crop source: 128x128px (1x locked)");
  await expect(page.locator("#cropNudgePixels")).toHaveValue("1");
  await expect(page.getByRole("button", { name: "Up", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Down", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Left", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Right", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Center Image" })).toHaveCount(0);
  await page.locator("#cropNudgePixels").fill("64");
  await page.getByRole("button", { name: "Up", exact: true }).click();
  await page.getByRole("button", { name: "Set Crop" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await expect(page.locator("#projectStatus")).toHaveText("Crop set to 128x128. Keep adjusting or add the tile.");
  await expect(page.locator(".tile-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Set Crop" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await page.getByRole("button", { name: "Add Tile" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", false);

  const sampled = await page.locator(".tile-card img").evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return [...ctx.getImageData(64, 64, 1, 1).data];
  });

  expect(sampled[2]).toBeGreaterThan(sampled[0]);
  expect(sampled[3]).toBe(255);
});

test("resizes and repositions a custom crop window when importing one PNG", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 2, rows: 2, tileWidth: 64, tileHeight: 32, spriteWidth: 128, spriteHeight: 128 });

  await page.locator("#fileInput").setInputFiles({
    name: "custom-crop.png",
    mimeType: "image/png",
    buffer: pngs.splitTall
  });

  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await page.locator("#cropWidth").fill("64");
  await page.locator("#cropHeight").fill("32");
  await page.getByRole("button", { name: "Apply Size" }).click();
  await expect(page.locator("#projectStatus")).toHaveText(
    "Crop window set to 64x32. Drag the image to position the crop."
  );
  await expect(page.locator("#cropCanvas")).toHaveJSProperty("width", 560);
  await expect(page.locator("#cropCanvas")).toHaveJSProperty("height", 280);

  await page.locator("#cropScaleMode").selectOption("1");
  await expect(page.locator("#cropSourceInfo")).toHaveText("Crop source: 64x32px (1x locked)");
  await page.locator("#cropNudgePixels").fill("112");
  await page.getByRole("button", { name: "Up", exact: true }).click();
  await page.getByRole("button", { name: "Add Tile" }).click();

  const inspected = await page.locator(".tile-card img").evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      sample: [...ctx.getImageData(32, 16, 1, 1).data]
    };
  });

  expect(inspected.width).toBe(64);
  expect(inspected.height).toBe(32);
  expect(inspected.sample[2]).toBeGreaterThan(inspected.sample[0]);
  expect(inspected.sample[3]).toBe(255);
});

test("auto crops visible pixels with optional padding and keeps the result editable", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 2, rows: 2, tileWidth: 64, tileHeight: 32, spriteWidth: 64, spriteHeight: 64 });

  await page.locator("#fileInput").setInputFiles({
    name: "transparent-box.png",
    mimeType: "image/png",
    buffer: createTransparentRectPng(
      64,
      64,
      { left: 10, top: 15, right: 29, bottom: 34 },
      [0, 0, 255, 255]
    )
  });

  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await page.getByRole("button", { name: "Auto Crop Visible Pixels" }).click();
  await expect(page.locator("#cropWidth")).toHaveValue("64");
  await expect(page.locator("#cropHeight")).toHaveValue("52");
  await expect(page.locator("#cropSourceInfo")).toHaveText("Crop source: 64x52px (1x locked)");
  await expect(page.locator("#projectStatus")).toHaveText(
    "Auto crop set to 64x52 with 16px X / 16px Y anchor padding and 0px X / 0px Y extra padding."
  );

  await page.locator("#cropPaddingX").fill("3");
  await page.locator("#cropPaddingY").fill("5");
  await page.getByRole("button", { name: "Auto Crop Visible Pixels" }).click();
  await expect(page.locator("#cropWidth")).toHaveValue("64");
  await expect(page.locator("#cropHeight")).toHaveValue("62");
  await expect(page.locator("#cropSourceInfo")).toHaveText("Crop source: 64x62px (1x locked)");
  await expect(page.locator("#projectStatus")).toHaveText(
    "Auto crop set to 64x62 with 16px X / 16px Y anchor padding and 3px X / 5px Y extra padding."
  );

  await page.getByRole("button", { name: "Add Tile" }).click();
  const inspected = await page.locator(".tile-card img").evaluate(async (image) => {
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      paddingSample: [...ctx.getImageData(1, 1, 1, 1).data],
      visibleSample: [...ctx.getImageData(22, 21, 1, 1).data]
    };
  });

  expect(inspected.width).toBe(64);
  expect(inspected.height).toBe(62);
  expect(inspected.paddingSample[3]).toBe(0);
  expect(inspected.visibleSample[2]).toBeGreaterThan(inspected.visibleSample[0]);
  expect(inspected.visibleSample[3]).toBe(255);
});

test("uses the crop diamond overlay as the placement anchor for oversized sprites", async ({ page }) => {
  await openApp(page);
  await setProject(page, {
    cols: 3,
    rows: 3,
    tileWidth: 64,
    tileHeight: 32,
    spriteWidth: 96,
    spriteHeight: 96,
    exportCols: 1
  });

  await page.locator("#fileInput").setInputFiles({
    name: "oversized-tile.png",
    mimeType: "image/png",
    buffer: createTransparentRectPng(
      96,
      96,
      { left: 16, top: 16, right: 79, bottom: 79 },
      [0, 0, 255, 255]
    )
  });

  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", true);
  await expect(page.locator(".crop-guide-description")).toHaveText(
    "The diamond overlay is the grid tile anchor. Drag or nudge the sprite around it to control how oversized art sits on the map."
  );
  await page.locator("#cropWidth").fill("120");
  await page.locator("#cropHeight").fill("140");
  await page.getByRole("button", { name: "Apply Size" }).click();
  await page.getByRole("button", { name: "Add Tile" }).click();
  await expect(page.locator("#cropDialog")).toHaveJSProperty("open", false);
  await expect(page.locator(".tile-card")).toHaveCount(1);
  await expect(page.evaluate(() => window.__tileBuilderDebug.getState().tiles[0].anchor))
    .resolves.toEqual({ x: 60, y: 70 });
  await selectControlTab(page, "5. Place");
  await clickCell(page, 1, 1);
  await clickExport(page, "Export Full Scene PNG");

  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const state = window.__tileBuilderDebug.getState();
    const pad = Math.max(32, Math.ceil(Math.max(state.tileWidth, state.spriteHeight) * 0.35));
    const centerX = pad + (state.rows - 1) * state.tileWidth / 2 + state.tileWidth / 2;
    const centerY = pad + state.tileHeight / 2 + (1 + 1) * state.tileHeight / 2;
    return {
      aligned: [...ctx.getImageData(centerX, centerY - 1, 1, 1).data]
    };
  }, exported.href);

  expect(inspected.aligned[2]).toBeGreaterThan(inspected.aligned[0]);
  expect(inspected.aligned[3]).toBe(255);
});

test("exports placed tiles as a Y-then-X sorted packed PNG", async ({ page }) => {
  await openApp(page);
  await setProject(page);
  await addTile(page, "red.png", pngs.red);
  await addTile(page, "blue.png", pngs.blue);

  await page.locator(".tile-card", { hasText: "blue.png" }).click();
  await clickCell(page, 0, 1);
  await page.locator(".tile-card", { hasText: "red.png" }).click();
  await clickCell(page, 1, 0);

  await clickExport(page, "Export PNG");

  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  expect(exported.download).toBe("godot-tileset-64x32.png");
  await expect(page.locator("#projectStatus")).toHaveText("Exported 2 tiles as 128x32 PNG.");

  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const first = [...ctx.getImageData(32, 16, 1, 1).data];
    const second = [...ctx.getImageData(96, 16, 1, 1).data];

    return {
      width: image.width,
      height: image.height,
      first,
      second
    };
  }, exported.href);

  expect(inspected.width).toBe(128);
  expect(inspected.height).toBe(32);
  expect(inspected.first[0]).toBeGreaterThan(inspected.first[2]);
  expect(inspected.second[2]).toBeGreaterThan(inspected.second[0]);
});

test("imports a spritesheet, paints layered tiles, and exports an oriented map PNG", async ({ page }) => {
  await openApp(page);
  await setProject(page, { cols: 3, rows: 3, tileWidth: 64, tileHeight: 32, exportCols: 2 });

  await page.locator("#sheetFileInput").setInputFiles({
    name: "terrain-sheet.png",
    mimeType: "image/png",
    buffer: pngs.twoTileSheet
  });

  await expect(page.locator(".tile-card")).toHaveCount(2);
  await expect(page.locator("#projectStatus")).toHaveText(
    "Imported 2 tiles from terrain-sheet.png using 64x32 sprite cells."
  );

  await selectControlTab(page, "5. Place");
  await page.locator(".tile-card", { hasText: "terrain-sheet_1_1.png" }).click();
  await clickCell(page, 1, 1);
  await page.getByRole("button", { name: "Add Layer" }).click();
  await expect(page.locator(".layer-list-item")).toHaveCount(2);
  expect(await page.locator("#layerList").evaluate((list) => list.getBoundingClientRect().height)).toBeGreaterThan(0);
  await expect(page.locator(".layer-list-name")).toHaveText(["Layer 2", "Layer 1"]);
  await page.locator("#layerName").fill("Foreground");
  await page.getByRole("button", { name: "Rename Layer" }).click();
  await expect(page.locator(".layer-list-name")).toHaveText(["Foreground", "Layer 1"]);
  await page.getByRole("button", { name: "Move Down" }).click();
  await expect(page.locator(".layer-list-name")).toHaveText(["Layer 1", "Foreground"]);
  await page.getByRole("button", { name: "Move Up" }).click();
  await expect(page.locator(".layer-list-name")).toHaveText(["Foreground", "Layer 1"]);
  expect(await page.evaluate(() => window.__tileBuilderDebug.getState())).toMatchObject({
    activeLayerName: "Foreground",
    layerPlacements: [
      { name: "Layer 1", count: 1 },
      { name: "Foreground", count: 0 }
    ]
  });
  await page.locator(".tile-card", { hasText: "terrain-sheet_1_2.png" }).click();
  await clickCell(page, 1, 1);
  await expect(page.locator("#placedCount")).toHaveText("2");

  await clickExport(page, "Export Active Layer PNG");
  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  let exported = await exportInfo.jsonValue();
  expect(exported.download).toBe("isometric-layer-foreground-3x3.png");
  await expect(page.locator("#projectStatus")).toHaveText(/Exported Foreground as .* from 1 tiles\./);

  await clickExport(page, "Export Full Scene PNG");
  exported = await page.evaluate(() => window.__lastTileDownload);
  expect(exported.download).toBe("isometric-map-3x3.png");
  await expect(page.locator("#projectStatus")).toHaveText(/Exported full scene as .* from 2 visible tiles\./);

  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const state = window.__tileBuilderDebug.getState();
    const pad = Math.max(32, Math.ceil(Math.max(state.tileWidth, state.tileHeight) * 0.35));
    const sampleX = pad + (state.rows - 1) * state.tileWidth / 2 + state.tileWidth / 2;
    const sampleY = pad + state.tileHeight / 2 + (1 + 1) * state.tileHeight / 2;
    return {
      width: image.width,
      height: image.height,
      sample: [...ctx.getImageData(sampleX, sampleY, 1, 1).data]
    };
  }, exported.href);

  expect(inspected.width).toBeGreaterThan(0);
  expect(inspected.height).toBeGreaterThan(0);
  expect(inspected.sample[2]).toBeGreaterThan(inspected.sample[0]);
});

test("imports 128px sprites onto a 128x64 isometric grid without splitting cells", async ({ page }) => {
  await openApp(page);
  await setProject(page, {
    cols: 3,
    rows: 3,
    tileWidth: 128,
    tileHeight: 64,
    spriteWidth: 128,
    spriteHeight: 128,
    exportCols: 2
  });

  const sheet = createTileGridPng(128, 128, [[[255, 0, 0, 255], [0, 0, 255, 255]]]);
  await page.locator("#sheetFileInput").setInputFiles({
    name: "ground-terrain.png",
    mimeType: "image/png",
    buffer: sheet
  });

  await expect(page.locator(".tile-card")).toHaveCount(2);
  await expect(page.locator("#projectStatus")).toHaveText(
    "Imported 2 tiles from ground-terrain.png using 128x128 sprite cells."
  );

  await selectControlTab(page, "5. Place");
  await page.locator(".tile-card", { hasText: "ground-terrain_1_2.png" }).click();
  await clickCell(page, 1, 1);
  await clickExport(page, "Export Full Scene PNG");

  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const state = window.__tileBuilderDebug.getState();
    const pad = Math.max(32, Math.ceil(Math.max(state.tileWidth, state.spriteHeight) * 0.35));
    const centerX = pad + (state.rows - 1) * state.tileWidth / 2 + state.tileWidth / 2;
    const centerY = pad + state.tileHeight / 2 + (1 + 1) * state.tileHeight / 2;
    return {
      grid: [state.tileWidth, state.tileHeight],
      sprite: [state.spriteWidth, state.spriteHeight],
      topSample: [...ctx.getImageData(centerX, centerY + state.tileHeight / 2 - state.spriteHeight + 4, 1, 1).data],
      bottomSample: [...ctx.getImageData(centerX, centerY + state.tileHeight / 2 - 4, 1, 1).data]
    };
  }, exported.href);

  expect(inspected.grid).toEqual([128, 64]);
  expect(inspected.sprite).toEqual([128, 128]);
  expect(inspected.topSample[2]).toBeGreaterThan(inspected.topSample[0]);
  expect(inspected.bottomSample[2]).toBeGreaterThan(inspected.bottomSample[0]);
});

test("anchors visible terrain pixels to the grid when imported sprites include bottom padding", async ({ page }) => {
  await openApp(page);
  await setProject(page, {
    cols: 3,
    rows: 3,
    tileWidth: 64,
    tileHeight: 32,
    spriteWidth: 64,
    spriteHeight: 64,
    exportCols: 1
  });

  await page.locator("#sheetFileInput").setInputFiles({
    name: "padded-ground.png",
    mimeType: "image/png",
    buffer: createPaddedTilePng(64, 64, 20, 49, [0, 0, 255, 255])
  });

  await expect(page.locator(".tile-card")).toHaveCount(1);
  await selectControlTab(page, "5. Place");
  await clickCell(page, 1, 1);
  await clickExport(page, "Export Full Scene PNG");

  const exportInfo = await page.waitForFunction(() => window.__lastTileDownload);
  const exported = await exportInfo.jsonValue();
  const inspected = await page.evaluate(async (href) => {
    const image = new Image();
    image.src = href;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const state = window.__tileBuilderDebug.getState();
    const pad = Math.max(32, Math.ceil(Math.max(state.tileWidth, state.spriteHeight) * 0.35));
    const centerX = pad + (state.rows - 1) * state.tileWidth / 2 + state.tileWidth / 2;
    const centerY = pad + state.tileHeight / 2 + (1 + 1) * state.tileHeight / 2;
    const diamondBottom = centerY + state.tileHeight / 2;
    return {
      anchored: [...ctx.getImageData(centerX, diamondBottom - 1, 1, 1).data],
      below: [...ctx.getImageData(centerX, diamondBottom + 1, 1, 1).data]
    };
  }, exported.href);

  expect(inspected.anchored[2]).toBeGreaterThan(inspected.anchored[0]);
  expect(inspected.anchored[3]).toBe(255);
  expect(inspected.below[3]).toBe(0);
});

test("batch terrain CLI crops directional tiles and reports missing terrain variants", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "terrain-set-"));
  try {
    for (const direction of ["N", "E", "S", "W"]) {
      fs.writeFileSync(path.join(tempRoot, `Ground A1_${direction}.png`), pngs.red);
      fs.writeFileSync(path.join(tempRoot, `Ground A3_${direction}.png`), pngs.blue);
    }

    childProcess.execFileSync(
      process.execPath,
      [path.resolve(__dirname, "..", "tools", "build-terrain-set.js"), "--source", tempRoot, "--set", "Ground A1"],
      { encoding: "utf8" }
    );

    const outDir = path.join(tempRoot, "Ground A1 edited");
    for (const direction of ["n", "e", "s", "w"]) {
      expect(fs.existsSync(path.join(outDir, `ground_a1_${direction}.png`))).toBe(true);
    }

    expect(readPngSize(fs.readFileSync(path.join(outDir, "ground_a1_terrain_sheet.png")))).toEqual({
      width: 4,
      height: 1
    });
    expect(fs.readFileSync(path.join(outDir, "missing_tiles_report.md"), "utf8")).toContain(
      "Missing numeric variant(s): 2"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("batch terrain CLI builds a full prefix sheet with fixed-size terrain cells", async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "terrain-prefix-"));
  try {
    for (const direction of ["N", "E", "S", "W"]) {
      fs.writeFileSync(path.join(tempRoot, `Ground A1_${direction}.png`), pngs.red);
      fs.writeFileSync(path.join(tempRoot, `Ground A3_${direction}.png`), pngs.blue);
      fs.writeFileSync(path.join(tempRoot, `Ground B1_${direction}.png`), pngs.red);
    }

    childProcess.execFileSync(
      process.execPath,
      [
        path.resolve(__dirname, "..", "tools", "build-terrain-set.js"),
        "--source",
        tempRoot,
        "--prefix",
        "Ground",
        "--tile-size",
        "128x128"
      ],
      { encoding: "utf8" }
    );

    const outDir = path.join(tempRoot, "Ground edited");
    expect(readPngSize(fs.readFileSync(path.join(outDir, "ground_a1_n.png")))).toEqual({
      width: 128,
      height: 128
    });
    expect(readPngSize(fs.readFileSync(path.join(outDir, "ground_terrain_sheet.png")))).toEqual({
      width: 1536,
      height: 256
    });
    expect(fs.readFileSync(path.join(outDir, "ground_terrain_sheet_map.csv"), "utf8")).toContain(
      "Ground_A3_W,ground_a3_w.png"
    );
    expect(fs.readFileSync(path.join(outDir, "missing_tiles_report.md"), "utf8")).toContain(
      "Ground A2: missing entire variant"
    );
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
