
var vertexColorbuffer;
var r;
function initVertexBuffers2(gl) {
var verticesColors1 = new Float32Array(540);

  var z = 0.0;
  var zp = 3.0;
  var num = 30;
  r = 10;
  var l = (2 * Math.PI * r) / num;
  var theta = Math.asin(l/r);
  var phi = 0.0;
  
  var n = 0;
  var j = 0;
  for(var i = 0; i < num; i++) {
    x = r * Math.cos(phi);
    y = r * Math.sin(phi);
    phi += theta;
    xp = r * Math.cos(phi);
    yp = r * Math.sin(phi);
//verticesColors1[j++] =

    verticesColors1.set([x, y, z, xp, yp, z, x, y, zp, x, y, zp, xp, yp, z, xp, yp, zp], j);
    j += 18;
/*
    vertices.push(x, y, z);
    indices.push(n++);
    vertices.push(xp, yp, z);
    indices.push(n++);
    vertices.push(x, y, zp);
    indices.push(n++);
    vertices.push(x, y, zp);
    indices.push(n++);
    vertices.push(xp, yp, z);
    indices.push(n++);
    vertices.push(xp, yp, zp);
    indices.push(n++);

	console.log(n++ + ", " +n++ + ", " +n++ + ", " +n++ + ", " +n++ + ", " +n++ + ",\n ");


console.log(x + " ," + y + " ," +z + " ," + xp  + " ," + yp  + " ," + z  + "\n ," + x  + " ," + y + " ," + zp + " ," + x + " ," + y + " ," + zp  + "\n ," + xp + " ," + yp + " ," + z  + " ," + xp  " ," + yp + " ," + zp + " ,\n");
*/

  }

  var n = verticesColors1.length / 3;

  // Create a buffer object
  vertexColorbuffer = gl.createBuffer();  
  if (!vertexColorbuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write vertex information to buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors1, gl.STATIC_DRAW);

  var FSIZE = verticesColors1.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  // Assign the buffer object to a_Color and enable the assignment


  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}
