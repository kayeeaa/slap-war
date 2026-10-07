/* ======================================================================
   engine/pong.js  —  Ping pong in the Games tab (saved as game "ping-pong"). Your buddy holds the bat on the left; a bot buddy holds the
   bat on the right. First to PONG_POINTS_TO_WIN wins. This file only plays and draws the game: app.js saves the
   result, and the server works out the XP (save_game_result).
   Everything here is in court pixels (PONG_WIDTH × PONG_HEIGHT); CSS scales the canvas to fit the screen.
   ====================================================================== */
const PONG_POINTS_TO_WIN = 3;
const PONG_WIDTH = 640, PONG_HEIGHT = 400;
const PONG_BAT = { width: 12, height: 76, inset: 100 };   // inset: edge of the court to the bat, room for the buddy behind it
const PONG_BALL_SIZE = 12;
const PONG_BALL_START_SPEED = 300, PONG_BALL_SPEED_UP = 1.07, PONG_BALL_TOP_SPEED = 680;   // court pixels a second
const PONG_BOT_SPEED = 250;          // the bot's bat can't go faster than this, so a fast rally gets past it
const PONG_BOT_WAKES_AT = 0.4;       // the bot only chases the ball once it's this far across the court
const PONG_KEY_SPEED = 460;
const PONG_SERVE_PAUSE = 0.9;        // seconds before each serve
const PONG_MAX_ANGLE = 55 * Math.PI / 180;   // hitting with the end of the bat sends the ball off at this angle
const PONG_BUDDY = { width: 92, height: 80, gap: 4 };
const PONG_REACTION_TIME = 1.2;      // seconds a buddy cheers after scoring or looks surprised after missing
const PONG_MOODS = { cheer: { face: "grin", arms: "cheer" }, oops: { face: "surprised", arms: "down" } };

/* scene: { locationId, themeColour, look: { petType, petLook, equipped, level, itemColours }, botPetType }
   onScore(myPoints, botPoints) after every point; onMatchEnd(myPoints, botPoints) when someone reaches 3. */
