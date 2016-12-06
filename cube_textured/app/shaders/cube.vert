attribute vec4 a_position;
attribute vec2 a_textureCoord;
attribute vec4 a_normal;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
// uniform mat4 u_worldInverseTranspose;

varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {

  vec3 position = a_position.xyz;
  v_normal = normalize(a_normal.rgb);

  v_texcoord = a_textureCoord;
  gl_Position =  u_worldViewProjection * u_world * vec4(position, a_position.w);

}
