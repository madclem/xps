precision highp float;

uniform float u_height;
uniform float u_percentage;

varying vec3 v_pos;

void main()
{
  vec3 color = vec3(0.,.0,.0);
  vec3 color2 = vec3(.92,.92,.92);

  vec3 c = mix(color, color2, u_percentage);
    // color.r += v_pos.z * 2.;

    float alpha = u_height + .4;
    gl_FragColor = vec4(c,  alpha);
}
