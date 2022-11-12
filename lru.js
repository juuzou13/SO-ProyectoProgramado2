async function lruProcess(pageNumber) {
    if (pagesInAlgFreeFrame > 0) {
        pagesInAlgFreeFrame -= 1;
        algMarkPages.unshift(pageNumber); 
    }
    else if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitLRU(pageNumber);
    } else {
        pageFaultLRU(pageNumber);
    }
}

function pageHitLRU(pageNumber) {
    
    pageIndex = algMarkPages.indexOf(pageNumber); 
    algMarkPages.splice(pageIndex, 1); // remove page from array
    algMarkPages.unshift(pageNumber); // add page to the beginning of the array
}

function pageFaultLRU(selectedPage) {
    
    
    frameToInsert = getFreeFrame(algorithmRAM);
    
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
        algMarkPages.unshift(pageNumber); 
    }else{

        deletedPage = algMarkPages.pop(); // ID del page que se debe eliminar
        frameToInsert = movePageToDisk(deletedPage, ramPagesAlg, algDisk, algorithmRAM);
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM); // move page to ram
        algMarkPages.unshift(selectedPage);
    }
}