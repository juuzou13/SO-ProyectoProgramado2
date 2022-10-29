async function runOptimal(fileContents){

    res = await loadProcesses(fileContents);
  
    if(res){

        print("Procesos Algoritmo Optimo", generalProcesses);
        print("Procesos Activos de Optimo", activeProcessesOptimal);
        print("Lista de accesos Optimo", pointerAccessList);
        
        /*
        movePageToDisk(3);
        movePageToDisk(9)
        movePageToRam(9,18)
        movePageToDisk(0)
        movePageToDisk(8)
        */

        //print(ramPagesOpt)
        //print(optimalDisk)

        startExecution()

    }else{
        print("Error al leer el archivo");
    }
}

function pageExists(pageId) {
  for (let i = 0; i < ramPagesOpt.length; i++) {
    if (ramPagesOpt[i].pageId == pageId) {
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

  mmuPageIndexInRam = ramPagesOpt.indexOf(ramPagesOpt.find(page => page.pageId == pageID));


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
  
// function assignAddress(pid, pointerID, size, color){
async function assignAddress(){

  blackList = [];

  for (let i = 0; i < pointerAccessList.length; i++) {

    if(!blackList.includes(pointerAccessList[i])){
      process = generalProcesses.find(process => process.pointerOrder.includes(pointerAccessList[i]));
      index = generalProcesses.indexOf(process);
      if(index != -1){

        pid = generalProcesses[index].pid;
        pointerID = pointerAccessList[i];
        size = generalProcesses[index].memoryTotal.find(pointer => pointer.pointerID == pointerID).size;
        colorId = generalProcesses[index].color;
        blackList.push(pointerID);
        
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
            color: colorId 
          });

          ramPagesAlg.push({ pageId: availablePage, 
            processId: pid, 
            loaded: false, 
            lAddr: pointerID , 
            mAddr: -1, 
            dAddr: 0, 
            loadedTime: 0, 
            mark: false, 
            processSize: newSize, 
            color: colorId 
          });

          movePageToDisk(availablePage);
          
          if(0){
            freeFrame = getFreeFrame();
            
            if(freeFrame != -1){
              movePageToRam(availablePage, freeFrame);
            } 
          }

          addresses.push({pointerID: pointerID, address: (availablePage * kbToB(computer.pageSize))});

          size -= kbToB(computer.pageSize);
        }

        generalProcesses[index].memoryAssigned.push(addresses);

      } else {
        print("Error en el proceso")
      }
    }
  }
}

  //ramPagesOpt.push({ pageId: 0, processId: 0, loaded: false, lAddr: 0, mAddr: -1, dAddr: 0, loadedTime: 0, mark: false, processSize: 500, color: "#16697A" })
  
  //print("Pages amount for pointer [" + pointerID + "]: " + pagesAmount+" page(s)");


function addProcessOptimal(pid, pointerID, size) {
  if(!activeProcessesOptimal.includes(pid)){
    activeProcessesOptimal.push(pid);

    colorToAssign = getRandomColor();

    generalProcesses.push({pid: pid,
      memoryTotal: [{pointerID: pointerID, size: size}],
      memoryAssigned: [], //assignAddress(pid, pointerID, size, colorToAssign),
      pointerOrder: [pointerID],
      color: colorToAssign,
    });
  }else{
    for(let i = 0; i < generalProcesses.length; i++){
      if(generalProcesses[i].pid == pid){
        generalProcesses[i].memoryTotal.push({pointerID: pointerID, size: size});
        generalProcesses[i].pointerOrder.push(pointerID);
      }
    }
  }
}

function removeProcessOptimal(pid) {
  for(let i = 0; i < generalProcesses.length; i++){
    if(generalProcesses[i].pid == pid){
      generalProcesses.splice(i, 1);
      activeProcessesOptimal.splice(activeProcessesOptimal.indexOf(pid), 1);
    }    
  }
}

// ------------------------ Optimal Algorithm End ------------------------ //

