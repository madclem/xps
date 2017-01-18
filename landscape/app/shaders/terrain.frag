precision mediump float;


uniform float alpha;
uniform vec2 resolutions;

void main() {
  vec3 color = vec3(0.);

  float y = gl_FragCoord.y/resolutions.y;
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor *= 1.0 - y;
}
