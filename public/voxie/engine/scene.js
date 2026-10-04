/* ---------- drawing engine for scenes (locations, the house, floor things) ----------
   Content files never touch the canvas directly. They get a "scene" with:
     fill(x, y, w, h, colour)   disc(centreX, centreY, radius, colour)   mountain(centreX, peakY, slope, colour, snow)
     sprite(spriteData, left, bottomY)   themeShade(lightness, extraSaturation)  — a shade of the child's game colour
     width, height, groundTop   (canvas is low-res: about 1 pixel per 4 screen pixels) */
function createScenePainter(canvas, themeColour) {
  const context = canvas.getContext("2d"), width = canvas.width, height = canvas.height;
  const groundTop = Math.round(height * 0.76);
  const fill = (x, y, w, h, colour) => { context.fillStyle = colour; context.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const disc = (centreX, centreY, radius, colour) => {
    for (let dy = -radius; dy <= radius; dy++) { const half = Math.floor(Math.sqrt(radius * radius - dy * dy)); fill(centreX - half, centreY + dy, half * 2 + 1, 1, colour); }
  };
  const mountain = (centreX, peakY, slope, colour, snow) => {
    for (let y = Math.round(peakY); y < groundTop; y++) {
      const half = Math.floor((y - peakY) * slope);
      fill(centreX - half, y, half * 2 + 1, 1, snow && y < peakY + 3 ? "#FFFFFF" : colour);
    }
  };
  const themeShade = (lightness, extraSaturation = 0) => hsl(themeColour.hue, themeColour.saturation + extraSaturation, lightness);
  const sprite = (spriteData, left, bottomY) => paintSprite(fill, spriteData, left, bottomY, 1);
  return { context, width, height, groundTop, fill, disc, mountain, themeShade, sprite };
}
/* Paints a pixel grid. bottomY is where the bottom of the grid sits. */
function paintSprite(fill, spriteData, left, bottomY, pixelSize) {
  const rows = spriteData.pixels || [], top = bottomY - rows.length * pixelSize;
  rows.forEach((rowText, row) => [...rowText].forEach((letter, column) => {
    const colour = (spriteData.colours || {})[letter];
    if (letter !== "." && colour) fill(left + column * pixelSize, top + row * pixelSize, pixelSize, pixelSize, colour);
  }));
}
/* Pets and house extras stand on the floor: their drawOnFloor, or their sprite. colourId recolours them. */
function drawItemOnFloor(scene, item, x, groundY, colourId = null) {
  if (!item) return;
  if (colourId && colourId !== "original") {
    const fill = (left, top, width, height, colour) => scene.fill(left, top, width, height, recolourHex(colour, colourId));
    scene = { ...scene, fill, disc: (centreX, centreY, radius, colour) => scene.disc(centreX, centreY, radius, recolourHex(colour, colourId)),
      sprite: (spriteData, left, bottomY) => paintSprite(fill, spriteData, left, bottomY, 1) };
  }
  if (item.drawOnFloor) item.drawOnFloor(scene, x, groundY);
  else if (item.sprite) scene.sprite(item.sprite, x, groundY);
}
/* The house starts bare: brick wall and concrete floor. House items paint over it, layer by layer. */
function drawBareBrickWall({ fill, width, groundTop }) {
  fill(0, 0, width, groundTop, "#B5583C");
  for (let y = 0; y < groundTop; y += 3) {
    fill(0, y + 2, width, 1, "#D9C3A6");
    for (let x = (y / 3) % 2 ? 0 : 3; x < width; x += 6) fill(x, y, 1, 2, "#D9C3A6");
  }
  for (let x = 4; x < width; x += 11) fill(x, (x * 7) % Math.max(3, groundTop - 3), 2, 1, "#9C4A31");
}
function drawBareConcreteFloor({ fill, width, height, groundTop }) {
  fill(0, groundTop - 1, width, 1, "#7E7E7A");
  fill(0, groundTop, width, height - groundTop, "#A2A29D");
  for (let x = 1; x < width; x += 5) fill(x, groundTop + 2 + (x % 7), 1, 1, "#8E8E89");
  fill(width * 0.2, groundTop + 4, 5, 1, "#8A8A85"); fill(width * 0.2 + 5, groundTop + 5, 3, 1, "#8A8A85");
  fill(width * 0.75, groundTop + 7, 4, 1, "#8A8A85");
}
function drawHouseRoom(scene, houseItems) {
  const inLayer = layer => houseItems.filter(item => item.drawInRoom && item.roomLayer === layer);
  ROOM_LAYERS.forEach(layer => {
    const items = inLayer(layer);
    if (layer === "wall" && !items.length) drawBareBrickWall(scene);
    if (layer === "floor" && !items.length) drawBareConcreteFloor(scene);
    items.forEach(item => item.drawInRoom(scene));
  });
  houseItems.filter(item => !item.drawInRoom)
    .forEach(item => drawItemOnFloor(scene, item, Math.round(scene.width * (item.floorPosition ?? 0.5)), scene.groundTop + 3));
}
/* A location without its own drawScene gets a simple sky and ground (its own colours, or the game colour). */
function drawSimpleScene({ fill, width, height, groundTop, themeShade }, location) {
  fill(0, 0, width, height, location.skyColour || themeShade(84, 6));
  fill(0, groundTop, width, height - groundTop, location.groundColour || themeShade(68));
  fill(0, groundTop, width, 1, location.groundLineColour || themeShade(58));
}
function drawLocationScene(canvas, locationId, themeColour, houseItemIds = [], companionIds = [], itemColours = myItemColours) {
  const scene = createScenePainter(canvas, themeColour);
  const location = LOCATIONS.find(candidate => candidate.id === locationId) || {};
  if (location.showsHouse) drawHouseRoom(scene, houseItemIds.map(getInventoryItem).filter(Boolean));
  else if (location.drawScene) location.drawScene(scene);
  else drawSimpleScene(scene, location);
  companionIds.forEach(companionId => drawItemOnFloor(scene, getInventoryItem(companionId), Math.round(scene.width * 0.16), scene.groundTop + 6, itemColours[companionId]));
}
function drawCompanionThumbnail(canvas, companionId, themeColour, colourId = myItemColours[companionId]) {
  const scene = createScenePainter(canvas, themeColour);
  scene.context.clearRect(0, 0, canvas.width, canvas.height);
  scene.fill(0, canvas.height - 2, canvas.width, 2, scene.themeShade(80));
  drawItemOnFloor(scene, getInventoryItem(companionId), Math.round(canvas.width / 2 - 4), canvas.height - 1, colourId);
}
function drawDecorationThumbnail(canvas, decorationId, themeColour) {
  const scene = createScenePainter(canvas, themeColour);
  scene.context.clearRect(0, 0, canvas.width, canvas.height);
  scene.fill(0, canvas.height - 6, canvas.width, 6, scene.themeShade(80));
  drawItemOnFloor(scene, getInventoryItem(decorationId), Math.round(canvas.width / 2 - 3.5), canvas.height - 4);
}
