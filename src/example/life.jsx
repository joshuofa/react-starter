/** @jsx React.DOM */
var React = require('react')

var Cell = React.createClass({
  render: function() {
  	//console.log("isAlive props: " + this.props.isAlive);
  	var color = "#222";
	if ( this.props.isAlive ) {
		color = "#FFF";
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
  	
    return <div style={cellStyle} onClick={this.onClick}></div>
  },
  onClick: function(e) {
  	//console.log("clicked");
  	this.props.changeState(this.props.row, this.props.col);//, this.refreshAlive)
  }
});

var Grid = React.createClass({

	getInitialState: function() {
        var numRows = 50;
        var numCols = 50;
        var grid = new Array();
        for (var i = 0; i < numRows; i++) {
            var row = new Array();
            for (var j = 0; j < numCols; j++) {
                row.push(0);
            }
            grid.push(row)
        }
        //console.log(grid);
        return {
            grid: grid,
            numRows: numRows,
            numCols: numCols
        }
    },

    clone: function(existingArray) {
        var newObj = (existingArray instanceof Array) ? [] : {};
        for (i in existingArray) {
            if (i == 'clone') continue;
            if (existingArray[i] && typeof existingArray[i] == "object") {
                newObj[i] = this.clone(existingArray[i]);
            } else {
                newObj[i] = existingArray[i]
            }
        }
        return newObj;
    },

    onNextGen: function() {
    	//console.log("onNextGen");
        //this.setState({grid: []})
        var numRows = this.state.numRows;
        var numCols = this.state.numRows;
        var prevGrid = this.state.grid;
        var nextGrid = this.clone(prevGrid);
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
				if (prevGrid[i][j] == 1) {
                    if (numNeighbors > 1 && numNeighbors < 4) {
                        nextGrid[i][j] = 1;
                    } else {
                        nextGrid[i][j] = 0;
                    }
                } else if (numNeighbors == 3) {
                    nextGrid[i][j] = 1;
                }            
            }
        }
        this.setState({grid: nextGrid});
    },
    toggleCellState: function(row, col, viewRefresh) {
    	//console.log("toggleStateClicked");
        if (row < 0 || row >= this.state.numRows ||
            col < 0 || col >= this.state.numCols) {
            alert("Invalid cell coordinates: " + row + "," + col);
        	return;
        }
        var nextGrid = this.state.grid
        nextGrid[row][col] = nextGrid[row][col] ^ 1;
        this.setState({grid: nextGrid});
        //viewRefresh(this.state.grid[row][col]);
    },
  	render: function() {

  		var cellViews = [];

		for (rowIndex = 0; rowIndex < this.state.numRows; rowIndex++) { 
			for ( cellIndex = 0; cellIndex < this.state.numCols; cellIndex++ ) {
				cellViews.push(<Cell col={cellIndex} row={rowIndex} isAlive={this.state.grid[rowIndex][cellIndex]} changeState={this.toggleCellState} />)
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