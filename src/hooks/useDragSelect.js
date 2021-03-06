import { useState, useRef, createRef, useEffect } from "react";

const useDragSelect = (itemData = []) => {
  const initialItems = [];
  const initialGroups = [];

  itemData.forEach(({ id, group = null, props }) => {
    const ref = createRef();

    initialItems.push({ id, ref, props });

    if (group) {
      if (!initialGroups.includes(group)) {
        initialGroups.push(group);
      }
    }
  });

  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsHistory, setSelectedItemsHistory] = useState([]);
  const [groups, setGroups] = useState(initialGroups);

  const params = useRef({
    isSelectMode: false,
    isAppendMode: false,
    bounds: {},
  });

  const containerRef = useRef();
  const selectionBoxRef = useRef();

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") {
      if (selectedItemsHistory.length > 0) {
        setSelectedItems([
          ...selectedItemsHistory[selectedItemsHistory.length - 1],
        ]);
        setSelectedItemsHistory(
          selectedItemsHistory.slice(0, selectedItemsHistory.length - 1)
        );
      }
    }
  };

  const handleMouseDown = (e) => {
    params.current.isSelectMode = true;
    params.current.bounds.top = e.pageY;
    params.current.bounds.left = e.pageX;
    containerRef.current.classList.add("is-select-mode");
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

      drawSelectionBox(selectionBoxBounds);
    }
  };

  const drawSelectionBox = (bounds) => {
    selectionBoxRef.current.style.top = parseInt(bounds.top) + "px";
    selectionBoxRef.current.style.left = parseInt(bounds.left) + "px";
    selectionBoxRef.current.style.width =
      parseInt(bounds.right - bounds.left) + "px";
    selectionBoxRef.current.style.height =
      parseInt(bounds.bottom - bounds.top) + "px";
  };

  const handleMouseUp = (e) => {
    if (e.shiftKey || e.ctrlKey) {
      params.current.isAppendMode = true;
    }

    if (!params.current.isAppendMode) {
      selectedItems.forEach((item) => {
        item.ref.current.classList.remove("drag-select-selected");
      });
    }

    if (params.current.isSelectMode) {
      params.current.isSelectMode = false;
      params.current.bounds.bottom = e.pageY;
      params.current.bounds.right = e.pageX;
      containerRef.current.classList.remove("is-select-mode");
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

      setSelectedItemsHistory([...selectedItemsHistory, selectedItems]);
      setSelectedItems(intersectingItems);

      params.current.isAppendMode = false;
    }
  };

  const handleMouseOut = (e) => {
    resetSelectionBox();
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

  const getSelectedItems = () => selectedItems;

  const getSelectedItemIds = () => {
    return selectedItems.map((item) => item.id);
  };

  const SelectionBox = () => (
    <div ref={selectionBoxRef} className="selection-box"></div>
  );

  return {
    items,
    selectedItems,
    getSelectedItems,
    getSelectedItemIds,
    SelectionBox,
    attributes: {
      ref: containerRef,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onMouseOut: handleMouseOut,
      onKeyDown: handleKeyDown,
      tabIndex: -1,
    },
  };
};

export default useDragSelect;
