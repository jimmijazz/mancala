/* Mancala game made on Flight to Cairns 1st October 2021

Idea will be that it's played purely in the terminal

To Build
- Board - DONE
- User input
- Moving Pieces
- Game finish check
- "AI" / Opponent

BOARD LAYOUT

 - 12 11 10 9 8 7 -
13  - - - - - -   6
 - 0  1  2  3 4 5 -

Each number will contain the number of pebbles
that are in that space.

==Definitions==
Hole = each position in the board
Pebble = the stones that are in each hole
Pocket = the two scoring areas at either end of the board

==Rules==
User 1 moves clockwise.
User 2 moves anticlockwise.
When either side contains no pebbles, game is over. The winnder
gets all remaining pieces and the score is tallied.
If a user lands in an empty space, they get all corresponding tiles

*/


var board = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

var testBoards = { // For testing scenarios
  player_one_has_one_hole_left : [0, 0, 0, 0, 0, 4, 0, 4, 4, 4, 4, 4, 4, 0]
};

var turn = 1; // Who's turn it is

var validInputsP1 = ["1", "2", "3", "4", "5", "6"];
var validInputsP2 = [ "8", "9", "10", "11", "12", "13"];

/* DEBUG CONFIG */
const DEBUG = true;
// const boardToUse = testBoards.player_one_has_one_hole_left;
const boardToUse = null;


// Resets the board to starting position
function resetBoard() {
  if (boardToUse) { // Load the testBoard
    board = boardToUse;
  } else {
    // Reset all pieces except the score pits to have 4
    board.forEach(function(hole, index) {
      if (index !== 6 && index !== board.length - 1) {
        board[index] = 4
      };
    });
  }

};

function checkIfGameHasFinished() {
  var b = board;
  var playerHasWon = false;
  var winningPlayer = 0; // 1 (player) or 2 (opponent)

  if ((b[0] + b[1] + b[2] + b[3] + b[4] + b[5]) === 0) {
    playerHasWon = true;
    winningPlayer = 1;
  } else if ((b[12] + b[11] + b[10] + b[9] + b[8] + b[7]) === 0) {
    playerHasWon = true;
    winningPlayer = 2
  } else {
    playerHasWon = false;
  };

  if (playerHasWon) {
    // Get the losing player's pebbles
    var remainingPebbles = 0;
    if (winningPlayer == 1) {
      board[6] += (b[12] + b[11] + b[10] + b[9] + b[8] + b[7]);
      b[12] = b[11] = b[10] = b[9] = b[8] = b[7] = 0;
    } else {
      board[13] += (b[0] + b[1] + b[2] + b[3] + b[4] + b[5]);
      b[0] = b[1] = b[2] = b[3] = b[4] = b[5] = 0
    };

    console.log("Remaining pebbles: ", remainingPebbles);
    // Update board to reflect the final total
    // Update the winning player based on pebble count
    winningPlayer = (board[6] > board[13] ? 1 : 2);
  };
  return {"game_over" : playerHasWon, "winning_player" : winningPlayer};
};

// Takes in array of board status, and returns friendly UI
function returnFormattedBoard(board) {
  /* Takes in board array and spits out UI */

  // Each "hole" should be two spaces. Either digits, or digit and space
  var formattedHoles = [];
  board.forEach(function(h) {
    if (h.toString().length == 1) {
      h += " ";
    };
    formattedHoles.push(h.toString());
  });

  let display = `
    13 12 11 10 9  8
    ${formattedHoles[12]} ${formattedHoles[11]} ${formattedHoles[10]} ${formattedHoles[9]} ${formattedHoles[8]} ${formattedHoles[7]}
 ${formattedHoles[13]} -  -  -  -  -  -  ${formattedHoles[6]}
    ${formattedHoles[0]} ${formattedHoles[1]} ${formattedHoles[2]} ${formattedHoles[3]} ${formattedHoles[4]} ${formattedHoles[5]}
    1  2  3  4  5  6
  `
  return display;
};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Gets a user input and validates it from the user
function getInput() {
  // console.log(readline);
  let validMoves = (turn == 1 ? validInputsP1 : validInputsP2);
  let minNumber = validMoves[0]
  let maxNumber = validMoves[5];
  var inputMessage = `Enter a number from ${minNumber} - ${maxNumber} to move the pebbles in that hole: `

  readline.question(inputMessage, input => {
    if ((turn == 1 && !validInputsP1.includes(input)) || (turn == 2 && !validInputsP2.includes(input))) { // Debugging, change back to validInputs
        // Re-ask for a valid input
        getInput();
      } else {
        // readline.close();
        updateBoard(input);
    };
  });
};

