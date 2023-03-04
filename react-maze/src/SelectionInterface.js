import "./SelectionInterface.css";
import { useRef } from "react";

function SelectionInterface(props) {
  let rowInput = useRef();
  let colInput = useRef();

  function handleClick() {
    props.initializeDimensions(rowInput.current.value, colInput.current.value);
  }
  return (
    <>
      <label>Enter Rows:</label>
      <input ref={rowInput} className="dimension" id="row"></input>
      <label>Enter Columns:</label>
      <input ref={colInput} className="dimension" id="col"></input>
      <button onClick={handleClick} className="createMaze">
        Create Maze
      </button>
    </>
  );
}

export default SelectionInterface;
