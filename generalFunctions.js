function pageExists(pageId, ram) {
    for (let i = 0; i < ram.length; i++) {
      if (ram[i].pageId == pageId) {
        return true;
      }
    }
    return false;
  }
  
  // ----------------------- Move to Disk -----------------------
  
  function getFirstFreeDiskSpace(disk) {
    for(let i = 0; i < disk.length+1; i++){
      pageWithDiskAddr = disk.find(page => page.dAddr == i)
      if(pageWithDiskAddr == undefined){
        return i;
      }
    }
  }
  
  
  function movePageToDisk(pageID, ram, disk, graphicRam){
  
    mmuPageIndexInRam = ram.indexOf(ram.find(page => page.pageId == pageID));
    addrInRam = 0;
  
    if(ram[mmuPageIndexInRam].loaded == true){
      addrInRam = ram[mmuPageIndexInRam].mAddr;
      graphicRam[addrInRam].pageId = -1;
      graphicRam[addrInRam].color = white;
    }
  
    ram[mmuPageIndexInRam].loaded = false;
    ram[mmuPageIndexInRam].mAddr = -1;
    ram[mmuPageIndexInRam].mark = false;
  
    freeDiskSpace = getFirstFreeDiskSpace(disk);
  
    ram[mmuPageIndexInRam].dAddr = freeDiskSpace
    disk.push({dAddr: freeDiskSpace, pageId: pageID});
    ram[mmuPageIndexInRam].loadedTime = 0;

    return addrInRam;
  
  }
  
  // ----------------------- End of move to Disk -----------------------
  
  
  // ----------------------- Move to RAM -----------------------
  
  function getFreeFrame(realRam) {
    for (let i = 0; i < realRam.length; i++) {
      if (realRam[i].pageID == -1) {
        return i;
      }
    }
    return -1;
  }
  
  
  function movePageToRam(pageID, frameID, ram, disk, graphicRam){
    
    mmuPageIndexInRam = ram.indexOf(ram.find(page => page.pageId == pageID));
  
    addrInDisk = ram[mmuPageIndexInRam].dAddr;
    indexFromPageInDisk = disk.indexOf(disk.find(page => page.dAddr == addrInDisk));
    disk.splice(indexFromPageInDisk, 1);
  
    ram[mmuPageIndexInRam].loaded = true;
    ram[mmuPageIndexInRam].mAddr = frameID;
    ram[mmuPageIndexInRam].dAddr = -1;
    ram[mmuPageIndexInRam].loadedTime = 100;
  
    graphicRam[frameID].pageID = pageID;
    graphicRam[frameID].color = ram[mmuPageIndexInRam].color;

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
              if(!pageExists(i, ramPagesOpt)){
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
  
            movePageToDisk(availablePage, ramPagesOpt, optimalDisk);
            movePageToDisk(availablePage, ramPagesAlg, algDisk);
            
            if(0){
              freeFrame = getFreeFrame(optimalRAM);
              
              if(freeFrame != -1){
                movePageToRam(availablePage, freeFrame, ramPagesOpt, optimalDisk);
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
  
  
  function addProcess(pid, pointerID, size) {
    if(!activeProcesses.includes(pid)){
      activeProcesses.push(pid);
  
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
        activeProcesses.splice(activeProcesses.indexOf(pid), 1);
      }    
    }
  }
  
  // ------------------------ Optimal Algorithm End ------------------------ //
  
  async function randomizepointerAccessList(){
    // CopypointerAccessList = pointerAccessList.slice();
    pointerOrderList = [];
  
    for(let i = 0; i < generalProcesses.length; i++){
      maxDuplicate = round(random(0, duplicatePointersNumber));
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
      addProcess(processInfo[0], processInfo[1], processInfo[2]);
    }
  
    await randomizepointerAccessList();
    await assignAddress();
    
    return 1;
  }
  
  function pageInMemory(pageId, realRam){
      for (let i = 0; i < realRam.length; i++) {
          if(realRam[i].pageID == pageId){
              return true;
          }
      }
      return false
  }
  
  function getPointerPages(selectedPointer, ram){
  
    pageN = [];
  
    pagesWithPointer = ram.filter((page) => page.lAddr == selectedPointer);
    pageN = pagesWithPointer.map((page) => {return page.pageId});
    
    return pageN.slice()
  }