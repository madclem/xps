precision mediump float;

varying vec3 v_normal;

void main() {
  vec3 color = vec3(v_normal);
  gl_FragColor = vec4(color, 1.0);
}
