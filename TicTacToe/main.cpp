#include <iostream>
#include <vector>

using namespace std;

class TicTacToe {
private:
    vector<vector<char>> board;
    char currentPlayer;

public:
    TicTacToe() {
        board = vector<vector<char>>(3, vector<char>(3, ' '));
        currentPlayer = 'X';
    }

    void printBoard() {
        cout << "  0 1 2" << endl;
        for (int i = 0; i < 3; i++) {
            cout << i << " ";
            for (int j = 0; j < 3; j++) {
                cout << board[i][j];
                if (j < 2) cout << "|";
            }
            cout << endl;
            if (i < 2) cout << "  -+-+-" << endl;
        }
    }

    bool makeMove(int row, int col) {
        if (row < 0 || row >= 3 || col < 0 || col >= 3 || board[row][col] != ' ') {
            return false;
        }
        board[row][col] = currentPlayer;
        return true;
    }

    bool checkWin() {
        // Check rows and columns
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == currentPlayer &&
                board[i][1] == currentPlayer &&
                board[i][2] == currentPlayer) {
                return true;
            }
            if (board[0][i] == currentPlayer &&
                board[1][i] == currentPlayer &&
                board[2][i] == currentPlayer) {
                return true;
            }
        }
        // Check diagonals
        if (board[0][0] == currentPlayer &&
            board[1][1] == currentPlayer &&
            board[2][2] == currentPlayer) {
            return true;
        }
        if (board[0][2] == currentPlayer &&
            board[1][1] == currentPlayer &&
            board[2][0] == currentPlayer) {
            return true;
        }
        return false;
    }

    bool checkDraw() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }

    void switchPlayer() {
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }

    void play() {
        int row, col;
        while (true) {
            printBoard();
            cout << "Player " << currentPlayer << ", enter your move (row and column): ";
            cin >> row >> col;
            if (!makeMove(row, col)) {
                cout << "Invalid move. Try again." << endl;
                continue;
            }
            if (checkWin()) {
                printBoard();
                cout << "Player " << currentPlayer << " wins!" << endl;
                break;
            }
            if (checkDraw()) {
                printBoard();
                cout << "The game is a draw." << endl;
                break;
            }
            switchPlayer();
        }
    }
};

int main() {
    TicTacToe game;
    game.play();
    return 0;
}