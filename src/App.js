import { useEffect } from "react"

import "./App.css"

const canvasId = "rectangle-editor"

const rectanglesOnMount = [
  { x: 5, y: 5, width: 0.3, height: 0.2, color: "red" },
]

const getCanvasContext = () => {
  const canvas = document.getElementById(canvasId)
  return canvas.getContext("2d")
}

const setupCanvas = () => {
  const ctx = getCanvasContext()
  ctx.scale(1, 1)
}
const drawRectangle = ({ x, y, width, height, color }) => {
  const ctx = getCanvasContext()
  const actualWidth = ctx.canvas.clientWidth * width
  const actualHeight = ctx.canvas.clientHeight * height
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
        id={canvasId}
      />
    </div>
  )
}

export default App
