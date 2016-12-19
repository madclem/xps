precision highp float;

varying vec3 vColor;

void main(void) {
    gl_FragColor = vec4(vColor, 1.0);
    // gl_FragColor = vec4(vec3(0.), 1.0);
}
