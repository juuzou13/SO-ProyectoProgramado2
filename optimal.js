processes = []
processCount = 0;

pointersCount = 0;

pageCount = 0;

textFile=[]

diskPages = []; //{lAddr:X, pageid: X}
freeVirtualFrames = [0];

function runOpt(){
    console.log("Running Optimal");
    createProcess(14);
    createProcess(6);
    createProcess(7);
    createProcess(8);
    createProcess(13);
    createProcess(55);
    print(processes)
    print(freeVirtualFrames)
    print(textFile)
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
  

function createProcess(size){
    pagesAmount = Math.ceil(size / 4);
    processColor = getRandomColor();

    sizeInBytes = kbToB(size);
    computerSizeInBytes = kbToB(computer.pageSize);

    totalMemory = [];
    pageTable = [];
    accessList = [];

    while (sizeInBytes > 0) {
        if(sizeInBytes >= computerSizeInBytes){
            
            pointer =  {
                id: pointersCount,
                pointerSize: computerSizeInBytes,
            }
            pointersCount++;
            textFile.push({pid: processCount, ptr: pointer.id, size: pointer.pointerSize});
            totalMemory.push(pointer);
            sizeInBytes -= computerSizeInBytes;

        }else{
            pointer =  {
                id: pointersCount,
                pointerSize: sizeInBytes,
            }
            pointersCount++;
            textFile.push({pid: processCount, ptr: pointer.id, size: pointer.pointerSize});
            totalMemory.push(pointer);
            sizeInBytes -= sizeInBytes;
        }
    }

    for (let i = 0; i < totalMemory.length; i++) {
        virtualFrameToBeUsed = freeVirtualFrames[0]; //El primer frame virtual libre
        pointer = {
            id: totalMemory[i].id,
            address: virtualFrameToBeUsed,
        }
        pageTable.push({pointer})
        freeVirtualFrames.push(freeVirtualFrames[freeVirtualFrames.length - 1] +1);
        freeVirtualFrames.shift();
        optimalPages.push({ pageId: totalMemory[i].id, processId: processCount, loaded: false, lAddr: virtualFrameToBeUsed, mAddr: -1, dAddr: 0, loadedTime: 0, mark: false, processSize: kbToB(size), color: processColor })
    }

    accessQuantity = random(3, 10);
    print(pointersCount)
    print(pointersCount-pagesAmount)
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