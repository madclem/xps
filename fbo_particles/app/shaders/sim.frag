//fragment Shader
precision mediump float;

uniform sampler2D positions;//DATA Texture containing original positions
varying vec2 vUv;
void main() {

    //basic simulation: displays the particles in place.
    vec3 pos = texture2D( positions, vUv ).rgb;
    /*
        we can move the particle here
    */
    // gl_FragColor = vec4( pos,1.0 );
    vec3 color = vec3(.5);
    gl_FragColor = vec4(color, 1.0);
}
