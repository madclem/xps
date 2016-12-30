precision mediump float;

uniform sampler2D uSampler;

varying vec2 v_position;
// varying vec3 v_normal;

void main() {
  vec4 textureColor = texture2D(uSampler, vec2(gl_FragCoord.x/1024., gl_FragCoord.y/1024.));
  // vec3 color = vec3(v_normal);
  gl_FragColor = textureColor;//vec4(color, 1.0);
}