function createPongGame(canvas, scene, { onScore, onMatchEnd }) {
  canvas.width = PONG_WIDTH; canvas.height = PONG_HEIGHT;
  const context = canvas.getContext("2d");
  const background = document.createElement("canvas");
  background.width = PONG_WIDTH / 4; background.height = PONG_HEIGHT / 4;   // scenes are low-res, like the stages
  let buddySprites = {}, batColour = "#4CAF50";
  let myPoints = 0, botPoints = 0, running = false, frameId = 0, lastTime = 0, clock = 0;
  let myY = PONG_HEIGHT / 2, botY = PONG_HEIGHT / 2, pointerY = null, botAim = 0;
  const keys = { up: false, down: false };
  const ball = { x: 0, y: 0, vx: 0, vy: 0 };
  let serveTimer = 0, serveDirection = 1;
  const reactions = { me: { mood: null, until: 0 }, bot: { mood: null, until: 0 } };

  function setScene(newScene) {
    scene = newScene;
    const equipped = scene.look.equipped || [];
    drawLocationScene(background, scene.locationId, scene.themeColour, equipped.filter(isHouseItem), [], scene.look.itemColours);
    batColour = getComputedStyle(canvas).getPropertyValue("--accent").trim() || batColour;
    buddySprites = {};
    draw();
  }
  /* A buddy drawn once per mood, then reused every frame. */
  function buddySprite(side, mood) {
    const key = side + ":" + (mood || "idle");
    if (!buddySprites[key]) {
      const sprite = document.createElement("canvas");
      sprite.width = PONG_BUDDY.width; sprite.height = PONG_BUDDY.height;
      const look = side === "me" ? scene.look : { petType: scene.botPetType, petLook: DEFAULT_PET_LOOK, equipped: [], level: 1, itemColours: {} };
      drawPet(sprite, look.petType, { fitTight: true, level: look.level, equipped: look.equipped || [], itemColours: look.itemColours || {},
        petLook: { ...DEFAULT_PET_LOOK, ...look.petLook, ...(PONG_MOODS[mood] || {}) } });
      buddySprites[key] = sprite;
    }
    return buddySprites[key];
  }
  const moodOf = side => reactions[side].until > clock ? reactions[side].mood : null;
  const clampBat = y => Math.max(PONG_BAT.height / 2, Math.min(PONG_HEIGHT - PONG_BAT.height / 2, y));
  const botBatX = PONG_WIDTH - PONG_BAT.inset - PONG_BAT.width;

  function serve(direction) {
    ball.x = (PONG_WIDTH - PONG_BALL_SIZE) / 2; ball.y = (PONG_HEIGHT - PONG_BALL_SIZE) / 2; ball.vx = 0; ball.vy = 0;
    serveDirection = direction; serveTimer = PONG_SERVE_PAUSE;
  }
  function launch() {
    const angle = (Math.random() * 2 - 1) * Math.PI / 6;
    ball.vx = serveDirection * PONG_BALL_START_SPEED * Math.cos(angle);
    ball.vy = PONG_BALL_START_SPEED * Math.sin(angle);
    botAim = 0;
  }
  /* Where the ball meets the bat sets its angle; every hit makes it a little faster. */
  function hit(direction, batY) {
    const speed = Math.min(PONG_BALL_TOP_SPEED, Math.hypot(ball.vx, ball.vy) * PONG_BALL_SPEED_UP);
    const offset = Math.max(-1, Math.min(1, (ball.y + PONG_BALL_SIZE / 2 - batY) / (PONG_BAT.height / 2)));
    ball.vx = direction * speed * Math.cos(offset * PONG_MAX_ANGLE);
    ball.vy = speed * Math.sin(offset * PONG_MAX_ANGLE);
    // The bot aims for a different part of its bat each rally, so it doesn't always meet the ball dead centre.
    if (direction > 0) botAim = (Math.random() * 2 - 1) * PONG_BAT.height * 0.45;
  }
  function scorePoint(side) {
    if (side === "me") myPoints++; else botPoints++;
    const other = side === "me" ? "bot" : "me";
    reactions[side] = { mood: "cheer", until: clock + PONG_REACTION_TIME };
    reactions[other] = { mood: "oops", until: clock + PONG_REACTION_TIME };
    onScore(myPoints, botPoints);
    if (myPoints >= PONG_POINTS_TO_WIN || botPoints >= PONG_POINTS_TO_WIN) {
      running = false; cancelAnimationFrame(frameId);
      serve(1); serveTimer = 0;
      draw();
      onMatchEnd(myPoints, botPoints);
      return;
    }
    serve(side === "me" ? 1 : -1);   // serve towards whoever just missed
  }

  function update(seconds) {
    clock += seconds;
    if (pointerY !== null) myY = pointerY;
    myY = clampBat(myY + ((keys.down ? 1 : 0) - (keys.up ? 1 : 0)) * PONG_KEY_SPEED * seconds);
    const ballCentre = ball.y + PONG_BALL_SIZE / 2;
    const botTarget = ball.vx > 0 && ball.x > PONG_WIDTH * PONG_BOT_WAKES_AT ? ballCentre + botAim : PONG_HEIGHT / 2;
    const botStep = Math.max(-PONG_BOT_SPEED * seconds, Math.min(PONG_BOT_SPEED * seconds, botTarget - botY));
    botY = clampBat(botY + botStep);
    if (serveTimer > 0) { serveTimer -= seconds; if (serveTimer <= 0) launch(); return; }

    const previousX = ball.x;
    ball.x += ball.vx * seconds; ball.y += ball.vy * seconds;
    if (ball.y < 0) { ball.y = 0; ball.vy = Math.abs(ball.vy); }
    if (ball.y + PONG_BALL_SIZE > PONG_HEIGHT) { ball.y = PONG_HEIGHT - PONG_BALL_SIZE; ball.vy = -Math.abs(ball.vy); }
    // A hit is the ball crossing the front of a bat this frame, so even a very fast ball can't skip through it.
    const meetsBat = batY => ball.y + PONG_BALL_SIZE >= batY - PONG_BAT.height / 2 && ball.y <= batY + PONG_BAT.height / 2;
    const myBatFront = PONG_BAT.inset + PONG_BAT.width;
    if (ball.vx < 0 && previousX >= myBatFront && ball.x <= myBatFront && meetsBat(myY)) { ball.x = myBatFront; hit(1, myY); }
    if (ball.vx > 0 && previousX + PONG_BALL_SIZE <= botBatX && ball.x + PONG_BALL_SIZE >= botBatX && meetsBat(botY)) {
      ball.x = botBatX - PONG_BALL_SIZE; hit(-1, botY);
    }
    if (ball.x + PONG_BALL_SIZE < 0) scorePoint("bot");
    else if (ball.x > PONG_WIDTH) scorePoint("me");
  }

  function outlinedRect(x, y, width, height, colour) {
    context.fillStyle = "#1D2340"; context.fillRect(Math.round(x) - 2, Math.round(y) - 2, width + 4, height + 4);
    context.fillStyle = colour; context.fillRect(Math.round(x), Math.round(y), width, height);
  }
  function draw() {
    context.imageSmoothingEnabled = false;
    context.drawImage(background, 0, 0, PONG_WIDTH, PONG_HEIGHT);
    context.fillStyle = "rgba(255,255,255,0.55)";
    for (let y = 6; y < PONG_HEIGHT; y += 24) context.fillRect(PONG_WIDTH / 2 - 2, y, 4, 12);
    // Buddies stand behind their bats and move with them. The bot is flipped to face you.
    const buddyTop = batY => Math.round(batY - PONG_BUDDY.height / 2);
    context.drawImage(buddySprite("me", moodOf("me")), PONG_BAT.inset - PONG_BUDDY.width - PONG_BUDDY.gap, buddyTop(myY));
    context.save();
    context.translate(botBatX + PONG_BAT.width + PONG_BUDDY.gap + PONG_BUDDY.width, 0); context.scale(-1, 1);
    context.drawImage(buddySprite("bot", moodOf("bot")), 0, buddyTop(botY));
    context.restore();
    outlinedRect(PONG_BAT.inset, myY - PONG_BAT.height / 2, PONG_BAT.width, PONG_BAT.height, batColour);
    outlinedRect(botBatX, botY - PONG_BAT.height / 2, PONG_BAT.width, PONG_BAT.height, "#E8574A");
    if (running && serveTimer > 0) {
      context.font = "44px Bungee, 'Arial Black', sans-serif"; context.textAlign = "center"; context.textBaseline = "middle";
      context.lineWidth = 8; context.strokeStyle = "#1D2340"; context.fillStyle = "#FFFFFF";
      const text = `${myPoints} - ${botPoints}`;
      context.strokeText(text, PONG_WIDTH / 2, PONG_HEIGHT / 3); context.fillText(text, PONG_WIDTH / 2, PONG_HEIGHT / 3);
    }
    if (running || serveTimer > 0 || ball.vx) outlinedRect(ball.x, ball.y, PONG_BALL_SIZE, PONG_BALL_SIZE, "#FFFFFF");
  }
  function frame(time) {
    if (!running) return;
    const seconds = Math.min(0.05, (time - lastTime) / 1000);   // a slow frame or a hidden tab never jumps the ball
    lastTime = time;
    update(seconds);
    if (running) { draw(); frameId = requestAnimationFrame(frame); }
  }

  // Slide the bat: finger or mouse anywhere on the court, or the up and down keys.
  const courtY = event => { const box = canvas.getBoundingClientRect(); return (event.clientY - box.top) * PONG_HEIGHT / box.height; };
  canvas.addEventListener("pointerdown", event => { pointerY = courtY(event); if (event.pointerType !== "mouse") canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener("pointermove", event => { if (event.pointerType === "mouse" || event.buttons) pointerY = courtY(event); });
  const keyFor = event => ({ ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down" })[event.key];
  document.addEventListener("keydown", event => {
    if (!running || !keyFor(event) || !canvas.offsetParent) return;
    event.preventDefault(); keys[keyFor(event)] = true; pointerY = null;
  });
  document.addEventListener("keyup", event => { if (keyFor(event)) keys[keyFor(event)] = false; });

  setScene(scene);
  return {
    start() {
      myPoints = 0; botPoints = 0; clock = 0; myY = botY = PONG_HEIGHT / 2; pointerY = null;
      reactions.me = { mood: null, until: 0 }; reactions.bot = { mood: null, until: 0 };
      serve(1);
      running = true; lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    },
    stop() { running = false; cancelAnimationFrame(frameId); serve(1); serveTimer = 0; draw(); },
    isRunning: () => running,
    setScene
  };
}
