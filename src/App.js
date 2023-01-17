import { useEffect, useState, useCallback } from "react"

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

const convertRectToTrueDiminsions = (rect) => {
  const { x, y, width, height } = rect
  const { canvasWidth, canvasHeight } = getCanvasSize()
  const actualWidth = canvasWidth * width
  const actualHeight = canvasHeight * height
  return { x, y, width: actualWidth, height: actualHeight }
}

const isMouseWithinExistingRect = (rects, mouseX, mouseY) => {
  const isWithinRect = (rect) => {
    const { x, y, width, height } = convertRectToTrueDiminsions(rect)
    const xLimit = x + width
    const yLimit = y + height
    const withinX = mouseX > x && mouseX < xLimit
    const withinY = mouseY > y && mouseY < yLimit
    return withinX && withinY ? rect : false
  }
  return rects.filter(isWithinRect)
}

const canvasHeight = window.innerHeight * 0.8
const canvasWidth = window.innerWidth * 0.8

function App() {
  const [dragStart, setDragStart] = useState(null)
  const [managedRectangles, setManagedRectangles] = useState(rectanglesOnMount)
  console.log(managedRectangles)

  const drawRectangle = useCallback(({ x, y, width, height, color }) => {
    const ctx = getCanvasContext()
    const { canvasWidth, canvasHeight } = getCanvasSize()
    const actualWidth = canvasWidth * width
    const actualHeight = canvasHeight * height
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.rect(x, y, actualWidth, actualHeight)
    ctx.fill()
  }, [])

  const clearCanvas = useCallback(() => {
    const ctx = getCanvasContext()
    ctx.clearRect(0, 0, canvasHeight, canvasWidth)
  }, [])

  const onMouseDown = (e) => {
    const { x: canvasX, y: canvasY } = getCanvasSize()
    const x = e.clientX - canvasX
    const y = e.clientY - canvasY
    const isWithinExistingRect = isMouseWithinExistingRect(
      managedRectangles,
      x,
      y
    )
    console.log(isWithinExistingRect)
    if (isWithinExistingRect.length > 0) {
      clearCanvas()
      setManagedRectangles(
        managedRectangles.filter((rect) => rect !== isWithinExistingRect[0])
      )
    }
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
    const rectangle = { x: dragStart.x, y: dragStart.y, width, height, color }
    if (width > 0 && height > 0) {
      setManagedRectangles([...managedRectangles, rectangle])
    }
  }

  // Need to handle resizing
  useEffect(() => {
    setupCanvas()
    managedRectangles.map(drawRectangle)
  }, [managedRectangles, drawRectangle])

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
