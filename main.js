RAMsize = 400;

pagesTableOptRAM = [];
pagesTableAlgRAM = [];
tableOpt = [];
tableAlg = [];

diskPagesOptRAM = [];
diskPagesAlgRAM = [];

optimalRAM = [];
algorithmRAM = [];

optimalInfo = {
  process: 5,
  simulationTime: 250,
  RAMused: 300,
  VRAMused: 600,
  PagesLoaded: 81,
  PagesUnloaded: 90,
  TrashingTime: 100,
  Fragmentation: 273,
}

algorithmInfo = {
  process: 7,
  simulationTime: 400,
  RAMused: 200,
  VRAMused: 346,
  PagesLoaded: 83,
  PagesUnloaded: 60,
  TrashingTime: 300,
  Fragmentation: 172,
}

// page = {
//   pageId: 0,
//   processId: 0,
//   loaded: false,
//   lAddr: 0,
//   mAddr: 0,
//   dAddr: 0,
//   loadedTime: 0,
//   mark: false,
//   processSize: 0,
//   color: "#000000",
// }

// ramInfo = {
//   pageId: -1,
//   lAddr: -1,
//   color: "#000000",
// }

let img;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    optimalRAM.push({pageId: i, lAddr: i, color: getRandomColor()});
    algorithmRAM.push({pageId: i, lAddr: i, color: getRandomColor()});
  }
  pagesTableOptRAM = example;
  pagesTableAlgRAM = example;
  tableOpt = generateTable("RAM - OPT", pagesTableOptRAM,  windowWidth * 0.14, windowHeight * 0.23);
  tableAlg = generateTable("RAM - ALG", pagesTableAlgRAM, windowWidth * 0.54, windowHeight * 0.23);
}

function preload() {
  img = loadImage('https://i.redd.it/ytbssa5z6pn61.png');
}

function draw() {
  background(255);
  imageMode(CENTER);
  image(img, 200, 600, 350, 250);
  showRAM("RAM - OPT", optimalRAM, 0);
  showRAM("RAM - ALG", algorithmRAM, 60);
  tableOpt.html(generateHtmlTableInfo("RAM - OPT", pagesTableOptRAM));
  tableAlg.html(generateHtmlTableInfo("RAM - ALG", pagesTableAlgRAM));
  showInfoTable("RAM - OPT", optimalInfo, windowWidth * 0.14, windowHeight * 0.65);
  showInfoTable("RAM - ALG", algorithmInfo, windowWidth * 0.54, windowHeight * 0.65);
}

function getRandomColor() {
  while (true) {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[round(random(0, 15))];
    }
    if (!color.match("(F){3}")) {
      break;
    }
  }

  return color;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tableOpt.position(windowWidth * 0.14, windowHeight * 0.23);
  tableAlg.position(windowWidth * 0.54, windowHeight * 0.23);
}

example = [
  { pageId: 0, processId: 0, loaded: false, lAddr: 0, mAddr: -1, dAddr: 0, loadedTime: 0, mark: false, processSize: 500, color: "#16697A" },
  { pageId: 1, processId: 0, loaded: true, lAddr: 1, mAddr: 0, dAddr: -1, loadedTime: 14, mark: false, processSize: 355, color: "#16697A" },
  { pageId: 2, processId: 0, loaded: false, lAddr: 2, mAddr: -1, dAddr: 1, loadedTime: 5, mark: false, processSize: 653, color: "#16697A" },
  { pageId: 3, processId: 1, loaded: true, lAddr: 3, mAddr: 1, dAddr: -1, loadedTime: 143, mark: false, processSize: 655, color: "#FFA62B" },
  { pageId: 4, processId: 1, loaded: false, lAddr: 4, mAddr: -1, dAddr: 2, loadedTime: 6, mark: false, processSize: 123, color: "#FFA62B" },
  { pageId: 5, processId: 1, loaded: true, lAddr: 5, mAddr: 2, dAddr: -1, loadedTime: 7, mark: false, processSize: 324, color: "#FFA62B" },
  { pageId: 6, processId: 2, loaded: true, lAddr: 6, mAddr: 3, dAddr: -1, loadedTime: 9, mark: false, processSize: 512, color: "#B7245C" },
  { pageId: 7, processId: 2, loaded: false, lAddr: 7, mAddr: -1, dAddr: 3, loadedTime: 23, mark: false, processSize: 1024, color: "#B7245C" },
  { pageId: 8, processId: 2, loaded: true, lAddr: 8, mAddr: 4, dAddr: -1, loadedTime: 11, mark: false, processSize: 2048, color: "#B7245C" },
  { pageId: 9, processId: 1, loaded: true, lAddr: 9, mAddr: 5, dAddr: -1, loadedTime: 54, mark: false, processSize: 783, color: "#FFA62B" },
  { pageId: 10, processId: 3, loaded: false, lAddr: 10, mAddr: -1, dAddr: 4, loadedTime: 67, mark: false, processSize: 236, color: "#002500" },
  { pageId: 11, processId: 3, loaded: false, lAddr: 11, mAddr: -1, dAddr: 5, loadedTime: 21, mark: false, processSize: 13, color: "#002500" },
  { pageId: 12, processId: 3, loaded: true, lAddr: 12, mAddr: 6, dAddr: -1, loadedTime: 43, mark: false, processSize: 1, color: "#002500" },
  { pageId: 13, processId: 4, loaded: false, lAddr: 13, mAddr: -1, dAddr: 6, loadedTime: 578, mark: false, processSize: 594, color: "#7C3238" },
  { pageId: 14, processId: 4, loaded: true, lAddr: 14, mAddr: 7, dAddr: -1, loadedTime: 3, mark: false, processSize: 543, color: "#7C3238" },
  { pageId: 15, processId: 4, loaded: false, lAddr: 15, mAddr: -1, dAddr: 7, loadedTime: 1, mark: false, processSize: 954, color: "#7C3238" },
]