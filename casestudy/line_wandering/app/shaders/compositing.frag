precision mediump float;

uniform sampler2D uSampler;
uniform vec2 u_dimension;
uniform float u_enabled;
uniform float u_time;
varying vec2 vUv;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void main() {

    // blur
    vec4 colorBlur;
    if (u_enabled > .5) {
        colorBlur = blur9(uSampler, vUv, u_dimension, vec2(1., 0.));
    } else {
        colorBlur = texture2D(uSampler, vUv);
    }
    // gl_FragColor = colorBlur;


    vec4 color = texture2D(uSampler, vUv);
    // color = vec4(0.2,0.2,0.2,1.);

    float strength = 16.0;

    float x = (vUv.x + 4.0 ) * (vUv.y + 4.0 ) * (u_time * 10.);
	   vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.001) * strength;


    // if(vUv.x > 0.5)
    // {
    // 	grain = 1.0 - grain;
		//   gl_FragColor = color * grain;
    // }
    // else
    // {
		  gl_FragColor = colorBlur + grain;
    // }


}
