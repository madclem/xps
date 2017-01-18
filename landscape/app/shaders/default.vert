attribute vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
// uniform mat4 u_worldInverseTranspose;

varying vec3 v_normal;
void main() {

  vec3 position = a_position.xyz;
  v_normal = normalize(position.rgb);

  gl_Position =  u_worldViewProjection * u_world * vec4(position, a_position.w);

}
