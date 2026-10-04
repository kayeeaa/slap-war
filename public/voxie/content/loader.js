/* ======================================================================
   content/loader.js  —  registers every content file, then loads the game.
   The prototype planned one import.meta.glob line per folder, which needs a bundler (Vite).
   This app has no bundler, so server.js lists each folder at /voxie/content-manifest.json and
   every file in it is imported here. Adding content is still ONE new file: no other code changes.
   Each file is checked by addItem / addPetType / addLocation / addMission (content/registry.js);
   a file that won't load or doesn't pass is skipped with a clear console message.

   content/locations/  —  where the pet can hang out. Locked ones show a padlock and no preview.
     A location needs: id, label, unlockLevel. Then EITHER
     skyColour / groundColour (simplest), OR drawScene(scene) for a detailed picture,
     OR showsHouse: true (the room you decorate in the House tab).
   content/pets/  —  one file per buddy type. Add a new file to add a new pet to collect.
     pixelMap: exactly 14 columns × 12 rows.
     B body  D dark  L light belly  S spots  N nose  . empty
     (E eyes and M mouth in the maps are painted over by the chosen face.)
     face: where eyes and mouth go.  arms: the row and the columns just
     outside the body where arms are drawn.  neckRow: scarves and bow ties.
   content/items/  —  one file per item (Inventory and House). See the TEMPLATE in content/registry.js.
     drawOnPet(pet) helpers, all in pet blocks (the pet is 14 blocks wide, 12 tall):
       pet.block(column, row, colour, width = 1, height = 1)
       pet.topRow (top of the head)   pet.neckRow   pet.neck.first / .last / .centre
       pet.rowEdges(row) → { first, last }   pet.arms.row / .leftX / .rightX
       pet.eyes.top / .leftX / .rightX       held things go at column 13–16 (pet.handColumn = 14)
     Pets (little pals): drawOnFloor(scene, x, groundY): x is the left edge, groundY the floor line, in scene pixels.
     House items need houseType (which House section) and their own slot.
       Things that change the room itself use drawInRoom(scene) and a roomLayer: wall | on-wall | floor | on-floor.
       Everything else stands on the floor (drawOnFloor or a sprite) at floorPosition: 0 = left, 1 = right.
     Shop: give an item xpPrice instead of unlockLevel and it appears in the Shop.
     Chance-only: chanceOnly: true, plus a rarity. chanceWithinRarity makes one extra hard to get.
   content/missions/  —  see engine/missions.js for the shapes.
   ====================================================================== */

/* Buddies are listed in the order they're registered. Any new pet not in this list goes after these, by file name. */
const PET_TYPE_ORDER = ["axolotl", "seal", "capybara", "fox", "frog", "panda", "penguin", "cat", "pug", "dino", "dragon", "shark", "owl", "slime", "robot"];
/* Everything that's worked out from the content, in the order it needs to run. */
const SCRIPTS_AFTER_CONTENT = ["/voxie/engine/progression.js", "/voxie/engine/pet.js", "/voxie/engine/missions.js", "/voxie/data/dataLayer.js", "/voxie/app.js"];

function petTypeRank(fileName) {
  const index = PET_TYPE_ORDER.indexOf(fileName.replace(/\.js$/, ""));
  return index === -1 ? PET_TYPE_ORDER.length : index;
}
async function registerFolder(folder, fileNames, register) {
  const files = await Promise.allSettled(fileNames.map(fileName => import(`/voxie/content/${folder}/${fileName}`)));
  files.forEach((file, index) => {
    const path = `content/${folder}/${fileNames[index]}`;
    if (file.status === "rejected") return console.error(`Voxie: ${path} couldn't be loaded and was skipped:`, file.reason);
    if (!file.value.default || typeof file.value.default !== "object") return console.error(`Voxie: ${path} was skipped: it needs export default { ... }`);
    register(file.value.default);
  });
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Voxie: couldn't load ${src}`));
    document.body.append(script);
  });
}

const manifest = await (await fetch("/voxie/content-manifest.json")).json();
await registerFolder("locations", manifest.locations, addLocation);
await registerFolder("pets", [...manifest.pets].sort((first, second) => petTypeRank(first) - petTypeRank(second) || first.localeCompare(second)), addPetType);
await registerFolder("items", manifest.items, addItem);
await registerFolder("missions", manifest.missions, addMission);
for (const src of SCRIPTS_AFTER_CONTENT) await loadScript(src);
