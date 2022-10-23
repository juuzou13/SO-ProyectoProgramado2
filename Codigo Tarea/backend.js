function addProcessMemory(pid, processSize, index, color, memory, subP) {
  rest = memory[index].space - processSize;
  memory[index].state = "process";
  memory[index].pid = pid;
  memory[index].color = color;
  memory[index].space = processSize;
  if (subP != undefined) {
    memory[index].subPid = subP;
  } else {
    memory[index].subPid = 0;
  }
  if (rest != 0) {
    memory.splice(index + 1, 0, {pid: -1, subPid: -1, color: spaceColor, state: "free", space: rest});
  }
  print("Proceso " + pid + " agregado en memoria");
}

function deleteProcessMemory(pid, memory, subP) {
  while (true) {
    if (subP != undefined) {
      index = memory.findIndex((item) => {
        return item.pid == pid && item.subPid == subP;
      });
    } else {
      index = memory.findIndex((item) => {
        return item.pid == pid;
      });
    }
    if (index != -1) {
      memory[index].state = "free";
      memory[index].pid = -1;
      memory[index].subPid = -1;
      memory[index].color = spaceColor;
      if (index != 0 && memory[index - 1].state == "free") {
        memory[index].space += memory[index - 1].space;
        memory.splice(index - 1, 1);
        index -= 1;
      }
      if (index != memory.length - 1 && memory[index + 1].state == "free") {
        memory[index].space += memory[index + 1].space;
        memory.splice(index + 1, 1);
      }
    } else {
      break;
    }
  }
  if(subP==undefined){
    console.log("Se elimino el proceso " + pid + " en memoria")
    if(memory == firstFitMemory){
      pidsFirstFit = pidsFirstFit.filter(p => p != pid);
    }
    if(memory == bestFitMemory){
      pidsBestFit = pidsBestFit.filter(p => p != pid);
    }
    if(memory == worstFitMemory){
      pidsWorstFit = pidsWorstFit.filter(p => p != pid);
    }
  }
}

function addProcessFirstFit(pid, processSize, color, subP) {
  freeSpace = firstFitMemory
    .filter((item) => {
      return item.state == "free";
    })
    .find((item) => {
      if (item.space >= processSize) {
        return item;
      }
    });

  if (freeSpace != undefined) {
    index = firstFitMemory.indexOf(freeSpace);
    addProcessMemory(pid, processSize, index, color, firstFitMemory, subP);
  } else {
    if (subP != undefined) {
      console.log("No hay suficiente memoria extra para el proceso " + pid + " en memoria First Fit");
      deleteProcessMemory(pid, firstFitMemory);
    } else {
      algorithmInfo[0].procRechazados += 1;
      console.log("Memoria First Fit rechaza pid:" + pid);
    }
  }
}

function addProcessBestFit(pid, processSize, color, subP) {
  //console.log("original: " + JSON.stringify(bestFitMemory));
  freeSpace = bestFitMemory.filter((item) => {
    return item.state == "free" && item.space >= processSize;
  });

  freeSpaceDifferences = freeSpace.map((item) => {
    return item.space - processSize;
  });

  //console.log("processSize: " + processSize);
  //console.log("freeSpace: " + freeSpaceDifferences);

  bestFragmentationIndex = freeSpaceDifferences.indexOf(
    min(freeSpaceDifferences)
  );

  //console.log("bestFragmentationIndex: " + bestFragmentationIndex);

  if (bestFragmentationIndex != -1) {
    index = bestFitMemory.indexOf(freeSpace[bestFragmentationIndex]);
    addProcessMemory(pid, processSize, index, color, bestFitMemory, subP);
  } else {
    if (subP != undefined) {
      console.log("No hay suficiente memoria extra para el proceso " + pid + " en memoria Best Fit");
      deleteProcessMemory(pid, bestFitMemory);
    } else {
      algorithmInfo[1].procRechazados += 1;
      console.log("Memoria Best Fit rechaza pid:" + pid);
    }
  }
  //console.log(freeSpace);
}

function getAlgorithInfo(name){
  return algorithmInfo[algorithmInfo.indexOf((item) =>{item.name == name})];
}

function addProcessWorstFit(pid, processSize, color, subP) {
  spaces = worstFitMemory
    .filter((item) => {
      return item.state == "free";
    })
    .map((item) => {
      return item.space;
    });

  maxSpace = Math.max(...spaces);

  if (maxSpace >= processSize) {
    index = worstFitMemory.findIndex((item) => {
      return item.space == maxSpace && item.state == "free";
    });
    addProcessMemory(pid, processSize, index, color, worstFitMemory, subP);
  } else {
    if (subP != undefined) {
      console.log("No hay suficiente memoria extra para el proceso " + pid + " en memoria Worst Fit");
      deleteProcessMemory(pid, worstFitMemory);
    } else {
      algorithmInfo[2].procRechazados += 1;
      console.log("Memoria Worst Fit rechaza pid:" + pid);
    }
  }
}

