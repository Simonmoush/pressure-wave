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

function pos(value){
	if(value > 0) {return value};
	return 0;
}

function setup(){
	var c = document.getElementById("airspace");
	var ctx = c.getContext("2d");

	var grid = [];
	var width = 10;
	var hunit = parseInt(c.width)/width;
	var height = 10;
	var vunit = parseInt(c.height)/height;
	var pressureRange = 1000;

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
				
				
				ctx.font="20px Georgia";
				ctx.fillStyle = "black";
				ctx.fillText(""+Math.floor(grid[i][j]), (i*hunit), ((j+1)*vunit)-vunit/3);
				

			}
		}
	}

	c.addEventListener("mousedown", highPressure);
	c.addEventListener("mouseup", lowPressure);

	function highPressure(event){
		grid[Math.floor(event.pageX/hunit)][Math.floor(event.pageY/vunit)] = pressureRange;
	}

	function lowPressure(event){
		grid[Math.floor(event.pageX/hunit)][Math.floor(event.pageY/vunit)] = 0;
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


	//TODO figure out how the propagation should happen
	function stepFrame(){
		var maxDiff = pressureRange;
		var rate = .3;
		var loss = .8;

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
				if(j != height-1){
					// south
					if(grid[i][j+1] < current){
						gridChanges[i][j+1] += Math.min(rate*(current - grid[i][j+1]), maxDiff)*loss;
						gridChanges[i][j] -= Math.min(rate*(current - grid[i][j+1]), maxDiff)*loss;
					}
				}
				if (j != 0){
					// north
					if(grid[i][j-1] < current){
						gridChanges[i][j-1] += Math.min(rate*(current - grid[i][j-1]), maxDiff)*loss;
						gridChanges[i][j] -= Math.min(rate*(current - grid[i][j-1]), maxDiff)*loss;
					}
				}
				if(i != width-1){ 
					// east
					if(grid[i+1][j] < current){
						gridChanges[i+1][j] += Math.min(rate*(current - grid[i+1][j]), maxDiff)*loss;
						gridChanges[i][j] -= Math.min(rate*(current - grid[i+1][j]), maxDiff)*loss;
					}
				}
				if(i != 0){
					// west
					if(grid[i-1][j] < current){
						gridChanges[i-1][j] += Math.min(rate*(current - grid[i-1][j]), maxDiff)*loss;
						gridChanges[i][j] -= Math.min(rate*(current - grid[i-1][j]), maxDiff)*loss;
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
