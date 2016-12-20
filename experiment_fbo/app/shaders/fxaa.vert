// attribute vec2 a_position;
//
// uniform mat4 u_viewMatrix;
// uniform mat4 u_projectionMatrix;
//
// // uniform mat4 u_worldInverseTranspose;
//
// varying vec2 v_position;
// varying vec2 v_textureCoord;
// // varying vec3 v_normal;
// void main() {
//
//   vec2 position = a_position.xy;
//   // v_normal = normalize(position.rg);
//   v_position = a_position;
//
//   v_textureCoord = a_position * .5 + .5;
//
//   gl_Position = vec4(position, 1.0, 1.0);
//
// }



precision mediump float;

//texcoords computed in vertex step
//to avoid dependent texture reads
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 v_textureCoord;

//a resolution for our optimized shader
uniform vec2 u_dimension;
attribute vec2 a_position;
varying vec2 vUv;

void texcoords(vec2 fragCoord, vec2 resolution,
			out vec2 v_rgbNW, out vec2 v_rgbNE,
			out vec2 v_rgbSW, out vec2 v_rgbSE,
			out vec2 v_rgbM) {
	vec2 inverseVP = 1.0 / resolution.xy;
	v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
	v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
	v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
	v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
	v_rgbM = vec2(fragCoord * inverseVP);
}

void main(void) {
   gl_Position = vec4(a_position, 1.0, 1.0);

   v_textureCoord = a_position * .5 + .5;
   //compute the texture coords and send them to varyings
   vUv = (a_position + 1.0) * 0.5;
   vUv.y = 1.0 - vUv.y;
   vec2 fragCoord = vUv * u_dimension;
   texcoords(fragCoord, u_dimension, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
