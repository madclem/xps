//vertex shader
precision highp float;

attribute vec3 a_position;


uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat4 u_transform;
uniform float u_height;
uniform float u_time;

uniform vec3 u_position;

uniform sampler2D positions;//RenderTarget containing the transformed positions
varying vec3 v_pos;
// uniform float pointSize;//size
void main() {

    vec3 a_pos = a_position; // for nothing this line

    // if( == 0){
    //   discard;
    // }
    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = a_position * 1.;//texture2D( positions, a_position.xy ).xyz * 1.;
    // vec3 pos = texture2D( positions, a_position.xy ).xyz * 1.;
    pos.z = texture2D( positions, a_position.xy ).x * u_height/4. * (sin(a_position.y * 1.) + .02);
    v_pos = pos;
    // pos.z = texture2D( positions, a_position.xy ).x * u_height * (pow(a_position.y, 1.8) + .02);
    // pos.z = texture2D( positions, a_position.xy ).x * u_height * pow(a_position.y, 1. + pow(sin(u_time/100.), 3.) * .6);
    // float alpha = pow(a_position.x, 2.);
    pos += u_position;
    //pos now contains a 3D position in space, we can use it as a regular vertex

    //regular projection of our position
    gl_Position = u_projectionMatrix * u_viewMatrix * u_transform * vec4( pos, 1.0 );
    // gl_Position = u_projectionMatrix * u_viewMatrix * u_transform * vec4( pos, a_position.x * alpha );

    //sets the point size
    gl_PointSize = 1.0;// pointSize;
}
