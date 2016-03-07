
var groundPos = [];
var diamondXPos = [];
var diamondYPos = [];
var diamondZPos = [];
var diamondLength = 1;
var lengthBetweenDiamonds = diamondLength * 3;
// Number of collectable to initialize in one row
var minColNum = 3, maxColNum = 12;
var groundRadius = 5;
// Min differece between player and last collectable location
var minDBPALCL = 20;
// Collectable number behind the player
var colNumBehThePlayer = 3;
var cameraZ = 50.0;
var colSliceNum = 0;
var minSpaceNum = 3, maxSpaceNum = 6;
// Number of collectable to initialize in one tunnel
var minFillDiamonds = 20,maxFillDiamonds = 50, diamondNumLoading = 0, diamondNumToFill;
var dimNotSpace = true;

function main() {
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  var program_player = createProgram(gl, PLAYER_VSHADER_SOURCE, PLAYER_FSHADER_SOURCE);
  var program_ground = createProgram(gl, GROUND_VSHADER_SOURCE, GROUND_FSHADER_SOURCE);
  var program_diamond = createProgram(gl, DIAMOND_VSHADER_SOURCE, DIAMOND_FSHADER_SOURCE);
  var program_wall = createProgram(gl, WALL_VSHADER_SOURCE, WALL_FSHADER_SOURCE);
  if (!program_player || !program_ground || !program_diamond || !program_wall) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.clearColor(0.3, 0.3, 0.3, 1.0);
  gl.enable(gl.DEPTH_TEST);

	var l1 = getLocations(program_player, 'program_player', gl);
	var l2 = getLocations(program_ground, 'program_ground', gl);
	var l3 = getLocations(program_diamond, 'program_diamond', gl);
	var l4 = getLocations(program_wall, 'program_wall', gl);
	if(!l1 || !l2 || !l3 || !l4) {
		return;
	}

	var modelGround = initBuffers(gl, program_ground, 'modelGround');
	var modelPlayer = initBuffers(gl, program_player, 'modelPlayer');
	var modelDiamond = initBuffers(gl, program_diamond, 'modelDiamond');
	var modelWall = initBuffers(gl, program_wall, 'modelWall');
  if (!modelGround || !modelPlayer || !modelDiamond || !modelWall) {
    return;
	}

	var player = new Obj();
	var ground = new Obj();
	var diamond = new Obj();
	var wall = new Obj();

  readOBJFile(player, 'objects/Ball.obj', gl, modelPlayer, 1, true);
	readOBJFile(ground, 'objects/Cylinder.obj', gl, modelGround, 10, true);
	// 1 * 1 * 1.5
	readOBJFile(diamond, 'objects/diamond.obj', gl, modelDiamond, 2, true);
	// 1 * 2 * 1
	readOBJFile(wall, 'objects/Ball.obj', gl, modelWall, 2, true);
	//?application/xhtml+xml

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 5000.0);
  viewProjMatrix.lookAt(0.0, 2.0, cameraZ, 0.0, 0.0, player.position[2], 0.0, 1.0, 0.0);

  var currentAngle = 0.0;

  document.onkeydown = function(ev){ currentAngle = keydown(ev, player, ground, program_player.u_MvpMatrix, currentAngle); };
	groundPos.push(0.0);

	diamondZPos.push(0.0); colSliceNum++;
	var diamondXYPos = new Position(1.5);
	diamondNumToFill = Math.floor(Math.random() * (maxFillDiamonds - minFillDiamonds + 1)) + minFillDiamonds;

  var tick = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 5000.0);
		viewProjMatrix.lookAt(0.0, 2.0, cameraZ, 0.0, 0.0, player.position[2], 0.0, 1.0, 0.0);

    gl.useProgram(program_player);
    gl.program = program_player;

    rebufferingVsAndNs(gl, program_player.a_Position, 3, gl.FLOAT, modelPlayer.vertexBuffer); 
    rebufferingVsAndNs(gl, program_player.a_Normal, 3, gl.FLOAT, modelPlayer.normalBuffer);
    rebufferingIs(modelPlayer, gl);

    drawPlayer(player, gl, gl.program, currentAngle, viewProjMatrix, modelPlayer);

