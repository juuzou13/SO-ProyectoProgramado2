function pageHitOptimal(selectedPage){
    print("Page hit Optimal");
}

function getLongestPageInRam(ram){
  let longestPage = ram[0];
  for(let i = 0; i < ram.length; i++){
    if(ram[i].loadedTime > longestPage.loadedTime){
      longestPage = ram[i];
    }
  }
  return longestPage.pageId;
}

function getFrameFromPage(pageNumber, ram){
  for(let i = 0; i < ram.length; i++){
    if(ram[i].pageID == pageNumber){
      return i;
    }
  }
  return -1;
}

function getLongestTimeInRamFromList(pageList, ram){
  let longestTime = 0;
  let longestPage = -1;
  for(let i = 0; i < pageList.length; i++){
    let page = pageList[i];
    let frame = getFrameFromPage(page, optimalRAM);
    if(frame != -1){
      if(ram[frame].loadedTime >= longestTime){
        longestTime = ram[frame].loadedTime;
        longestPage = page;
      }
    }
  }
  return longestPage;
}

function getPagesFromPointerList(pointerList){
  let pages = [];
  for(let i = 0; i < pointerList.length; i++){
    r = getPointerPages(pointerList[i], ramPagesOpt);
    pages = pages.concat(r);
  }
  return pages;
}

function pageFaultOptimal(selectedPage){
    print("Page fault Optimal");
    frameToInsert = getFreeFrame(optimalRAM);
    
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesOpt, optimalDisk, optimalRAM);
    }else{


        let futurePointers = pointerAccessList.slice(1, pointerAccessList.length);
        let k = getPagesFromPointerList(futurePointers);
        let referenceString = k;

        let pagesInRam = optimalRAM.map((page) => page.pageID);
        let PR = pagesInRam.slice();

        let amountOfPagesInRam = PR.length;

        let pageToLookIntoFuture;

        let latterPage = 0;
        let cyclesUntilCalled = 0;

        let haveFoundNonRefPage = 0;

        let mostCyclesUntilCalled = 0;

        let pagesNeverReferencedAgain = [];

        for (let i = 0; i < amountOfPagesInRam; i++) {


          pageToLookIntoFuture = PR[i];
          cyclesUntilCalled = -1;

          for (let j = 0; j < referenceString.length; j++) {
            if (pageToLookIntoFuture == referenceString[j]) {
              cyclesUntilCalled = j;
              break;
            }
          }

          if (cyclesUntilCalled == -1) {
            haveFoundNonRefPage = 1
            pagesNeverReferencedAgain.push(pageToLookIntoFuture)
          }

          if (!haveFoundNonRefPage) {
            if (cyclesUntilCalled > mostCyclesUntilCalled) {
              mostCyclesUntilCalled = cyclesUntilCalled;
              latterPage = pageToLookIntoFuture;
            }
          } else {
            let pagesLength = pagesNeverReferencedAgain.length;

            if (pagesLength == 1) {
              latterPage = pagesNeverReferencedAgain[0];
            }else{
              d = getLongestTimeInRamFromList(pagesNeverReferencedAgain.slice(), ramPagesOpt)
              latterPage = d;
            }
          }

        }

        frameToInsert = getFrameFromPage(latterPage, optimalRAM);

        movePageToDisk(latterPage, ramPagesOpt, optimalDisk, optimalRAM);
        movePageToRam(selectedPage, frameToInsert, ramPagesOpt, optimalDisk, optimalRAM);

    }

    return 1;
}



async function optimalProcess(pageNumber){
  if(pageInMemory(pageNumber, optimalRAM)){
    pageHitOptimal(pageNumber);
  }else{
    pageFaultOptimal(pageNumber);
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