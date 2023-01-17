import { useEffect, useState } from "react"

import "./App.css"

const canvasId = "rectangle-editor"

const rectanglesOnMount = [
  { x: 5, y: 5, width: 0.3, height: 0.2, color: "red" },
]

const getCanvasContext = () => {
  const canvas = document.getElementById(canvasId)
  return canvas.getContext("2d")
}

const getCanvasSize = () => {
  const {
    width: canvasWidth,
    height: canvasHeight,
    x,
    y,
  } = document.getElementById(canvasId).getBoundingClientRect()
  return { canvasWidth, canvasHeight, x, y }
}

const setupCanvas = () => {
  const ctx = getCanvasContext()
  ctx.scale(1, 1)
}

const drawRectangle = ({ x, y, width, height, color }) => {
  console.log("drawing", { x, y })
  const ctx = getCanvasContext()
  const { canvasWidth, canvasHeight } = getCanvasSize()
  const actualWidth = canvasWidth * width
  const actualHeight = canvasHeight * height
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.rect(x, y, actualWidth, actualHeight)
  ctx.fill()
}

const canvasHeight = window.innerHeight * 0.8
const canvasWidth = window.innerWidth * 0.8

function App() {
  // Need to handle resizing
  useEffect(() => {
    setupCanvas()
    rectanglesOnMount.map(drawRectangle)
  }, [])

  const [dragStart, setDragStart] = useState(null)

  const onMouseDown = (e) => {
    const { x: canvasX, y: canvasY } = getCanvasSize()
    const x = e.clientX - canvasX
    const y = e.clientY - canvasY
    setDragStart({ x, y })
  }

  const onMouseUp = (e) => {
    // Handle drawing upwards as well
    const {
      canvasWidth,
      canvasHeight,
      x: canvasX,
      y: canvasY,
    } = getCanvasSize()
    const x = e.clientX - canvasX
    const y = e.clientY - canvasY
    const width = Math.abs(dragStart.x - x) / canvasWidth
    const height = Math.abs(dragStart.y - y) / canvasHeight
    const color = "red"
    drawRectangle({ x: dragStart.x, y: dragStart.y, width, height, color })
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="App"
    >
      <canvas
        style={{ border: "1px solid black" }}
        height={canvasHeight}
        width={canvasWidth}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        id={canvasId}
      />
    </div>
  )
}

export default App
