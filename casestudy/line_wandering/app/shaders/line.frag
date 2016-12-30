precision mediump float;


uniform sampler2D texture;
// varying vec3 vPosition;
// varying vec3 vColor;
// uniform vec2 resolutions;
uniform float alpha;

varying float vCounters;
varying vec2 vUV;

void main() {

  // vec4 color = vec4(1., 1., .0, 1.);;
  // vec4 color = vec4(1.0);
  // vec4 colorEnd = color * texture2D( texture, vUV );

  // if(colorEnd.a < .01){
  //   discard;
  // }

  // colorEnd.a = 1.0;
  // color *= texture2D( texture, vUV );

  // gl_FragColor = vec4(0., .0, .0, alpha);
  // gl_FragColor = colorEnd;

  // vec3 color = vec3(0.0, .0, .0);
  //
  // color.a = colorEnd.a;
  gl_FragColor = vec4(vec3(.2), alpha);

  // gl_FragColor.rgb *= alpha;

  // gl_FragColor.a *= step(vCounters, 1.0);

}
