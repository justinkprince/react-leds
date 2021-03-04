import React from "react";

const Led = React.forwardRef((props, ref) => {
  const isSelected = props.isSelected ?? false;
  const color = props.color;
  const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <div ref={ref} className={`led ${isSelected ? "selected" : ""}`}>
      <div className="bulb" style={{ backgroundColor: rgb }} />
      <div className="shine" />
    </div>
  );
});

export default Led;
