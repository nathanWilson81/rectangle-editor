import { createPortal } from "react-dom"

export const InfoModal = ({ setInfoModalOpen }) => {
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "lightgray",
        opacity: 0.95,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => setInfoModalOpen(false)}
    >
      <div
        style={{
          width: "50%",
          background: "white",
          borderRadius: "1rem",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Information</h1>
        <ul>
          <li>Made using Canvas</li>
          <li>Draw squares using your mouse or touch</li>
          <li>
            Drag the squares around by clicking near the center of the square
            and dragging
          </li>
          <li>To resize a square, drag near the edges</li>
          <li>Clicking a square will let you change it's color or delete it</li>
        </ul>
      </div>
    </div>,
    document.getElementById("modal-root")
  )
}

export default InfoModal
