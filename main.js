//Computer Specifications
computer = {
  cores: 1,
  instructionsPSec: 1,
  diskAccessTime: 5,
  ramSize: 400,
  diskSize: Number.MAX_SAFE_INTEGER,
  pageSize: 4,
  framesQuantity: 400 / 4,
  // framesQuantity: 12 / 4,
}

// General Variables
generalProcesses = [];
pointerAccessList = [];

// Time Variables
let optimalTime = 0;
let algorithmTime = 0;

let duplicatePointersNumber = 20;

// ----------------------- User Algorithm -----------------------

//MMU Graphics
mmuAlg = [];

// Algorithm Pages
ramPagesAlg = [];
algDisk = [];

// Graphic RAM
algorithmRAM = [];

// Algorithm Information
algorithmInfo = {
  process: 0,
  simulationTime: 0,
  RAMused: 0,
  VRAMused: 0,
  PagesLoaded: 0,
  PagesUnloaded: 0,
  TrashingTime: 0,
  Fragmentation: 0,
}

// Algorithm List of Marked Pages
algMarkPages = [];
algAuxMarkPages = [];
algMarkIndex = -1;

// Additional pointer
pointer = 0

// Algorithm Interval Time in seconds
intervalTimeAlg = 8;

// ----------------------- End of User Algorithm ----------------------- //

// ------------------------ Optimal Algorithm ------------------------ //

//MMU Graphics
mmuOpt = [];

// Optimal Algorithm RAM 
optimalRAM = [];
optimalRAMFramesLeft = computer.framesQuantity;


// Optimal Algorithm Pages
ramPagesOpt = [];
optimalDisk = [];

// Optimal Algorithm Page Table
optimalPageTable = []

// Optimal Algorithm Information
optimalInfo = {
  process: 0,
  simulationTime: 0,
  RAMused: 0,
  VRAMused: 0,
  PagesLoaded: 0,
  PagesUnloaded: 0,
  TrashingTime: 0,
  Fragmentation: 0,
}

// Optimal Algorithm Processes

activeProcesses = [];

let fileInput;
let seed;
let algorithm;

// --------------------------------------------------------------------- //

let img;
let img2;
let backgroundImg;
const white = "#FFFFFF";

let fileContents;

function preload() {
  backgroundImg = loadImage('./img/background.jpg');
  // fileContents = loadStrings("procesos.txt");
}

async function setup() {

  createCanvas(windowWidth, windowHeight);

  //Change tab name
  document.title = "Proyecto 2 - S.O";

  //Set tab icon
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = './img/icon.png';
  document.getElementsByTagName('head')[0].appendChild(link);

  for (let i = 0; i < computer.framesQuantity; i++) {
    optimalRAM.push({ frameNumber: i, pageID: -1, color: white });
    algorithmRAM.push({ frameNumber: i, pageID: -1, color: white });
  }
  // seed = prompt("Ingrese un número entero positivo para la seed (default: 1)", "");
  // seed = parseInt(seed, 10);
  // if (!(seed != null && Number.isInteger(seed) && seed >= 0)) {
  //   seed = 1;
  // }

  separation = windowWidth * 0.05
  w = windowWidth * 0.25
  tw = w * 2 + separation
  center = windowWidth / 2 - tw / 2

  mmuOpt = generateTable("MMU - OPT", ramPagesOpt, center, 180, w, 200);
  mmuAlg = generateTable("MMU - ALG", ramPagesAlg, center + separation + w, 180, w, 200);



  setConfig();
}

function processFile(file) {

  let newData = file.data.split("\n")
  var reg = new RegExp(' ', 'g');
  newData = newData.map((line) => line.replace(reg, ""))
  
  fileContents = newData;

}

function textConfigs() {
  fill(0);
  textSize(12);
  textAlign(LEFT, TOP);
  text("1. Seleccione el archivo con la lista de accesos", 10, 10);
  text("2. Seleccione el segundo algoritmo a visualizar", 305, 10);
  text("3. Ingrese un número entero positivo para la seed (default: 1)", 600, 10);
  text("4. Inicie la simulación", 960, 10);
}

async function setConfig() {

  fileInput = createFileInput(processFile);
  fileInput.position(10, 30);

  algorithm = createSelect();
  algorithm.position(305, 30);
  algorithm.option("LRU");
  algorithm.option("Second Chance");
  algorithm.option("Aging");
  algorithm.option("Random");
  algorithm.selected("LRU");

  seed = createInput();
  seed.position(600, 30);

  button = createButton("Simular");
  button.position(960, 30);
  button.mousePressed(runMainProgram);
}

async function runMainProgram() {
  if (fileContents == undefined) {
    alert("Seleccione un archivo de texto con la lista de accesos");
  } else {
    if (seed.value() != "" && !isNaN(seed.value()) && seed.value() >= 0) {
      randomSeed(seed.value());
    } else {
      randomSeed(1);
    }
    await mainProgram(fileContents, algorithm.value());
  }
}

