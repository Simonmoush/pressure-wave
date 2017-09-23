Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function pressureToColor(value, range){
	var blue = 0;
	var red = 0;
	var green = 0;
	if (value > range/2){
		red = 255;
		blue = value.map(range/2, range, 255, 0);
		green = value.map(range/2, range, 255, 0);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}else{
		blue = 255;
		red = value.map(0, range/2, 0, 255);
		green = value.map(0, range/2, 0, 255);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}
}

function setup(){
	var c = document.getElementById("airspace");
	var ctx = c.getContext("2d");

	var grid = [];
	var width = 10;
	var hunit = parseInt(c.width)/width;
	var height = 10;
	var vunit = parseInt(c.height)/height;
	var pressureRange = 100;

	for (var i = 0; i < width; i++){
		grid[i] = [];
		for (var j = 0; j < height; j++){
			grid[i][j] = Math.random()*pressureRange;

			ctx.fillStyle = pressureToColor(grid[i][j], pressureRange);
			ctx.fillRect((i*hunit), (j*vunit), hunit-2, vunit-2);

			ctx.font="20px Georgia";

			ctx.fillStyle = "black";
			ctx.fillText(""+Math.floor(grid[i][j]), (i*hunit), ((j+1)*vunit)-vunit/3);
		}
	}

	window.onclick = function(){stepFrame()};

	function stepFrame(){
		//var gridChanges = grid.clone // clone doesn't exist, but deepclone the array and apply the changes at the end of the frame

		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				var ndiff = (j == 0) ? null : grid[i][j] - grid[i][j-1];
				var sdiff = (j == height-1) ? null : grid[i][j] - grid[i][j+1];
				var ediff = (i == width-1) ? null : grid[i][j] - grid[i+1][j];
				var wdiff = (i == 0) ? null : grid[i][j] - grid[i-1][j];
				var nediff = (j == 0 || i == width-1) ? null : grid[i][j] - grid[i+1][j-1];
				var sediff = (j == height-1 || i == width-1) ? null : grid[i][j] - grid[i+1][j+1];
				var nwdiff = (j == 0 || i == 0) ? null : grid[i][j] - grid[i-1][j-1];
				var swdiff = (j == height-1 || i == 0) ? null : grid[i][j] - grid[i-1][j+1];
				
				// figure out how to distribute pressure
				// mark changes in the gridChanges array

			}
		}
		// apply the changes from the gridChanges array to the real grid
	}
}

setup();
