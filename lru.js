async function lruProcess(pageNumber) {
    if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitLRU(pageNumber);
    } else {
        pageFaultLRU(pageNumber);
    }
    print(" LRU array: " + algMarkPages);
    //await new Promise(r => setTimeout(r, 500));

}

function pageHitLRU(pageNumber) {
    // realRam[i].pageID == pageId
    print("Page hit");
    print("Page: " + pageNumber);
    print("LRU Page is already in memory");
    print(" ");
    pageIndex = algMarkPages.indexOf(pageNumber); 
    algMarkPages.splice(pageIndex, 1); // remove page from array
    algMarkPages.unshift(pageNumber); // add page to the beginning of the array
}

function pageFaultLRU(selectedPage) {
    print("Page fault");
    print("Page fault LRU: " + selectedPage);
    
    frameToInsert = getFreeFrame(algorithmRAM);
    

    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
        algMarkPages.unshift(pageNumber); // add page to the beginning of the array
    }else{

        deletedPage = algMarkPages.pop(); // ID del page que se debe eliminar
        print(" deletedPage: " + deletedPage);

        index = ramPagesAlg.find(page => page.pageId == deletedPage).mAddr;

        
        movePageToDisk(deletedPage, ramPagesAlg, algDisk);        
        movePageToRam(selectedPage, index, ramPagesAlg, algDisk, algorithmRAM); // move page to ram
        algMarkPages.unshift(selectedPage);
    }
}