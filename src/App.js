import { useEffect, useState, useCallback, useRef } from "react"

import "./App.css"

const canvasId = "rectangle-editor"
const canvasHeight = window.innerHeight * 0.8
const canvasWidth = window.innerWidth * 0.8

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


function App() {
  const [dragStart, setDragStart] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [managedRectangles, setManagedRectangles] = useState(rectanglesOnMount)
  const [moving, setMoving] = useState(false)
  const [currentRect, setCurrentRect] = useState(null)
  const rectangleBeingDrawn = useRef(null)

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

  const drawRectangles = () => {
    managedRectangles.map(drawRectangle)
  }

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
    setDragStart({ x, y })
    if (isWithinExistingRect.length > 0) {
      setMoving(true)
      setManagedRectangles(
        managedRectangles.filter((rect) => rect !== isWithinExistingRect[0])
      )
      setCurrentRect(isWithinExistingRect[0])
    } else {
      setDragging(true)
    }
  }

  const onMouseUp = () => {
    setDragging(false)
    setMoving(false)
    setManagedRectangles([
      ...managedRectangles,
      { ...rectangleBeingDrawn.current },
    ])
    rectangleBeingDrawn.current = null
  }

  const onMouseMove = (e) => {
    if (moving) {
      const {
        x: canvasX,
        y: canvasY,
      } = getCanvasSize()
      const x = (e.clientX - canvasX) - dragStart.x
      const y = e.clientY - canvasY - dragStart.y
      const { width, height, color } = currentRect
      const rectangle = { x: dragStart.x + x, y: dragStart.y + y, width, height, color }
      clearCanvas()
      drawRectangles()
      drawRectangle(rectangle)
      rectangleBeingDrawn.current = rectangle
    }
    if (dragging) {
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
        clearCanvas()
        drawRectangles()
        drawRectangle(rectangle)
        rectangleBeingDrawn.current = rectangle
      }
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
        onPointerDown={onMouseDown}
        onPointerUp={onMouseUp}
        onPointerMove={onMouseMove}
        id={canvasId}
      />
    </div>
  )
}

export default App
