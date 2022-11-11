async function secondChanceProcess(pageNumber) {
    if (0 < pagesInAlgFreeFrame) {
        pagesInAlgFreeFrame -= 1;
        algMarkPages.push({pageId: pageNumber, chance: 0});
    } else if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitSecondChance(pageNumber);
    } else {
        pageFaultSecondChance(pageNumber);
    }
}

function pageHitSecondChance(pageNumber) {

    let index = algMarkPages.findIndex(object => { return object.pageId === pageNumber; });
    let indexRAM = ramPagesAlg.findIndex(object => { return object.pageId === pageNumber; });

    algMarkPages[index].chance = 1;
    ramPagesAlg[indexRAM].mark = 1;

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
            algMarkPages[pointer] = {pageId: selectedPage, chance: 0};
            return (pointer + 1) % computer.framesQuantity;
        }
        algMarkPages[pointer].chance = 0;
        let index = ramPagesAlg.findIndex(object => { return object.pageId === algMarkPages[pointer].pageId; });
        ramPagesAlg[index].mark = 0;
        pointer = (pointer + 1) % computer.framesQuantity;
    }
}