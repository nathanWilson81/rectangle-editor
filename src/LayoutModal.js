import { useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { Save } from "feather-icons-react"

const localStorageKey = "rectangle-editor-layouts"

const modalItemStyles = {
  display: "flex",
  flexDirection: "row",
}

export const LayoutModal = ({
  managedRectangles,
  setManagedRectangles,
  setLayoutModalOpen,
}) => {
  const [currentLayoutName, setCurrentLayoutName] = useState("")
  const [layouts, setLayouts] = useState(
    JSON.parse(localStorage.getItem(localStorageKey))
  )
  const getItems = useCallback(() => {
    return JSON.parse(localStorage.getItem(localStorageKey))
  }, [])

  const saveLayout = useCallback(() => {
    const currentItems = getItems()
    const isRename = currentItems.find(
      (item) => item.name === currentLayoutName
    )
    const itemToAdd = { name: currentLayoutName, items: managedRectangles }
    if (isRename) {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify(
          currentItems.map((item) =>
            item.name === currentLayoutName ? itemToAdd : item
          )
        )
      )
    } else {
      if (currentItems) {
        localStorage.setItem(
          localStorageKey,
          JSON.stringify([...currentItems, itemToAdd])
        )
        setLayouts([...currentItems, itemToAdd])
      } else {
        localStorage.setItem(localStorageKey, JSON.stringify([itemToAdd]))
        setLayouts([itemToAdd])
      }
    }
    setLayoutModalOpen(false)
  }, [managedRectangles, currentLayoutName, getItems, setLayoutModalOpen])

  const selectLayout = useCallback(
    (e) => {
      const layoutName = e.target.value
      const currentItems = getItems()
      const layoutToLoad = currentItems.find((item) => item.name === layoutName)
      setManagedRectangles(layoutToLoad.items)
    },
    [setManagedRectangles, getItems]
  )

  const deleteLayout = useCallback(
    (e) => {
      const layoutName = e.target.value
      const currentItems = getItems()
      const newLayoutList = currentItems.filter(
        (item) => item.name !== layoutName
      )
      setLayouts(newLayoutList)
      setLayoutModalOpen(false)
      localStorage.setItem(localStorageKey, JSON.stringify(newLayoutList))
    },
    [setLayouts, setLayoutModalOpen, getItems]
  )

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "lightgray",
        opacity: 0.8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          height: "50%",
          width: "50%",
          background: "white",
          borderRadius: "1rem",
          textAlign: "center",
        }}
      >
        <h1>Layout Management</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={modalItemStyles}>
            <p>Rename current Layout: </p>
            <input
              value={currentLayoutName}
              onChange={(e) => setCurrentLayoutName(e.target.value)}
            />
          </div>
          <div style={modalItemStyles}>
            <p>Save current Layout: </p>
            <Save onClick={saveLayout} />
          </div>
          <div style={modalItemStyles}>
            <p>Load Layout: </p>
            <select onChange={selectLayout}>
              {layouts?.map((layout) => (
                <option key={layout.name} value={layout.name}>
                  {layout.name}
                </option>
              ))}
            </select>
          </div>
          <div style={modalItemStyles}>
            <p>Delete Layout: </p>
            <select onChange={deleteLayout}>
              {layouts?.map((layout) => (
                <option key={layout.name} value={layout.name}>
                  {layout.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  )
}

export default LayoutModal
