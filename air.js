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

// make it an nonlinear 
function pressureChangeToColor(linvalue, range){
	var k = range/500;
	//s-shaped function
	var value = (2*range/(1+Math.pow(Math.E, -(1/(k))*linvalue))-range)
	//var value = linvalue;
	var blue = 0;
	var red = 0;
	var green = 0;
	if (value > 0){
		red = 255;
		blue = value.map(0, range, 255, 0);
		green = value.map(0, range, 255, 0);
		return "rgb(" + red + ", " + green + ", " + blue + ")";
	}else{
		blue = 255;
		red = value.map(-1*range, 0, 0, 255);
		green = value.map(-1*range, 0, 0, 255);
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
	var gridMax = .1;
	var gridChanges = [];
	var gridChangesMax = .1;
	var gridChangesCurrentMax = .1;
	var width = 50;
	var hunit = parseInt(c.width)/width;
	var height = 50;
	var vunit = parseInt(c.height)/height;
	var pressureRange = 100;
	var drag = false;
	var dotSize = 1;

	for(var i = 0; i < width; i++){
		grid[i] = [];
		gridChanges[i] =[];
		for(var j = 0; j < height; j++){
			grid[i][j] = pressureRange/2;
			gridChanges[i][j] = 0;
		}
	}

	render();
	function render(){
		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){

				//ctx.fillStyle = pressureToColor(grid[i][j], pressureRange);
				ctx.fillStyle = pressureChangeToColor(gridChanges[i][j], gridChangesMax);
				ctx.fillRect((i*hunit), (j*vunit), hunit, vunit);
				
				if (false){
					ctx.font="20px Georgia";
					ctx.fillStyle = "black";
					ctx.fillText(""+Math.floor(grid[i][j]), (i*hunit), ((j+1)*vunit)-vunit/3);
				}
			}
		}
	}

	c.addEventListener("mousedown", dragStart);
	c.addEventListener("mouseup", dragStop);
	c.addEventListener("mousemove", highPressure);

	function dragStart(){
		drag = true;
	}

	function dragStop(){
		drag = false;
	}

	function highPressure(event){
		if(drag == true){
			for(var i = 0; i < dotSize; i++){
				for(var j = 0; j < dotSize; j++){
					grid[Math.floor(event.pageX/hunit)+i][Math.floor(event.pageY/vunit)+j] += pressureRange*1;
				}
			}
		}
	}

	function lowPressure(event){
		for(var i = 0; i < dotSize; i++){
			for(var j = 0; j < dotSize; j++){
				grid[Math.floor(event.pageX/hunit)+i][Math.floor(event.pageY/vunit)+j] -= pressureRange*1;
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
		var loss = .1;

		// make a new grid to hold the changes
		gridChanges = [];
		for (var i = 0; i < width; i++){
			gridChanges[i] =[];
			for (var j = 0; j < height; j++){
				gridChanges[i][j] = 0;
			}
		}
		gridChangesCurrentMax = 0;

		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				var current = grid[i][j];

				if (j != 0){
					// north
					gridChanges[i][j] += (grid[i][j-1] - current)*loss;
				}
				if(j != height-1){
					// south
					gridChanges[i][j] += (grid[i][j+1] - current)*loss;
				}
				if(i != width-1){ 
					// east
					gridChanges[i][j] += (grid[i+1][j] - current)*loss;
				}
				if(i != 0){
					// west
					gridChanges[i][j] += (grid[i-1][j] - current)*loss;
				}
				gridChangesCurrentMax = Math.max(gridChanges[i][j], gridChangesCurrentMax);
				gridChangesMax = Math.max(gridChangesMax, gridChangesCurrentMax)
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
