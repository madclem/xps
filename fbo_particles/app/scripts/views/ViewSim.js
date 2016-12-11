import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/sim.vert'
import fs from '../../shaders/sim.frag'

class ViewSim {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

    let l = width * height;
    let pos = []
    var data = this.getRandomData( width, height, 256 );
    let gl = mcgl.GL.gl;

    if (!gl.getExtension("OES_texture_float")){
      throw new Error( "float textures not supported" );
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new Float32Array(pos));
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, new Float32Array(pos));
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,    //The current texture unit
      0,                //Miplevel (more on this later)
      gl.RGB,          //Internal texture format
      width,                //Width of texture in pixels
      height,                //Height of texture in pixels
      0,                //Ignore this parameter, must be 0
      gl.RGB,          //Type of input array
      gl.FLOAT, //Storage format of pixel data
      new Float32Array(width * height * 3))          //Pixel data
      // new Float32Array(data))          //Pixel data


    this.mesh = new mcgl.Mesh(this.shader.shaderProgram, gl.TRIANGLES);
    let positions = [[-1 * 1024,-1 * 1024,0], [1 * 1024,-1 * 1024,0], [1 * 1024,1 * 1024,0], [-1 * 1024,-1 * 1024, 0], [1 * 1024, 1 * 1024, 0], [-1 * 1024,1 * 1024,0]];
    let indices = [0, 1, 2, 3, 4, 5];
    this.mesh.bufferVertex(positions)
    this.mesh.bufferIndex(indices)
    // this.mesh.bufferData([ [0,1], [1,1], [1,0]], "uv", 2);
    this.mesh.bufferData([ [0,1], [1,1], [1,0],     [0,1], [1,0], [0,0]], "uv", 2);
    // this.mesh = new mcgl.Mesh(this.shader.shaderProgram);
    // let positions = [[-1,-1,0], [1,-1,0], [1,1,0], [-1,-1, 0], [1, 1, 0], [-1,1,0]];
    // let indices = [0, 1, 2, 0, 2, 3];
    // this.mesh.bufferVertex(positions)
    // this.mesh.bufferIndex(indices)
    // this.mesh.bufferData([ [0,1], [1,1], [1,0],     [0,1], [1,0], [0,0]], "uv", 2);

    // this.shader

    // this.mesh.bufferData("uv", new Float32Array(   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ), 2)
  }

  isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  getRandomData( width, height, size ){
      var len = width * height * 3;
      var data = new Float32Array( len );
      while( len-- )data[len] = ( Math.random() -.5 ) * size ;
      return data;
  }

  render(t){

    this.shader.bind();
    mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, this.texture);

    GL.draw(this.mesh);

    // this.shader.uniform("positions", "int", 1)
    // //
    // //
    // mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);
  }
}

export default ViewSim;
