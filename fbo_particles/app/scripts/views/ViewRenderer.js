import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/render.vert'
import fs from '../../shaders/render.frag'

class ViewRenderer {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

    // create the particles
    let l = (width * height );
    let vertices = new Float32Array( l * 3 );
    let count = 0;
    let indices = [];

    for ( var i = 0; i < l; i++ ) {

        var i3 = i * 3;
        vertices[ i3 ] = ( i % width ) / width ;
        vertices[ i3 + 1 ] = ( i / width ) / height;

        indices.push(count);
        count ++;
    }

    this.mesh = new mcgl.Mesh(this.shader.shaderProgram, mcgl.GL.gl.POINTS);
    this.mesh.bufferVertex(vertices);
    // this.mesh.bufferData("positions", vertices, 3);
    this.mesh.bufferIndex(indices);


  }

  render(t){

    this.shader.bind();

    mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    GL.draw(this.mesh);

    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    // mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);
  }
}

export default ViewRenderer;
