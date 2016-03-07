
var dirToX = 0.0;

function keydown(ev, player, ground, u_MvpMatrix, currentAngle) {
  switch (ev.keyCode) {
    case 38: // Up arrow key ->
			player.position[2] -= 3.0;
			updateZGroundPosition (player, ground);
			updateColPos (player);
			cameraZ -= 3.0;
      break;
    case 40: // Down arrow key ->
      player.position[2] += 3.0;
			cameraZ += 3.0;
      break;
    case 39: // Right arrow key -> 
      player.theta_position += 3.0;
			dirToX = 1.0;
      currentAngle =  (currentAngle + player.ANGLE_STEP) % 360;
      break;
    case 37: // Left arrow key ->
      player.theta_position -= 3.0;
			dirToX = -1.0;
      currentAngle =  (currentAngle - player.ANGLE_STEP) % 360;
      break;
    default: return; // Skip drawing at no effective action
  }

  player.theta_position %= 360.0;
  var rad = (player.theta_position * Math.PI) / 180.0;
  x = (groundRadius - 1) * Math.cos(rad); 
  y = (groundRadius - 1) * Math.sin(rad);
  // 1 is the radians of the player, without -1 the half player will be outside the ground.
  player.position[0] = x;
  player.position[1] = y;

  return currentAngle;
}

var cylNum = 1;
function updateZGroundPosition (player, ground) {
	if((player.position[2] / 10) * -1 >= cylNum) {
			ground.position[2] -= 10;
			groundPos.push(ground.position[2]);
			cylNum++;																																	
	}
}

// Update Collectable Positions 
function updateColPos (player) {
	if(dimNotSpace) {
		if(player.position[2] - diamondZPos[diamondZPos.length - 1] < minDBPALCL) {
			// Returns a random integer between min (included) and max (included)
			var colNum = Math.floor(Math.random() * (maxColNum - minColNum + 1)) + minColNum; // Number of collectable to initialize in subtunnel
			var sum = colNum + colSliceNum;
			diamondZPos = diamondZPos.slice(Math.max(diamondZPos.length - ((minDBPALCL / lengthBetweenDiamonds) + colNumBehThePlayer), 0.0));

			for(var i = colSliceNum; i < sum; i++) { // 1 is the size of collectable
				// diamondZPos[i] = -1 * lengthBetweenDiamonds * i;
				diamondZPos.push(-1 * lengthBetweenDiamonds * i);
			}

			diamondNumLoading += colNum;

			if(diamondNumLoading >= diamondNumToFill) {
				dimNotSpace = false;
				diamondNumLoading = 0;
				// Number of collectable to initialize in the whole next tunnel.
				diamondNumToFill = Math.floor(Math.random() * (maxFillDiamonds - minFillDiamonds + 1)) + minFillDiamonds;
			}
	//console.log(diamondZPos);
			colSliceNum = sum;
		}
	}
	else {
		var spaceNum = Math.floor(Math.random() * (maxSpaceNum - minSpaceNum + 1)) + minSpaceNum; // Number of spaces to initialize
		colSliceNum += spaceNum;
		dimNotSpace = true;
	}
}

var Position = function(objRadius) {
	this.rad = Math.PI / 180.0;
this.a = 10;
  // 1 is the radians of the collectable, without -1 the half collectable will be outside the ground.
  this.clock0X = (groundRadius - objRadius) * Math.cos(0);
	this.clock0Y = (groundRadius - objRadius) * Math.sin(0);
  this.clock45X = (groundRadius - objRadius) * Math.cos(this.rad * 45);
	this.clock45Y = (groundRadius - objRadius) * Math.sin(this.rad * 45);
  this.clock90X = (groundRadius - objRadius) * Math.cos(this.rad * 90);
	this.clock90Y = (groundRadius - objRadius) * Math.sin(this.rad * 90);
  this.clock135X = (groundRadius - objRadius) * Math.cos(this.rad * 135);
	this.clock135Y = (groundRadius - objRadius) * Math.sin(this.rad * 135);
  this.clock180X = (groundRadius - objRadius) * Math.cos(this.rad * 180);
	this.clock180Y = (groundRadius - objRadius) * Math.sin(this.rad * 180);
  this.clock225X = (groundRadius - objRadius) * Math.cos(this.rad * 225);
	this.clock225Y = (groundRadius - objRadius) * Math.sin(this.rad * 225);
  this.clock270X = (groundRadius - objRadius) * Math.cos(this.rad * 270);
	this.clock270Y = (groundRadius - objRadius) * Math.sin(this.rad * 270);
  this.clock315X = (groundRadius - objRadius) * Math.cos(this.rad * 315);
	this.clock315Y = (groundRadius - objRadius) * Math.sin(this.rad * 315);
}

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}

