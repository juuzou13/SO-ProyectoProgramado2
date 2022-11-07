async function randomProcess(pageNumber) {
    if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitRandom();
    } else {
        pageFaultRandom(pageNumber);
    }
}

function pageHitRandom() {
    
}

function pageFaultRandom(selectedPage) {
    
    
    frameToInsert = getFreeFrame(algorithmRAM);

    /* Sí encontró un frame libre en RAM */
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
    }else{
        let loadedPagesArray = ramPagesAlg.filter(page => page.loaded == true).map(page => page.pageId)
        frameToInsert = movePageToDisk(random(loadedPagesArray), ramPagesAlg, algDisk, algorithmRAM);
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
    }
}