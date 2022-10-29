function showRAM(title, RAM, heightPos) {
    widthMargin = windowWidth * 0.1;
    heightMargin = windowHeight * 0.04 + heightPos;
    width = windowWidth - widthMargin * 2;
    fill(0);
    fill(255);
    rect(widthMargin, heightMargin, width, 20);
    fill(0);
    textSize(14);
    textAlign(CENTER);
    text(title, widthMargin + width/2, heightMargin + 15);
    for (let i = 0; i < computer.framesQuantity; i++) {
        fill(RAM[i].color);
        rect(widthMargin + width / 100 * i, heightMargin+20, width / 100, 18);
        fill(0);
        textSize(9);
        textAlign(LEFT);
        text(i, widthMargin + width / 100 * i + 1, heightMargin+35);
    }
}

function generateTable(title, table, widthPos, heightPos) {
    html = generateHtmlTableInfo(title, table);
    divTable = createDiv("");
    divTable.position(widthPos, heightPos);
    divTable.class("table-scroll");
    divTable.html(html);

    return divTable;
}

function generateHtmlTableInfo(title, table) {
    html = 
    "<table>"+
    "<thead>"+
            `<th colspan='8' id='1'>${title}</th>`+
    "</thead>"+
    "<tbody>"+
        "<tr bgcolor='#ffffff'>"+
            "<td> PAGE ID </td>"+
            "<td> PID </td>"+
            "<td> LOADED </td>"+
            "<td> L-ADDR </td>"+
            "<td> M-ADDR </td>"+
            "<td> D-ADDR </td>"+
            "<td> LOADED-T </td>"+
            "<td> MARK </td>"+
        "</tr>";
    for (let i = 0; i < table.length; i++) {
        html += `<tr bgcolor='${table[i].color}'>`+
                "<td>"+table[i].pageId+"</td>"+
                "<td>"+table[i].processId+"</td>";
        if (table[i].loaded) {
            html += "<td>X</td>";
        } else {
            html += "<td></td>";
        }
        if (table[i].lAddr != -1) {
            html += "<td>"+table[i].lAddr+"</td>";
        } else {
            html += "<td></td>";
        }
        if (table[i].mAddr != -1) {
            html += "<td>"+table[i].mAddr+"</td>";
        } else {
            html += "<td></td>";
        }
        if (table[i].dAddr != -1) {
            html += "<td>"+table[i].dAddr+"</td>";
        } else {
            html += "<td></td>";
        }
        html += "<td>"+table[i].loadedTime+"s"+"</td>";
        if (table[i].mark) {
            html += "<td>X</td>";
        } else {
            html += "<td></td>";
        }
        html += "</tr>";
    }
    html += "</tbody>"+"</table>";
    return html;
}

function showInfoTable(title, info, widthPos, heightPos) {
    width = windowWidth * 0.25;

    fill(255);
    rect(widthPos, heightPos, width, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text(title, widthPos + width/2, heightPos + 13);

    heightPos += 18;

    fill(255);
    rect(widthPos, heightPos, width/2, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("Processes", widthPos + width/4, heightPos + 13);

    fill(255);
    rect(widthPos + width/2, heightPos, width/2, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("Simulation Time", widthPos + width/2 + width/4, heightPos + 13);

    heightPos += 18;

    fill(255);
    rect(widthPos, heightPos, width/2, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(info.process, widthPos + width/4, heightPos + 20);

    fill(255);
    rect(widthPos + width/2, heightPos, width/2, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(`${info.simulationTime}s`, widthPos + width/2 + width/4, heightPos + 20);

    heightPos += 30;
    heightPos += 10;

    fill(255);
    rect(widthPos, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("RAM KB", widthPos + width/8, heightPos + 13);

    fill(255);
    rect(widthPos + width/4, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("RAM %", widthPos + width/4 + width/8, heightPos + 13);

    fill(255);
    rect(widthPos + width/2, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("V-RAM KB", widthPos + width/2 + width/8, heightPos + 13);

    fill(255);
    rect(widthPos + width/4 * 3, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("V-RAM %", widthPos + width/4 * 3 + width/8, heightPos + 13);

    heightPos += 18;

    fill(255);
    rect(widthPos, heightPos, width/4, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(info.RAMused, widthPos + width/8, heightPos + 20);

    fill(255);
    rect(widthPos + width/4, heightPos, width/4, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(`${info.RAMused / computer.ramSize * 100}%`, widthPos + width/4 + width/8, heightPos + 20);

    fill(255);
    rect(widthPos + width/2, heightPos, width/4, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(info.VRAMused, widthPos + width/2 + width/8, heightPos + 20);

    fill(255);
    rect(widthPos + width/4 * 3, heightPos, width/4, 30);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(`${info.VRAMused / computer.ramSize * 100}%`, widthPos + width/4 * 3 + width/8, heightPos + 20);

    heightPos += 30;
    heightPos += 10;

    fill(255);
    rect(widthPos, heightPos, width/2, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("Pages", widthPos + width/4, heightPos + 13);
    
    if(info.simulationTime == 0) {
        thrasingPercent = 0;
    }else{
        thrasingPercent = info.TrashingTime / info.simulationTime * 100;
    }

    var color1 = "";
    var color2 = "";

    if (thrasingPercent > 50) {
        color1 = "#F08080";
        color2 = "#7C0A02";
    } else if (thrasingPercent <= 50) {
        color1 = "#98FB98";
        color2 = "#0B6623";
    }

    fill(color1);
    rect(widthPos + width/2, heightPos, width/4, 18);
    fill(color2);
    textSize(11);
    textAlign(CENTER);
    text("Thrashing", widthPos + width/2 + width/8, heightPos + 13);

    fill(255);
    rect(widthPos + width/4 * 3, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("Fragmentation", widthPos + width/4 * 3 + width/8, heightPos + 13);

    heightPos += 18;

    fill(255);
    rect(widthPos, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("LOADED", widthPos + width/8, heightPos + 13);

    fill(255);
    rect(widthPos, heightPos+18, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text(info.PagesLoaded, widthPos + width/8, heightPos + 18 + 13);

    fill(255);
    rect(widthPos + width/4, heightPos, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text("UNLOADED", widthPos + width/4 + width/8, heightPos + 13);

    fill(255);
    rect(widthPos + width/4, heightPos+18, width/4, 18);
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text(info.PagesUnloaded, widthPos + width/4 + width/8, heightPos + 18 + 13);

    fill(color1);
    rect(widthPos + width/2, heightPos, width/8, 36);
    fill(color2);
    textSize(12);
    textAlign(CENTER);
    text(`${info.TrashingTime}s`, widthPos + width/2 + width/16, heightPos + 22);

    fill(color1);
    rect(widthPos + width/2 + width/8, heightPos, width/8, 36);
    fill(color2);
    textSize(12);
    textAlign(CENTER);
    text(`${thrasingPercent}%`, widthPos + width/2 + (width/16 * 3), heightPos + 22);

    fill(255);
    rect(widthPos + width/4 * 3, heightPos, width/4, 36);
    fill(0);
    textSize(13);
    textAlign(CENTER);
    text(`${info.Fragmentation}KB`, widthPos + width/4 * 3 + width/8, heightPos + 22);
}