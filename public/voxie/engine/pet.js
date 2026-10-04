/* ======================================================================
   engine/pet.js  —  drawing the pet (with its items), retired angel buddies, and the stage it stands on.
   ====================================================================== */

/* fitTight: fill a small thumbnail. Otherwise (stages) every look keeps the same scale,
   so chunky, tall and bigger-buddy pets really do look bigger. */
/* itemColours: { itemId: colourId } for recoloured items (defaults to the signed-in child's). */
function drawPet(canvas, petType, { level = 1, equipped = [], petLook = DEFAULT_PET_LOOK, fitTight = false, itemColours = myItemColours } = {}) {
  const pet = PET_TYPES[petType] || PET_TYPES.axolotl;
  const look = { ...DEFAULT_PET_LOOK, ...petLook };
  const bodyColour = findOption(BODY_COLOURS, look.bodyColour);
  const palette = { ...pet.palette, ...(bodyColour.palette || {}) };
  const widthFactor = findOption(BODY_WIDTHS, look.width).factor, heightFactor = findOption(BODY_HEIGHTS, look.height).factor;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Something held in the hand sticks out to the right, so leave room and nudge the pet left.
  const holdsSomething = equipped.some(itemId => (getInventoryItem(itemId) || {}).slot === "hand");
  let pixelSize;
  if (fitTight) {
    pixelSize = Math.min(canvas.width / ((holdsSomething ? 17.5 : 16) * widthFactor), canvas.height / (14.5 * heightFactor));
  } else {
    const basePixel = Math.min(canvas.width / 18, canvas.height / (15.5 * 1.15));
    pixelSize = Math.min(basePixel, canvas.width / (18 * widthFactor), canvas.height / (15.5 * heightFactor));
    if (level < BIGGER_BUDDY_LEVEL) pixelSize *= 0.82;
  }
  const pixelWidth = pixelSize * widthFactor, pixelHeight = pixelSize * heightFactor;
  const originX = (canvas.width - 14 * pixelWidth) / 2 - (holdsSomething ? pixelWidth * 1.2 : 0);
  const originY = canvas.height - 12 * pixelHeight;
  const fillBlock = (column, row, colour, width = 1, height = 1) => {
    const left = Math.round(originX + column * pixelWidth), top = Math.round(originY + row * pixelHeight);
    const right = Math.round(originX + (column + width) * pixelWidth), bottom = Math.round(originY + (row + height) * pixelHeight);
    context.fillStyle = colour;
    context.fillRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
  };

  const rowEdges = row => { const text = pet.pixelMap[row]; return { first: text.search(/[^.]/), last: text.length - 1 - [...text].reverse().join("").search(/[^.]/) }; };
  // Items worn or held (not house items or little pals). Each one draws itself: see content/items/.
  const wornItems = equipped.map(getInventoryItem).filter(item => item && item.category !== "house" && item.category !== "pets");
  const petPainter = { block: fillBlock, rowEdges, neckRow: pet.neckRow, arms: pet.arms, face: pet.face, handColumn: 14 };
  // Each item draws through its own painter, so a recoloured item's colours are shifted as it draws.
  const painterFor = item => itemColours[item.id] && itemColours[item.id] !== "original"
    ? { ...petPainter, block: (column, row, colour, width, height) => fillBlock(column, row, recolourHex(colour, itemColours[item.id]), width, height) }
    : petPainter;
  wornItems.forEach(item => { if (item.drawBehindPet) item.drawBehindPet(painterFor(item)); });

  // body (eyes and mouth in the map are painted as body; the face is drawn on top)
  let topRow = 12;
  pet.pixelMap.forEach((rowText, row) => [...rowText].forEach((cell, column) => {
    if (cell === ".") return;
    fillBlock(column, row, palette[cell === "E" || cell === "M" ? "B" : cell]);
    if (cell === "B") topRow = Math.min(topRow, row);
  }));

  // arms
  const arms = pet.arms, armRow = arms.row, armLeft = arms.leftX, armRight = arms.rightX;
  const arm = (column, row, width = 1, height = 1) => fillBlock(column, row, palette.D, width, height);
  if (look.arms === "down") { arm(armLeft, armRow, 1, 2); arm(armRight, armRow, 1, 2); }
  if (look.arms === "wave") { arm(armLeft, armRow, 1, 2); arm(armRight, armRow - 1); arm(armRight + 1, armRow - 2); arm(armRight + 1, armRow - 3); }
  if (look.arms === "cheer") { arm(armLeft, armRow - 1); arm(armLeft - 1, armRow - 2); arm(armLeft - 1, armRow - 3); arm(armRight, armRow - 1); arm(armRight + 1, armRow - 2); arm(armRight + 1, armRow - 3); }
  if (look.arms === "wide") { arm(armLeft - 1, armRow, 2, 1); arm(armRight, armRow, 2, 1); }

  // face
  const face = pet.face, eyeColour = palette.E, mouthColour = palette.M;
  const openEye = column => fillBlock(column, face.eyeRow, eyeColour, 1, 2);
  const closedEye = column => fillBlock(column - 0.5, face.eyeRow + 1, eyeColour, 2, 0.5);
  const mouthX = face.mouthX, mouthRow = face.mouthRow;
  if (look.face === "happy") { openEye(face.leftEyeX); openEye(face.rightEyeX); fillBlock(mouthX, mouthRow, mouthColour, 2, 1); }
  if (look.face === "grin") {
    openEye(face.leftEyeX); openEye(face.rightEyeX);
    fillBlock(mouthX - 1, mouthRow, mouthColour); fillBlock(mouthX + 2, mouthRow, mouthColour); fillBlock(mouthX, mouthRow + 0.5, mouthColour, 2, 1);
  }
  if (look.face === "surprised") {
    openEye(face.leftEyeX); openEye(face.rightEyeX);
    fillBlock(face.leftEyeX + 0.5, face.eyeRow, "#FFFFFF", 0.5, 0.5); fillBlock(face.rightEyeX + 0.5, face.eyeRow, "#FFFFFF", 0.5, 0.5);
    fillBlock(mouthX + 0.25, mouthRow, eyeColour, 1.5, 1.5);
  }
  if (look.face === "sleepy") { closedEye(face.leftEyeX); closedEye(face.rightEyeX); fillBlock(mouthX + 0.5, mouthRow, mouthColour, 1, 0.6); }
  if (look.face === "cheeky") {
    closedEye(face.leftEyeX); openEye(face.rightEyeX);
    fillBlock(mouthX, mouthRow, mouthColour, 2, 0.6); fillBlock(mouthX + 1, mouthRow + 0.6, "#F28CA0", 1, 0.9);
  }
  if (look.face === "determined") {
    openEye(face.leftEyeX); openEye(face.rightEyeX);
    fillBlock(face.leftEyeX - 1, face.eyeRow - 0.8, eyeColour, 2, 0.5); fillBlock(face.rightEyeX, face.eyeRow - 0.8, eyeColour, 2, 0.5);
    fillBlock(face.leftEyeX + 0.5, face.eyeRow - 0.4, eyeColour, 0.5, 0.4); fillBlock(face.rightEyeX, face.eyeRow - 0.4, eyeColour, 0.5, 0.4);
    fillBlock(mouthX - 0.5, mouthRow, mouthColour, 3, 0.5);
  }
  // Body is drawn, so the helpers that depend on it can be filled in.
  const neckText = pet.pixelMap[pet.neckRow];
  const neckFirst = neckText.search(/[^.]/), neckLast = neckText.length - 1 - [...neckText].reverse().join("").search(/[^.]/);
  petPainter.topRow = topRow;
  petPainter.neck = { first: neckFirst, last: neckLast, centre: (neckFirst + neckLast + 1) / 2 };
  petPainter.eyes = { top: face.eyeRow, leftX: face.leftEyeX, rightX: face.rightEyeX };
  [...wornItems].sort((first, second) => slotDrawOrder(first.slot) - slotDrawOrder(second.slot)).forEach(item => {
    const painter = painterFor(item);
    if (item.drawOnPet) item.drawOnPet(painter);
    else if (item.sprite) paintPetSprite(painter, item);
  });
}
/* Front-to-back order for things on the pet: later slots are drawn on top. */
const PET_SLOT_DRAW_ORDER = ["neck", "back", "float", "chest", "hand", "head"];
function slotDrawOrder(slot) { const index = PET_SLOT_DRAW_ORDER.indexOf(slot); return index === -1 ? PET_SLOT_DRAW_ORDER.length : index; }
/* One sprite pixel = half a pet block. Where the grid goes depends on the item's slot. */
const PET_SPRITE_PIXEL = 0.5;
function paintPetSprite(pet, item) {
  const rows = item.sprite.pixels || [], spriteWidth = Math.max(0, ...rows.map(row => row.length)) * PET_SPRITE_PIXEL, spriteHeight = rows.length * PET_SPRITE_PIXEL;
  const place = {
    head:  { left: 7 - spriteWidth / 2,                                   bottom: pet.topRow },
    neck:  { left: pet.neck.centre - spriteWidth / 2,                     bottom: pet.neckRow - 0.3 + spriteHeight },
    chest: { left: pet.neck.centre + 1,                                   bottom: pet.neckRow + 0.5 + spriteHeight },
    back:  { left: pet.rowEdges(pet.arms.row - 1).first - spriteWidth + 0.2, bottom: pet.arms.row - 2 + spriteHeight },
    float: { left: pet.arms.leftX - spriteWidth / 2,                      bottom: pet.topRow - 1.5 },
    hand:  { left: 13,                                                    bottom: 12 }
  }[item.sprite.at || item.slot] || { left: 7 - spriteWidth / 2, bottom: 12 };
  paintSprite((x, y, w, h, colour) => pet.block(x, y, colour, w, h), item.sprite, place.left, place.bottom, PET_SPRITE_PIXEL);
}

