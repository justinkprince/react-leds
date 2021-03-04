import { useState } from "react";

const DragSelect = ({ refs, children }) => {
  const [items, setItems] = useState([]);
  refs.forEach((ref) => {
    ref.current = [items, setItems];
  });

  console.log(refs);

  return (
    <div>
      <h2 onClick={(e) => console.log(refs)}>Drag select</h2>
      {children}
    </div>
  );
};

export default DragSelect;
