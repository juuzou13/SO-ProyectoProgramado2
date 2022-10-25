processes = []
processCount = 0;

pointersCount = 0;

pageCount = 0;

textFile=[]
pointers = []

diskPages = []; //{lAddr:X, pageid: X}
diskPages = [{pageId: -1, index: 0}];

function runOpt(){
    console.log("Running Optimal");
    createProcess(14);

    startExecution(0);

    
    print(processes)
    print(pointers)
    print(diskPages)
    //print(pointerPageRelation)
}
/*
computer = {
  cores: 1,
  instructionsPSec: 1,
  diskAccessTime: 5,
  ramSize: 400,
  diskSize: Number.MAX_SAFE_INTEGER,
  pageSize: 4,
  framesQuantity: 400 / 4,
}
*/

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

/*
function createProcess(size){
    pagesAmount = Math.ceil(size / 4);
    processColor = getRandomColor();

    sizeInBytes = kbToB(size);
    computerSizeInBytes = kbToB(computer.pageSize);

    totalMemory = [];
    pageTable = [];
    accessList = [];

    while (sizeInBytes > 0) {
        //TODO Esto quiza haya que cambiarlo
        if(sizeInBytes >= computerSizeInBytes){
            
            pointer =  {
                id: pointersCount,
                pointerSize: computerSizeInBytes,
            }

            // ---------------- Prevista ------------------
            referencedPagesAmount = getRandomIntInclusive(1, 1)
            referencedPages = [];

            
            for (let i = 0; i < referencedPagesAmount; i++) {
                referencedPages.push(pageCount);
                pageCount++;
            }
            pointers.push({pid: processCount, ptr: pointer.id, referencedPages: referencedPages});
            // --------------------------------------------

        
            textFile.push({pid: processCount, ptr: pointer.id, size: pointer.pointerSize});
            
            totalMemory.push(pointer);

            pointersCount++;
            sizeInBytes -= computerSizeInBytes;

        }else{
            pointer =  {
                id: pointersCount,
                pointerSize: sizeInBytes,
            }
            
            // ---------------- Prevista ------------------
            referencedPagesAmount = getRandomIntInclusive(1, 1)
            referencedPages = [];

            
            for (let i = 0; i < referencedPagesAmount; i++) {
                referencedPages.push(pageCount);
                pageCount++;
            }
            pointers.push({pid: processCount, ptr: pointer.id, referencedPages: referencedPages});
            // --------------------------------------------

            textFile.push({pid: processCount, ptr: pointer.id, size: pointer.pointerSize});
            totalMemory.push(pointer);

            pointersCount++;
            sizeInBytes -= sizeInBytes;
        }
    }

    //TODO Esto quiza haya que cambiarlo
    for (let i = 0; i < totalMemory.length; i++) {

        referencedPages = pointers.find(pointer => pointer.ptr == totalMemory[i].id).referencedPages;
        
        for (let j = 0; j < referencedPages.length; j++) {
            virtualFrameToBeUsed = diskPages.find(page => page.pageId == -1).index;
            pointer = {
                id: totalMemory[i].id,
                address: virtualFrameToBeUsed,
            }
            diskPages[virtualFrameToBeUsed].pageId = referencedPages[j];
            pageTable.push({pointer})
            diskPages.push({pageId: -1, index: (diskPages[diskPages.length - 1].index +1)});
            optimalPages.push({ pageId: virtualFrameToBeUsed, processId: processCount, loaded: false, lAddr: referencedPages[j], mAddr: -1, dAddr: virtualFrameToBeUsed, loadedTime: 0, mark: false, processSize: kbToB(size), color: processColor })
        }
    }

    accessQuantity = random(3, 10);

    for (let accesses = 0; accesses < accessQuantity; accesses++) {
        accessList.push(getRandomIntInclusive(pointersCount-pagesAmount, pointersCount-1));
    }

    let process = {
        pid: processCount,
        size: size,
        totalMemoryStructure: totalMemory,
        assignedMemoryStructure: pageTable,
        accessList: accessList,
        color: processColor,
    }

    processCount++;
    processes.push(process);

    return process;
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

function pageHitOptimal(pageId){
    console.log("Page "+pageId+" Hit");
}

function pageFaultOptimal(pid, pageId){
    currProcess = processes.find(process => process.pid == pid)

    loadedFrames = optimalPages.filter(page => page.loaded == true);
    framesLeft = computer.framesQuantity - loadedFrames.length;

    if(framesLeft > 0){

        firstFreeFrame = optimalRAM.indexOf(optimalRAM.find(frame => frame.pageId == -1));

        processPointers = pointers.filter(pointer => pointer.pid == pid);

        pointerToFind = -1;
        
        for(let i = 0; i < processPointers.length; i++){
            if(processPointers[i].referencedPages.includes(pageId)){
                pointerToFind = processPointers[i].ptr;
                break;
            }
        }

        entryToChange = pageTable.find(entry => entry.pointer.id == pointerToFind);
        entryOldAddress = entryToChange.pointer.address;
        
        unloadedPageFromDisk = diskPages.find(page => page.index == entryOldAddress)
        indexFromUnloadedPage = diskPages.indexOf(unloadedPageFromDisk);
        diskPages[indexFromUnloadedPage].pageId = -1;
        

        mmuDataForPage = optimalPages.find(page => page.pageId == pageId)
        mmuDataForPage.loaded = true;
        mmuDataForPage.mAddr = firstFreeFrame;
        mmuDataForPage.dAddr = "";

        optimalRAM[firstFreeFrame].pageId = pageId;
        optimalRAM[firstFreeFrame].color = currProcess.color;

        entryToChange.pointer.address = firstFreeFrame;

        print("SSS")
        print(pointerToFind)
        print(currProcess)
    }

}
*/

async function startExecution(pid){

    selectedProcess = processes.find(process => process.pid == pid);

    while(selectedProcess.accessList.length > 0){

        await new Promise(r => setTimeout(r, 1000));
        
        selectedPage = selectedProcess.accessList[0];

        if(pageInMemory(selectedPage)){
            pageHitOptimal(selectedPage);
        }else{
            pageFaultOptimal(pid, selectedPage);
        }

        selectedProcess.accessList.shift();

    }
}
