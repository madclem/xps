//vertex shader

attribute vec3 a_position;


uniform mat4 u_world;
uniform mat4 u_worldViewProjection;

uniform sampler2D positions;//RenderTarget containing the transformed positions
uniform float pointSize;//size
void main() {

    vec3 a_pos = a_position; // for nothing this line

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, a_position.xy ).xyz;
    //pos now contains a 3D position in space, we can use it as a regular vertex

    //regular projection of our position
    gl_Position = u_worldViewProjection * u_world * vec4( pos, 1.0 );

    //sets the point size
    gl_PointSize = pointSize;
}
