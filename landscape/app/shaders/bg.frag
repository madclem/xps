precision highp float;
uniform float u_percentage;

void main() {
  vec3 color = vec3(.92,.92,.92);
  vec3 color2 = vec3(0.,.0,.0);

  vec3 c = mix(color, color2, u_percentage);

  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor *= 1.0 - y;
}
