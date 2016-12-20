import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/fxaa.vert'
import fs from '../../shaders/fxaa.frag'

class ViewFXAA {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);

		this.mesh = new mcgl.geom.BigTriangle(this.shader.shaderProgram);

  }

  render(t){

    this.shader.bind();
    this.shader.uniform("u_width", "float", window.innerWidth)
    this.shader.uniform("u_height", "float", window.innerHeight)
    t.bind();

    GL.draw(this.mesh);
  }
}

export default ViewFXAA;
