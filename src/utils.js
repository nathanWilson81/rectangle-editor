export const canvasId = "rectangle-editor"
export const getCanvasSize = () => {
  const { x, y } = document.getElementById(canvasId).getBoundingClientRect()
  return { x, y }
}
export const isMouseWithinExistingRect = (rects, mouseX, mouseY) => {
  const isWithinRect = (rect) => {
    const { x, y, width, height } = rect
    const xLimit = x + width
    const yLimit = y + height
    const withinX = mouseX > x && mouseX < xLimit
    const withinY = mouseY > y && mouseY < yLimit
    return withinX && withinY ? rect : false
  }
  return rects.filter(isWithinRect)
}

export const isMouseCloseToEdges = (rects, mouseX, mouseY) => {
  const threshhold = 5
  const isWithinThreshold = (point1, point2) => {
    return Math.abs(point1 - point2) < threshhold
  }
  const isNearRectEdge = (rect) => {
    const { x, y, width, height } = rect
    if (isWithinThreshold(mouseX, x) && isWithinThreshold(mouseY, y)) {
      return {
        direction: "topLeft",
        rect,
      }
    } else if (
      isWithinThreshold(mouseX, x + width) &&
      isWithinThreshold(mouseY, y)
    ) {
      return {
        direction: "topRight",
        rect,
      }
    } else if (
      isWithinThreshold(mouseX, x) &&
      isWithinThreshold(mouseY, y + height)
    ) {
      return {
        direction: "bottomLeft",
        rect,
      }
    } else if (
      isWithinThreshold(mouseX, x + width) &&
      isWithinThreshold(mouseY, y + height)
    ) {
      return {
        direction: "bottomRight",
        rect,
      }
    }
    return false
  }
  return rects.map(isNearRectEdge).filter(Boolean)
}
