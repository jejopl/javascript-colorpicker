const layer1 = document.getElementById("layer1")
const layer1_ctx = layer1.getContext("2d")
const layer2 = document.getElementById("layer2")
const layer2_ctx = layer2.getContext('2d')
const side_layer1_ctx = document.getElementById("side-layer1").getContext("2d")
const side_layer2 = document.getElementById("side-layer2")
const side_layer2_ctx = side_layer2.getContext("2d")
const result = document.getElementsByClassName('st0')
const hex = document.getElementById('hex')
const rgb = document.getElementById('rgb')

function rgbaToRgb(r, g, b, a) {
    let rR, rG, rB
    rR = ((1 - a) * 255) + (a * r)
    rG = ((1 - a) * 255) + (a * g)
    rB = ((1 - a) * 255) + (a * b)
    rR = (rR < 255) ? Math.round(rR) : 255
    rG = (rG < 255) ? Math.round(rG) : 255
    rB = (rB < 255) ? Math.round(rB) : 255
    return [rR, rG, rB]
}

function rgbToHex(rgb) {
    let hex = Number(rgb).toString(16)
    if (hex.length < 2) hex = "0" + hex
    return hex
}

function fullColorHex(r, g, b) {
    let red = rgbToHex(r)
    let green = rgbToHex(g)
    let blue = rgbToHex(b)
    return ('#' + red + green + blue).toUpperCase()
}

const startPos = {
    x: 125,
    y: 125
}
const mainSwitchPos = {
    x: 125,
    y: 125
}

let dragStart = {
    x: 140,
    y: 140
}

let sideDragStart = {
    x: 18,
    y: 5
}

const sideSwitchPos = {
    x: 3,
    y: 2
}

let drag, sideDrag, dragEnd, sideY, currentColor, alpha, sideColor, sideAlpha

// draw side layer gradient
const someColors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', ]
let side_layer1_gr = side_layer1_ctx.createLinearGradient(0, 0, 0, 250)
for (i = 0; i < someColors.length; i++) {
    let color = someColors[i]
    let part = 1 / (someColors.length - 1)
    side_layer1_gr.addColorStop(part * i, color)
}
side_layer1_ctx.fillStyle = side_layer1_gr
side_layer1_ctx.fillRect(0, 0, side_layer1_ctx.canvas.width, side_layer1_ctx.canvas.height)

// side layer switch
side_layer2_ctx.fillStyle = "#000"
side_layer2_ctx.strokeStyle = '#000'
side_layer2_ctx.lineWidth = 2
side_layer2_ctx.rect(5, 1, 30, 10)
side_layer2_ctx.stroke()

// layer1 (color)
function drawColorLayer(color = `#ff0000`) {
    let layer1_gr = layer1_ctx.createLinearGradient(0, 0, 250, 0)
    layer1_gr.addColorStop(1, color)
    layer1_gr.addColorStop(.95, color)
    layer1_gr.addColorStop(0, `#fff`)
    layer1_ctx.fillStyle = layer1_gr
    layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height)
}

// layer1 (black n white)
function drawBlackNWhiteLayer() {
    let layer1_gr2 = layer1_ctx.createLinearGradient(0, 0, 0, 250)
    layer1_gr2.addColorStop(1, "rgba(0,0,0,1)")
    layer1_gr2.addColorStop(.95, "rgba(0,0,0,1)")
    layer1_gr2.addColorStop(.5, "rgba(0,0,0,0.2)")
    layer1_gr2.addColorStop(.4, "rgba(0,0,0,0.1)")
    layer1_gr2.addColorStop(.1, "rgba(0,0,0,0)")
    layer1_ctx.fillStyle = layer1_gr2
    layer1_ctx.fillRect(0, 0, layer1_ctx.canvas.width, layer1_ctx.canvas.height)
}

// draw bg layers (color, black and white gradient)
drawColorLayer()
drawBlackNWhiteLayer()

// set current color on main and side layers
// save current color value from main switch position
function setCurrentColor() {
    currentColor = layer1_ctx.getImageData(mainSwitchPos.x, mainSwitchPos.y, 1, 1).data
    alpha = (currentColor[3] / 255).toFixed(2)
    currentColor = rgbaToRgb(currentColor[0], currentColor[1], currentColor[2], alpha)
    if (!sideColor) {
        sideColor = side_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data
        sideAlpha = (sideColor[3] / 255).toFixed(2)
        sideColor = rgbaToRgb(sideColor[0], sideColor[1], sideColor[2], sideAlpha)
    }
}
setCurrentColor()

function setLogoColor() {
    for (let i = 0; i < result.length; i++) result[i].style = `fill: rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`
}
setLogoColor()

