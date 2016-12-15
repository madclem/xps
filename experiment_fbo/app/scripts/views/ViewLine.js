import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';

import vs from '../../shaders/line.vert';
import fs from '../../shaders/line.frag'
import Spline from '../../libs/Spline';

let tempArray = [];

class ViewLine {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

    this.spline = new Spline([]);
		this.points = []
		this.sub = 3//GL.isMobile ? 3 : 5;

    let index = 0;
		for (var i = 0; i < 20; i++) {
			this.points[index++] = [4 * i, Math.random()  * 10, Math.random()  * 10];
		}

		// let division = 4;
		this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.points);
		// this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.getPoints(this.points));
		this.line.points = this.points;

    console.log(this.line.points);

  }


  getPoints(pts){
		this.spline.points = pts;
		let indexArray, n_sub = this.sub;

		tempArray = [];
		let index = 0;
		for (let i = 0; i < pts.length * n_sub; i ++ ) {
			indexArray = i / ( pts.length * n_sub );
			this.spline.getPoint( indexArray,  tempArray);
		}

		return tempArray;
	}

  render(t){

    this.shader.bind();

    t.bind();
    this.shader.uniform("uTime", "float", 0);
		this.shader.uniform("alpha", "float", 1.0);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    GL.draw(this.line);

  }
}

export default ViewLine;
