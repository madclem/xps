import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/save.vert'
import fs from '../../shaders/save.frag'

class ViewSave {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    // this.shader.bind();

    let positions = [];
		let coords = [];
		let indices = [];
		let extras = [];
		let count = 0;

		let numParticles = 200;
		let totalParticles = numParticles * numParticles;
		console.debug('Total Particles : ', totalParticles);
		let ux, uy;
		let range = 3;

		for(let j = 0; j < numParticles; j++) {
			for(let i = 0; i < numParticles; i++) {
				positions.push([Math.random() * range  -range/2, Math.random() * range  -range/2, Math.random() * range  -range/2]);

				ux = (i / numParticles * 2.0 - 1.0 + .5 / numParticles) * 100;
				uy = (j / numParticles * 2.0 - 1.0 + .5 / numParticles) * 100;

				extras.push([Math.random(), Math.random(), Math.random()]);
				coords.push([ux, uy]);
				indices.push(count);
				count ++;

			}
		}


    // console.log("here", GL);
		this.mesh = new mcgl.Mesh(this.shader.shaderProgram, GL.gl.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(coords);
		this.mesh.bufferIndex(indices);

		// this.meshExtra = new alfrid.Mesh(GL.POINTS);
		// this.meshExtra.bufferVertex(extras);
		// this.meshExtra.bufferTexCoord(coords);
		// this.meshExtra.bufferIndex(indices);


  }


  getRandomData( width, height, size ){

  }

  render(t){

    this.shader.bind();
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, this.texture);
    GL.draw(this.mesh);
  }
}

export default ViewSave;
