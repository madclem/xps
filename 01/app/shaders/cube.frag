precision mediump float;

uniform sampler2D u_texture;

varying vec3 v_normal;
varying vec2 v_texcoord;

void main() {
  gl_FragColor = texture2D(u_texture, v_texcoord);
  // gl_FragColor = vec4(.2, .3, .3, 1.0);
}