function displayColorValues() {
    // display color values on the page
    hex.value = fullColorHex(currentColor[0], currentColor[1], currentColor[2])
    rgb.value = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`
}
displayColorValues()

// check if mouse is on switch
function isMouseOnSwitch(layerX, layerY, switchPosX, switchPosY, switchSizeX, switchSizeY) {
    if (layerX > switchPosX && layerX < switchPosX + switchSizeX && layerY > switchPosY && layerY < switchPosY + switchSizeY) return true
    else return false
}

// set translate to 0 if switch is on max top/bottom/left/right (block switch to move out of range)
function restrictSwitchToMoveOutRange(prop) {
    if (prop === 'side') return ((sideSwitchPos.y < 2 && sideDragEnd.y - sideDragStart.y < 0) || (sideSwitchPos.y > 248 && sideDragEnd.y - sideDragStart.y > 0)) ? 0 : sideDragEnd.y - sideDragStart.y
    if (prop === 'y') return ((mainSwitchPos.y < 2 && dragEnd.y - dragStart.y < 0) || (mainSwitchPos.y > 248 && dragEnd.y - dragStart.y > 0)) ? 0 : dragEnd.y - dragStart.y
    if (prop === 'x') return ((mainSwitchPos.x < 2 && dragEnd.x - dragStart.x < 0) || (mainSwitchPos.x > 248 && dragEnd.x - dragStart.x > 0)) ? 0 : dragEnd.x - dragStart.x
}

// draw function for the main switch
function draw() {
    //clear first
    layer2_ctx.save()
    layer2_ctx.setTransform(1, 0, 0, 1, 0, 0)
    layer2_ctx.clearRect(0, 0, layer2.width, layer2.height)
    layer2_ctx.restore()

    //draw
    layer2_ctx.beginPath()
    layer2_ctx.arc(140, 140, 8, 0, 2 * Math.PI)
    layer2_ctx.fillStyle = `rgb(${currentColor[0]},${currentColor[1]},${currentColor[2]})`
    layer2_ctx.fill()
    if (currentColor[1] > 180) layer2_ctx.strokeStyle = '#000'
    else layer2_ctx.strokeStyle = '#fff'
    layer2_ctx.stroke()
}
draw()

function drawSide() {
    // move the switch (translate), clear and draw again
    side_layer2_ctx.translate(0, sideY)
    side_layer2_ctx.clearRect(0, 0, side_layer2.width, side_layer2.height)
    side_layer2_ctx.clearRect(0, 0, side_layer2.width, -side_layer2.height)
    side_layer2_ctx.beginPath()
    side_layer2_ctx.rect(5, 2, 30, 10)
    side_layer2_ctx.stroke()
}

function setMainSwitchPos(x, y) {
    startPos.x += x
    startPos.y += y
    mainSwitchPos.x = startPos.x
    mainSwitchPos.y = startPos.y
}

layer2.addEventListener('mousedown', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 5, mainSwitchPos.y + 5, 18, 18)) {
        dragStart = {
            x: e.layerX,
            y: e.layerY
        }
        drag = true
    }
})

layer2.addEventListener('mousemove', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, mainSwitchPos.x + 5, mainSwitchPos.y + 5, 18, 18)) {
        layer2.style.cursor = 'pointer'
    } else layer2.style.cursor = 'default'

    if (drag) {
        dragEnd = {
            x: e.layerX,
            y: e.layerY
        }
        mainY = restrictSwitchToMoveOutRange('y')
        mainX = restrictSwitchToMoveOutRange('x')
        setMainSwitchPos(mainX, mainY)
        layer2_ctx.translate(mainX, mainY)
        setCurrentColor()
        draw()
        setLogoColor()
        displayColorValues()

        dragStart = dragEnd
    }
})

layer2.addEventListener('mouseup', e => {
    drag = false
    dragEnd = {
        x: e.layerX,
        y: e.layerY
    }

    mainY = restrictSwitchToMoveOutRange('y')
    mainX = restrictSwitchToMoveOutRange('x')
    setMainSwitchPos(mainX, mainY)
    layer2_ctx.translate(mainX, mainY)
    setCurrentColor()
    draw()
    setLogoColor()
    displayColorValues()

    dragStart = dragEnd
    layer2.style.cursor = 'pointer'
})


side_layer2.addEventListener('mousemove', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) side_layer2.style.cursor = 'pointer'
    else side_layer2.style.cursor = 'default'

    if (sideDrag) {
        sideDragEnd = {
            x: e.layerX,
            y: e.layerY
        }

        sideY = restrictSwitchToMoveOutRange('side')
        sideSwitchPos.y += sideY
        drawSide()
        sideColor = side_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data

        drawColorLayer(`rgba(${sideColor[0]},${sideColor[1]},${sideColor[2]}, ${sideAlpha})`)
        drawBlackNWhiteLayer()
        setCurrentColor()
        draw()
        setLogoColor()
        displayColorValues()

        sideDragStart = sideDragEnd
    }
})

side_layer2.addEventListener('mousedown', e => {
    if (isMouseOnSwitch(e.layerX, e.layerY, sideSwitchPos.x, sideSwitchPos.y, 34, 14)) {
        sideDragStart = {
            x: e.layerX,
            y: e.layerY
        }
        sideDrag = true
    }

})

side_layer2.addEventListener('mouseup', e => {
    sideDrag = false
    sideDragEnd = {
        x: e.layerX,
        y: e.layerY
    }

    sideY = restrictSwitchToMoveOutRange('side')
    sideSwitchPos.y += sideY

    drawSide()

    sideColor = side_layer1_ctx.getImageData(sideSwitchPos.x, sideSwitchPos.y, 1, 1).data

    drawColorLayer(`rgba(${sideColor[0]},${sideColor[1]},${sideColor[2]}, ${sideAlpha})`)
    drawBlackNWhiteLayer()
    setCurrentColor()
    setLogoColor()
    draw()
    displayColorValues()

    sideDragStart = sideDragEnd
    side_layer2.style.cursor = 'pointer'
})

// copy the value of the color (rgb or hex) after mouse click
const colorValues = [hex, rgb].forEach(item => {
    item.addEventListener('mouseover', e => item.style.cursor = 'pointer')
    item.addEventListener('mouseout', e => item.style.cursor = 'default')
    item.addEventListener('mousedown', e => {
        item.className += " copied"
        let temp = item.value
        item.focus()
        item.select()
        document.execCommand('copy')
        item.value = 'Copied!'
        setTimeout(() => {
            item.className = 'colors'
            item.value = temp
        }, 500)
    })
})