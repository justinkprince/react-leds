import { useState, useEffect, useRef, createRef } from "react";
import { useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper";

// import config from "../../data/test-config";
import { selectLeds, selectShelves } from "../../store/configSlice";
import Shelf from "./Shelf";
import useDragSelect from "../../hooks/useDragSelect";

const LedConsole = () => {
  const ledConfig = useSelector(selectLeds);
  const shelfConfig = useSelector(selectShelves);
  const [that, setThat] = useState(0);

  const ledData = ledConfig?.map((led, index) => {
    return {
      id: index,
      group: led.group,
      props: {
        color: led.color,
        group: led.group,
      },
    };
  });

  const selectable = useDragSelect();

  const leds = selectable.items;

  useEffect(() => {
    selectable.items = ledConfig;
  }, [ledConfig]);

  console.log(selectable.items);

  if (selectable.items.length < 1) {
    return <div onClick={() => setThat(that + 1)}>Loading {that}</div>;
  }

  const shelves = [...shelfConfig];

  const selectedLedIds = selectable.getSelectedItemIds();
  const { SelectionBox } = selectable;

  let shelfIndex = 0;
  let shelfLimit = shelves[shelfIndex].numLeds;
  let longestCount = 0;

  shelves[shelfIndex].leds = [];

  leds.forEach((led, index) => {
    if (index >= shelfLimit) {
      shelfIndex++;
      shelfLimit += shelves[shelfIndex].numLeds;
      shelves[shelfIndex].leds = [];
    }

    shelves[shelfIndex].leds.push(led);
  });

  return (
    <Paper>
      <div className="led-console" {...selectable.attributes}>
        <SelectionBox />

        {shelves.map((shelf, index) => {
          return (
            <Shelf
              key={`${shelf.name}-${index}`}
              name={shelf.name}
              leds={shelf.leds}
              selectedLedIds={selectedLedIds}
            />
          );
        })}

        <h1 style={{ color: "white" }}>{selectable.selectedItems.length}</h1>
        <h4 style={{ color: "white" }}>
          {JSON.stringify(selectable.getSelectedItemIds())}
        </h4>
      </div>
    </Paper>
  );
};

export default LedConsole;
