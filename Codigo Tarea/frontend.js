function calculteWidthScale(width) {
  var originalRatio = width / originalWidth;
  var newWidth = windowWidth * originalRatio;

  return newWidth;

}

let img;

function preload() {
  img = loadImage('./img/circ.png');
}

function calculteHeightScale(height) {
  var originalRatio = height / originalHeight;
  var newHeight = windowHeight * originalRatio;

  return newHeight;
}

function roundTo(num, decimalPlaces) {
  const multFactor = decimalPlaces * 10;

  return Math.round(num * multFactor) / multFactor;
}

function drawRams(ramsCount, realMaxRamSize, margin) {

  // Esto es todo lo relacionado a definir todas las posiciones de cuadros, formas, etc.

  var xMargin = windowWidth * margin * 5;
  var yMargin = windowHeight * margin;

  let singleRamSpaceWidth = (originalWidth - xMargin * 2) / ramsCount;
  var singleRamSpaceHeight = originalHeight - yMargin * 2;
  var singleRamSpaceX = xMargin;
  var singleRamSpaceY = yMargin;

  //rect(singleRamSpaceX, singleRamSpaceY, (originalWidth - xMargin * 2), originalHeight - yMargin * 2);

  var ramSpaceXMargin = 5;
  var ramSpaceYMargin = 5;

  var ramSpaceRelativeWidth = singleRamSpaceWidth - ramSpaceXMargin * 2;
  var ramSpaceRelativeHeight = singleRamSpaceHeight - ramSpaceYMargin * 2;
  var ramSpaceRelativeX = xMargin + ramSpaceXMargin;
  var ramSpaceRelativeY = yMargin + ramSpaceYMargin;

  var ramInfoSpaceHeight = ramSpaceRelativeHeight * 0.15;
  var ramInfoSpaceWidth = ramSpaceRelativeWidth - ramSpaceXMargin * 2;
  var currRamInfoSpaceY = ramSpaceRelativeY + ramSpaceYMargin;
  var currRamInfoSpaceX = ramSpaceRelativeX + ramSpaceXMargin;

  var ramBlockHeight = ramSpaceRelativeHeight * 0.80 - ramSpaceYMargin * 2;
  var ramBlockWidth = ramInfoSpaceWidth;
  var currRamBlockY = currRamInfoSpaceY + ramInfoSpaceHeight + ramSpaceYMargin;
  var currRamBlockX = currRamInfoSpaceX;

  
  for (var i = 0; i < ramsCount; i++) {
    fill(255);
    rect(ramSpaceRelativeX, ramSpaceRelativeY, ramSpaceRelativeWidth, ramSpaceRelativeHeight);
    rect(currRamInfoSpaceX, currRamInfoSpaceY, ramInfoSpaceWidth, ramInfoSpaceHeight);
    rect(currRamBlockX, currRamBlockY, ramBlockWidth, ramBlockHeight);

    fill(0)
    textSize(windowHeight * 0.001 + windowWidth * 0.01);

    let factor = 0.012;

    let info = algorithmInfo[i];

    var textX = currRamInfoSpaceX + windowWidth * 0.005;
    var textY = currRamInfoSpaceY + windowHeight * 0.025;
    text("Algoritmo: " + info.name, textX, textY);

    if(i == 3) {
      var textX = textX;
      var textY = textY + windowWidth * factor;
      text("Fragmentación Interna: " + roundTo(info.fragInt,4) + " MB", textX, textY);
    }

    var textX = textX;
    var textY = textY + windowWidth * factor;
    text("Memoria Disponible: " + roundTo(info.memDisp,4) + " MB", textX, textY);

    var textX = textX;
    var textY = textY + windowWidth * factor;
    text("Segmentos Disponibles: " + info.segDisp, textX, textY);

    var textX = textX;
    var textY = textY + windowWidth * factor;
    text("Procesos Rechazados: " + info.procRechazados, textX, textY);

    currRamInfoSpaceX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);
    ramSpaceRelativeX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);
    currRamBlockX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);
  }

  // ------------------------------------------------------------

  // Esto es todo lo relacionado a dibujar los bloques de memoria

  let ramsMemoryCells = [firstFitMemory, bestFitMemory, worstFitMemory, buddySystemMemory];

  //Vamos a tomarlo ramSize en bytes

  let graphicalMaxRamSize = int(ramBlockHeight)

  var ramSpaceRelativeX = xMargin + ramSpaceXMargin;
  var currRamInfoSpaceX = ramSpaceRelativeX + ramSpaceXMargin;
  var currRamBlockX = currRamInfoSpaceX;

  let processYPosition;

  for (var ram = 0; ram < ramsCount; ram++) {
    processYPosition = currRamBlockY;
    for (var i = 0; i < ramsMemoryCells[ram].length; i++) {

      let realPercentageOfMemoryUsed = ramsMemoryCells[ram][i].space / realMaxRamSize;
      let graphicalPercentageOfMemoryUsed = realPercentageOfMemoryUsed * graphicalMaxRamSize;

      fill(ramsMemoryCells[ram][i].color);

      rect(currRamBlockX, processYPosition, ramBlockWidth, graphicalPercentageOfMemoryUsed);
      processYPosition += graphicalPercentageOfMemoryUsed;

      fill(0);
      if (ramsMemoryCells[ram][i].pid != -1) {
        text("pid: " + ramsMemoryCells[ram][i].pid, currRamBlockX+1, (processYPosition-2));
      }
    }
    currRamInfoSpaceX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);
    ramSpaceRelativeX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);
    currRamBlockX += (ramSpaceRelativeWidth + ramSpaceXMargin * 2);

  }
  fill(255, 255, 255);

}

function windowResized() {

  prevHeight = windowHeight;
  prevWidth = windowWidth;

  resizeCanvas(windowWidth, windowHeight);
}