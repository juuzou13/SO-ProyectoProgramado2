async function agingProcess(pageNumber) {
    if (pageInMemory(pageNumber, algorithmRAM)) {
        pageHitAging(pageNumber);
    } else {
        pageFaultAging(pageNumber);
    }
}

//! ESTO HAY QUE ARREGLARLO
function pageHitAging(pageNumber) {
    print("Page hit Aging");

    if (algMarkPages.filter(page => page.pageId == pageNumber).length == 0) {
        algMarkPages.push({pageId: pageNumber, binary: "000000"});
    }
    if (algAuxMarkPages.includes(pageNumber) == false) {
        algAuxMarkPages.push(pageNumber);
    }
}

function pageFaultAging(selectedPage) {
    print("Page fault Aging");
    print("AGING",algMarkPages)

    frameToInsert = getFreeFrame(algorithmRAM);

    if(frameToInsert != -1){
        movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
        algMarkPages.push({pageId: selectedPage, binary: "000000"});
    }else{
        frameToInsert = movePageToDisk(algMarkPages[0].pageId, ramPagesAlg, algDisk, algorithmRAM);

        if(frameToInsert == -1){
            pageFaultAging(selectedPage);
        } else {
            movePageToRam(selectedPage, frameToInsert, ramPagesAlg, algDisk, algorithmRAM);
            algMarkPages.shift();
            algMarkPages.push({pageId: selectedPage, binary: "000000"});
            
            index = ramPagesAlg.map(object => object.pageId).indexOf(algMarkPages[0].pageId);

            if (index != -1) {
                ramPagesAlg[index].mark = true;
                algMarkIndex = index;
            } else {
                print("Error Aging4");
            }
        }
    }
}

async function markAgingLoop() {
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

        algMarkPages.sort((a, b) => {
            if (parseInt(a.binary, 2) > parseInt(b.binary, 2)) {
                return 1;
            } else if (parseInt(a.binary, 2) == parseInt(b.binary, 2)) {
                return 0;
            } else {
                return -1;
            }
        });

        if (algMarkIndex != -1) {
            ramPagesAlg[algMarkIndex].mark = false;
        }
        
        index = ramPagesAlg.map(object => object.pageId).indexOf(algMarkPages[0].pageId);

        if (index != -1) {
            ramPagesAlg[index].mark = true;
            algMarkIndex = index;
        } else {
            print("Error Aging3");
        }
        
        await new Promise(r => setTimeout(r, intervalTimeAlg * 1000));
    }
}
    
