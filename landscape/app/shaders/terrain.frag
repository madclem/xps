precision mediump float;


uniform float alpha;
uniform vec2 resolutions;

varying vec3 v_normal;

#define fade 1.0
#define LIGHT_YELLOW vec3(fade, fade, -fade)
#define LIGHT_BLUE vec3(50.0, -fade, 0.0)

#define LIGHT0 vec3(1.0)
#define LIGHT1 vec3(-1.0, -0.5, 0.1)


float diffuse(vec3 N, vec3 L) {
    return max(dot(N, normalize(L)), 0.0);
}
vec3 diffuse(vec3 N, vec3 L, vec3 C) {
    return diffuse(N, L) * C;
}

void main() {
  vec3 color1 = vec3(242./255.0, 230./255., 160./255.);
  // vec3 color1 = vec3(194./255.0, 197./255., 245./255.);
  // vec3 color2 = vec3(244./255.0, 242./255., 199./255.);

  vec3 d0 = diffuse(v_normal, LIGHT0, color1);// * 1.5;
	vec3 d1 = diffuse(v_normal, LIGHT1, color1);// * 1.5;
  vec3 color = vec3(d0 + d1);
  // vec3 color = vec3(0.);

  // float y = gl_FragCoord.y/resolutions.y;
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor *= 1.0 - y;
}















// precision mediump float;


// uniform vec3 color1;
// uniform vec3 color2;
// varying vec3 v_normal;

// float diffuse(vec3 N, vec3 L) {
//   return max(dot(N, normalize(L)), 0.0);
// }

// float diffuse(vec3 N, vec3 L, float density) {
//   return diffuse(N, L) * density;
// }
//
//
// vec3 diffuse(vec3 N, vec3 L, float density, vec3 color) {
//   return diffuse(N, L, density) * color;
// }


// float diffuse(vec3 N, vec3 L) {
// 	return max(dot(N, normalize(L)), 0.0);
// }
//
//
// vec3 diffuse(vec3 N, vec3 L, vec3 C) {
// 	return diffuse(N, L) * C;
// }
//
//
// #define fade 1.0
// #define LIGHT_YELLOW vec3(fade, fade, -fade)
// #define LIGHT_BLUE vec3(50.0, -fade, 0.0)
//
// #define LIGHT0 vec3(1.0)
// #define LIGHT1 vec3(-1.0, -0.5, 0.1)
//
// void main() {
//
//
//   vec3 color1 = vec3(194./255.0, 197./255., 245./255.);
//   vec3 color2 = vec3(244./255.0, 242./255., 199./255.);
//
//   vec3 d0 = diffuse(v_normal, LIGHT0, color1) * 1.5;
// 	vec3 d1 = diffuse(v_normal, LIGHT1, color2) * 1.5;
//   // vec3 d0 = diffuse(v_normal, LIGHT0, vec3(1.0, 1.0, .97)) * 0.2;
// 	// vec3 d1 = diffuse(v_normal, LIGHT1, vec3(.97, .97, 1.0)) * 0.2;
// 	vec3 color = vec3(d0 + d1);
//
//   // float _diffuseYellow = diffuse(v_normal, LIGHT_YELLOW, .5);
//   // float _diffuseBlue = diffuse(v_normal, LIGHT_BLUE, .5);
//   // float _diffuse = _diffuseYellow + _diffuseBlue;
//
//   // _diffuse *= 1.6;
//   // if(_diffuse < .2){
//   //   _diffuse = .2;
//   // }
//
//   // vec3 yellow = vec3(28)
//   // vec3 color1 = vec3(0, 1, 1);
//   // vec3 color2 = vec3(1, 1, 1);
//   // vec3 color = vec3(0,1,1);
//   // vec3 color = vec3(0,1,1);
//   // vec3 color = vec3(mix(_diffuseYellow, _diffuseBlue, _diffuse));
//   // vec3 color = vec3(_diffuse);
//   gl_FragColor = vec4(color,1);
//   // gl_FragColor.rgb *= _diffuse;

// }
