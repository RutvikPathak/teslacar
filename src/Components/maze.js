import React, { useState, useEffect } from 'react';
import Grid from './grid';

const Maze = () => {
  const [grid, setGrid] = useState([]);
  const [isSelectingStart, setIsSelectingStart] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [isPlacingObstacles, setIsPlacingObstacles] = useState(false);
  const [carPosition, setCarPosition] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [allPaths, setAllPaths] = useState([]);
  const [bestPath, setBestPath] = useState([]);

  // Initialize the grid on component mount
  useEffect(() => {
    const initialGrid = createGrid();
    setGrid(initialGrid);
  }, []);

  // Create a 50x50 grid with walls around the perimeter and two openings for entrance and exit
  const createGrid = () => {
    const grid = Array(50)
      .fill(null)
      .map(() => Array(50).fill({ isWall: false }));

    for (let i = 0; i < 50; i++) {
      grid[0][i] = { isWall: true };
      grid[49][i] = { isWall: true };
      grid[i][0] = { isWall: true };
      grid[i][49] = { isWall: true };
    }

    return grid;
  };

  // Handle cell click events to set start, end points, and place obstacles
  const handleCellClick = (row, col) => {
    const newGrid = grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (isSelectingStart) {
            setStartPoint({ row, col });
            setCarPosition({ row, col });
            return { ...cell, isEntrance: true, isWall: false };
          } else if (isSelectingEnd) {
            setEndPoint({ row, col });
            return { ...cell, isExit: true, isWall: false };
          } else if (isPlacingObstacles && !cell.isEntrance && !cell.isExit) {
            return { ...cell, isWall: true };
          }
        }
        return cell;
      })
    );
    setGrid(newGrid);
    setIsSelectingStart(false);
    setIsSelectingEnd(false);
  };

  // Place obstacles randomly in the grid
  const placeObstaclesRandomly = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => {
        if (!cell.isEntrance && !cell.isExit && Math.random() < 0.2) {
          return { ...cell, isWall: true };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  // Start the car journey using pathfinding logic
  const startJourney = () => {
    if (!startPoint || !endPoint) return;
    const { allPaths, bestPath } = findPaths(grid, startPoint, endPoint);
    setAllPaths(allPaths || []);
    setBestPath(bestPath || []);

    let index = 0;
    const interval = setInterval(() => {
      if (index < bestPath.length) {
        setCarPosition(bestPath[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);
  };

  // Find all paths and the best path from start to end points
  const findPaths = (grid, start, end) => {
    const queue = [[start]];
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];
    const visited = new Set();
    const allPaths = [];

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      const key = `${current.row}-${current.col}`;

      if (current.row === end.row && current.col === end.col) {
        allPaths.push(path);
        continue;
      }

      visited.add(key);

      directions.forEach((dir) => {
        const next = { row: current.row + dir.row, col: current.col + dir.col };
        const nextKey = `${next.row}-${next.col}`;

        if (
          next.row >= 0 &&
          next.row < 50 &&
          next.col >= 0 &&
          next.col < 50 &&
          !grid[next.row][next.col].isWall &&
          !visited.has(nextKey)
        ) {
          queue.push([...path, next]);
          visited.add(nextKey);
        }
      });
    }

    const bestPath = allPaths.reduce((shortest, currentPath) => {
      return currentPath.length < shortest.length ? currentPath : shortest;
    }, allPaths[0] || []);

    return { allPaths, bestPath };
  };

  // Clear all settings and reset the grid
  const clearAll = () => {
    setGrid(createGrid());
    setCarPosition(null);
    setStartPoint(null);
    setEndPoint(null);
    setAllPaths([]);
    setBestPath([]);
  };

  return (
    <div className="maze">
      <button onClick={() => setIsSelectingStart(true)}>Set Start Point</button>
      <button onClick={() => setIsSelectingEnd(true)}>Set End Point</button>
      <button onClick={() => setIsPlacingObstacles(true)}>Place Custom Obstacles</button>
      <button onClick={placeObstaclesRandomly}>Place Random Obstacles</button>
      <button onClick={startJourney}>Start Journey</button>
      <button onClick={clearAll}>Clear All</button>
      <Grid grid={grid} handleCellClick={handleCellClick} carPosition={carPosition} allPaths={allPaths} bestPath={bestPath} />
    </div>
  );
};

export default Maze;





