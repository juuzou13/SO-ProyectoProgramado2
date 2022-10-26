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

processes = [];
activeProcesses = [];


// ------------------------ Optimal Algorithm ------------------------ //

// Optimal Algorithm RAM 
optimalRAM = [];
optimalRAMFramesLeft = computer.framesQuantity;


// Optimal Algorithm Pages
ramPagesOpt = [];
optimalDisk = [];

pagesTableOptRAM = [];

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
processesOptimal = [];
activeProcessesOptimal = [];

// Access List
optimalAccessList = [];

// --------------------------------------------------------------------- //

function pageInMemory(pageId){
  memory = optimalRAM
  for (let i = 0; i < memory.length; i++) {
      if(memory[i].pageId == pageId){
          return true;
      }
  }
  return false
}

/*
function processPageExists(pid) {
  allPages = ramPagesOpt.concat(optimalDisk);

  for (let i = 0; i < allPages.length; i++) {
    if (allPages[i].processId == pid) {
      return true;
    }
  }

  return false;
}
*/

ptrPage = []

function pageExists(pageId) {
  allPages = ramPagesOpt.concat(optimalDisk);
  
  for (let i = 0; i < allPages.length; i++) {
    if (allPages[i].pageId == pageId) {
      //print("page exists", pageId)
      return true;
    }
  }

  return false;
}

// ----------------------- Move to Disk -----------------------

function getFirstFreeDiskSpace() {
  for(let i = 0; i < optimalDisk.length+1; i++){
    pageWithDiskAddr = optimalDisk.find(page => page.dAddr == i)
    if(pageWithDiskAddr == undefined){
      return i;
    }
  }
}

function movePageToDisk(pageID){

  if(pageID == 6)
    print("SSSSSSSSSSS", ramPagesOpt)



  mmuPageIndexInRam = ramPagesOpt.indexOf(ramPagesOpt.find(page => page.pageId == pageID));

  print("mmuPageIndexInRam", mmuPageIndexInRam)

  if(ramPagesOpt[mmuPageIndexInRam].loaded == true){
    addrInRam = ramPagesOpt[mmuPageIndexInRam].mAddr;
    optimalRAM[addrInRam].pageId = -1;
    optimalRAM[addrInRam].color = white;
  }

  ramPagesOpt[mmuPageIndexInRam].loaded = false;
  ramPagesOpt[mmuPageIndexInRam].mAddr = -1;

  freeDiskSpace = getFirstFreeDiskSpace();

  ramPagesOpt[mmuPageIndexInRam].dAddr = freeDiskSpace
  optimalDisk.push({dAddr: freeDiskSpace, pageId: pageID});
  ramPagesOpt[mmuPageIndexInRam].loadedTime = 0;

}

// ----------------------- End of move to Disk -----------------------


// ----------------------- Move to RAM -----------------------

function getFreeFrame() {

  for (let i = 0; i < optimalRAM.length; i++) {
    if (optimalRAM[i].pageID == -1) {
      return i;
    }
  }
  return -1;
}

function movePageToRam(pageID, frameID){
  
  mmuPageIndexInRam = ramPagesOpt.indexOf(ramPagesOpt.find(page => page.pageId == pageID));

  if(ramPagesOpt[mmuPageIndexInRam].loaded == false){
    addrInDisk = ramPagesOpt[mmuPageIndexInRam].dAddr;
    indexFromPageInDisk = optimalDisk.indexOf(optimalDisk.find(page => page.dAddr == addrInDisk));
    optimalDisk.splice(indexFromPageInDisk, 1);
  }

  ramPagesOpt[mmuPageIndexInRam].loaded = true;
  ramPagesOpt[mmuPageIndexInRam].mAddr = frameID;
  ramPagesOpt[mmuPageIndexInRam].dAddr = -1;
  ramPagesOpt[mmuPageIndexInRam].loadedTime = 100;

  optimalRAM[frameID].pageID = pageID;
  optimalRAM[frameID].color = ramPagesOpt[mmuPageIndexInRam].color;

}

// ----------------------- End of move to RAM -----------------------
  

