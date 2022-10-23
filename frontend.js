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

function showTable(table, heightPos) {
    html = 
    "<table>"+
    "<thead>"+
        "<tr>"+
            "<th colspan='2'>The table header</th>"+
        "</tr>"+
    "</thead>"+
    "<tbody>"+
        "<tr>"+
            "<td>PAGE ID</td>"+
            "<td>PID</td>"+
            "<td>LOADED</td>"+
            "<td>L-ADDR</td>"+
            "<td>M-ADDR</td>"+
            "<td>D-ADDR</td>"+
            "<td>LOADED-T</td>"+
            "<td>MARK</td>"+
        "</tr>"+
    "</tbody>"+
    "</table>";
    divTable = createDiv("");
    divTable.position(100, windowHeight/3+ heightPos);
    divTable.class("table");
    divTable.html(html);
}