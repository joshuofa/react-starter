/** @jsx React.DOM */
var React = require('react')

var Cell = React.createClass({
  render: function() {
  	var color = "#222";
	if ( this.props.isAlive ) {
		color = "#FFF"
	}

  	var offset = 15;
  	var topOffset = this.props.col * offset;
  	var leftOffset = this.props.row * offset;

  	var cellStyle = {
      backgroundColor: color,
      border: "solid 1px black",
      width: offset,
      height: offset,
      position: 'absolute',
      top: topOffset,
      left: leftOffset
    }
  	
    return <div style={cellStyle}></div>
  },
});

var Grid = React.createClass({

	getInitialState: function() {
        var numRows = 50;
        var numCols = 50;
        var grid = new Array();
        for (var i = 0; i < numRows; i++) {
            var row = new Array();
            for (var j = 0; j < numCols; j++) {
                row.push(1);
            }
            grid.push(row)
        }
        console.log(grid);
        return {
            grid: grid,
            numRows: numRows,
            numCols: numCols
        }
    },


    onNextGen: function() {
        //this.setState({grid: []})
        var numRows = this.state.numRows;
        var numCols = this.state.numRows;
        var prevGrid = this.state.grid;
        var nextGrid = this.state.grid.slice(0);
        //this.setState({grid: this.state.grid})
        for (var i = 0; i < numRows; i++) {
            var row = [];
            for (var j = 0; j < numCols; j++) {
                var numNeighbors = 0;
                for (var m = -1; m <= 1; m++) {
                    for (var n = -1; n <= 1; n++) {
                        if (m == 0 && n == 0) {
                            continue;
                        }
                        var y = i + n;
                        var x = j + m;
                        if (x < 0 || y < 0 || x >= numCols || y >= numRows) {
                            continue;
                        }
                        if (prevGrid[y][x] == 1) {
                            numNeighbors++;
                        }
                    }
                }
                if (numNeighbors < 2 || numNeighbors > 3) {
                    nextGrid[i][j] = 0;
                } else {
                    nextGrid[i][j] = 1;
                }
            }
        }
        this.setState({grid: nextGrid});
    },

  render: function() {

  	var cellViews = [];
  	
	for (rowIndex = 0; rowIndex < this.state.numRows; rowIndex++) { 
		for ( cellIndex = 0; cellIndex < this.state.numCols; cellIndex++ ) {
			cellViews.push(<Cell col={cellIndex} row={rowIndex} isAlive={this.state.grid[rowIndex][cellIndex]} />)
		}
	};

	buttonTop = 15 * this.state.numCols;
	var buttonStyle = {
		position: "absolute",
		top: buttonTop
	}
  	
    return <div>
      <p>
        {cellViews}
      </p>
      <button onClick={this.onNextGen} style={buttonStyle}>Next Gen</button>
    </div>
  },
});

module.exports = Grid