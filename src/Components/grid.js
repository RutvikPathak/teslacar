import React from 'react';
import Car from './car';

const Grid = ({ grid, handleCellClick, carPosition, allPaths, bestPath }) => {
  // Check if the cell is part of any path
  const isPathCell = (row, col) => {
    return allPaths.some(path => path.some(point => point.row === row && point.col === col));
  };

  // Check if the cell is part of the best path
  const isBestPathCell = (row, col) => {
    return bestPath.some(point => point.row === row && point.col === col);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(50, 20px)' }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: cell.isWall
                ? 'black'
                : cell.isEntrance
                ? 'green'
                : cell.isExit
                ? 'red'
                : isBestPathCell(rowIndex, colIndex)
                ? 'yellow' // Color for the best path
                : isPathCell(rowIndex, colIndex)
                ? 'yellow' // Color for all paths
                : 'white',
              border: '1px solid gray',
              position: 'relative',
            }}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {carPosition &&
              carPosition.row === rowIndex &&
              carPosition.col === colIndex && (
                <Car carPosition={carPosition} />
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default Grid;
