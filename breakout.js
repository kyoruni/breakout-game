const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

var dx = 2
var dy = -2

const ball = {
  radius: 10,
  color: '#0095DD',
  x: canvas.width / 2,
  y: canvas.height - 30,
}

const brick = {
  width: 75,
  height: 20,
  padding: 10,
  color: '#0095DD',
  rowCount: 3,
  columnCount: 5,
  offsetTop: 30,
  offsetLeft: 30
}

const paddle = {
  height: 10,
  width: 75,
  color: '#0095DD',
}

var paddleX = (canvas.width - paddle.width) / 2

const score = {
  value: 0,
  color: '#fff',
}

const life = {
  value: 3,
  color: '#fff',
}

const pressed = {
  right: false,
  left: false,
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
preparation()

function startButton () {
  draw()
}

function preparation () {
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  drawLife()
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  preparation()
  collisionDetection()

  if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
    dx = -dx
  }

  if (ball.y + dy < ball.radius) {
    dy = -dy
  } else if (ball.y + dy > canvas.height - ball.radius) {
    if (ball.x > paddleX && ball.x < paddleX + paddle.width) {
      dy = -dy
    } else {
      life.value --
      if (!life.value) {
        alert('GAME OVER')
        document.location.reload()
      } else {
        ball.x = canvas.width / 2
        ball.y = canvas.height - 30
        dx = 2
        dy = -2
        paddleX = (canvas.width - paddle.width) / 2
      }
    }
  }

  if (ball.y + dy > canvas.height - ball.radius || ball.y + dy < ball.radius) {
    dy = -dy
  }

  if (pressed.right && paddleX < canvas.width - paddle.width) {
    paddleX += 7
  } else if (pressed.left && paddleX > 0) {
    paddleX -= 7
  }

  ball.x += dx
  ball.y += dy

  requestAnimationFrame(draw)
}

function drawBall () {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fillStyle = ball.color
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  // x, y, w, h
  ctx.rect(paddleX, canvas.height - paddle.height, paddle.width, paddle.height)
  ctx.fillStyle = paddle.color
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
        ctx.fillStyle = brick.color
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function keyDownHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    pressed.right = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    pressed.left = true
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    pressed.right = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    pressed.left = false
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
        if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
          dy = -dy
          b.status = 0
          score.value ++
          if (score.value === brick.rowCount * brick.columnCount) {
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
  ctx.fillStyle = score.color
  ctx.fillText('Score: ' + score.value, 8, 20)
}

function drawLife () {
  ctx.font = '16px Arial'
  ctx.fillStyle = life.color
  ctx.fillText('Life: ' + life.value, canvas.width - 65, 20)
}
