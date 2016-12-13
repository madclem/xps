precision highp float;

attribute vec2 a_position;

uniform vec3 u_viewport;
uniform mat4 u_worldViewProjection;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(a_position, 0.0, 1.0);
    vTextureCoord = a_position * .5 + .5;

    const float radius = 0.01;
    float distOffset = u_viewport.y * u_worldViewProjection[1][1] * radius / gl_Position.w;
    gl_PointSize = distOffset * (2.0);
}
