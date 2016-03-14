
function keydown(ev) {
	var disToMoveInZ = 2.0;
	var thetaToMoveInXY = 2.0;

  switch (ev.keyCode) {
    case 38: // Up arrow key ->
			player.position[2] -= disToMoveInZ;
			cameraZPos -= disToMoveInZ;
			updateGroundPos();
			updateColPos();
			doseTouchDmdOrWall();
      break;
    case 40: // Down arrow key ->
      player.position[2] += disToMoveInZ;
			cameraZPos += disToMoveInZ;
			doseTouchDmdOrWall();
      break;
    case 39: // Right arrow key -> 
      player.theta += thetaToMoveInXY;
			doseTouchDmdOrWall();
      break;
    case 37: // Left arrow key ->
      player.theta -= thetaToMoveInXY;
			doseTouchDmdOrWall();
      break;
    default: return; // Skip drawing at no effective action
  }

  player.theta %= 360.0;
  var rad = (player.theta * Math.PI) / 180.0;
  player.position[0] = (ground.dim[0] / 2 - player.dim[0] / 2) * Math.cos(rad);
  player.position[1] = (ground.dim[0] / 2 - player.dim[1] / 2) * Math.sin(rad);
}

function updateGroundPos() {
	while(player.position[2] - groundZPos[groundZPos.length - 1] <= distanceBetweenPlayerAndLastGround) {
			groundZPos.push(groundZPos[groundZPos.length - 1] - ground.dim[2]);
	}
	
	if(Math.abs(player.position[2] - groundZPos[0])>= distanceBetweenPlayerAndFirstGround) {
		groundZPos = groundZPos.slice(1);
	}
}

// Update Collectables Position
function updateColPos() {
	if(colNotSpace) {
		if(player.position[2] - dmdZPos[dmdZPos.length - 1] < distanceBetweenPlayerAndLastCollectable) {
			// Returns a random integer between min (included) and max (included)
			var colNumToInit = Math.floor(Math.random() * (maxColNum - minColNum + 1)) + minColNum; // Number of collectable to initialize in subtunnel

			var firstColToInit = Math.max(dmdZPos.length - (collectablesBetweenPlayerAndLastCollectable + collectablesNumBehindThePlayer), 0.0);

			dmdZPos = dmdZPos.slice(firstColToInit);
			dmdZ0Pos = dmdZ0Pos.slice(firstColToInit);
			dmdZ90Pos = dmdZ90Pos.slice(firstColToInit);
			dmdZ180Pos = dmdZ180Pos.slice(firstColToInit);
			dmdZ270Pos = dmdZ270Pos.slice(firstColToInit);
			wallZPos = wallZPos.slice(firstColToInit);

			// temp : the number of collectables and spaces from the beginning of the game
			var temp = colNumToInit + allCollectablesAndSpacesInitialized;
			var tempArr = [];
			for(var i = allCollectablesAndSpacesInitialized; i < temp; i++) {
				tempArr.push(-1 * distanceBetweenTwoCol * i);
			}

			dmdZPos = dmdZPos.concat(tempArr);
			dmdZ0Pos = dmdZ0Pos.concat(tempArr);
			dmdZ90Pos = dmdZ90Pos.concat(tempArr);
			dmdZ180Pos = dmdZ180Pos.concat(tempArr);
			dmdZ270Pos = dmdZ270Pos.concat(tempArr);

			wallZPos = wallZPos.concat(tempArr);

			allCollectablesAndSpacesInitialized = temp;
			colNotSpace = false;
		}
	}
	else {
		var spaceNum = Math.floor(Math.random() * (maxSpaceNum - minSpaceNum + 1)) + minSpaceNum; // Number of spaces to initialize
		allCollectablesAndSpacesInitialized += spaceNum;
		colNotSpace = true;
	}
}

function doseTouchDmdOrWall() { 
////////////////////////////////////////////////////////////////
// Touch collectable

	if (player.position[0] <= xDistancePlayerDiamondCenters && player.position[0] >= -1 * xDistancePlayerDiamondCenters) { // |
		if (player.position[1] > 0) { // Above
			touchRowDmd(dmdZ90Pos, player);
		} else { // Below
			touchRowDmd(dmdZ270Pos, player);
		}
	} else {
		if (player.position[1] <= yDistancePlayerDiamondCenters && player.position[1] >= -1 * yDistancePlayerDiamondCenters) { // ___
			if (player.position[0] > 0) { // Right
				touchRowDmd(dmdZ0Pos, player);
			} else { // Left
				touchRowDmd(dmdZ180Pos, player);
			}
		}
	}

////////////////////////////////////////////////////////////////
// Touch wall

	var playerTheta = Math.abs(player.theta);

	if((playerTheta >= playerThetaToTouchTheWall.thetaB45 && playerTheta <= playerThetaToTouchTheWall.thetaA45) || 
		(playerTheta >= playerThetaToTouchTheWall.thetaB135 && playerTheta <= playerThetaToTouchTheWall.theraA135) || 
		(playerTheta >= playerThetaToTouchTheWall.thetaB225 && playerTheta <= playerThetaToTouchTheWall.theraA225) || 
		(playerTheta >= playerThetaToTouchTheWall.thetaB315 && playerTheta <= playerThetaToTouchTheWall.theraA315)) {
		/**
		 * Replace the loop with function to check 'Game Over' with constant time.
		 * wallZPos.splice(i, (player.position[2] - wallZPos[0]) / number);
		 */
		for(var i = 0; i < wallZPos.length; i++) {
			if(Math.abs(player.position[2] - wallZPos[i]) <= zDistancePlayerWallCenters) {
				console.log('Game Over!');
			}
		}
	}
}

function touchRowDmd(row) {
	/**
	 * Replace the loop with function to get the diamond with constant time.
	 * row.splice(i, (player.position[2] - row[0]) / distanceBetweenTwoCol);
	 */
	for(var i = 0; i < row.length; i++) {
		if(row[i] != null && Math.abs(player.position[2] - row[i]) <= zDistancePlayerDiamondCenters) {
			//row.splice(i, 1); I delete it because "null" is better and keep the size of the array, if I not delete it there will be many falts in
			//slice method of an array to delete the collectable behind the player.
			row[i] = null;
			break; // Because the player can not touch tow diamond at the same time.
		}
	}
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

