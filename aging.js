async function agingProcess(pageNumber) {
    if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitAging(pageNumber);
    } else {
        pageFaultAging(pageNumber);
    }
}

function pageHitAging(pageNumber) {
    print("Page hit");
    print("Page: " + pageNumber);
    print("Aging Page is already in memory");
    print(" ");
}

function pageFaultAging(selectedPage) {
    print("Page fault");
    print("Page: " + selectedPage);
    
    frameToInsert = getFreeFrame(algorithmRAM);

    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
    }else{

    }
}

async function markAgingLoop() {

    // algMarkPages = [];
    // algAuxMarkPages = [];

    // for (i = 0; i < ramPagesAlg.length; i++) {
    //     algMarkPages.push({pageId: ramPagesAlg[i].pageId, pid: ramPagesAlg[i].pid, binary: "000000"});
    // }

    await new Promise(r => setTimeout(r, intervalTimeAlg * 1000));

    while (pointerAccessList.length > 0) {
        for (i = 0; i < algMarkPages.length; i++) {
            if (algAuxMarkPages.includes(algMarkPages[i].pageId)) {
                algMarkPages[i].binary = "1" + algMarkPages[i].binary;
                algMarkPages[i].binary = algMarkPages[i].binary.slice(0, -1);
            } else {
                algMarkPages[i].binary = "0" + algMarkPages[i].binary;
                algMarkPages[i].binary = algMarkPages[i].binary.slice(0, -1);
            }
        }

        algAuxMarkPages = [];

        algMarkPages.sort((a, b) => (parseInt(a.binary, 2) > parseInt(b.binary, 2)) ? 1 : -1);
        index = algMarkPages.indexOf((page) => page.pageId == algMarkPages[0].pageId);
        algMarkPages[index].mark = true;

        await new Promise(r => setTimeout(r, intervalTimeAlg * 1000));
    }
}
    