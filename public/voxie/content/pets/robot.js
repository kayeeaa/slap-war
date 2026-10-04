export default {
  id: "robot", label: "Robot", neckRow: 8,
  face: { eyeRow: 4, leftEyeX: 4, rightEyeX: 9, mouthRow: 7, mouthX: 6 },
  arms: { row: 9, leftX: 0, rightX: 13 },
  palette: { B:"#B8C4D0", D:"#5E6A78", L:"#5CF2FF", S:"#3A4450", E:"#38D9F5", M:"#3A4450", N:"#F6D44A" },
  pixelMap: [
    "......N.......",
    "......D.......",
    "..DDDDDDDDDD..",
    "..DBBBBBBBBD..",
    "..DBEBBBBEBD..",
    "..DBEBBBBEBD..",
    "..DBBBBBBBBD..",
    "..DBBBMMBBBD..",
    "..DDDDDDDDDD..",
    ".DBBBSSSSBBBD.",
    ".DBBBSLLSBBBD.",
    "..DD......DD.."
  ]
};
