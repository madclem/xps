//vertex shader
attribute vec4 a_position;
attribute vec2 uv;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;

varying vec2 vUv;

void main() {
    vec3 pos = a_position.xyz;

    // vUv = vec2(a_position.xy);
    vUv = vec2(uv.x, uv.y);
    gl_Position = u_worldViewProjection * u_world * vec4( a_position.xyz, 1.0 );

    gl_PointSize = 10.0;
}
