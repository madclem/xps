import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/sim.vert'
import fs from '../../shaders/sim.frag'

class ViewSim {
  constructor(width, height){
    this.time = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

    this.mesh = new mcgl.geom.BigTriangle(this.shader.shaderProgram, GL.gl.POINTS);
  }

  render(t){
    this.time += .01;
    this.shader.bind();
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);

    t.bind();
    // GL.gl.activeTexture(GL.gl.TEXTURE0);
    this.shader.uniform("time", "float", this.time)
    this.shader.uniform("viewport", "vec2", [GL.gl.viewport.width, GL.gl.viewport.height])

    GL.draw(this.mesh);

    // //
    // //
    // mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);
  }
}

export default ViewSim;
