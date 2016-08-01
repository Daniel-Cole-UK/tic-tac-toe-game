var game = ["", "", "", "", "", "", "", "", ""];
var winCombos = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]];
var playerSelection;
var compSelection;
var running = false;
var aiMove;

// Check if no further empty spaces remain
function isFull(board) {
  return board.indexOf("") === -1;
}

// Check if the board is full or a player has won
function isGameOver(board) {
  return isFull(board) || winCheck(board, "X") || winCheck(board, "O");
}

// Returns true if the specified player has won
function winCheck(board, player) {
  var win = false;
  winCombos.forEach(function(curr, index, array) {
    if (board[curr[0]] === player && board[curr[1]] === player && board[curr[2]] === player) {
      win = true;
    }
  });
  return win;
}

// Scores a potential board
function score(board) {
  var score;
  if (winCheck(board, "X")) {
    score = 10;
  } else if (winCheck(board, "O")) {
    score = -10;
  } else {
    score = 0;
  }
  return score;
}

// Return all the available moves
function getMoves(board) {
  return Array.apply(null, {
    length: 9
  }).map(eval.call, Number).filter(function(i) {
    return board[i] == "";
  });
}

// Find best AI move (depth controls how many moves to look ahead)
function minMax(board, player, depth) {
  if (depth >= 8 || isGameOver(board)) {
    return score(board);
  }
  var scores = [];
  var moves = [];
  var minScore;
  var maxScore;
  var opponent = player == "X" ? "O" : "X";
  var possibleMoves = getMoves(board);

  // score all possible boards
  possibleMoves.forEach(function(move) {
    var posState = board.slice(0);
    posState[move] = player;
    scores.push(minMax(posState, opponent, depth + 1));
    moves.push(move);
  });

  aiMove = moves[0]; // set first move
  // find best move maxPlayer
  if (player === "X") {
    maxScore = scores[0];
    for (var s in scores) {
      if (scores[s] > maxScore) {
        maxScore = scores[s];
        aiMove = moves[s];
      }
    }
    return maxScore;
  } else { 
    // find best move min player
    minScore = scores[0];
    for (var s in scores) {
      if (scores[s] < minScore) {
        minScore = scores[s];
        aiMove = moves[s];
      }
    }
    return minScore;
  }
}

function newGame() {
  // Clear the board
  $(".blockText").each(function() {
    $(this).html("");
  });
  // Clear game array
  game = game.map(function() {
    return ""
  });
  playerSelection = null;
  compSelection = null;
  $('#playerSelect').removeClass("animated").removeClass("zoomOut");
  $('#container').removeClass("animated").removeClass("zoomOut");
  $('#result').addClass('hidden');
  $('#container').addClass('hidden');
  $('#playerSelect').animateCss('zoomIn');
  $('#playerSelect').removeClass('hidden');
  running = false;
}

function showResult(result) {
  $('#container').animateCss('tada');
  setTimeout(function() {
    $('#container').animateCss('zoomOut');
  }, 2000);
  setTimeout(function() {
    $('#container').addClass('hidden');
  }, 2500);
  setTimeout(function() {
    $('#result').animateCss('fadeIn');
    $('#result').removeClass('hidden');
  }, 3000);
  $('#result').find('h2').html(result);
}

$.fn.extend({
  animateCss: function(animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});

$(document).ready(function() {
  newGame();
  $(".selectButton").click(function() {
    if (!running) {
      playerSelection = $(this).attr("id");
      compSelection = playerSelection == "X" ? "O" : "X";
      $('#playerSelect').animateCss('zoomOut');
      setTimeout(function() {
        $('#playerSelect').addClass('hidden');
      }, 500);
      setTimeout(function() {
        $('#container').removeClass('hidden');
      }, 1000);
      $('#container').animateCss('rotateIn');
      running = true;
    }
  });

  $("#playAgain").click(function() {
    newGame();
  });

  $(".block").click(function() {
    if (running) {
      var pos = Number($(this).find(".blockText").attr("id")); // get id of block
      // If the block is empty...
      if (game[pos] == "") {
        // ...update board and game array
        $(this).find(".blockText").html(playerSelection);
        game[pos] = "X";

        if (isFull(game)) {
          // full board game over
          running = false;
          showResult("Draw");
        } else if (winCheck(game, "X")) {
          // Player win
          running = false;
          showResult("You Won");
        } else {
          // get best AI move and make it
          minMax(game, "O", 0);
          game[aiMove] = "O";
          $(this).find(".blockText").attr("id")
          $(".blockText[id=" + aiMove + "]").html(compSelection);
          // check if AI has won
          if (winCheck(game, "O")) {
            running = false;
            showResult("You Lost");
          }
        }
      }
    }
  });

});