/** @jsx React.DOM */
var React = require('react')


var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var Cell = React.createClass({
    render: function() {
  	//console.log("isAlive props: " + this.props.isAlive);
  	var color = "#222";
	if ( this.props.isAlive ) {
	    color = "#FFF";
	}

  	var offset = 15;
  	var topOffset = this.props.row * offset;
  	var leftOffset = this.props.col * offset;

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
  	this.props.changeState(this.props.row, this.props.col);
    }
});

var Grid = React.createClass({
    mixins: [SetIntervalMixin],
    getInitialState: function() {
        var numRows = 50;
        var numCols = 50;
        return {
            currGrid: this.newGrid(numRows, numCols),
            numRows: numRows,
            numCols: numCols,
            running: false,
            interval: 100
        }
    },
    newGrid: function(rows, cols) {
        var grid = new Array();
        for (var i = 0; i < rows; i++) {
            var row = new Array();
            for (var j = 0; j < cols; j++) {
                row.push(0);
            }
            grid.push(row);
        }
        return grid;
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
        var numRows = this.state.numRows;
        var numCols = this.state.numCols;
        var currGrid = this.state.currGrid;
        var nextGrid = this.clone(currGrid);
        
        for (var i = 0; i < numRows; i++) {
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
                        if (currGrid[y][x] == 1) {
                            numNeighbors++;
                        }
                    }
                }
		if (currGrid[i][j] == 1) {
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
        this.setState({currGrid: nextGrid});
    },
    countCells: function() {
        var currGrid = this.state.currGrid;
        var nextGrid = this.state.nextGrid;
        var numRows = this.state.numRows;
        var numCols = this.state.numCols;
        grids = [currGrid, nextGrid];
        for (var h = 0; h < 2; h++) {
            var num = 0;
            for (var i = 0; i < numRows; i++) {
                for (var j = 0; j < numCols; j++) {
                    if (grids[h][i][j] == 1) {
                        num++;
                    }
                }
            }
            console.log(num);
        }
    },
    toggleCellState: function(row, col, viewRefresh) {
    	//console.log("toggleStateClicked");
        if (row < 0 || row >= this.state.numRows ||
            col < 0 || col >= this.state.numCols) {
            alert("Invalid cell coordinates: " + row + "," + col);
            return;
        }
        var currGrid = this.state.currGrid;
        currGrid[row][col] = currGrid[row][col] ^ 1;
        this.setState({currGrid: currGrid});
    },
    random: function() {
        var numRows = this.state.numRows;
        var numCols = this.state.numCols;
        var currGrid = this.state.currGrid;
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                if (Math.random() > .8) {
                    currGrid[i][j] = 1;
                } else {
                    currGrid[i][j] = 0;
                }
            }
        }
        this.setState({currGrid: currGrid});
    },
    toggleSimulation: function() {
        var running = this.state.running;
        if (running) {
            running = false;
            this.intervals.map(clearInterval);
        } else {
            running = true;
            this.setInterval(this.onNextGen, this.state.interval);
        }
        this.setState({running: running});
    },
    render: function() {
  	var cellViews = [];
        var grid = this.state.currGrid;

	for (var rowIndex = 0; rowIndex < this.state.numRows; rowIndex++) { 
	    for (var cellIndex = 0; cellIndex < this.state.numCols; cellIndex++ ) {
		cellViews.push(<Cell col={cellIndex} row={rowIndex} isAlive={grid[rowIndex][cellIndex]} changeState={this.toggleCellState} />)
	    }
	};

	buttonTop = 15 * this.state.numRows;
	var buttonStyle = {
            float: "left",
	    top: buttonTop
	}
	
	return <div>
	    <p>
	    {cellViews}
	</p>
	    <button onClick={this.random} style={buttonStyle}>Random</button>
	    <button onClick={this.toggleSimulation} style={buttonStyle}>Run/Stop</button>
	    <button onClick={this.onNextGen} style={buttonStyle}>Step</button>
	    </div>
    },
});


module.exports = Grid
