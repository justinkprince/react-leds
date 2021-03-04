import React from "react";

const Container = ({ shelf, items }) => {
  return (
    <div>
      {items}
      {/* {items.map((Item, index) => {
        return <Item key={`${shelf}-${index}`} />;
      })} */}
    </div>
  );
};

export default Container;
