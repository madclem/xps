// ViewAnimal.js


import mcgl, {GLShader} from 'mcgl';

import Spline from '../../../libs/Spline';
import vs from '../../../shaders/line.vert';
import fs from '../../../shaders/line.frag';

let tempArray = [];
class ViewAnimal {

	constructor(pos) {
		this.shader = new GLShader(vs, fs);
		this.pos = pos;
		this.time = Math.random() * 0xFF;

    this.totalPts = [];
	}


	_init() {
		this.rotation = 0;
	}

	reset(pos, rx = 0, ry = 0){
		this.sub = window.isMobile ? 2 : 6; // how nice should be the curve
		this.pos = pos;

		this.shape.rotateY(ry); // wil lset the animal matrix

		this.points = []
		this.spline = new Spline([]); // spline to have some nice curves
		this.tick = 0;
		this.finalP = this.getPoints(this.shape.getPoints());

		this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.finalP); // create a line to get the points
		this.line.points = this.line.vert;
	}

	rotateX(rx){
		this.shape.rotateX(rx);
	}

	rotateY(ry){
		this.shape.rotateY(ry);
	}

  getPoints(pts){
		// call from ViewLine to draw the animal :)
    this.spline.points = pts;
    tempArray.length = 0;
    let index;

    var array = []
    for (let i = 0; i < pts.length * this.sub; i ++ ) {
			index = i / ( pts.length * this.sub );
      array.push(this.spline.getPoint( index ));
		}

    this.totalPts = array;

    return array;
  }

}

export default ViewAnimal;
