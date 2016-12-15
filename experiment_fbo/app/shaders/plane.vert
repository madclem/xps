attribute vec4 a_position;

uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
// uniform mat4 u_viewMatrixInverseTranspose;


void main() {
  // Multiply the position by the matrix.

  vec3 surfaceWorldPosition = (u_viewMatrix * a_position).xyz;


  vec3 position = a_position.xyz;

  // position.yz = rotate(position.yz, sin(time * 0.1));
  // position.xz = rotate(position.xz, time * 2.1);

  gl_Position = u_projectionMatrix * u_viewMatrix * vec4(position, a_position.w);

}
