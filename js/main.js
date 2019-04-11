const layer1 = document.getElementById("layer1")
const layer1_ctx = layer1.getContext("2d")
const layer2 = document.getElementById("layer2")
const layer2_ctx = layer2.getContext('2d')
const outer_layer1_ctx = document.getElementById("outer-layer1").getContext("2d")
const outer_layer2 = document.getElementById("outer-layer2")
const outer_layer2_ctx = outer_layer2.getContext("2d")
const result = document.getElementsByClassName('st0')

const startPos = {
    x: 125,
    y: 125
};
const mainSwitchPos = {
    x: 125,
    y: 125
};

let dragStart = {
    x: 156,
    y: 156
};

const sideSwitchPos = {
    x: 3,
    y: 0
}

let drag, sideDrag, dragEnd


// side layer color
const someColors = ['red', 'orange', 'yellow', 'chartreuse', 'green', 'aqua', 'blue', 'violet', 'mistyrose'];
let outer_layer1_gr = outer_layer1_ctx.createLinearGradient(0, 0, 0, 250);
for (i = 0; i < someColors.length; i++) {
    let color = someColors[i]
    let part = 1 / (someColors.length - 1)
    outer_layer1_gr.addColorStop(part * i, color);
}
outer_layer1_ctx.fillStyle = outer_layer1_gr;
outer_layer1_ctx.fillRect(0, 0, outer_layer1_ctx.canvas.width, outer_layer1_ctx.canvas.height);

// side layer switch
outer_layer2_ctx.fillStyle = "#000"
outer_layer2_ctx.strokeStyle = '#000';
outer_layer2_ctx.lineWidth = 2
outer_layer2_ctx.rect(5, 2, 30, 10)
outer_layer2_ctx.stroke();
//outer_layer2_ctx.fill();


let currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
let alpha = (currentColor[3] / 255).toFixed(2)


let sideColor = outer_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data;
let sideAlpha = (sideColor[3] / 255).toFixed(2)

result[0].style = `fill: rgb(${sideColor[0]}, ${sideColor[1]}, ${sideColor[2]}, ${sideAlpha})`
result[1].style = `fill: rgb(${sideColor[0]}, ${sideColor[1]}, ${sideColor[2]}, ${sideAlpha})`
result[2].style = `fill: rgb(${sideColor[0]}, ${sideColor[1]}, ${sideColor[2]}, ${sideAlpha})`


// layer1 (color)
let layer1_gr = layer1_ctx.createLinearGradient(0, 0, 150, 100);
layer1_gr.addColorStop(1, `#ff0000`);
layer1_gr.addColorStop(0, `#fff`);
layer1_ctx.fillStyle = layer1_gr;
layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);

// layer1 (black n white)
let layer1_gr2 = layer1_ctx.createLinearGradient(0, 0, 300, 200);
layer1_gr2.addColorStop(1, "rgb(0,0,0,1)");
layer1_gr2.addColorStop(.6, "rgb(0,0,0,0.1)");
layer1_gr2.addColorStop(.35, "rgb(0,0,0,0)");
layer1_ctx.fillStyle = layer1_gr2;
layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);


// check if mouse is on switch
function isMouseOnSwitch(layerX, layerY, switchPosX, switchPosY, switchSizeX, switchSizeY) {
    if (layerX > switchPosX && layerX < switchPosX + switchSizeX && layerY > switchPosY && layerY < switchPosY + switchSizeY) {
        return true
    } else false
}

// draw function for picker (circle)
function draw(lastColor = currentColor, a = alpha) {
    alpha = (lastColor[3] / 255).toFixed(2)
    layer2_ctx.beginPath();
    layer2_ctx.arc(150, 150, 8, 0, 2 * Math.PI);
    layer2_ctx.fillStyle = `rgba(${lastColor[0]},${lastColor[1]},${lastColor[2]}, ${a})`
    layer2_ctx.fill();
    if (alpha < 0.15) layer2_ctx.strokeStyle = '#000';
    else if (alpha < 0.35) layer2_ctx.strokeStyle = '#555'
    else layer2_ctx.strokeStyle = '#fff';
    layer2_ctx.stroke();
}

