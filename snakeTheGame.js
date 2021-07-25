let canvas = document.getElementById('canvas')
let ctx = canvas.getContext("2d")
let score = 0, blockSize = 10
let width = canvas.width, height = canvas.height
let widthInBlocks = width / blockSize, heightInBlocks = height / blockSize
let directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}
let animationTime = 100
let isApplePositionCorrect

function drawBorder() {
    ctx.fillStyle = 'Grey'
    ctx.fillRect(0, 0, width, blockSize)
    ctx.fillRect(0, 0, blockSize, height)
    ctx.fillRect(width - blockSize, 0, blockSize, height)
    ctx.fillRect(0, height - blockSize, width, blockSize)
}

function drawScore() {
    ctx.font = '20px Courier'
    ctx.fillStyle = 'Red'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText(`Счёт: ${score}.`, blockSize, blockSize)
}

function gameOver() {
    snake.draw()
    apple.draw()
    ctx.font = '40px Courier'
    ctx.fillStyle = 'Blue'
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.fillText('Игра окончена!', width / 2, height / 2)
    ctx.textBaseline = 'top'
    ctx.fillText('Сосать!', width / 2, height / 2)
    clearTimeout(gameTimer)
}

function Block(col, row) {
    this.col = col
    this.row = row
}

function Snake() {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ]
    this.direction = 'right'
    this.nextDirection = 'right'
}

function circle(x, y, rad, fill) {
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, Math.PI * 2, false)
    fill ? ctx.fill() : ctx.stroke()
}

Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize
    let y = this.row * blockSize
    ctx.fillStyle = color
    ctx.fillRect(x, y, blockSize, blockSize)
}

Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2
    let centerY = this.row * blockSize + blockSize / 2
    ctx.fillStyle = color
    circle(centerX, centerY, blockSize / 2, true)
}

Block.prototype.equal = function (otherBlock) {
    return this.row === otherBlock.row && this.col === otherBlock.col
}

Snake.prototype.draw = function () {
    for (i = 1; i < this.segments.length + 1; i++) {
        if (i & 1) {
            this.segments[i - 1].drawSquare('red')}
        else {
            this.segments[i - 1].drawSquare('yellow')
        }
    }
}

Snake.prototype.move = function () {
    let head = this.segments[0]
    let newHead
    this.direction = this.nextDirection

    if (this.direction === 'right') {newHead = new Block(head.col + 1, head.row)}
    else if (this.direction === 'left') {newHead = new Block(head.col - 1, head.row)}
    else if (this.direction === 'up') {newHead = new Block(head.col, head.row - 1)}
    else if (this.direction === 'down') {newHead = new Block(head.col, head.row + 1)}

    if (this.checkCollision(newHead)) {
        gameOver()
        return
    }
    this.segments.unshift(newHead)
    if (newHead.equal(apple.position)) {
        score++
        animationTime--
        apple.move ()
    }
    else {
        this.segments.pop()
    }
}

Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0)
    let topCollision = (head.row === 0)
    let rightCollision = (head.col === widthInBlocks - 1)
    let bottomCollision = (head.row === heightInBlocks - 1)
    let selfCollision = false

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision

    for (i = 0; i < this.segments.length; i++) {
        if (this.segments[i].equal(head)) {selfCollision = true}
    }

    return selfCollision || wallCollision
}

Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === 'right' && newDirection === 'left') {return}
    else if (this.direction === 'left' && newDirection === 'right') {return}
    else if (this.direction === 'up' && newDirection === 'down') {return}
    else if (this.direction === 'down' && newDirection === 'up') {return}

    this.nextDirection = newDirection
}

let Apple = function () {
    this.position = new Block (10, 10)
}

Apple.prototype.draw = function () {
    this.position.drawCircle('limeGreen')
}

Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1
    let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1
    this.position = new Block(randomCol, randomRow)
}

function checkAppleCorrectPosition() {
    isApplePositionCorrect = true
    for (i = 0; i < snake.segments.length; i++) {
        if (snake.segments[i].equal(apple.position)) {isApplePositionCorrect = false}
}}

function appleMoveRecall() {
    while (isApplePositionCorrect === false) {apple.move()
    checkAppleCorrectPosition()}
}

let snake = new Snake()
let apple = new Apple()

$('body').keydown(function (event) {
    let newDirection = directions[event.keyCode]
    if (newDirection !== undefined) {
        snake.setDirection(newDirection)
    }
})

function gameLoop() {
    ctx.clearRect(0, 0, width, height)
    drawBorder()
    drawScore()
    snake.move()
    snake.draw()
    apple.draw()
    checkAppleCorrectPosition()
    appleMoveRecall()
    let gameTimer = setTimeout(gameLoop, animationTime)
}

gameLoop()