async function startExecution(algorithm) {

  if (algorithm == "Aging") {
    markAgingLoop();
  }
  updateLoop();

  while (pointerAccessList.length > 0) {
    await assignAddress(pointerAccessList[0])
    await new Promise(r => setTimeout(r, 1000));
    optimalTime = 0;
    algorithmTime = 0;

    selectedProcess = pointerAccessList[0];
    //345345345


    pN = await getPointerPages(selectedProcess, ramPagesOpt);
    pageNumbers = pN.slice()


    for (let i = 0; i < pageNumbers.length; i++) {

      pageNumber = pageNumbers[i];
      

      if (algorithm == "LRU") {
        await Promise.all([optimalProcess(pageNumber), lruProcess(pageNumber)]);
      } else if (algorithm == "Second Chance") {
        await Promise.all([optimalProcess(pageNumber), secondChanceProcess(pageNumber)]);
      } else if (algorithm == "Aging") {
        await Promise.all([optimalProcess(pageNumber), agingProcess(pageNumber)]);
      } else if (algorithm == "Random") {
        await Promise.all([optimalProcess(pageNumber), randomProcess(pageNumber)]);
      } else {
        await optimalProcess(pageNumber);


      }

      optimalTime += 1;
      algorithmTime += 1;
    }

    sumTimeToPagesInRam(ramPagesOpt, optimalTime);
    sumTimeToPagesInRam(ramPagesAlg, algorithmTime);

    optimalInfo.simulationTime += optimalTime;
    algorithmInfo.simulationTime += algorithmTime;

    processId = getPidOfPointer(selectedProcess);

    shiftPointerOrder(processId);

    if (!processHasPointersLeft(processId)) {
      
      removeProcess(processId);
    }

    pointerAccessList.shift();
    updateLoop();
  }
  await new Promise(r => setTimeout(r, 11000));
  window.alert("Simulación finalizada");
  location.reload();
}



async function mainProgram(fileContents, algorithm) {

  res = await loadProcesses(fileContents);

  if (res) {

    button.hide();

    await startExecution(algorithm);

  } else {
    window.alert("Error al leer el archivo");
  }


}

function draw() {
  background(255);
  image(backgroundImg, 0, 0, windowWidth, windowHeight);
  //image(img, 0, windowHeight/2, img.width/2, img.height/2);
  //image(img2, windowWidth - img2.width/6, windowHeight/2, img2.width/6, img2.height/6);
  textConfigs();

  optRamStartY = 70
  ramHeight = windowHeight * 0.05;

  showRAM("RAM - OPTIMAL ALG", optimalRAM, optRamStartY);
  algRamStartY = optRamStartY + ramHeight + windowHeight * 0.02
  showRAM(`RAM - ${algorithm.value().toUpperCase()} ALG`, algorithmRAM, algRamStartY);

  mmusYStart = algRamStartY + ramHeight + windowHeight * 0.02

  separation = windowWidth * 0.05
  mmusWidth = windowWidth * 0.25
  mmusHeight = windowWidth * 0.15
  combinedWidth = mmusWidth * 2 + separation
  center = windowWidth / 2 - combinedWidth / 2

  mmuOpt.size(mmusWidth, mmusHeight);
  mmuAlg.size(mmusWidth, mmusHeight);

  mmuOpt.position(center, mmusYStart);
  mmuAlg.position(center + separation + mmusWidth, mmusYStart);

  mmuOpt.html(generateHtmlTableInfo("MMU - OPTIMAL ALG", ramPagesOpt));
  mmuAlg.html(generateHtmlTableInfo(`RAM - ${algorithm.value().toUpperCase()} ALG`, ramPagesAlg));


  infoTableYStart = mmusYStart + mmusHeight + windowHeight * 0.1

  separation = windowWidth * 0.05
  infoTableW = windowWidth * 0.25
  combinedWidth = infoTableW * 2 + separation
  center = windowWidth / 2 - combinedWidth / 2


  showInfoTable("MMU - OPTIMAL ALG", optimalInfo, center, infoTableYStart);
  showInfoTable(`RAM - ${algorithm.value().toUpperCase()} ALG`, algorithmInfo, center + separation + infoTableW, infoTableYStart);
}

function sumTimeToPagesInRam(ram, time) {
  for (let i = 0; i < ram.length; i++) {
    if (ram[i].loaded != false) {
      ram[i].loadedTime += time;
    }
  }
}

async function updateLoop() {
  while (ramPagesOpt.length > 0) {
    await new Promise(r => setTimeout(r, 1000));
    updateTables();
  }
}

async function updateTables() {

  // Optimal Algorithm
  loadedOpt = ramPagesOpt.filter((page) => page.loaded == true);

  const uniquePidOpt = [...new Set(loadedOpt.map(item => item.processId))];
  const usageSizeOpt = loadedOpt.reduce((accumulator, object) => {
    return accumulator + object.processSize;
  }, 0);

  PagesLoadedLength = loadedOpt.length;
  pagesUnloadedLength = optimalDisk.length;

  fragmentationOpt = bToKb((loadedOpt.length * 4096) - usageSizeOpt).toFixed(1);

  optimalInfo.process = uniquePidOpt.length;
  optimalInfo.RAMused = PagesLoadedLength * computer.pageSize;
  optimalInfo.VRAMused = pagesUnloadedLength * computer.pageSize;
  optimalInfo.PagesLoaded = PagesLoadedLength;
  optimalInfo.PagesUnloaded = pagesUnloadedLength;
  optimalInfo.Fragmentation = fragmentationOpt;

  // Selected Algorithm
  loadedAlg = ramPagesAlg.filter((page) => page.loaded == true);

  const uniquePidAlg = [...new Set(loadedAlg.map(item => item.processId))];
  const usageSizeAlg = loadedAlg.reduce((accumulator, object) => {
    return accumulator + object.processSize;
  }, 0);

  PagesLoadedAlgLength = loadedAlg.length;
  pagesUnloadedAlgLength = algDisk.length;

  fragmentationAlg = bToKb((loadedAlg.length * 4096) - usageSizeAlg).toFixed(1);

  algorithmInfo.process = uniquePidAlg.length;
  algorithmInfo.RAMused = PagesLoadedAlgLength * computer.pageSize;
  algorithmInfo.VRAMused = pagesUnloadedAlgLength * computer.pageSize;
  algorithmInfo.PagesLoaded = PagesLoadedAlgLength;
  algorithmInfo.PagesUnloaded = pagesUnloadedAlgLength;
  algorithmInfo.Fragmentation = fragmentationAlg;
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