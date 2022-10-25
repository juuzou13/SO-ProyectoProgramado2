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

mmuOpt = [];
mmuAlg = [];

pagesTableAlgRAM = [];
diskPagesAlgRAM = [];

algorithmRAM = [];
algorithmRAMFramesLeft = computer.framesQuantity;

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

ramPages=[];

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


pageTable = [];

processes = [];
activeProcesses = [];


// ------------------------ Optimal Algorithm ------------------------ //

// Optimal Algorithm RAM 
optimalRAM = [];
optimalRAMFramesLeft = computer.framesQuantity;


// Optimal Algorithm Pages

ramPagesOpt = [];
diskPagesOpt = [];

pagesTableOptRAM = [];



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
processesOptimal = [];
activeProcessesOptimal = [];

// Access List
optimalAccessList = [];

function pageInMemory(pageId){
  memory = optimalRAM
  for (let i = 0; i < memory.length; i++) {
      if(memory[i].pageId == pageId){
          return true;
      }
  }
  return false
}

function getFirstFreeFrameOptimal() {
  for (let i = 0; i < optimalRAM.length; i++) {
    if (optimalRAM[i].pageId == -1) {
      return i;
    }
  }
  return -1;
}

function processPageExists(pid) {
  allPages = ramPagesOpt.concat(diskPagesOpt);

  for (let i = 0; i < allPages.length; i++) {
    if (allPages[i].processId == pid) {
      return true;
    }
  }

  return false;
}

function pageExists(pageId) {
  allPages = ramPagesOpt.concat(diskPagesOpt);
  
  for (let i = 0; i < allPages.length; i++) {
    if (allPages[i].pageId == pageId) {
      //print("page exists", pageId)
      return true;
    }
  }

  return false;
}

ptrPage = []

function assignAddress(pid, pointerID, size){
  pagesAmount = Math.ceil(bToKb(size) / 4);
  allPages = ramPagesOpt.concat(diskPagesOpt);

  processPages = allPages.filter(page => page.processId == pid && page.processSize != 4096);

  if(processPages.length == 0){
    firstAvailablePageNumer = 0;
    for(let i = 0; i < allPages.length+1; i++){
      if(!pageExists(i)){
        firstAvailablePageNumer = i;
        break;
      }
    }
    
    isInRam = 0;

    if(firstAvailablePageNumer < computer.framesQuantity){
      isInRam = 1;
    }

    currProcess = processesOptimal.find(process => process.pid == pid);

    ptrPage.push({pointerID: pointerID, pageId: firstAvailablePageNumer});

    ramPagesOpt.push({ pageId: firstAvailablePageNumer, 
      processId: pid, 
      loaded: false, 
      lAddr: firstAvailablePageNumer * 4096, 
      mAddr: -1, 
      dAddr: 0, 
      loadedTime: 0, 
      mark: false, 
      processSize: size, 
      color: currProcess.color })
      
  }else{
    sizeLeft = 4096;
    for(let i = 0; i < processPages.length; i++){
      if(sizeLeft > 0){
        sizeLeft -= processPages[i].processSize;
        pageToPoint = processPages[i].pageId;
      }
    }

    if(sizeLeft >= size){
      lastPage = processPages[processPages.length - 1];
      lastPage.processSize += size;
      ptrPage.push({pointerID: pointerID, pageId: pageToPoint});
    }else{
      newPages = Math.ceil(bToKb(size - sizeLeft) / 4);
      
      processPages[0].processSize = 4096;
      size = size - sizeLeft
      ptrPage.push({pointerID: pointerID, pageId: processPages[0].pageId});

      for(let i = 0; i < newPages; i++){

        firstAvailablePageNumer = 0;

        allPages = ramPagesOpt.concat(diskPagesOpt);


        for(let i = 0; i < allPages.length+1; i++){
          if(!pageExists(i)){
            firstAvailablePageNumer = i;
            break;
          }
        }

        isInRam = 0;

        if(firstAvailablePageNumer < computer.framesQuantity){
          isInRam = 1;
        }

        currProcess = processesOptimal.find(process => process.pid == pid);

        ptrPage.push({pointerID: pointerID, pageId: firstAvailablePageNumer});

        ramPagesOpt.push({ pageId: firstAvailablePageNumer, 
          processId: pid, 
          loaded: false, 
          lAddr: firstAvailablePageNumer * 4096, 
          mAddr: -1, 
          dAddr: 0, 
          loadedTime: 0, 
          mark: false, 
          processSize: size, 
          color: currProcess.color })
      }
    }


  }

  //ramPagesOpt.push({ pageId: 0, processId: 0, loaded: false, lAddr: 0, mAddr: -1, dAddr: 0, loadedTime: 0, mark: false, processSize: 500, color: "#16697A" })
  
  //print("Pages amount for pointer [" + pointerID + "]: " + pagesAmount+" page(s)");
}

