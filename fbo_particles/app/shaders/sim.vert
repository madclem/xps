precision highp float;

attribute vec2 a_position;
varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(a_position, 0.0, 1.0);
    vTextureCoord = a_position * .5 + .5;
}
