import "./Selection.css";
import { useReducer } from "react";

/*
Component manages the input choice for rows and cols of the maze and passes that information back to the app
I decided to practice using useReducer to manage state
I know it's not necessary as the state is small
*/

const initialState = {
  rowInput: undefined,
  colInput: undefined,
};

const ACTIONS = {
  ROW: "ROW",
  COL: "COL",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ROW:
      return { ...state, rowInput: action.payload };
    case ACTIONS.COL:
      return { ...state, colInput: action.payload };
    default:
      return state;
  }
}

function Selection({ initializeDimensions }) {
  const [inputState, dispatch] = useReducer(reducer, initialState);

  function handleClick() {
    initializeDimensions(inputState.rowInput, inputState.colInput);
  }
  return (
    <>
      <label>Enter Rows:</label>
      <input
        onChange={(e) =>
          dispatch({ type: ACTIONS.ROW, payload: e.target.value })
        }
        className="dimension"
        id="row"
      ></input>
      <label>Enter Columns:</label>
      <input
        onChange={(e) =>
          dispatch({ type: ACTIONS.COL, payload: e.target.value })
        }
        className="dimension"
        id="col"
      ></input>
      <button onClick={handleClick}>Create Maze</button>
      <button onClick={() => window.print()}>Print</button>
    </>
  );
}

export default Selection;