/* ---------- Retired buddies: angels with wings and a halo ----------
   Drawn small (1 scene pixel per pet block) floating in the scene, out of the way of the pet and the buttons. */
function drawAngelBuddy(scene, buddy, left, top) {
  const pet = PET_TYPES[buddy.petType] || PET_TYPES[PET_ORDER[0]];
  const palette = { ...pet.palette, ...(findOption(BODY_COLOURS, (buddy.petLook || {}).bodyColour).palette || {}) };
  const { fill } = scene;
  const firstFilled = text => text.search(/[^.]/), lastFilled = text => text.length - 1 - [...text].reverse().join("").search(/[^.]/);
  const topRow = pet.pixelMap.findIndex(row => /[^.]/.test(row));
  const wingRow = Math.min(PET_MAP_ROWS - 4, topRow + 4), wingText = pet.pixelMap[wingRow];
  const wingLeft = left + firstFilled(wingText), wingRight = left + lastFilled(wingText) + 1;
  [["#FFFFFF", 0], ["#FFFFFF", 1], ["#DCE6F2", 2], ["#FFFFFF", 3]].forEach(([colour, row]) => {
    const width = row === 0 || row === 3 ? 2 : 4, inset = row === 3 ? 1 : 0;
    fill(wingLeft - width - inset, top + wingRow + row, width, 1, colour);
    fill(wingRight + inset, top + wingRow + row, width, 1, colour);
  });
  pet.pixelMap.forEach((rowText, row) => [...rowText].forEach((cell, column) => { if (cell !== ".") fill(left + column, top + row, 1, 1, palette[cell]); }));
  const haloY = top + topRow - 3;
  fill(left + 5, haloY, 4, 1, "#F6D44A"); fill(left + 4, haloY + 1, 1, 1, "#E9B92F"); fill(left + 9, haloY + 1, 1, 1, "#E9B92F"); fill(left + 5, haloY + 2, 4, 1, "#F6D44A");
}
/* Angels drift slowly around the back of the scene (above the floor), each on its own path.
   With reduced motion they stay still, spread out. Redrawn about 8 times a second for a chunky pixel feel. */
