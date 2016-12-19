precision highp float;

uniform float u_height;
varying vec3 v_pos;

void main()
{
    vec3 color = vec3( 0., 0., 0. );
    // color.r += v_pos.z * 2.;

    float alpha = u_height + .4;
    gl_FragColor = vec4(color,  alpha);
}