function clear() {
    layer2_ctx.save();
    layer2_ctx.setTransform(1, 0, 0, 1, 0, 0);
    layer2_ctx.clearRect(0, 0, layer2.width, layer2.height);
    layer2_ctx.restore();
}

draw()

layer2.addEventListener('mousedown', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 15, mainSwitchPos.y + 15, 18, 18)) {
        dragStart = {
            x: e.pageX - layer2.offsetLeft,
            y: e.pageY - layer2.offsetTop
        }

        drag = true;

    }
});

layer2.addEventListener('mousemove', e => {

    if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 15, mainSwitchPos.y + 15, 18, 18)) {
        layer2.style.cursor = 'pointer'
    } else layer2.style.cursor = 'default'

    if (drag) {
        dragEnd = {
            x: e.pageX - layer2.offsetLeft,
            y: e.pageY - layer2.offsetTop
        };

        startPos.x += (dragEnd.x - dragStart.x);
        startPos.y += (dragEnd.y - dragStart.y);
        mainSwitchPos.x = startPos.x;
        mainSwitchPos.y = startPos.y;
        layer2_ctx.translate(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
        currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
        clear();
        draw();
        dragStart = dragEnd;

        result[0].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
        result[1].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
        result[2].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
    }
});

layer2.addEventListener('mouseup', e => {
    drag = false;
    dragEnd = {
        x: e.pageX - layer2.offsetLeft,
        y: e.pageY - layer2.offsetTop
    }

    startPos.x += (dragEnd.x - dragStart.x);
    startPos.y += (dragEnd.y - dragStart.y);
    mainSwitchPos.x = startPos.x;
    mainSwitchPos.y = startPos.y;
    layer2_ctx.translate(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
    currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
    clear();
    draw();
    dragStart = dragEnd;
    layer2.style.cursor = 'pointer';

    result[0].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
    result[1].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
    result[2].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`

});


outer_layer2.addEventListener('mousemove', e => {

    if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) outer_layer2.style.cursor = 'pointer'
    else outer_layer2.style.cursor = 'default'
    

    if (sideDrag) {
        sideDragEnd = {
            x: e.layerX,
            y: e.layerY
        };


        sideSwitchPos.y += (sideDragEnd.y - sideDragStart.y);
        
        outer_layer2_ctx.translate(0, sideDragEnd.y - sideDragStart.y);


        outer_layer2_ctx.clearRect(0, 0, outer_layer2.width, outer_layer2.height);
        outer_layer2_ctx.clearRect(0, 0, outer_layer2.width, -outer_layer2.height);
        
        outer_layer2_ctx.beginPath()
        outer_layer2_ctx.rect(5, 2, 30, 10)
        outer_layer2_ctx.stroke();

        sideColor = outer_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data;
        sideDragStart = sideDragEnd;


        layer1_ctx.clearRect(0, 0, layer1.width, layer1.height);

        layer1_gr = layer1_ctx.createLinearGradient(0, 0, 150, 100);
        layer1_gr.addColorStop(.8, `rgba(${sideColor[0]},${sideColor[1]},${sideColor[2]}, ${sideAlpha})`);
        layer1_gr.addColorStop(0, `rgba(${sideColor[0]},${sideColor[1]},${sideColor[2]}, 0)`);
        layer1_ctx.fillStyle = layer1_gr;
        layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);

        layer1_gr2 = layer1_ctx.createLinearGradient(0, 0, 300, 200);
        layer1_gr2.addColorStop(1, "rgb(0,0,0,1)");
        layer1_gr2.addColorStop(.6, "rgb(0,0,0,0.1)");
        layer1_gr2.addColorStop(.35, "rgb(0,0,0,0)");
        layer1_ctx.fillStyle = layer1_gr2;
        layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height);

        currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data;
        alpha = (currentColor[3] / 255).toFixed(2)
        result[0].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
        result[1].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
        result[2].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${alpha})`
        clear();
        draw(currentColor, alpha);
    }



})

outer_layer2.addEventListener('mousedown', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) {
        sideDragStart = {
            x: e.layerX,
            y: e.layerY
        }

        sideDrag = true;

    }
});

outer_layer2.addEventListener('mouseup', e => {

        sideDrag = false;

});
