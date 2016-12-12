import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/render.vert'
import fs from '../../shaders/render.frag'

class ViewRenderer {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();


    let positions = [];
		let indices = [];
		let count = 0;
		// let totalParticles = numParticles * numParticles;
		let ux, uy;

		for(let j = 0; j < width; j++) {
			for(let i = 0; i < height; i++) {
				ux = (i / width) * 1;
				uy = (j / height) * 1;
				indices.push(count);
				count ++;

        positions.push([ux, uy, 0]);

			}
		}


		this.mesh = new mcgl.Mesh(this.shader.shaderProgram, GL.gl.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferIndex(indices);
  }

  render(t){

    this.shader.bind();

    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    t.bind();
    // mcgl.GL.gl.activeTexture(mcgl.GL.gl.TEXTURE0);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    this.shader.uniform("positions", "int", 0);

    GL.draw(this.mesh);

    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    // mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);
  }
}

export default ViewRenderer;
