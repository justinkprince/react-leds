import React from "react";

const Item = React.forwardRef((props, ref) => {
  const isSelected = props.isSelected ?? false;

  return <div ref={ref} className={`item ${isSelected ? "selected" : ""}`} />;
});

export default Item;