function addProcessOptimal(pid, pointerID, size) {
  if(!activeProcessesOptimal.includes(pid)){
    activeProcessesOptimal.push(pid);
    processesOptimal.push({
      pid: pid,
      memoryTotal: [{pointerID: pointerID, size: size}],
      memoryAssigned: [/*assignAddress(pid, pointerID, size)*/],
      accessList: [pointerID],
      color: getRandomColor(),
    });
    assignAddress(pid, pointerID, size);
  }else{
    for(let i = 0; i < processesOptimal.length; i++){
      if(processesOptimal[i].pid == pid){
        processesOptimal[i].memoryTotal.push({pointerID: pointerID, size: size});
        processesOptimal[i].accessList.push(pointerID);
        assignAddress(pid, pointerID, size);
      }
    }
  }
}

function removeProcessOptimal(pid) {
  for(let i = 0; i < processesOptimal.length; i++){
    if(processesOptimal[i].pid == pid){
      processesOptimal.splice(i, 1);
      activeProcessesOptimal.splice(activeProcessesOptimal.indexOf(pid), 1);
    }    
  }
}

// ------------------------ Optimal Algorithm End ------------------------ //

function readProcessesFromFile(filename){
  let file = loadStrings(filename, function(data){
    let processes = [];
    let colHeaders = data[0].split(",");

    if(colHeaders.length != 3 || (colHeaders[0]!="PID" && colHeaders[1]!="Ptr" && colHeaders[2]!="Size")){
      print("Error: Identificadores de columnas incorrectos");
      return 0;
    }
    for(let i = 1; i < data.length; i++){
      try{
        processInfo = data[i].split(",");
        processInfo = processInfo.map((info) => parseInt(info.trim()));
        optimalAccessList.push(processInfo[1]);
      }catch{
        print("Error: Datos incorrectos en columna " + i);
        return 0;
      }
      addProcessOptimal(processInfo[0], processInfo[1], processInfo[2]);
    }
    
  });
  return 1;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < computer.framesQuantity; i++) {
    optimalRAM.push({frameNumber: i, pageID:-1, color: white});
    algorithmRAM.push({frameNumber: i, pageID:-1, color: white});
  }
  pagesTableOptRAM = ramPagesOpt;
  pagesTableAlgRAM = ramPages;
  mmuOpt = generateTable("MMU - OPT", pagesTableOptRAM,  windowWidth * 0.15, 150);
  mmuAlg = generateTable("MMU - ALG", pagesTableAlgRAM, windowWidth * 0.1 + 675, 150);
  
  if(readProcessesFromFile("./procesos.txt")){
    print("Procesos Algoritmo Optimo", processesOptimal);
    print("Procesos Activos de Optimo", activeProcessesOptimal);
    print("Lista de accesos Optimo", optimalAccessList);
    print("l",ramPagesOpt)
    print("AAA",ptrPage)
  }else{
    print("Error al leer el archivo");
  }
  //runOpt();

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
  mmuOpt.html(generateHtmlTableInfo("MMU - OPT", pagesTableOptRAM));
  mmuAlg.html(generateHtmlTableInfo("MMU - ALG", pagesTableAlgRAM));
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

