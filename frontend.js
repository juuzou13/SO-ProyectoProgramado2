function showRAM(title, RAM, heightPos) {
    widthMargin = windowWidth * 0.1;
    heightMargin = windowHeight * 0.04 + heightPos;
    width = windowWidth - widthMargin * 2;
    fill(0);
    rect(widthMargin-1, heightMargin-1, width+2, 40)
    fill(255);
    rect(widthMargin, heightMargin, width, 20);
    fill(0);
    textSize(14);
    textAlign(CENTER);
    text(title, widthMargin + width/2, heightMargin + 15);
    for (let i = 0; i < 100; i++) {
        fill(RAM[i].color);
        rect(widthMargin + width / 100 * i, heightMargin+20, width / 100, 18);
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
        html += "<td>"+table[i].loadedTime+"</td>";
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