const ANGEL_FRAME_MS = 125;
const ANGEL_WIDTH = PET_MAP_COLUMNS + 8, ANGEL_HEIGHT = PET_MAP_ROWS + 3;
function angelPosition(index, count, width, groundTop, time) {
  const phase = index * 2.4 + 0.7, xSpeed = 0.00011 + index * 0.00003, ySpeed = 0.00023 + index * 0.00005;
  const xRange = Math.max(0, width - ANGEL_WIDTH - 4), yRange = Math.max(0, groundTop - ANGEL_HEIGHT - 8);
  const xWave = time === null ? (count === 1 ? 0.85 : index / (count - 1)) : 0.5 + 0.5 * Math.sin(time * xSpeed + phase);
  const yWave = time === null ? 0.3 : 0.5 + 0.5 * Math.sin(time * ySpeed + phase * 1.3);
  return { left: Math.round(6 + xRange * xWave), top: Math.round(4 + yRange * yWave) };
}
function drawAngelLayer(canvas, time) {
  const buddies = canvas.angelBuddies || [];
  const scene = createScenePainter(canvas, canvas.angelTheme || THEME_COLOURS[0]);
  scene.context.clearRect(0, 0, canvas.width, canvas.height);
  buddies.forEach((buddy, index) => {
    const spot = angelPosition(index, buddies.length, scene.width, scene.groundTop, time);
    drawAngelBuddy(scene, buddy, spot.left, spot.top);
  });
}
function setUpAngelLayer(stageElement, backgroundCanvas, retiredBuddies, themeColour) {
  let layer = stageElement.querySelector(".stage-angels");
  if (!layer) {
    layer = document.createElement("canvas");
    layer.className = "stage-angels";
    layer.setAttribute("aria-hidden", "true");
    backgroundCanvas.after(layer);
  }
  layer.width = backgroundCanvas.width; layer.height = backgroundCanvas.height;
  layer.angelBuddies = retiredBuddies || [];
  layer.angelTheme = themeColour;
  drawAngelLayer(layer, angelsShouldMove() ? performance.now() : null);
  startAngelAnimation();
}
const angelsShouldMove = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let angelAnimationRunning = false, lastAngelFrame = 0;
function startAngelAnimation() {
  if (angelAnimationRunning || !angelsShouldMove()) return;
  angelAnimationRunning = true;
  const tick = time => {
    // Only stages on screen with angels are redrawn; the loop stops when there are none.
    const layers = [...document.querySelectorAll(".stage-angels")].filter(layer => layer.offsetParent && (layer.angelBuddies || []).length);
    if (!layers.length) { angelAnimationRunning = false; return; }
    if (time - lastAngelFrame >= ANGEL_FRAME_MS) { lastAngelFrame = time; layers.forEach(layer => drawAngelLayer(layer, time)); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function drawAngelThumbnail(canvas, buddy, themeColour) {
  const scene = createScenePainter(canvas, themeColour);
  scene.context.clearRect(0, 0, canvas.width, canvas.height);
  drawAngelBuddy(scene, buddy, Math.round((canvas.width - PET_MAP_COLUMNS) / 2), canvas.height - PET_MAP_ROWS - 1);
}

/* A "stage" is the box with a background scene and the pet standing in it. */
function renderStage(stageElement, look) {
  stageElement.lastLook = look;
  const backgroundCanvas = stageElement.querySelector(".stage-bg");
  backgroundCanvas.width = Math.max(40, Math.round((stageElement.clientWidth || 400) / 4));
  backgroundCanvas.height = Math.max(30, Math.round((stageElement.clientHeight || 250) / 4));
  const itemColours = look.itemColours || myItemColours;
  drawLocationScene(backgroundCanvas, look.location, getThemeColour(look.themeColour), (look.equipped || []).filter(isHouseItem), (look.equipped || []).filter(isCompanionPet), itemColours);
  setUpAngelLayer(stageElement, backgroundCanvas, look.retiredBuddies, getThemeColour(look.themeColour));
  drawPet(stageElement.querySelector(".stage-pet"), look.petType, { level: look.level, equipped: look.equipped, petLook: look.petLook, itemColours });
  const nameplate = stageElement.querySelector(".nameplate");
  if (nameplate) nameplate.innerHTML = `${look.petName ? `<span>${escapeHtml(look.petName)}</span>` : ""}<span class="level-chip" aria-label="Level ${look.level}">LV ${look.level}</span>`;
}
window.addEventListener("resize", () => { if (!element("screenLogin").hidden) drawHomepageScene(); });
window.addEventListener("resize", () => document.querySelectorAll(".stage").forEach(stage => {
  if (stage.lastLook && stage.offsetParent) renderStage(stage, stage.lastLook);
}));
