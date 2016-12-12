precision highp float;
attribute vec3 a_position;
attribute vec2 a_textureCoord;


uniform mat4 u_world;
uniform mat4 u_worldViewProjection;

varying vec2 vTextureCoord;
varying vec3 vColor;

void main(void) {
	vColor      = a_position;
	vec3 pos    = vec3(a_textureCoord, 0.0);
	gl_Position = vec4(pos, 1.0);
  gl_PointSize = 1.0;
}
