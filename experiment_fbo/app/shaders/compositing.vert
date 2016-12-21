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
varying vec2 v_textureCoord;

//a resolution for our optimized shader
uniform vec2 u_dimension;
attribute vec2 a_position;
varying vec2 vUv;


void main(void) {

   v_textureCoord = a_position * .5 + .5;
   //compute the texture coords and send them to varyings
   vUv = (a_position + 1.0) * 0.5;
  //  vUv.y = 1.0 - vUv.y;
   vec2 fragCoord = vUv * u_dimension;
	 gl_Position = vec4(a_position, 1.0, 1.0);
}