function updateBoard(position) {
  /* Moves the pebbles at position(int).

  position(string) -> position on the board provided by the player
  */

  var pebbles; // Count of pebbles
  var currentPosition; // The current position on the board
  var tempBoard; // Temp copy that will update the real board when ready

  position; // Player provided position is +1 for readability
  currentPosition = position --
  pebbles = board[position];
  tempBoard = board;

  // Check there are pebbles at that position
  if (pebbles == 0){console.log("No pebbles at that position");getInput()} else {
    tempBoard[position] = 0;  // Pick up the pebbles
    // Drop our pebbles one by one

    while (pebbles !== 0) {
      // Loop around
      if (currentPosition == 14) { currentPosition = 0};
      if ((turn == 1 && (currentPosition == 13)) || (turn == 2 && (currentPosition == 6))) {
      } else {
        tempBoard[currentPosition] ++; // Increase pebble count at position
        pebbles --; // Decrement pebbles in hand
      };
      currentPosition ++; // Move one space over

    }

    /* If a player lands in an empty spot on the opponents side, they get the
    opposing pebbles */
    board = tempBoard; // Update the board
    var lastPosition = currentPosition - 1;

    /* If a player lands in one of their own empty spaces that has pebbles
    in the opponents adjacent square, they get those pebbles.
    */
    var holeMapping = {
      0 : 12,
      1 : 11,
      2 : 10,
      3 : 9,
      4 : 8,
      5 : 7
    };

    var pebblesToGet, adjacentHole;
    if (turn == 1 && validInputsP1.includes(String(lastPosition+1)) && board[lastPosition] - 1 == 0 ) {
      // P1 Gets opposite
      adjacentHole = holeMapping[lastPosition];
      pebblesToGet = board[adjacentHole];

    } else if (validInputsP2.includes(String(lastPosition+1)) && board[lastPosition] - 1 == 0) {
      // P2 Gets opposite
      Object.keys(holeMapping).forEach(function(key) {
        if (holeMapping[key] == lastPosition) {
          adjacentHole = key;
        }
      });
      pebblesToGet = board[adjacentHole];
    };

    if (pebblesToGet > 0) { // If pebbles were stolen, update the board
      board[lastPosition] += pebblesToGet; // Update our pebbles
      board[adjacentHole] = 0; // Set the opponenets hole to zero
      console.log(`Player ${turn} stole ${pebblesToGet} pebbles`);
    };

    console.log(returnFormattedBoard(board));

    /* Validate if game has finished */
    var gameStatus = checkIfGameHasFinished();
    if (gameStatus["game_over"]) {
      console.log(`Game over. Congratulations player ${gameStatus['winning_player']}`);
      console.log(returnFormattedBoard(board));
    } else {
    /* Game has not finished */

      /* Update the turn (and give another turn if last move landed in
      empty space on their side, or in the pocket ) */
      var haveAnotherGo = false;
      if (turn == 1 && lastPosition == 6) { // Valid bonus spaces for P1
        haveAnotherGo = true;
      } else if (lastPosition == 13){
        haveAnotherGo = true;
      };

      if (!haveAnotherGo) {
        turn = (turn == 1 ? 2 : 1); // Rotate turns
      } else {
        console.log(`Player ${turn} landed in the pocket and gets another turn`);
      }
      console.log("TURN: ", turn)
      // console.log(`It's player ${turn}'s turn`);
      if (turn == 1 || DEBUG == true) { // Player's turn
        getInput()
      } else if (turn == 2) { // Opponents turn
        // Handle opponent's turn and make sure it's a valid move
        var validOppMove = false;
        var opponentPosition;
        var min=8,max=13; // Valid moves for the opponent

        while (!validOppMove) {
          opponentPosition = Math.floor(Math.random() * (max - min + 1) + min);
          // Check their attemped move is valid
          if (board[opponentPosition] > 0) {
            validOppMove = true;
          }
        };

        // handle opponent trying to move without their being pebbles
        console.log(`Opponent moved ${board[opponentPosition]} pebbles from position ${opponentPosition - 1}`);
        updateBoard(opponentPosition);
      };
    };
  }
};

/* GAMEPLAY */
resetBoard();
console.log(returnFormattedBoard(board));
getInput(); // Get the first input to start the game;
