
var Obj = function() {
	this.g_objDoc = null;
	this.g_drawingInfo = null;
	this.position = new Float32Array(3);

	this.g_modelMatrix = new Matrix4();
	this.g_mvpMatrix = new Matrix4();
	this.g_normalMatrix = new Matrix4();

	this.ANGLE_STEP = 5;
	this.theta_position = 0.0;
}

function rebufferingVsAndNs(gl, a_attribute, num, type, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);  // Assign the buffer object to the attribute variable
	gl.enableVertexAttribArray(a_attribute);  // Enable the assignment
}

function rebufferingIs(model, gl) {
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
}

function drawPlayer(obj, gl, program, angle, viewProjMatrix, model) {
  if (obj.g_objDoc != null && obj.g_objDoc.isMTLComplete()){
    obj.g_drawingInfo = onReadComplete(gl, model, obj.g_objDoc);
    obj.g_objDoc = null;
  }
  if (!obj.g_drawingInfo) return;

  obj.g_modelMatrix.setRotate(angle, 0.0, 0.0, 1.0);
  obj.g_modelMatrix.translate(obj.position[0], obj.position[1], obj.position[2]);

  obj.g_normalMatrix.setInverseOf(obj.g_modelMatrix);
  obj.g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, obj.g_normalMatrix.elements);

  obj.g_mvpMatrix.set(viewProjMatrix);
  obj.g_mvpMatrix.multiply(obj.g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, obj.g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, obj.g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawGround(obj, gl, program, viewProjMatrix, model) {
  if (obj.g_objDoc != null && obj.g_objDoc.isMTLComplete()){
    obj.g_drawingInfo = onReadComplete(gl, model, obj.g_objDoc);
    obj.g_objDoc = null;
  }
  if (!obj.g_drawingInfo) return;

  obj.g_modelMatrix.setTranslate(obj.position[0], obj.position[1], obj.position[2]);

  obj.g_normalMatrix.setInverseOf(obj.g_modelMatrix);
  obj.g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, obj.g_normalMatrix.elements);

  obj.g_mvpMatrix.set(viewProjMatrix);
  obj.g_mvpMatrix.multiply(obj.g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, obj.g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, obj.g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

