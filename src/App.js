import { useEffect } from "react"

import "./App.css"

const rectanglesOnMount = [
  { x: 5, y: 5, width: 250, height: 350, color: "red" },
]

const drawRectangle = ({ x, y, width, height, color }) => {
  const canvas = document.getElementById("rectangle-editor")
  const ctx = canvas.getContext("2d")
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.rect(x, y, width, height)
  ctx.fill()
}

function App() {
  useEffect(() => {
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
        style={{ border: "1px solid black", height: "80%", width: "80%" }}
        id="rectangle-editor"
      />
    </div>
  )
}

export default App
