class ChessGraph {
  constructor(size = 8) {
    this.size = size;
    this.adjacencyList = {};
    this.initGraph();
  }

  initGraph() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const pos = this.positionKey(row, col);
        this.adjacencyList[pos] = [];
      }
    }
    this.addAllEdges();
  }

  positionKey(row, col) {
    return `${row},${col}`;
  }

  addAllEdges() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.addEdgesForPosition(row, col);
      }
    }
  }

  addEdgesForPosition(row, col) {
    const moves = [
      [row - 2, col - 1],
      [row - 2, col + 1],
      [row - 1, col - 2],
      [row - 1, col + 2],
      [row + 1, col - 2],
      [row + 1, col + 2],
      [row + 2, col - 1],
      [row + 2, col + 1],
    ];

    moves.forEach(([newRow, newCol]) => {
      if (this.isValidPosition(newRow, newCol)) {
        const currentPos = this.positionKey(row, col);
        const newPos = this.positionKey(newRow, newCol);
        this.adjacencyList[currentPos].push(newPos);
      }
    });
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  bfsShortestPath(start, target) {
    // Convert positions to row, col integers to check bounds
    const [startRow, startCol] = start.split(',').map(Number);
    const [targetRow, targetCol] = target.split(',').map(Number);

    // Validate positions
    if (!this.isValidPosition(startRow, startCol) || !this.isValidPosition(targetRow, targetCol)) {
      throw new Error('Move is outside the bounds of the board.');
    }

    const queue = [start];
    const visited = new Set([start]);
    const previous = { [start]: null };

    while (queue.length) {
      const vertex = queue.shift();
      if (vertex === target) {
        return this.reconstructPath(previous, target);
      }

      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          previous[neighbor] = vertex;
        }
      });
    }

    return []; // Return an empty array if no path is found
  }

  reconstructPath(previous, target) {
    const path = [];
    let current = target;
    while (current !== null) {
      path.push(current);
      current = previous[current];
    }
    return path.reverse();
  }
}

// Correct usage
const chessBoard = new ChessGraph(8);
const start = chessBoard.positionKey(0, 0); // Convert position to the correct format
const target = chessBoard.positionKey(3, 3);
console.log(chessBoard.adjacencyList);
console.log(chessBoard.bfsShortestPath(start, target));