function assignAddress(pid, pointerID, size, color){

  pagesAmount = Math.ceil(bToKb(size) / 4);
  allPages = ramPagesOpt.concat(optimalDisk);

  addresses = [];

  for(let i = 0; i < pagesAmount; i++){

    allPages = ramPagesOpt.concat(optimalDisk);

    availablePage = 0;
    for(let i = 0; i < allPages.length+1; i++){
      if(!pageExists(i)){
        availablePage = i;
        break;
      }
    }
    
    //ptrPage.push({pointerID: pointerID, pageId: availablePage});

    newSize = size > kbToB(computer.pageSize)? kbToB(computer.pageSize) : size;

    ramPagesOpt.push({ pageId: availablePage, 
      processId: pid, 
      loaded: false, 
      lAddr: pointerID , 
      mAddr: -1, 
      dAddr: 0, 
      loadedTime: 0, 
      mark: false, 
      processSize: newSize, 
      color: color })

    movePageToDisk(availablePage);

    if(pid % 2 == 0){

      freeFrame = getFreeFrame();
      
      if(freeFrame != -1){
        movePageToRam(availablePage, freeFrame);
      } else {
        movePageToDisk(availablePage);
      }
    }

    addresses.push({pointerID: pointerID, address: (availablePage * kbToB(computer.pageSize))});

    size -= kbToB(computer.pageSize);
  }

  return addresses;

}

  //ramPagesOpt.push({ pageId: 0, processId: 0, loaded: false, lAddr: 0, mAddr: -1, dAddr: 0, loadedTime: 0, mark: false, processSize: 500, color: "#16697A" })
  
  //print("Pages amount for pointer [" + pointerID + "]: " + pagesAmount+" page(s)");


function addProcessOptimal(pid, pointerID, size) {
  if(!activeProcessesOptimal.includes(pid)){
    activeProcessesOptimal.push(pid);

    colorToAssign = getRandomColor();
    addresses = assignAddress(pid, pointerID, size, colorToAssign);

    processesOptimal.push({pid: pid,
      memoryTotal: [{pointerID: pointerID, size: size}],
      memoryAssigned: addresses,
      accessList: [pointerID],
      color: colorToAssign,
    });
    
    
  }else{
    for(let i = 0; i < processesOptimal.length; i++){
      if(processesOptimal[i].pid == pid){
        processesOptimal[i].memoryTotal.push({pointerID: pointerID, size: size});
        processesOptimal[i].accessList.push(pointerID);
        processesOptimal[i].memoryAssigned.push(assignAddress(pid, pointerID, size, processesOptimal[i].color));
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

async function readProcessesFromFile(data){

  //data = ['PID, Ptr, Size', '1,   001, 12200', '1,   002, 1024', '1,   003, 512', '2,   004, 256', '2,   005, 512', '3,   006, 128', '3,   007, 1024', '3,   008, 512', '3,   009, 512', '4,   010, 256']
  
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

  return 1;
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < computer.framesQuantity; i++) {
    optimalRAM.push({frameNumber: i, pageID:-1, color: white});
    algorithmRAM.push({frameNumber: i, pageID:-1, color: white});
  }
  pagesTableOptRAM = ramPagesOpt;
  pagesTableAlgRAM = ramPages;
  mmuOpt = generateTable("MMU - OPT", pagesTableOptRAM,  windowWidth * 0.15, 150);
  mmuAlg = generateTable("MMU - ALG", pagesTableAlgRAM, windowWidth * 0.1 + 675, 150);
  
  run();

}

async function run(){
  res = await readProcessesFromFile(result);

  if(res){
  
    // Initialize page table
    print("Procesos Algoritmo Optimo", processesOptimal);
    print("Procesos Activos de Optimo", activeProcessesOptimal);
    print("Lista de accesos Optimo", optimalAccessList);

    print(ramPagesOpt)
    movePageToDisk(6);
    movePageToRam(6,7);


  }else{
    print("Error al leer el archivo");
  }
}


let result;

function preload() {
  img = loadImage('https://i.redd.it/ytbssa5z6pn61.png');
  result = loadStrings("procesos.txt");
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

