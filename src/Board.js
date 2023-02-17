// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // pull the desired row from the matrix
      rowArray = this.rows()[rowIndex];

      // sum over the row for all elements that have a piece
      let rowTotal = _.reduce(rowArray, function(total, element) {
        return total + element;
      }, 0);

      // if there's more than one piece in the row, return true
      return rowTotal > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // define 'this' to be used later
      let matrix = this;

      // if any row has a conflict, return that these is a row conflict
      return _.some(matrix.rows(), function(row, rowIndex) {
        // use the helper function to determine if the row has a conflict
        return matrix.hasRowConflictAt(rowIndex);
      });
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // define a sum variable
      var sum = 0;

      // iterate over each row array
      this.rows().forEach(function (row) {
        // and pull the nth element
        // sum over those elements
        sum += row[colIndex];
      });

      // check if more than one
      return sum > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      // run hasColConflict on every column to see if any columns have conflict
      // defining matrix as the object
      let matrix = this;
      let conflict = false;
      // iterate through each column index for every row array

      // this.attributes.n
      // this.hasAnyColConflictAt(0);

      // for (let i = 0; i < this.attributes.n; i++) {
      //   row = this.rows()[i]

      //   hasAnyColConflictAt(i)
      // }

      this.rows().forEach(function (row, index) {
        // run hasColConflictAt() to check if column has conflict
        // if column has conflict
        if (matrix.hasColConflictAt(index)) {
          // immediately exit the loop and return true
          conflict = true;
          return;
        }
        // otherwise keep going
      });

      // return false (meaning row has no conflicts)
      return conflict;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // declare a sum variable
      let sum = 0;
      let n = this.attributes.n;
      let row;
      let col;

      // assign the starting node based on the input argument
      if (majorDiagonalColumnIndexAtFirstRow >= 0) {
        row = 0;
        col = majorDiagonalColumnIndexAtFirstRow;
      } else {
        row = -majorDiagonalColumnIndexAtFirstRow;
        col = 0;
      }

      // iterate as long as the index for row and col < n
      while (row < n && col < n) {
        // sum the value at the indices
        sum += (this.rows())[row][col];
        row++; col++;
      }

      // return if sum is greater than 1
      return sum > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let n = this.attributes.n;
      // iterate over all possible major diagonals
      for (let i = -n + 1; i < n; i++) {
        // if there is a conflict, return true and exit
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }

      // otherwise, return false
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // declare sum variable
      let sum = 0; let col = 0; let row = 0;
      n = this.attributes.n;

      // if input < n
      if (minorDiagonalColumnIndexAtFirstRow < n) {
        // set col to input
        col = minorDiagonalColumnIndexAtFirstRow;
      // else
      } else {
        // set column to n - 1
        col = n - 1;
        // set row to input - (n - 1)
        row = minorDiagonalColumnIndexAtFirstRow - (n - 1);
      }

      // iterate through the diagonal by subtracting from col and adding to row
      // if col is less than 0 or if row > n
      while (col >= 0 && row < n) {
        // add the value of the indices to the sum
        sum += (this.rows())[row][col];
        row++; col--;
      }

      // return true if sum greater than 1
      return sum > 1;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let n = this.attributes.n;
      // iterate over all possible minor diagonals
      for (let i = 0; i < (2 * (n - 1)); i++) {
        // if there is a conflict, return true and exit
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }

      // otherwise, return false
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
