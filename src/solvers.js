/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks place8d such that none of them can attack each other

var findSolutions = function(n, searchAdjacent = true, searchDiagonal = true) {
  // define a final solutions array= [[]]
  var finalSol = [[]];

  // HELPER FUNCTION to check row possibilities given previous pieces
  var validChecker = function (n, row, solution) {
    // Create an outputArray that contains the range 0 through n - 1
    var outputArr = [...Array(n).keys()];

    if (searchAdjacent) {
      // Determine columns already attacked by other pieces
      for (var i = 0; i < solution.length; i++) {
        for (var j = 0; j < outputArr.length; j++)  {
          if (solution[i] === outputArr[j]) {
            // Remove element from outputArray if attacked
            outputArr.splice(j, 1);
            j--
            break;
          }
        }
      }
    }

    if (searchDiagonal) {
      // Determine diagonals attacked by other pieces (major and minor)
      for (var i = 0; i < solution.length; i++) {
        for (var j = 0; j < outputArr.length; j++)  {
          // major axis (row-col)
          if ((i - solution[i]) === (row - outputArr[j])) {
            // Remove element from outputArray if attacked
            outputArr.splice(j, 1);
            j--
            continue;
          }
          // minor axis (row+col)
          if ((i + solution[i]) === (row + outputArr[j])) {
            // Remove element from outputArray if attacked
            outputArr.splice(j, 1);
            j--
            continue;
          }
        }
      }
    }

  return outputArr;
  };
  // END of HELPER FUNCTION

  // Main function body
  // iterate over each row, 1 through n
  for (var row = 0; row < n; row++) {
    // define a temporary solutions array equal to final solutions
    var tempSol = finalSol.slice();
    // reset final solutions array
    finalSol = [];
    // for each solution in the temporary solutions:
    for (var i = 0; i < tempSol.length; i++) {
      // determine what options are available on the next row using the helper function
      var options = validChecker(n, row, tempSol[i]);
      // if options is not empty
      if (options.length !== 0) {
        // for each option in the options defined above
        for (var option = 0; option < options.length; option++) {
          // combine the solution and option and push into the final solutions
          finalSol.push(tempSol[i].concat(options[option]));
        }
      }
    }
  }

  // Return the final solution
  return finalSol;
}

window.findNRooksSolution = function(n) {
  var solutionIndices = findSolutions(n, true, false)[0]; //fixme

  var solution = [];

  for (let i = 0; i < solutionIndices.length; i++) {
    let row = Array(n).fill(0);

    if (solutionIndices !== undefined) {
      row[solutionIndices[i]] = 1;
    }

    solution.push(row);
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = findSolutions(n, true, false).length; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solutionIndices = findSolutions(n, true, true)[0]; //fixme

  var solution = [];

  for (let i = 0; i < n; i++) {
    let row = Array(n).fill(0);

    if (solutionIndices !== undefined) {
      row[solutionIndices[i]] = 1;
    }

    solution.push(row);
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = findSolutions(n, true, true).length; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
