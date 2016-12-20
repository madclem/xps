precision mediump float;

uniform sampler2D uSampler;
uniform vec2 u_dimension;

varying vec2 v_position;
// varying vec3 v_normal;

void main() {
  vec4 textureColor = texture2D(uSampler, vec2(gl_FragCoord.x/u_dimension.x, gl_FragCoord.y/u_dimension.y));
  // vec3 color = vec3(v_normal);
  gl_FragColor = textureColor;//vec4(color, 1.0);
}
