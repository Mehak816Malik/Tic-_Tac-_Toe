let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = false;
let playerTypes = { X: 'human', O: 'ai' };
let history = [];
let timerInterval;
let startTime;

const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const rematchButton = document.getElementById('rematch');
const historyList = document.getElementById('historyList');
const startGameButton = document.getElementById('startGame');
const playerXType = document.getElementById('playerXType');
const playerOType = document.getElementById('playerOType');
const gameDiv = document.getElementById('game');
const timerDisplay = document.getElementById('timer');
const winPopup = document.getElementById('win-popup');

const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

function checkWin() {
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return board.every(cell => cell !== null);
}

function updateMessage(text) {
  message.textContent = text;
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index]) return;
  if (playerTypes[currentPlayer] === 'human') {
    playMove(index);
  }
}

function playMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer.toLowerCase());
  moveSound.play();

  if (checkWin()) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const isHuman = playerTypes[currentPlayer] === 'human';
    updateMessage(isHuman
      ? `🎉 Congrats! Player ${currentPlayer} won in ${timeTaken}s! 🎉`
      : `😢 AI (${currentPlayer}) won in ${timeTaken}s!`);
    history.push(`Player ${currentPlayer} - ${timeTaken}s`);
    updateHistory();
    winSound.play();
    showWinPopup();
    clearInterval(timerInterval);
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    updateMessage(`😐 It's a draw!`);
    history.push("Draw");
    updateHistory();
    drawSound.play();
    clearInterval(timerInterval);
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateMessage(`Player ${currentPlayer}'s turn`);
  if (playerTypes[currentPlayer] === 'ai') {
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = currentPlayer;
      if (checkWin()) {
        board[i] = null;
        playMove(i);
        return;
      }
      board[i] = null;
    }
  }

  const opponent = currentPlayer === 'X' ? 'O' : 'X';
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = opponent;
      if (checkWin()) {
        board[i] = null;
        playMove(i);
        return;
      }
      board[i] = null;
    }
  }

  const available = board.map((v, i) => v === null ? i : null).filter(i => i !== null);
  const move = available[Math.floor(Math.random() * available.length)];
  playMove(move);
}

function restartGame() {
  board.fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  currentPlayer = 'X';
  gameActive = true;
  updateMessage(`Player ${currentPlayer}'s turn`);
  winPopup.style.display = 'none';
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${elapsed}s`;
  }, 1000);

  if (playerTypes[currentPlayer] === 'ai') {
    setTimeout(aiMove, 500);
  }
}

function startGame() {
  playerTypes.X = playerXType.value;
  playerTypes.O = playerOType.value;
  gameDiv.style.display = 'block';
  restartGame();
}

function showWinPopup() {
  winPopup.style.display = 'block';
  winPopup.classList.add('popup');
  setTimeout(() => {
    winPopup.style.display = 'none';
    winPopup.classList.remove('popup');
  }, 2000);
}

function updateHistory() {
  historyList.innerHTML = history.map(h => `<li>${h}</li>`).join('');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', () => {
  gameDiv.style.display = 'none';
});
rematchButton.addEventListener('click', restartGame);
startGameButton.addEventListener('click', startGame);