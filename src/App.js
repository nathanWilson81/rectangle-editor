import { useEffect, useState, useCallback, useRef } from "react"

import "./App.css"

const canvasId = "rectangle-editor"

const rectanglesOnMount = [
  { x: 5, y: 5, width: 0.3, height: 0.2, color: "red", current: false },
]

const getCanvasContext = () => {
  const canvas = document.getElementById(canvasId)
  return canvas.getContext("2d")
}


const setupCanvas = () => {
  const ctx = getCanvasContext()
  ctx.scale(1, 1)
}

function App() {
  const [dragStart, setDragStart] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [managedRectangles, setManagedRectangles] = useState(rectanglesOnMount)
  const [moving, setMoving] = useState(false)
  const [currentRect, setCurrentRect] = useState(null)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * .8)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * .8)
  const rectangleBeingDrawn = useRef(null)
  const resizeRef = useRef(null)
  const renderRef = useRef(null)

  const getCanvasSize = () => {
    const {
      x,
      y,
    } = document.getElementById(canvasId).getBoundingClientRect()
    return { x, y }
  }

  const convertRectToTrueDiminsions = useCallback((rect) => {
    const { x, y, width, height } = rect
    const actualWidth = canvasWidth * width
    const actualHeight = canvasHeight * height
    return { x, y, width: actualWidth, height: actualHeight }
  }, [canvasWidth, canvasHeight])

  const isMouseWithinExistingRect = useCallback((rects, mouseX, mouseY) => {
    const isWithinRect = (rect) => {
      const { x, y, width, height } = convertRectToTrueDiminsions(rect)
      const xLimit = x + width
      const yLimit = y + height
      const withinX = mouseX > x && mouseX < xLimit
      const withinY = mouseY > y && mouseY < yLimit
      return withinX && withinY ? rect : false
    }
    return rects.filter(isWithinRect)
  }, [convertRectToTrueDiminsions])

  const drawRectangle = useCallback(({ x, y, width, height, color, current }) => {
    const ctx = getCanvasContext()
    const actualWidth = canvasWidth * width
    const actualHeight = canvasHeight * height
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.rect(x, y, actualWidth, actualHeight)
    ctx.fill()
    if (current) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "green";
      ctx.rect(x, y, actualWidth, actualHeight);
      ctx.stroke();
    }
  }, [canvasWidth, canvasHeight])

  const drawRectangles = useCallback(() => {
    managedRectangles.map(drawRectangle)
  }, [managedRectangles, drawRectangle])

  const clearCanvas = useCallback(() => {
    const ctx = getCanvasContext()
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }, [canvasHeight, canvasWidth])

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
      { ...rectangleBeingDrawn.current, current: false },
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
      const rectangle = { x: dragStart.x + x, y: dragStart.y + y, width, height, color, current: true }
      rectangleBeingDrawn.current = rectangle
    }
    if (dragging) {
      const {
        x: canvasX,
        y: canvasY,
      } = getCanvasSize()
      const x = e.clientX - canvasX
      const y = e.clientY - canvasY
      const width = Math.abs(dragStart.x - x) / canvasWidth
      const height = Math.abs(dragStart.y - y) / canvasHeight
      const color = "red"
      const rectangle = { x: dragStart.x, y: dragStart.y, width, height, color, current: true }
      if (width > 0 && height > 0) {
        rectangleBeingDrawn.current = rectangle
      }
    }
  }

  useEffect(() => {
    resizeRef.current = window.addEventListener('resize', () => {
      setCanvasWidth(window.innerWidth * .8)
      setCanvasHeight(window.innerHeight * .8)
    })

    return () => {
      window.removeEventListener('resize', resizeRef.current)
    }
  }, [])

  useEffect(() => {
    setupCanvas()
  }, [])

  useEffect(() => {
    const render = () => {
      clearCanvas()
      drawRectangles()
      if (rectangleBeingDrawn.current) {
        drawRectangle(rectangleBeingDrawn.current)
      }
      requestAnimationFrame(render)
    }
    renderRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(renderRef.current)
    }
  }, [clearCanvas, drawRectangles, drawRectangle])

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
