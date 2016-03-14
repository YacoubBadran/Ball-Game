
function drawPlayer(obj, gl, program, viewProjMatrix, model) {
  if (obj.g_objDoc != null && obj.g_objDoc.isMTLComplete()){
    obj.g_drawingInfo = onReadComplete(gl, model, obj.g_objDoc);
    obj.g_objDoc = null;
  }
  if (!obj.g_drawingInfo) return;

 /**
  *〈 ” translated   and   then   rotated ”  coordinates 〉 =
  *〈 rotation   matrix 〉 × ( 〈 translation   matrix 〉 × 〈 original   coordinates 〉 ) 
  * rotate then translate, in the program in the opposit order
  * page 123 in the book
	*/
  obj.g_modelMatrix.setTranslate(obj.position[0], obj.position[1], obj.position[2]);
  obj.g_modelMatrix.rotate(obj.angle, 0.0, 0.0, 1.0);

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

function drawDiamond(obj, gl, program, viewProjMatrix, model) {
  if (obj.g_objDoc != null && obj.g_objDoc.isMTLComplete()){
    obj.g_drawingInfo = onReadComplete(gl, model, obj.g_objDoc);
    obj.g_objDoc = null;
  }
  if (!obj.g_drawingInfo) return;

  obj.g_modelMatrix.setTranslate(obj.position[0], obj.position[1], obj.position[2]);
  obj.g_modelMatrix.rotate(obj.angle, 0, 0, 1);

  obj.g_normalMatrix.setInverseOf(obj.g_modelMatrix);
  obj.g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, obj.g_normalMatrix.elements);

  obj.g_mvpMatrix.set(viewProjMatrix);
  obj.g_mvpMatrix.multiply(obj.g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, obj.g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, obj.g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

function drawWall(obj, gl, program, viewProjMatrix, model) {
  if (obj.g_objDoc != null && obj.g_objDoc.isMTLComplete()){
    obj.g_drawingInfo = onReadComplete(gl, model, obj.g_objDoc);
    obj.g_objDoc = null;
  }
  if (!obj.g_drawingInfo) return;

  obj.g_modelMatrix.setTranslate(obj.position[0], obj.position[1], obj.position[2]);
  obj.g_modelMatrix.rotate(obj.angle, 0, 0, 1);

  obj.g_normalMatrix.setInverseOf(obj.g_modelMatrix);
  obj.g_normalMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, obj.g_normalMatrix.elements);

  obj.g_mvpMatrix.set(viewProjMatrix);
  obj.g_mvpMatrix.multiply(obj.g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, obj.g_mvpMatrix.elements);

  gl.drawElements(gl.TRIANGLES, obj.g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
}

