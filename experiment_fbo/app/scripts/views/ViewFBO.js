import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/fbo.vert'
import fs from '../../shaders/fbo.frag'

class ViewFBO {
  constructor(texture){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.texture = texture;


    this.bigTriangle = new mcgl.geom.BigTriangle(this.shader.shaderProgram);
  }

  render(t){

    this.shader.bind(); // just to use propgram
    // this.texture.bind(0);

    // mcgl.GL.gl.activeTexture(mcgl.GL.gl.TEXTURE0 + 0);

    mcgl.GL.gl.activeTexture(mcgl.GL.gl.TEXTURE0);
    mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, this.texture);
    this.shader.uniform("uSampler", "int", 0);


    this.tick++;

    // this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    GL.draw(this.bigTriangle);
  }
}

export default ViewFBO;
