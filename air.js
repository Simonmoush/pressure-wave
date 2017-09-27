Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function pressureToColor(value, range){
	var blue = 0;
	var red = 0;
	var green = 0;
	if (value > range/2){
		red = 255;
		blue = value.map(range/2, .52*range, 255, 0);
		green = value.map(range/2, .52*range, 255, 0);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}else{
		blue = 255;
		red = value.map(range*.48, range/2, 0, 255);
		green = value.map(range*.48, range/2, 0, 255);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}
}

function pos(value){
	if(value > 0) {return value};
	return 0;
}

function setup(){
	var c = document.getElementById("airspace");
	var ctx = c.getContext("2d");

	var grid = [];
	var width = 40;
	var hunit = parseInt(c.width)/width;
	var height = 40;
	var vunit = parseInt(c.height)/height;
	var pressureRange = 100;

	for(var i = 0; i < width; i++){
		grid[i] = [];
		for(var j = 0; j < height; j++){
		grid[i][j] = pressureRange/2;
		}
	}

	render();
	function render(){
		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){

				ctx.fillStyle = pressureToColor(grid[i][j], pressureRange);
				ctx.fillRect((i*hunit), (j*vunit), hunit, vunit);
				
				if (false){
					ctx.font="20px Georgia";
					ctx.fillStyle = "black";
					ctx.fillText(""+Math.floor(grid[i][j]), (i*hunit), ((j+1)*vunit)-vunit/3);
				}
			}
		}
	}

	c.addEventListener("mousedown", highPressure);
	c.addEventListener("mouseup", lowPressure);

	function highPressure(event){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 1; j++){
				grid[Math.floor(event.pageX/hunit)+i][Math.floor(event.pageY/vunit)+j] = pressureRange*.6;
			}
		}
	}

	function lowPressure(event){
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 1; j++){
				grid[Math.floor(event.pageX/hunit)+i][Math.floor(event.pageY/vunit)+j] = pressureRange*.4;
			}
		}
	}

	/*
	window.onclick = function(){
		stepFrame();
		render();
	};
	*/

	function update(){
		stepFrame();
		render();
		window.requestAnimationFrame(update);
	}
	window.requestAnimationFrame(update);

	function stepFrame(){
		var loss = .3;

		// make a new grid to hold the changes
		var gridChanges = [];
		for (var i = 0; i < width; i++){
			gridChanges[i] =[];
			for (var j = 0; j < height; j++){
				gridChanges[i][j] = 0;
			}
		}

		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				var current = grid[i][j];
				var diffs = [0,0,0,0];

				if (j != 0){
					// north
					if(grid[i][j-1] < current){
						diffs[0] = (current - grid[i][j-1]);
					}
				}
				if(j != height-1){
					// south
					if(grid[i][j+1] < current){
						diffs[1] = (current - grid[i][j+1]);
					}
				}
				if(i != width-1){ 
					// east
					if(grid[i+1][j] < current){
						diffs[2] = (current - grid[i+1][j]);
					}
				}
				if(i != 0){
					// west
					if(grid[i-1][j] < current){
						diffs[3] = (current - grid[i-1][j]);
					}
				}

				function applyChanges(ci, cj, ni, nj, d){
					gridChanges[ni][nj] += (diffs[d]/2)*loss;
					gridChanges[ci][cj] -= (diffs[d]/2)*loss;
				}
				
				if (j != 0){
					// north
					if(grid[i][j-1] < current){
						applyChanges(i, j, i, j-1, 0);
					}
				}
				if(j != height-1){
					// south
					if(grid[i][j+1] < current){
						applyChanges(i, j, i, j+1, 1);
					}
				}
				if(i != width-1){ 
					// east
					if(grid[i+1][j] < current){
						applyChanges(i, j, i+1, j, 2);
					}
				}
				if(i != 0){
					// west
					if(grid[i-1][j] < current){
						applyChanges(i, j, i-1, j, 3);
					}
				}
			}
		}

		// apply the changes from the gridChanges array to the real grid
		for(var i = 0; i < width; i++){
			for(var j = 0; j < height; j++){
				grid[i][j] += gridChanges[i][j];
				if(grid[i][j] < 0){ grid[i][j] = 0;}
				if(grid[i][j] > pressureRange){ grid[i][j] = pressureRange;}
			}
		}
	}
}

setup();
