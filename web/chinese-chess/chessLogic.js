// 象棋游戏逻辑

// 初始棋盘布局
export const initialBoard = [
  // 黑方 (顶部)
  [
    { type: 'chariot', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'advisor', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'advisor', color: 'black' },
    { type: 'elephant', color: 'black' },
    { type: 'horse', color: 'black' },
    { type: 'chariot', color: 'black' }
  ],
  [null, null, null, null, null, null, null, null, null],
  [null, { type: 'cannon', color: 'black' }, null, null, null, null, null, { type: 'cannon', color: 'black' }, null],
  [{ type: 'pawn', color: 'black' }, null, { type: 'pawn', color: 'black' }, null, { type: 'pawn', color: 'black' }, null, { type: 'pawn', color: 'black' }, null, { type: 'pawn', color: 'black' }],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [{ type: 'pawn', color: 'red' }, null, { type: 'pawn', color: 'red' }, null, { type: 'pawn', color: 'red' }, null, { type: 'pawn', color: 'red' }, null, { type: 'pawn', color: 'red' }],
  [null, { type: 'cannon', color: 'red' }, null, null, null, null, null, { type: 'cannon', color: 'red' }, null],
  [null, null, null, null, null, null, null, null, null],
  // 红方 (底部)
  [
    { type: 'chariot', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'advisor', color: 'red' },
    { type: 'king', color: 'red' },
    { type: 'advisor', color: 'red' },
    { type: 'elephant', color: 'red' },
    { type: 'horse', color: 'red' },
    { type: 'chariot', color: 'red' }
  ]
];

// 检查位置是否在棋盘范围内
export const isInBounds = (row, col) => {
  return row >= 0 && row < 10 && col >= 0 && col < 9;
};

// 检查是否在己方区域（用于帅/将、仕/士、相/象的移动限制）
export const isInPalace = (row, col, color) => {
  if (color === 'red') {
    return row >= 7 && row <= 9 && col >= 3 && col <= 5;
  } else {
    return row >= 0 && row <= 2 && col >= 3 && col <= 5;
  }
};

// 检查是否在己方半场（用于相/象的移动限制）
export const isInOwnSide = (row, color) => {
  if (color === 'red') {
    return row >= 5;
  } else {
    return row <= 4;
  }
};

// 检查路径是否被阻挡
export const isPathClear = (board, fromRow, fromCol, toRow, toCol) => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  
  // 计算移动方向
  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
  
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  
  // 检查路径上的每个位置
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol] !== null) {
      return false;
    }
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
};

// 验证棋子移动是否合法
export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
  if (!isInBounds(toRow, toCol)) return false;
  
  const piece = board[fromRow][fromCol];
  if (!piece) return false;
  
  const targetPiece = board[toRow][toCol];
  
  // 不能吃己方棋子
  if (targetPiece && targetPiece.color === piece.color) return false;
  
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  
  switch (piece.type) {
    case 'king':
      // 帅/将只能在九宫格内移动，每次只能走一格
      if (!isInPalace(toRow, toCol, piece.color)) return false;
      if (rowDiff + colDiff !== 1) return false;
      
      // 检查是否与对方将帅面对面
      if (targetPiece && targetPiece.type === 'king') {
        if (fromCol === toCol && isPathClear(board, fromRow, fromCol, toRow, toCol)) {
          return false; // 不能面对面
        }
      }
      return true;
      
    case 'advisor':
      // 仕/士只能在九宫格内斜向移动
      if (!isInPalace(toRow, toCol, piece.color)) return false;
      if (rowDiff !== 1 || colDiff !== 1) return false;
      return true;
      
    case 'elephant':
      // 相/象斜向移动两格，不能过河
      if (!isInOwnSide(toRow, piece.color)) return false;
      if (rowDiff !== 2 || colDiff !== 2) return false;
      
      // 检查象眼是否被阻挡
      const eyeRow = fromRow + (toRow - fromRow) / 2;
      const eyeCol = fromCol + (toCol - fromCol) / 2;
      if (board[eyeRow][eyeCol] !== null) return false;
      return true;
      
    case 'horse':
      // 马走日字，检查蹩马腿
      if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) return false;
      
      // 检查马腿
      let legRow, legCol;
      if (rowDiff === 2) {
        legRow = fromRow + (toRow - fromRow) / 2;
        legCol = fromCol;
      } else {
        legRow = fromRow;
        legCol = fromCol + (toCol - fromCol) / 2;
      }
      
      if (board[legRow][legCol] !== null) return false;
      return true;
      
    case 'chariot':
      // 车直线移动
      if (rowDiff !== 0 && colDiff !== 0) return false;
      return isPathClear(board, fromRow, fromCol, toRow, toCol);
      
    case 'cannon':
      // 炮直线移动，吃子时需要跳过一个棋子
      if (rowDiff !== 0 && colDiff !== 0) return false;
      
      if (targetPiece) {
        // 吃子时需要有一个棋子作为炮台
        let pieceCount = 0;
        const rowStep = toRow === fromRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
        const colStep = toCol === fromCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
          if (board[currentRow][currentCol] !== null) {
            pieceCount++;
          }
          currentRow += rowStep;
          currentCol += colStep;
        }
        
        return pieceCount === 1;
      } else {
        // 不吃子时路径必须畅通
        return isPathClear(board, fromRow, fromCol, toRow, toCol);
      }
      
    case 'pawn':
      // 兵/卒的移动规则
      const isRed = piece.color === 'red';
      const hasRiver = isRed ? fromRow <= 4 : fromRow >= 5;
      
      if (!hasRiver) {
        // 未过河只能向前
        const forwardDir = isRed ? -1 : 1;
        return toRow === fromRow + forwardDir && toCol === fromCol;
      } else {
        // 过河后可以横向移动
        if (rowDiff === 1 && colDiff === 0) {
          const forwardDir = isRed ? -1 : 1;
          return toRow === fromRow + forwardDir;
        } else if (rowDiff === 0 && colDiff === 1) {
          return true;
        }
        return false;
      }
      
    default:
      return false;
  }
};

// 执行移动
export const makeMove = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[fromRow][fromCol];
  
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  
  return newBoard;
};

// 找到指定颜色的王
export const findKing = (board, color) => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return [row, col];
      }
    }
  }
  return null;
};

// 检查是否被将军
export const isInCheck = (board, color) => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  
  const [kingRow, kingCol] = kingPos;
  const opponentColor = color === 'red' ? 'black' : 'red';
  
  // 检查所有对方棋子是否能攻击到王
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        if (isValidMove(board, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// 获取所有可能的移动
export const getAllPossibleMoves = (board, color) => {
  const moves = [];
  
  for (let fromRow = 0; fromRow < 10; fromRow++) {
    for (let fromCol = 0; fromCol < 9; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < 10; toRow++) {
          for (let toCol = 0; toCol < 9; toCol++) {
            if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
              const newBoard = makeMove(board, fromRow, fromCol, toRow, toCol);
              if (!isInCheck(newBoard, color)) {
                moves.push({ from: [fromRow, fromCol], to: [toRow, toCol] });
              }
            }
          }
        }
      }
    }
  }
  
  return moves;
};

// 检查是否被将死
export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false;
  return getAllPossibleMoves(board, color).length === 0;
};



// AI选择最佳移动
export const getBestMove = (board, color) => {
  const possibleMoves = getAllPossibleMoves(board, color);
  if (possibleMoves.length === 0) return null;

  // 简单AI：随机选择一个合法移动
  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};


