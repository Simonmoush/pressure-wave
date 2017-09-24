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
	var pressureRange = 10;

	for(var i = 0; i < width; i++){
		grid[i] = [];
		for(var j = 0; j < height; j++){
		grid[i][j] = Math.random()*pressureRange;
		}
	}

	render();
	function render(){
		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				var currentSquare = grid[i][j];

				ctx.fillStyle = pressureToColor(grid[i][j], pressureRange);
				ctx.fillRect((i*hunit), (j*vunit), hunit, vunit);

				ctx.font="20px Georgia";
				ctx.fillStyle = "black";
				ctx.fillText(""+Math.floor(grid[i][j]), (i*hunit), ((j+1)*vunit)-vunit/3);
			}
		}
	}

	window.onclick = function(){
		stepFrame();
		render();
	};

	function update(){
		stepFrame();
		render();
		window.requestAnimationFrame(update);
	}
	//window.requestAnimationFrame(update);

	function stepFrame(){

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

				if(j == 0){
					//north is out of bounds and south is in bounds // assumes a grid with width and height > 1
					
					// south is in bounds
					if(grid[i][j+1] < grid[i][j]){
						// south is lower pressure than current
						gridChanges[i][j+1] += 1;
						gridChanges[i][j] -= 1;
					}
					if(i == 0){ // east is in bounds and west is out of bounds TODO FIX
						
						// east and southeast are in bounds
						
						// east
						if(grid[i+1][j] < grid[i][j]){
							gridChanges[i+1][j] += 1;
							gridChanges[i][j] -= 1;
						}

						//southeast
						if(grid[i+1][j+1] < grid[i][j]){
							gridChanges[i+1][j+1] += 1;
							gridChanges[i][j] -= 1;
						}
					}else if(i == width-1){
						// west and southwest are in bounds

						//west
						if(grid[i-1][j] < grid[i][j]){
							gridChanges[i-1][j] += 1;
							gridChanges[i][j] -= 1;
						}

						//southwest
						if(grid[i-1][j+1] < grid[i][j]){
							gridChanges[i-1][j+1] += 1;
							gridChanges[i][j] -= 1;
						}
					}
				}else if (j == height-1){
					//south is out of bounds and north is in bounds // assumes a grid with width and height > 1
					
					// north is in bounds
					if(grid[i][j-1] < grid[i][j]){
						gridChanges[i][j-1] += 1;
						gridChanges[i][j] -= 1;
					}

					if(i == 0){
						// east and northeast are in bounds
						
						// east
						if(grid[i+1][j] < grid[i][j]){
							gridChanges[i+1][j] += 1;
							gridChanges[i][j] -= 1;
						}

						//northeast
						if(grid[i+1][j-1] < grid[i][j]){
							gridChanges[i+1][j-1] += 1;
							gridChanges[i][j] -= 1;
						}
					}else if(i == width-1){
						// west and northwest are in bounds

						//west
						if(grid[i-1][j] < grid[i][j]){
							gridChanges[i-1][j] += 1;
							gridChanges[i][j] -= 1;
						}

						//northwest
						if(grid[i-1][j-1] < grid[i][j]){
							gridChanges[i-1][j-1] += 1;
							gridChanges[i][j] -= 1;
						}
					}
				}
			}
		}

		// apply the changes from the gridChanges array to the real grid
		for(var i = 0; i < width; i++){
			for(var j = 0; j < height; j++){
				grid[i][j] += gridChanges[i][j];
			}
		}
	}
}

setup();
