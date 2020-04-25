import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css'

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]


const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
}

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });
 
  const [running, setRunning] = useState(false);

  const clickGridHandler = (i: number, j: number) => {
    const newGrid = produce(grid, gridCopy => {
      gridCopy[i][j] = grid[i][j] ? 0 : 1;
    });
    setGrid(newGrid);
  }

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    })
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <h1>
      Game of Life
      </h1>
      <div className="Buttons">
      <button onClick={() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}>{running ? 'STOP' : 'START'}</button>
      <button onClick={() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
          rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0));
        }
        setGrid(rows);
      }}>
        RANDOM
      </button>
      <button onClick={() => {
        setGrid(generateEmptyGrid())
      }}>
        CLEAR
      </button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        <div className="Grids">
        {grid.map((rows, i) => rows.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              clickGridHandler(i, j);
            }}
            style={{
              width: '20px',
              height: '20px',
              boxSizing: 'border-box',
              backgroundColor: grid[i][j] ? 'pink' : undefined,
              border: 'solid 1px black'
            }}
          />
        )))}
        </div>
      </div>
    </>
  )
};

export default App;
