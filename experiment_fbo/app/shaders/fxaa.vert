attribute vec2 a_position;

uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

// uniform mat4 u_worldInverseTranspose;

varying vec2 v_position;
varying vec2 v_textureCoord;
// varying vec3 v_normal;
void main() {

  vec2 position = a_position.xy;
  // v_normal = normalize(position.rg);
  v_position = a_position;

  v_textureCoord = a_position * .5 + .5;

  gl_Position = vec4(position, 1.0, 1.0);

}
