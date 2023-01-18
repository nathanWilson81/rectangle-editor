import { useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { Save } from "feather-icons-react"

const localStorageKey = "rectangle-editor-layouts"

const modalItemStyles = {
  display: "flex",
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
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
      setLayoutModalOpen(false)
    },
    [setManagedRectangles, getItems, setLayoutModalOpen]
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
      onClick={() => setLayoutModalOpen(false)}
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
        <h1>Layout Management</h1>
        <div
          style={{ display: "flex", flexDirection: "column", padding: "2rem" }}
        >
          <div style={modalItemStyles}>
            <p>Name current Layout: </p>
            <input
              style={{ width: "50%" }}
              value={currentLayoutName}
              placeholder="Reuse the same name to override"
              onChange={(e) => setCurrentLayoutName(e.target.value)}
            />
          </div>
          <div style={modalItemStyles}>
            <p>Save current Layout: </p>
            <button disabled={!currentLayoutName} onClick={saveLayout}>
              <Save />
            </button>
          </div>
          <div style={modalItemStyles}>
            <p>Load Layout: </p>
            <select style={{ width: "50%" }} onChange={selectLayout}>
              {layouts?.map((layout) => (
                <>
                  <option style={{ display: "none" }} key="empty" label="" />
                  <option key={layout.name} value={layout.name}>
                    {layout.name}
                  </option>
                </>
              ))}
            </select>
          </div>
          <div style={modalItemStyles}>
            <p>Delete Layout: </p>
            <select style={{ width: "50%" }} onChange={deleteLayout}>
              {layouts?.map((layout) => (
                <>
                  <option style={{ display: "none" }} key="empty" label="" />
                  <option key={layout.name} value={layout.name}>
                    {layout.name}
                  </option>
                </>
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
