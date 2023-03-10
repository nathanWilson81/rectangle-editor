import "./App.css"

import { useEffect, useState, useCallback, useRef } from "react"

import { Trash2, XCircle, Archive, Info } from "feather-icons-react"
import { v4 as uuid } from "uuid"
import {
  isMouseWithinExistingRect,
  getCanvasSize,
  canvasId,
  isMouseCloseToEdges,
} from "./utils"

import LayoutModal from "./LayoutModal"
import InfoModal from "./InfoModal"

const getCanvasContext = () => {
  const canvas = document.getElementById(canvasId)
  return canvas.getContext("2d")
}

const setupCanvas = () => {
  const ctx = getCanvasContext()
  ctx.scale(1, 1)
}

const ButtonStyles = {
  marginRight: "1rem",
  height: "48px",
}

function App() {
  const [dragStart, setDragStart] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [moving, setMoving] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [layoutModalOpen, setLayoutModalOpen] = useState(false)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [managedRectangles, setManagedRectangles] = useState([])
  const [currentRect, setCurrentRect] = useState(null)
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.8)
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.8)
  const [drawColor, setDrawColor] = useState("#ff0000")
  const rectangleBeingDrawn = useRef(null)
  const resizeRef = useRef(null)
  const renderRef = useRef(null)

  const drawRectangle = useCallback(
    ({ x, y, width, height, color, current }) => {
      const ctx = getCanvasContext()
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.rect(x, y, width, height)
      ctx.fill()
      if (current || currentRect?.x === x) {
        ctx.beginPath()
        ctx.lineWidth = "2"
        ctx.strokeStyle = "green"
        ctx.rect(x, y, width, height)
        ctx.stroke()
      }
    },
    [currentRect]
  )

  const drawRectangles = useCallback(() => {
    managedRectangles.map(drawRectangle)
  }, [managedRectangles, drawRectangle])

  const clearCanvas = useCallback(() => {
    const ctx = getCanvasContext()
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  }, [canvasHeight, canvasWidth])

  const onMouseDown = (e) => {
    e.preventDefault()
    const { x: canvasX, y: canvasY } = getCanvasSize()
    const x = e.clientX - canvasX
    const y = e.clientY - canvasY
    const isWithinExistingRect = isMouseWithinExistingRect(
      managedRectangles,
      x,
      y
    )
    const isCloseToEdges = isMouseCloseToEdges(managedRectangles, x, y)
    setDragStart({ x, y })
    if (isCloseToEdges.length > 0) {
      setResizing(isCloseToEdges[0])
      setCurrentRect({ ...isCloseToEdges[0] })
    } else if (isWithinExistingRect.length > 0) {
      setMoving(true)
      setCurrentRect({ ...isWithinExistingRect[0] })
    } else {
      setCurrentRect(null)
      setDragging(true)
    }
  }

  const onMouseUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    setMoving(false)
    setResizing(false)
    if (rectangleBeingDrawn.current?.width) {
      setManagedRectangles([
        ...managedRectangles,
        { ...rectangleBeingDrawn.current, current: false, id: uuid() },
      ])
    }
    rectangleBeingDrawn.current = null
  }

  const getRelativeXandY = (e) => {
    const { x: canvasX, y: canvasY } = getCanvasSize()
    const x = e.clientX - canvasX
    const y = e.clientY - canvasY
    return { x, y }
  }

  const handleResizing = (e) => {
    const { direction, rect } = resizing
    setManagedRectangles(managedRectangles.filter((r) => r.id !== rect.id))
    clearCanvas()

    const { x, y } = getRelativeXandY(e)

    if (direction === "bottomRight") {
      const rectangle = {
        ...rect,
        width: rect.width - (dragStart.x - x),
        height: rect.height - (dragStart.y - y),
      }
      rectangleBeingDrawn.current = rectangle
    } else if (direction === "bottomLeft") {
      const rectangle = {
        ...rect,
        x,
        width: rect.x + (dragStart.x - x),
        height: rect.height - (dragStart.y - y),
      }
      rectangleBeingDrawn.current = rectangle
    } else if (direction === "topLeft") {
      const rectangle = {
        ...rect,
        x,
        y,
        width: rect.x + (dragStart.x - x),
        height: rect.y + (dragStart.y - y),
      }
      rectangleBeingDrawn.current = rectangle
    } else {
      const rectangle = {
        ...rect,
        y,
        width: rect.x - (dragStart.x - x),
        height: rect.height + (dragStart.y - y),
      }
      rectangleBeingDrawn.current = rectangle
    }
  }

  const handleMoving = (e) => {
    setManagedRectangles(
      managedRectangles.filter((rect) => rect.id !== currentRect.id)
    )
    const { x: canvasX, y: canvasY } = getCanvasSize()
    const x = e.clientX - canvasX - dragStart.x
    const y = e.clientY - canvasY - dragStart.y
    const { width, height, color } = currentRect
    const rectangle = {
      x: dragStart.x + x,
      y: dragStart.y + y,
      width,
      height,
      color,
      current: true,
    }
    rectangleBeingDrawn.current = rectangle
  }

  const handleDragging = (e) => {
    const { x, y } = getRelativeXandY(e)
    const width = Math.abs(dragStart.x - x)
    const height = Math.abs(dragStart.y - y)
    const color = drawColor
    const rectangle = {
      x: dragStart.x,
      y: dragStart.y,
      width,
      height,
      color,
      current: true,
    }
    if (width > 0 && height > 0) {
      rectangleBeingDrawn.current = rectangle
    }
  }

  const onMouseMove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (resizing) {
      handleResizing(e)
    }
    if (moving) {
      handleMoving(e)
    }
    if (dragging) {
      handleDragging(e)
    }
  }

  const onDeleteRect = useCallback(() => {
    setManagedRectangles(
      managedRectangles.filter((rect) => rect.id !== currentRect.id)
    )
    setCurrentRect(null)
  }, [managedRectangles, setManagedRectangles, currentRect])

  const onColorChange = useCallback(
    (e) => {
      const color = e.target.value
      setDrawColor(color)
      if (currentRect) {
        setManagedRectangles(
          managedRectangles.map((rect) =>
            rect.id === currentRect.id ? { ...currentRect, color } : rect
          )
        )
      }
    },
    [currentRect, managedRectangles, setManagedRectangles]
  )

  const onClearBoard = useCallback(() => {
    setManagedRectangles([])
  }, [setManagedRectangles])

  useEffect(() => {
    setupCanvas()
  }, [])

  useEffect(() => {
    resizeRef.current = window.addEventListener("resize", () => {
      setCanvasWidth(window.innerWidth * 0.8)
      setCanvasHeight(window.innerHeight * 0.8)
    })

    return () => {
      window.removeEventListener("resize", resizeRef.current)
    }
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
      className="App"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {layoutModalOpen && (
        <LayoutModal
          setLayoutModalOpen={setLayoutModalOpen}
          managedRectangles={managedRectangles}
          setManagedRectangles={setManagedRectangles}
        />
      )}
      {infoModalOpen && <InfoModal setInfoModalOpen={setInfoModalOpen} />}
      <div>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button style={ButtonStyles} onClick={() => setInfoModalOpen(true)}>
            <Info />
          </button>
          <button
            style={ButtonStyles}
            disabled={!currentRect}
            onClick={onDeleteRect}
          >
            <p>Delete Selected</p>
            <Trash2 />
          </button>
          <button style={ButtonStyles} onClick={onClearBoard}>
            <p>Clear All</p>
            <XCircle />
          </button>
          <button style={ButtonStyles} onClick={() => setLayoutModalOpen(true)}>
            <p>Sessions</p>
            <Archive />
          </button>
          <input type="color" value={drawColor} onChange={onColorChange} />
        </div>
        <canvas
          style={{
            border: "2px solid black",
            borderRadius: "1rem",
            touchAction: "none",
          }}
          height={canvasHeight}
          width={canvasWidth}
          onPointerDown={onMouseDown}
          onPointerUp={onMouseUp}
          onPointerMove={onMouseMove}
          id={canvasId}
        />
      </div>
    </div>
  )
}

export default App
