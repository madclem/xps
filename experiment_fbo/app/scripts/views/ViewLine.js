import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';

import vs from '../../shaders/line.vert';
import fs from '../../shaders/line.frag'
import Spline from '../../libs/Spline';

let tempArray = [];

class ViewLine {
  constructor(isMainLine){

    this.isMainLine = isMainLine
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

    this.tick = Math.random() * 0xFF;

    this.spline = new Spline([]);
		this.points = []
		this.sub = 3//GL.isMobile ? 3 : 5;

    let index = 0;
		for (var i = 0; i < 15; i++) {
			this.points[index++] = [.5, 0 , .5/15 * i];
		}

    this.targetPoint = [0,0,0];
		// let division = 4;
		// this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.points);
		this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.getPoints(this.points));
		this.line.points = this.line.vert;


    if(this.isMainLine){
      this.alpha = 1;
    }
    else {
      this.alpha = Math.random() * .4 + .2;
    }
    // console.log(this.line.points);

  }

  onMouseMove(e){

    // if(this.isMainLine) return;

    let x = e.screenX / window.innerWidth;
    let y = e.screenY / window.innerHeight;
    this.targetPoint[0] = x;

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

  animateTargetPoint(){
    this.targetPoint[2] = Math.sin(this.tick/100) * .25 +.25;
    // this.targetPoint[2] = Math.sin(Math.pow(8, Math.sin(this.tick/200))) * .5 +.5;
    // this.targetPoint[2] = Math.sin(Math.pow(8, Math.sin(this.tick/100))) * .5 +.5;
  }

  newPoints(line){
    var pt0 = line.points[0];

    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4;
    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4;
    // pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * this.mainSpeed * (vrPresenting ? .25 : 1);

		let speed = .6;

		for (var i = 1; i < line.points.length; i++) {
			line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * speed;
			// line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * speed * this.mainSpeed * (vrPresenting ? .5 : 1);

      line.points[i][2] = pt0[2] + i * .5/line.points.length
			// line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * speed;
		}

		var pts = line.points;

    return pts;

  }

  render(t){
    this.tick++;
    this.shader.bind();

    t.bind();

    this.animateTargetPoint();
    let pts = this.newPoints(this.line);

    this.line.render(pts, false);
    this.shader.uniform("alpha", "float", this.alpha);
    this.shader.uniform("uTime", "float", 0);
		this.shader.uniform("alpha", "float", 1.0);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    GL.draw(this.line);

  }
}

export default ViewLine;
