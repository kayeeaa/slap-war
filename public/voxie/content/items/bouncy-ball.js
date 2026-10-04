export default {
  id: "bouncy-ball", label: "Bouncy ball", category: "house", houseType: "extras", slot: "house-ball", floorPosition: 0.7, unlockLevel: 5, rarity: "common", colourName: "Red", colour: "#E8574A",
  drawOnFloor({ fill, disc }, x, groundY) {
    disc(x + 3, groundY - 3, 3, "#E8574A"); fill(x, groundY - 3, 7, 1, "#FFFFFF"); fill(x + 2, groundY - 5, 1, 1, "#F7A99F");
  }
};
