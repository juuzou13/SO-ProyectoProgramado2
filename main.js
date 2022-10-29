//Computer Specifications
computer = {
  cores: 1,
  instructionsPSec: 1,
  diskAccessTime: 5,
  ramSize: 400,
  diskSize: Number.MAX_SAFE_INTEGER,
  pageSize: 4,
  framesQuantity: 400 / 4,
}

// General Variables
generalProcesses = [];
pointerAccessList = [];

// Time Variables
let optimalTime = 0;
let algorithmTime = 0;


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
  process: 7,
  simulationTime: 400,
  RAMused: 200,
  VRAMused: 346,
  PagesLoaded: 83,
  PagesUnloaded: 60,
  TrashingTime: 300,
  Fragmentation: 172,
}

// Algorithm List of Marked Pages
algMarkPages = [];
algAuxMarkPages = [];

// Algorithm Interval Time
intervalTimeAlg = 0;

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

// --------------------------------------------------------------------- //

/*
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
*/

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
const white = "#FFFFFF";

let fileContents;

function preload() {
  img = loadImage('https://i.redd.it/ytbssa5z6pn61.png');
  fileContents = loadStrings("procesos.txt");
}

async function setup() {

  var seed;

  // seed = prompt("Ingrese un número entero positivo para la seed (default: 1)", "");
  // seed = parseInt(seed, 10);
  // if (!(seed != null && Number.isInteger(seed) && seed >= 0)) {
  //   seed = 1;
  // }

  seed = random(1000000);

  // acá se establece la seed para los numeros aleatorios
  randomSeed(seed);

  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < computer.framesQuantity; i++) {
    optimalRAM.push({frameNumber: i, pageID:-1, color: white});
    algorithmRAM.push({frameNumber: i, pageID:-1, color: white});
  }
  mmuOpt = generateTable("MMU - OPT", ramPagesOpt,  windowWidth * 0.15, 150);
  mmuAlg = generateTable("MMU - ALG", ramPagesAlg, windowWidth * 0.1 + 675, 150);
  
  await mainProgram(fileContents);

}

async function startExecution(algorithm){

  while(pointerAccessList.length > 0){

      selectedProcess = pointerAccessList[0];

      pN = await getPointerPages(selectedProcess, ramPagesOpt);
      pageNumbers = pN.slice()

      for(let i = 0; i < pageNumbers.length; i++){
        
        //await new Promise(r => setTimeout(r, 1));
        pageNumber = pageNumbers[i];
        print(i, pointerAccessList)
        
        if (algorithm=="LRU"){
          // await Promise.all([optimalProcess(pageNumber), lruProcess(pageNumber)]);
        } else if (algorithm=="Second Chance"){
          // await Promise.all([optimalProcess(pageNumber), secondChanceProcess(pageNumber)]);
        } else if (algorithm=="Aging"){
          // await Promise.all([optimalProcess(pageNumber), agingProcess(pageNumber)]);
        } else if (algorithm=="Random"){
          // await Promise.all([optimalProcess(pageNumber), randomProcess(pageNumber)]);
        } else {
          await optimalProcess(pageNumber);
        }
      }
      //print("Page numbers 1: " + pageNumbers);
      await new Promise(r => setTimeout(r, 1000));

      pointerAccessList.shift();

  }
}

async function mainProgram(fileContents, algorithm){

  res = await loadProcesses(fileContents);

  if(res){

      print("Procesos Algoritmo Optimo", generalProcesses);
      print("Procesos Activos de Optimo", activeProcesses);
      print("Lista de accesos Optimo", pointerAccessList);

      await startExecution(algorithm)

  }else{
      print("Error al leer el archivo");
  }
}

function draw() {
  background(255);
  imageMode(CENTER);
  image(img, 200, 600, 350, 250);
  showRAM("RAM - OPT", optimalRAM, 0);
  showRAM("RAM - ALG", algorithmRAM, 60);
  mmuOpt.html(generateHtmlTableInfo("MMU - OPT", ramPagesOpt));
  mmuAlg.html(generateHtmlTableInfo("MMU - ALG", ramPagesAlg));
  showInfoTable("MMU - OPT", optimalInfo, 300, 510);
  showInfoTable("MMU - ALG", algorithmInfo, 900, 510);
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