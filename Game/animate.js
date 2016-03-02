
function keydown(ev, player, ground, u_MvpMatrix, currentAngle) {
  switch (ev.keyCode) {
    case 38: // Up arrow key -> the positive rotation of joint1 around the z-axis
			player.position[2] -= 3.0;
			updateZCylPosition (player, ground);
      break;
    case 40: // Down arrow key -> the negative rotation of joint1 around the z-axis
      player.position[2] += 3.0;
      break;
    case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
      player.theta_position += 0.1;
      currentAngle =  (currentAngle + player.ANGLE_STEP) % 360;
      break;
    case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
      player.theta_position -= 0.1;
      currentAngle =  (currentAngle - player.ANGLE_STEP) % 360;
      break;
    default: return; // Skip drawing at no effective action
  }

  player.theta_position %= 360.0;
  x = 5 * Math.cos(player.theta_position);
  y = 5 * Math.sin(player.theta_position);
  player.position[0] = x;
  player.position[1] = y;

  return currentAngle;
}

var cylNum = 1;
function updateZCylPosition (player, ground) {
	if((player.position[2] / 10) * -1 >= cylNum) {
			ground.position[2] -= 10;
			groundPos.push(ground.position[2]);
			cylNum++;
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

