
var groundPos = [];

function main() {
  var canvas = document.getElementById('webgl');

  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  var program_player = createProgram(gl, GROUND_VSHADER_SOURCE, GROUND_FSHADER_SOURCE);
  var program_ground = createProgram(gl, GROUND_VSHADER_SOURCE, GROUND_FSHADER_SOURCE);
  var program_cyl = createProgram(gl, CYL_VSHADER_SOURCE, CYL_FSHADER_SOURCE);

  if (!program_player || !program_cyl || !program_ground) {
    console.log('Failed to intialize shaders.');
    return;
  }

  gl.clearColor(0.3, 0.3, 0.3, 1.0);
  gl.enable(gl.DEPTH_TEST);

  program_player.a_Position = gl.getAttribLocation(program_player, 'a_Position');
  program_player.a_Normal = gl.getAttribLocation(program_player, 'a_Normal');
  program_player.a_Color = gl.getAttribLocation(program_player, 'a_Color');
  program_player.u_MvpMatrix = gl.getUniformLocation(program_player, 'u_MvpMatrix');
  program_player.u_NormalMatrix = gl.getUniformLocation(program_player, 'u_NormalMatrix');

  program_ground.a_Position = gl.getAttribLocation(program_ground, 'a_Position');
  program_ground.a_Normal = gl.getAttribLocation(program_ground, 'a_Normal');
  program_ground.a_Color = gl.getAttribLocation(program_ground, 'a_Color');
  program_ground.u_MvpMatrix = gl.getUniformLocation(program_ground, 'u_MvpMatrix');
  program_ground.u_NormalMatrix = gl.getUniformLocation(program_ground, 'u_NormalMatrix');

  if (program_player.a_Position < 0 ||  program_player.a_Normal < 0 || program_player.a_Color < 0 ||
      !program_player.u_MvpMatrix || !program_player.u_NormalMatrix) {
    console.log('attribute, can not get the uniform location of program_player uniforms'); 
    return;
  }

  if (program_ground.a_Position < 0 ||  program_ground.a_Normal < 0 || program_ground.a_Color < 0 ||
      !program_ground.u_MvpMatrix || !program_ground.u_NormalMatrix) {
    console.log('attribute, can not get the uniform location of program_ground uniforms'); 
    return;
  }

/*
  program_cyl.a_Position = gl.getAttribLocation(program_cyl, 'a_Position');
  var u_MvpMatrix = gl.getUniformLocation(program_cyl, 'u_MvpMatrix');

  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  var modelMatrix = new Matrix4(); // Model matrix
  var viewMatrix = new Matrix4();  // View matrix
  var projMatrix = new Matrix4();  // Projection matrix
  var mvpMatrix = new Matrix4();   // Model view projection matrix

  // Calculate the view matrix and the projection matrix
  viewMatrix.setLookAt(0, 0, 20, 0, 0, 0, 0, 1, 0);
  projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
  // Calculate the model view projection matrix
  mvpMatrix.set(projMatrix).multiply(viewMatrix);
*/

  // Prepare empty buffer objects for vertex coordinates, colors, and normals
	var modelGround = initVertexBuffers(gl, program_ground);
  if (!modelGround) {
    console.log('Failed to set the vertex information in modelGround');
    return;
	}

  var modelPlayer = initVertexBuffers(gl, program_player);
  if (!modelPlayer) {
    console.log('Failed to set the vertex information in modelPlayer');
    return;
  }

/*
  gl.program = program_cyl;
  var verticesNum = initVertexBuffers2(gl);
  if (verticesNum < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.useProgram(program_cyl);
  // Pass the model view projection matrix
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
*/

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 5000.0);
  viewProjMatrix.lookAt(0.0, 20.0, 50.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

	var player = new Obj();
	var ground = new Obj();

  readOBJFile(player, 'objects/Ball.obj', gl, modelPlayer, 2, true);
	readOBJFile(ground, 'objects/Cylinder.obj', gl, modelGround, 10, true);
//?application/xhtml+xml

  var currentAngle = 0.0;

  document.onkeydown = function(ev){ currentAngle = keydown(ev, player, ground, program_player.u_MvpMatrix, currentAngle); };
	groundPos.push(0.0);

  var tick = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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
/*
    gl.useProgram(program_cyl);
    gl.program = program_cyl;

    rebufferingVsAndNs(gl, program_cyl.a_Position, 3, gl.FLOAT, vertexColorbuffer); // Vertex coordinates

    gl.drawArrays(gl.TRIANGLES, 0, verticesNum);
*/
    requestAnimationFrame(tick, canvas);
  };
  tick();
}