async function randomizepointerAccessList(){
  // CopypointerAccessList = pointerAccessList.slice();
  pointerOrderList = [];

  for(let i = 0; i < generalProcesses.length; i++){
    maxDuplicate = round(random(0, 10));
    pointerOrderLength = generalProcesses[i].pointerOrder.length;
    for(let j = 0; j < maxDuplicate; j++){
      randomIndex = round(random(0, pointerOrderLength-1));
      generalProcesses[i].pointerOrder.push(generalProcesses[i].pointerOrder[randomIndex]);
    }
    pointerOrderList.push(generalProcesses[i].pointerOrder.slice());
  }

  while (pointerOrderList.length > 0) {
    randomIndex = round(random(0, pointerOrderList.length-1));
    pointerAccessList.push(pointerOrderList[randomIndex].shift());
    if(pointerOrderList[randomIndex].length == 0){
      pointerOrderList.splice(randomIndex, 1);
    }
  }

  print("pointerAccessList",pointerAccessList);

}

async function loadProcesses(data){

  //data = ['PID, Ptr, Size', '1,   001, 12200', '1,   002, 1024', '1,   003, 512', '2,   004, 256', '2,   005, 512', '3,   006, 128', '3,   007, 1024', '3,   008, 512', '3,   009, 512', '4,   010, 256']
  
  let colHeaders = data[0].split(",");

  if(colHeaders.length != 3 || (colHeaders[0]!="PID" && colHeaders[1]!="Ptr" && colHeaders[2]!="Size")){
    print("Error: Identificadores de columnas incorrectos");
    return 0;
  }
  for(let i = 1; i < data.length; i++){
    try{
      processInfo = data[i].split(",");
      processInfo = processInfo.map((info) => parseInt(info.trim()));
    }catch{
      print("Error: Datos incorrectos en columna " + i);
      return 0;
    }
    addProcessOptimal(processInfo[0], processInfo[1], processInfo[2]);
  }

  await randomizepointerAccessList();
  await assignAddress();
  
  return 1;
}

function pageInMemory(pageId){
    memory = optimalRAM
    for (let i = 0; i < memory.length; i++) {
        if(memory[i].pageID == pageId){
            return true;
        }
    }
    return false
}

function pageHitOptimal(selectedPage){
    print("Page hit");
}

async function pageFaultOptimal(selectedPage){
    frameToInsert = getFreeFrame();
    
    
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert);
    }else{

        futurePointers = pointerAccessList.slice(1, pointerAccessList.length);
        //print("Future pointers: " + futurePointers);

        pagesToCheck = [];
        for(let i = 0; i < futurePointers.length; i++){
            pN = await getPointerPages(futurePointers[i]);
            k = pN.slice()

            pagesToCheck = pagesToCheck.concat(k);
        }
        print("Page string: " + pagesToCheck);
        //await new Promise(r => setTimeout(r, 2000));
        /*
        print(pageString)
        
        /*
        pagesInMemory = optimalRAM.map((page) => page.pageID);

        counts = [];

        for(let i = 0; i < pagesInMemory.length; i++){

            currPageID = pagesInMemory[i];

            pageAlreadyCounted = counts.find((count) => count.pageID == currPageID);

            if(!pageAlreadyCounted){
                currPageCount = pageString.filter((pageID) => pageID == currPageID).length;
                currCount = {pageID: currPageID, count: currPageCount};
                counts.push(currCount);
            }

        }
        leastUsedPage = counts.reduce((prev, curr) => prev.count < curr.count ? prev : curr);
        frame = optimalRAM.find((page) => page.pageID == leastUsedPage.pageID).frameNumber;

        print("Page fault");
        print("Page to replace: " + leastUsedPage.pageID);
        print("Page to insert: " + selectedPage);
        print("Frame to replace it in: " + frame);
        
        movePageToDisk(leastUsedPage.pageID);
        movePageToRam(selectedPage, frame);
        */
    }

    return 1;
}

function getPointerPages(selectedPointer){

    pageN = [];

    pagesWithPointer = ramPagesOpt.filter((page) => page.lAddr == selectedPointer);
    pageN = pagesWithPointer.map((page) => {return page.pageId});
    
    return pageN.slice()
}

async function startExecution(algorithm){

    while(pointerAccessList.length > 0){

        selectedProcess = pointerAccessList[0];

        pN = await getPointerPages(selectedProcess);
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
        print("Salio")
        await new Promise(r => setTimeout(r, 1000));

        

        pointerAccessList.shift();

    }
}

async function optimalProcess(pageNumber){
  if(pageInMemory(pageNumber)){
    pageHitOptimal(pageNumber);
  }else{
    await pageFaultOptimal(pageNumber);
  }
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

/*
function pageInMemory(pageId){
  memory = optimalRAM
  for (let i = 0; i < memory.length; i++) {
      if(memory[i].pageId == pageId){
          return true;
      }
  }
  return false
}
*/