function addProcessBuddySystem(pid, processSize, color, subP) {
  fount = false;
  while (!fount) {
    pIndex = -1;
    sIndex = -1;
    buddySystemMemory.forEach((item, index) => {
      if (processSize <= item.space && processSize >= item.space/2 && item.state == "free" && pIndex == -1) {
        pIndex = index;
      }
      if (processSize <= item.space/2 && item.state == "free" && sIndex == -1) {
        sIndex = index;
      }
      if (index == buddySystemMemory.length - 1) {
        if (pIndex != -1) {
          if (buddySystemMemory[pIndex].space/2 == processSize) {
            spliceSpaceBS(pIndex);
          }
          addProcessBSAux(pid, processSize, color, pIndex, subP);
          fount = true;
        } else if (sIndex != -1) {
          spliceSpaceBS(sIndex);
        } else {
          if (subP != undefined) {
            console.log("No hay suficiente memoria extra para el proceso " + pid + " en memoria Buddy System");
            deleteProcessBS(pid);
            fount = true;
          } else {
            algorithmInfo[3].procRechazados += 1;
            console.log("Memoria Buddy System rechaza pid:" + pid);
            fount = true;
          }
        };
      };
    });
  };
};
  
function spliceSpaceBS(index) {
  buddySystemMemory[index].space = buddySystemMemory[index].space/2;
  buddySystemMemory[index].pairId.splice(0, 0, buddyPairId);
  buddySystemMemory.splice(index + 1, 0, {pid: -1, subPid: -1, fragInt: 0, color: spaceColor, state: "free", space: buddySystemMemory[index].space, pairId: [buddyPairId]});
  buddyPairId += 1;
}

function addProcessBSAux(pid, processSize, color, index, subP) {
  rest = buddySystemMemory[index].space - processSize;
  buddySystemMemory[index].state = "process";
  buddySystemMemory[index].pid = pid;
  if (subP != undefined) {
    buddySystemMemory[index].subPid = subP;
  } else {
    buddySystemMemory[index].subPid = 0;
  }
  buddySystemMemory[index].color = color;
  buddySystemMemory[index].fragInt = rest;
  algorithmInfo[3].fragInt += kbToMb(rest);
  print("Proceso " + pid + " agregado en memoria Buddy System");
}

function deleteProcessBS(pid, subP) {
  while (true) {
    if (subP != undefined) {
      index = buddySystemMemory.findIndex((item) => {
        return item.pid == pid && item.subPid == subP;
      });
    } else {
      index = buddySystemMemory.findIndex((item) => {
        return item.pid == pid;
      });
    }
  
    if (index != -1) {
      buddySystemMemory[index].state = "free";
      buddySystemMemory[index].color = spaceColor;
      buddySystemMemory[index].pid = -1;
      buddySystemMemory[index].subPid = -1;
      algorithmInfo[3].fragInt -= kbToMb(buddySystemMemory[index].fragInt);
      buddySystemMemory[index].fragInt = 0;
    } else {
      break;
    }
  }
  if (subP==undefined) {
    console.log("Se elimino el proceso " + pid + " en memoria Buddy System");
    pidsBuddySystem = pidsBuddySystem.filter(p => p != pid);
  }
  unfragBSMemory();
}

function unfragBSMemory() {
  buddySystemMemory.forEach((item, index) => {
    if (item.state == "free") {
      while (true) {
        if (buddySystemMemory.length > 1 && index < buddySystemMemory.length - 1) {
          if (index != 0 && buddySystemMemory[index - 1].state == "free" && buddySystemMemory[index - 1].pairId[0] == buddySystemMemory[index].pairId[0] && buddySystemMemory[index - 1].space == buddySystemMemory[index].space) {
            buddySystemMemory[index-1].space += buddySystemMemory[index].space;
            buddySystemMemory[index-1].pairId.splice(0, 1);
            buddySystemMemory.splice(index, 1);
            continue;
          } else if (index != buddySystemMemory.length - 1 && buddySystemMemory[index + 1].state == "free" && buddySystemMemory[index + 1].pairId[0] == buddySystemMemory[index].pairId[0] && buddySystemMemory[index + 1].space == buddySystemMemory[index].space) {
            buddySystemMemory[index + 1].space += buddySystemMemory[index + 1].space;
            buddySystemMemory[index + 1].pairId = buddySystemMemory[index].pairId;
            buddySystemMemory[index + 1].pairId.splice(0, 1);
            buddySystemMemory.splice(index, 1);
            continue;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
  });
  if (buddySystemMemory.every((item) => item.state == "free")) {
    buddySystemMemory = [{pid: -1, subPid: -1, fragInt: 0, color: spaceColor, state: "free", space: memorySize, pairId: []}];
    buddyPairId = 1;
  }
}

function updateMemoryState() {
  //Determina la cantidad de espacios libres en cada algoritmo
  //Determina tambien la cantidad de memoria libre en cada algoritmo
  let currMemory;
  for(let i = 0; i < 4; i++){
    currInfo = algorithmInfo[i];
    switch(i){
      case 0:
        currMemory = firstFitMemory;
        break;
      case 1:
        currMemory = bestFitMemory;
        break;
      case 2:
        currMemory = worstFitMemory;
        break;
      case 3:
        currMemory = buddySystemMemory;
        break;
    }
    algorithmInfo[i].segDisp = 0
    algorithmInfo[i].memDisp = 0
    currMemory.forEach((segment) => {
      if (segment.state == "free" && segment.space != 0) {
        algorithmInfo[i].segDisp += 1;
        algorithmInfo[i].memDisp += segment.space;
      }
    });

    algorithmInfo[i].memDisp = kbToMb(algorithmInfo[i].memDisp);
  }
}