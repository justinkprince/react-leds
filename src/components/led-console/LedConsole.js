import { useState, useRef, createRef } from "react";
import Paper from "@material-ui/core/Paper";

import config from "../../data/test-config";
import Shelf from "./Shelf";
import useDragSelect from "../../hooks/useDragSelect";

const ledConfig = config.leds;
const shelves = config.shelves;

const LedConsole = () => {
  const ledData = ledConfig.map((led, index) => {
    return {
      id: index,
      group: led.group,
      props: {
        color: led.color,
        group: led.group,
      },
    };
  });

  const selectable = useDragSelect(ledData);

  const leds = selectable.items;
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

        {/* <div className="shelf">
          {leds.map(({ id, ref, props }) => (
            <Led
              key={id}
              ref={ref}
              isSelected={selectedLedIds.includes(id)}
              {...props}
            />
          ))}
        </div> */}

        <h1 style={{ color: "white" }}>{selectable.selectedItems.length}</h1>
        <h4 style={{ color: "white" }}>
          {JSON.stringify(selectable.getSelectedItemIds())}
        </h4>
      </div>
    </Paper>
  );
};

export default LedConsole;
