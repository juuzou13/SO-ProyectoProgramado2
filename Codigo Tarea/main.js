var memorySize = 4;
var buddyPairId = 0;
var pCount = 0;
var spaceColor = "#FFFFFF";
var firstFitMemory = [];
var bestFitMemory = [];
var worstFitMemory = [];
var buddySystemMemory = [];

var pidsFirstFit = [];
var pidsBestFit = [];
var pidsWorstFit = [];
var pidsBuddySystem = [];

let algorithmInfo = [{ name: "First Fit", memDisp: 0, segDisp: 1, procRechazados: 0 },
{ name: "Best Fit", memDisp: 0, segDisp: 1, procRechazados: 0 },
{ name: "Worst Fit", memDisp: 0, segDisp: 1, procRechazados: 0 },
{ name: "Buddy System", fragInt: 0, memDisp: 0, segDisp: 1, procRechazados: 0 }];

let memories = [firstFitMemory, bestFitMemory, worstFitMemory, buddySystemMemory];

let processOriginalSize = [];

var originalWidth;
var originalHeight;

var prevWidth;
var prevHeight;


async function setup() {

  var seed;

  seed = prompt("Ingrese un número entero positivo para la seed (default: 1)", "");
  seed = parseInt(seed, 10);
  if (!(seed != null && Number.isInteger(seed) && seed >= 0)) {
    seed = 1;
  }

  // acá se establece la seed para los numeros aleatorios
  randomSeed(seed);

  createCanvas(windowWidth, windowHeight);
  memorySize = memorySize * 1024 * 1024;

  firstFitMemory = [{ pid: -1, subPid: -1, color: spaceColor, state: "free", space: memorySize }];
  bestFitMemory = [{ pid: -1, subPid: -1, color: spaceColor, state: "free", space: memorySize }];
  worstFitMemory = [{ pid: -1, subPid: -1, color: spaceColor, state: "free", space: memorySize }];
  buddySystemMemory = [{ pid: -1, subPid: -1, fragInt: 0, color: spaceColor, state: "free", space: memorySize, pairId: [] }];

  originalWidth = windowWidth;
  originalHeight = windowHeight;

  updateMemoryState();

  await mainProgram();
}

function draw() {
  background(0);
  image(img, 0, 0, windowWidth, windowHeight);
  drawRams(4, memorySize, 0.01);
  updateMemoryState();
}

async function mainProgram() {
  while (pCount < 100) {
    let processSize = round(random(40, 200));
    let time = round(random(500, 2000));
    let color = getRandomColor();
    print("Agregando proceso " + pCount + " de " + processSize + " MB" + " con tiempo de " + time + " ms");
    addProcess(pCount, mbToKb(processSize), color);
    pCount++;
    await sleep(time);
  }
}

async function addProcess(pid, processSize, color) {
  //Añade todos los procesos al mismo tiempo
  deathTime = round(random(300000, 30000));
  addProcessFirstFit(pid, processSize, color);
  addProcessBestFit(pid, processSize, color);
  addProcessWorstFit(pid, processSize, color);
  addProcessBuddySystem(pid, processSize, color);
  pidsFirstFit = [...pidsFirstFit, pid];
  pidsBestFit = [...pidsBestFit, pid];
  pidsWorstFit = [...pidsWorstFit, pid];
  pidsBuddySystem = [...pidsBuddySystem, pid];
  updateMemoryState();
  newMemoryLoop(pid, color);
  print("Eliminando proceso " + pid + " en " + deathTime + " ms");
  await sleep(deathTime);
  deleteProcess(pid);
  print("Proceso " + pid + " eliminado");
  updateMemoryState();
}

async function newMemoryLoop(pid, color) {
  subPids = [];
  countSubPids = 1;
  while (pidsFirstFit.includes(pid) || pidsBestFit.includes(pid) || pidsWorstFit.includes(pid) || pidsBuddySystem.includes(pid)) {
    time = round(random(2000, 6000));
    processSize = round(random(40, 150));
    print("Espera hasta que el proceso " + pid + " pida/libere memoria " + time + " ms");
    await sleep(time);
    if (pidsFirstFit.includes(pid) || pidsBestFit.includes(pid) || pidsWorstFit.includes(pid) || pidsBuddySystem.includes(pid)) {
      option = round(random());
      if (option == 0 || subPids.length == 0) {
        print("El proceso " + pid + " pide memoria de " + processSize + " MB");
        if (pidsFirstFit.includes(pid)) {
          addProcessFirstFit(pid, mbToKb(processSize), color, countSubPids);
        }
        if (pidsBestFit.includes(pid)) {
          addProcessBestFit(pid, mbToKb(processSize), color, countSubPids);
        }
        if (pidsWorstFit.includes(pid)) {
          addProcessWorstFit(pid, mbToKb(processSize), color, countSubPids);
        }
        if (pidsBuddySystem.includes(pid)) {
          addProcessBuddySystem(pid, mbToKb(processSize), color, countSubPids);
        }
        subPids = [...subPids, countSubPids];
        countSubPids++;
      } else {
        subPid = subPids[round(random(0, subPids.length - 1))];
        print("El proceso " + pid + " libera " + processSize + " MBs de memoria del subproceso " + subPid);
        if (pidsFirstFit.includes(pid)) {
          deleteProcessMemory(pid, firstFitMemory, subPid);
        }
        if (pidsBestFit.includes(pid)) {
          deleteProcessMemory(pid, bestFitMemory, subPid);
        }
        if (pidsWorstFit.includes(pid)) {
          deleteProcessMemory(pid, worstFitMemory, subPid);
        }
        if (pidsBuddySystem.includes(pid)) {
          deleteProcessBS(pid, subPid);
        }
        subPids = subPids.filter(p => p != subPid);
      }
      updateMemoryState();
    }
  }
}

function deleteProcess(pid) {
  deleteProcessMemory(pid, firstFitMemory);
  deleteProcessMemory(pid, bestFitMemory);
  deleteProcessMemory(pid, worstFitMemory);
  deleteProcessBS(pid);

}

function printMemory() {
  print("First Fit " + JSON.stringify(firstFitMemory));
  print("Best Fit " + JSON.stringify(bestFitMemory));
  print("Worst Fit " + JSON.stringify(worstFitMemory));
  print("Buddy System " + JSON.stringify(buddySystemMemory));
}

async function addP(size) {
  addProcess(size);
  print("Agregando proceso de " + size + " MB");
  printMemory();
  await new Promise(r => setTimeout(r, 0000))
}

async function deleteP(pid) {
  print("Eliminando proceso " + pid);
  deleteProcess(pid);
  printMemory();
  await new Promise(r => setTimeout(r, 500))
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function mbToKb(mb) {
  return mb * 1024;
}

function kbToMb(kb) {
  return kb / 1024;
}

function mbToGb(mb) {
  return mb / 1024;
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