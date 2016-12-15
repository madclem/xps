precision mediump float;


uniform sampler2D texture;
// varying vec3 vPosition;
// varying vec3 vColor;
// uniform vec2 resolutions;
uniform float alpha;

varying float vCounters;
varying vec2 vUV;

void main() {

  vec3 color = vec3(0.0, .0, .0);

  gl_FragColor = vec4(color, alpha);
  gl_FragColor.rgb *= alpha;

  // gl_FragColor.a *= step(vCounters, 1.0);

}
