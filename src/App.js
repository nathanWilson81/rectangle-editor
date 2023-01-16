import { useEffect } from 'react'

import './App.css';

const rectanglesOnMount = [{ x: 5, y: 5, width: 250, height: 350 }]

const drawRectangle = ({ x, y, width, height }) => {
  const canvas = document.getElementById("rectangle-editor")
  const ctx = canvas.getContext("2d")
  ctx.beginPath();
  ctx.lineWidth = "6";
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red"
  ctx.rect(x, y, width, height);
  ctx.fill();
}

function App() {
  useEffect(() => {
    rectanglesOnMount.map(drawRectangle)
  }, [])
  return (
    <div className="App">
      <canvas id="rectangle-editor" width="1280" height="720" />
    </div>
  );
}

export default App;
