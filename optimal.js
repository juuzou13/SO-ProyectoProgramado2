async function runOptimal(){
    res = await readProcessesFromFile(result);
  
    if(res){
    
      // Initialize page table
      print("Procesos Algoritmo Optimo", processesOptimal);
      print("Procesos Activos de Optimo", activeProcessesOptimal);
      print("Lista de accesos Optimo", optimalAccessList);
        
      movePageToDisk(3);
      
      movePageToDisk(9)

      movePageToRam(9,20)

      movePageToDisk(0)
      movePageToDisk(8)

      print(ramPagesOpt)
      print(optimalDisk)
  
    }else{
      print("Error al leer el archivo");
    }
  }

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

    addrInDisk = ramPagesOpt[mmuPageIndexInRam].dAddr;
    indexFromPageInDisk = optimalDisk.indexOf(optimalDisk.find(page => page.dAddr == addrInDisk));
    optimalDisk.splice(indexFromPageInDisk, 1);

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

      freeFrame = getFreeFrame();
      
      if(freeFrame != -1){
        movePageToRam(availablePage, freeFrame);
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