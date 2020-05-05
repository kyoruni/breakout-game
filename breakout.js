const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
var x = canvas.width / 2
var y = canvas.height - 30
var dx = 2
var dy = -2
const ballRadius = 10
var score = 0
var life = 3

const paddle = {
  height: 10,
  width: 75,
}

var paddleX = (canvas.width - paddle.width) / 2

const color = {
  ball: '#0095DD',
  paddle: '#0095DD',
  brick: '#0095DD',
  score: '#fff',
  life: '#fff',
}

var rightPressed = false
var leftPressed  = false

const brick = {
  width: 75,
  height: 20,
  padding: 10,
  rowCount: 3,
  columnCount: 5,
  offsetTop: 30,
  offsetLeft: 30
}

var bricks = []
for (c = 0; c < brick.columnCount; c++) {
  bricks[c] = []
  for (r = 0; r < brick.rowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup',   keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)
draw()

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  drawLife()
  collisionDetection()

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }

  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddle.width) {
      dy = -dy
    } else {
      life --
      if (!life) {
        alert('GAME OVER')
        document.location.reload()
      } else {
        x = canvas.width / 2
        y = canvas.height - 30
        dx = 2
        dy = -2
        paddleX = (canvas.width - paddle.width) / 2
      }
    }
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy
  }

  if (rightPressed && paddleX < canvas.width - paddle.width) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  x += dx
  y += dy

  requestAnimationFrame(draw)
}

function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = color.ball
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  // x, y, w, h
  ctx.rect(paddleX, canvas.height - paddle.height, paddle.width, paddle.height)
  ctx.fillStyle = color.paddle
  ctx.fill()
  ctx.closePath()
}

function drawBricks () {
  for (c = 0; c < brick.columnCount; c++) {
    for (r = 0; r < brick.rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brick.width + brick.padding)) + brick.offsetLeft
        let brickY = (r * (brick.height + brick.padding)) + brick.offsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brick.width, brick.height)
        ctx.fillStyle = color.brick
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function keyDownHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false
  }
}

function mouseMoveHandler (e) {
  let relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddle.width / 2
  }
}

function collisionDetection () {
  for (c = 0; c < brick.columnCount; c++) {
    for (r = 0; r < brick.rowCount; r++) {
      let b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brick.width && y > b.y && y < b.y + brick.height) {
          dy = -dy
          b.status = 0
          score ++
          if (score === brick.rowCount * brick.columnCount) {
            alert('YOU WIN, CONGRATULATIONS!')
            document.location.reload()
          }
        }
      }
    }
  }
}

function drawScore () {
  ctx.font = '16px Arial'
  ctx.fillStyle = color.score
  ctx.fillText('Score: ' + score, 8, 20)
}

function drawLife () {
  ctx.font = '16px Arial'
  ctx.fillStyle = color.life
  ctx.fillText('Life: ' + life, canvas.width - 65, 20)
}
