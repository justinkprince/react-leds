import { useState, useRef, createRef } from "react";
import DragSelect from "./drag-select/DragSelect";
import Container from "./Container";
import Item from "./Item";

import "./App.scss";

const getKey = () => Math.floor(Math.random() * 10000) + 100;

const itemFactory = (num) => {
  const items = Array(num)
    .fill(1)
    .map((_, index) => {
      const ref = createRef();

      return {
        id: index,
        ref,
        Component: Item,
      };
    });

  return items;
};

const items = itemFactory(149);

const App = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  // const [items, setItems] = useState([]);

  const params = useRef({
    isSelectMode: false,
    isAppendMode: false,
    bounds: {},
  });

  const selectionBoxRef = useRef();

  const handleMouseDown = (e) => {
    if (e.shiftKey || e.ctrlKey) {
      params.current.isAppendMode = true;
    }

    if (!params.current.isAppendMode) {
      selectedItems.forEach((item) => {
        item.ref.current.classList.remove("selected");
      });
    }

    params.current.isSelectMode = true;
    params.current.bounds.top = e.pageY;
    params.current.bounds.left = e.pageX;
    selectionBoxRef.current.classList.add("is-select-mode");
  };

  const handleMouseMove = (e) => {
    if (params.current.isSelectMode) {
      const nowTop = e.pageY;
      const nowLeft = e.pageX;

      const selectionBoxBounds = {
        top: Math.min(params.current.bounds.top, nowTop),
        left: Math.min(params.current.bounds.left, nowLeft),
        bottom: Math.max(params.current.bounds.top, nowTop),
        right: Math.max(params.current.bounds.left, nowLeft),
      };

      selectionBoxRef.current.style.top = selectionBoxBounds.top + "px";
      selectionBoxRef.current.style.left = selectionBoxBounds.left + "px";
      selectionBoxRef.current.style.width =
        selectionBoxBounds.right - selectionBoxBounds.left + "px";
      selectionBoxRef.current.style.height =
        selectionBoxBounds.bottom - selectionBoxBounds.top + "px";
    }
  };

  const handleMouseUp = (e) => {
    if (params.current.isSelectMode) {
      params.current.isSelectMode = false;
      params.current.bounds.bottom = e.pageY;
      params.current.bounds.right = e.pageX;
      selectionBoxRef.current.classList.remove("is-select-mode");
      resetSelectionBox();

      let intersectingItems = getIntersectingItems(
        items,
        params.current.bounds
      );

      if (params.current.isAppendMode) {
        // If there's more than one, just add them as selected items.
        if (intersectingItems.length > 1) {
          intersectingItems = [
            ...new Set([...selectedItems, ...intersectingItems]),
          ];
        } else {
          // Else, it's a single click and we just allow for the single item to
          // toggle on AND off.
          const mergedSet = [
            ...new Set([...selectedItems, ...intersectingItems]),
          ];
          intersectingItems = mergedSet.filter((item) => {
            return !(
              selectedItems.find(
                (selectedItem) => selectedItem.id === item.id
              ) &&
              intersectingItems.find(
                (intersectingItem) => intersectingItem.id === item.id
              )
            );
          });
        }
      }

      setSelectedItems(intersectingItems);

      params.current.isAppendMode = false;
    }
  };

  const resetSelectionBox = () => {
    selectionBoxRef.current.style.width = 0;
    selectionBoxRef.current.style.height = 0;
  };

  const getIntersectingItems = (items, bounds) => {
    bounds = {
      top: Math.min(bounds.top, bounds.bottom),
      left: Math.min(bounds.left, bounds.right),
      bottom: Math.max(bounds.top, bounds.bottom),
      right: Math.max(bounds.left, bounds.right),
    };

    return items.filter(({ ref, id }) => {
      const el = ref.current;
      const itemRect = el.getBoundingClientRect();
      const item = {
        top: itemRect.top + window.scrollY,
        left: itemRect.left + window.scrollX,
        bottom: itemRect.bottom + window.scrollY,
        right: itemRect.right + window.scrollX,
      };

      const isIntersecting = !(
        bounds.top > item.bottom ||
        bounds.right < item.left ||
        bounds.bottom < item.top ||
        bounds.left > item.right
      );

      return isIntersecting;
    });
  };

  return (
    <div
      className="App"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div ref={selectionBoxRef} className="selection-box"></div>

      <div className="shelf">
        {items.map(({ Component, ref: itemRef, id }) => {
          const isSelected = selectedItems?.find((selectedItem) => {
            return selectedItem.id === id;
          });

          return (
            <Component key={id} id={id} ref={itemRef} isSelected={isSelected} />
          );
        })}
      </div>

      <h1>{selectedItems.length}</h1>
    </div>
  );
};

export default App;