////////////////////////////////////////////////////////////////

    gl.useProgram(program_ground);
    gl.program = program_ground;

    rebufferingVsAndNs(gl, program_ground.a_Position, 3, gl.FLOAT, modelGround.vertexBuffer); 
    rebufferingVsAndNs(gl, program_ground.a_Normal, 3, gl.FLOAT, modelGround.normalBuffer);
    rebufferingIs(modelGround, gl);

		for(var i = 0; i < groundPos.length; i++) {
			ground.position[2] = groundPos[i];
			drawGround(ground, gl, gl.program, viewProjMatrix, modelGround);
		}

////////////////////////////////////////////////////////////////

    gl.useProgram(program_diamond);
    gl.program = program_diamond;

    rebufferingVsAndNs(gl, program_diamond.a_Position, 3, gl.FLOAT, modelDiamond.vertexBuffer); 
    rebufferingVsAndNs(gl, program_diamond.a_Normal, 3, gl.FLOAT, modelDiamond.normalBuffer);
    rebufferingIs(modelDiamond, gl);
	
		for(var i = 0; i < diamondZPos.length; i++) {
			diamond.position[2] = diamondZPos[i];
			diamond.position[0] = diamondXYPos.clock0X;
			diamond.position[1] = diamondXYPos.clock0Y;
			drawDiamond(diamond, gl, gl.program, 0, viewProjMatrix, modelDiamond);

			diamond.position[0] = diamondXYPos.clock90X;
			diamond.position[1] = diamondXYPos.clock90Y;
			drawDiamond(diamond, gl, gl.program, 90, viewProjMatrix, modelDiamond);


			diamond.position[0] = diamondXYPos.clock180X;
			diamond.position[1] = diamondXYPos.clock180Y;
			drawDiamond(diamond, gl, gl.program, 180, viewProjMatrix, modelDiamond);

			diamond.position[0] = diamondXYPos.clock270X;
			diamond.position[1] = diamondXYPos.clock270Y;
			drawDiamond(diamond, gl, gl.program, 270, viewProjMatrix, modelDiamond);
		}

////////////////////////////////////////////////////////////////

    gl.useProgram(program_wall);
    gl.program = program_wall;

    rebufferingVsAndNs(gl, program_wall.a_Position, 3, gl.FLOAT, modelWall.vertexBuffer); 
    rebufferingVsAndNs(gl, program_wall.a_Normal, 3, gl.FLOAT, modelWall.normalBuffer);
    rebufferingIs(modelWall, gl);

		for(var i = 0; i < diamondZPos.length; i++) {
			wall.position[2] = diamondZPos[i];
			wall.position[0] = diamondXYPos.clock45X;
			wall.position[1] = diamondXYPos.clock45Y;
    	drawWall(wall, gl, gl.program, 45, viewProjMatrix, modelWall);

			wall.position[0] = diamondXYPos.clock135X;
			wall.position[1] = diamondXYPos.clock135Y;
    	drawWall(wall, gl, gl.program, 135, viewProjMatrix, modelWall);


			wall.position[0] = diamondXYPos.clock225X;
			wall.position[1] = diamondXYPos.clock225Y;
    	drawWall(wall, gl, gl.program, 225, viewProjMatrix, modelWall);

			wall.position[0] = diamondXYPos.clock315X;
			wall.position[1] = diamondXYPos.clock315Y;
    	drawWall(wall, gl, gl.program, 315, viewProjMatrix, modelWall);
		}

////////////////////////////////////////////////////////////////

    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function getLocations(program, programName, gl) {
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');

  if (program.a_Position < 0 ||  program.a_Normal < 0 || program.a_Color < 0 ||
      !program.u_MvpMatrix || !program.u_NormalMatrix) {
    console.log(programName + ' : can not get the uniform or attribute location of program'); 
    return false;
  }

	return true;
}

function initBuffers(gl, program, modelName) {
	var model = initVertexBuffers(gl, program);
  if (!model) {
    console.log('Failed to set the vertex information in ' + modelName);
    return null;
	}

	return model;
}



