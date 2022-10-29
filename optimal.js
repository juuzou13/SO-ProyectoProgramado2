function pageHitOptimal(selectedPage){
    print("Page hit");
}

async function pageFaultOptimal(selectedPage){
    print("Page fault");
    frameToInsert = getFreeFrame(optimalRAM);
    
    
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesOpt, optimalDisk);
    }else{

        futurePointers = pointerAccessList.slice(1, pointerAccessList.length);
        //print("Future pointers: " + futurePointers);

        pagesToCheck = [];
        for(let i = 0; i < futurePointers.length; i++){
            pN = await getPointerPages(futurePointers[i], ramPagesOpt);
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



async function optimalProcess(pageNumber){
  if(pageInMemory(pageNumber, optimalRAM)){
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