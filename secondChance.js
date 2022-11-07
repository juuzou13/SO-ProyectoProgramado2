async function secondChanceProcess(pageNumber) {
    if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitSecondChance(pageNumber);
    } else {
        pageFaultSecondChance(pageNumber);
    }
}

function pageHitSecondChance(pageNumber) {
    
    let index = algMarkPages.findIndex(object => { return object.pageId === pageNumber; });
    
    markedPageExists = algMarkPages[index] != undefined;

    if (markedPageExists) {
        algMarkPages[index].chance = 1;
    }else{
        algMarkPages.push({pageId: pageNumber, chance: 1});
    }
}

function pageFaultSecondChance(selectedPage) {
    
    
    frameToInsert = getFreeFrame(algorithmRAM);

    /* Sí encontró un frame libre en RAM */
    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
        algMarkPages.push({pageId: selectedPage, chance: 0});
    }else{
        pointer = replacePageSecondChance(selectedPage)
    }
}

function replacePageSecondChance(selectedPage) {
    while(true) {
        if(!algMarkPages[pointer].chance) {
            frameToInsert = movePageToDisk(algMarkPages[pointer].pageId, ramPagesAlg, algDisk, algorithmRAM);
            movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
            let index = algMarkPages.findIndex(object => { return object.pageId === algMarkPages[pointer].pageId; });
            algMarkPages[index] = {pageId: selectedPage, chance: 0};
            return (pointer + 1) % computer.framesQuantity;
        }
        algMarkPages[pointer].chance = 0;
        pointer = (pointer + 1) % computer.framesQuantity;
    }
}