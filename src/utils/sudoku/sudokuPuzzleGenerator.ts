// This generator is an extremely simplified version of a soduku generator
// real generators should be based off of: https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf

import { GRID_SIZE, SUBGRID_SIZE } from "@/components/Sudoku/config";
import { getShuffledNumbers, isValid } from "./helpers";

// Create an empty 9x9 grid filled with zeros
const createEmptyGrid = (): number[][] => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const fillGrid = (grid: number[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        const numbers = getShuffledNumbers(); // Get random order of numbers
        for (let num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num; // Place the number

            if (fillGrid(grid)) {
              return true; // If grid is successfully filled, return true
            }

            grid[row][col] = 0; // Backtrack if placing the number doesn't work
          }
        }
        return false; // If no number fits, return false to backtrack
      }
    }
  }
  return true; // Return true if the entire grid is filled
};

// Function to check if a puzzle has a unique solution
const hasUniqueSolution = (grid: number[][]): boolean => {
  let solutions = 0;

  const countSolutions = (grid: number[][]): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col] === 0) {
          const numbers = getShuffledNumbers();
          for (let num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;

              if (countSolutions(grid)) {
                solutions++;
                if (solutions > 1) return false; // More than one solution found
              }

              grid[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid solution for this cell
        }
      }
    }
    return true;
  };

  countSolutions(grid);
  return solutions === 1;
};

const getRandomNumberFromRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRemovalAttempts = (difficulty: string): number => {
  switch (difficulty) {
    case "easy": return getRandomNumberFromRange(32, 45);
    case "medium": return getRandomNumberFromRange(46, 49);
    case "hard": return getRandomNumberFromRange(50, 58);
    default: return 35;
  }
}

// Generate a Sudoku puzzle with a unique solution
export const generateSudokuPuzzle = (difficulty: string): number[][] => {
  const grid = createEmptyGrid();
  // const shuffledCells = getShuffledCells();
  fillGrid(grid); // Fill the grid with a valid solution

  let puzzleGrid = grid.map(row => row.slice()); // Clone the filled grid

  // Remove numbers from the board
  let cellsToRemove = getRemovalAttempts(difficulty)
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (puzzleGrid[row][col] !== 0) {
      const temp = puzzleGrid[row][col];
      puzzleGrid[row][col] = 0;
      if (!hasUniqueSolution(puzzleGrid)) {
        puzzleGrid[row][col] = temp; // Revert if it breaks uniqueness
      } else {
        cellsToRemove--;
      }
    }
  }

  return puzzleGrid;
};

