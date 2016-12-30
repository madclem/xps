import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';

import Perlin from '../../libs/perlin'
import vs from '../../shaders/line.vert';
import fs from '../../shaders/line.frag'
import Spline from '../../libs/Spline';
import Motions from './LinesMotions';

let tempArray = [];

const STATES = {
	wandering: 0,
}

class ViewLine {
  constructor(isMainLine){

		this.perlin = new Perlin.Noise(Math.random());

    this.position = [0,0,0];

    this.state = STATES.wandering;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();

		this.indexMotion = -1;
    this.delay = Math.random() * 240;
    this.spline = new Spline([]);
		this.points = []
		this.sub = 3;

    let index = 0;
		for (var i = 0; i < 15; i++) {
			this.points[index++] = [.5, 0 , .5/15 * i];
		}

    this.targetPoint = [0,0,0];
    this.position = [0,0,0];
		this.line = new mcgl.geom.Line(this.shader.shaderProgram, this.getPoints(this.points));
		this.line.points = this.line.vert;

    this.texture = new mcgl.Texture(ASSET_URL + "images/stroke.png");
    this.alpha = 1;


		this.motionOptions = {
			perlin:  this.perlin,
			time:  Math.random() * 0xFF,
			startAngle:  Math.random() * Math.PI*2,
			radius:  Math.floor(Math.random() * 3) + 2,
			targetPoint:  this.targetPoint,
			position:  this.position,
			xoff:  Math.random() * 100,
			yoff:  Math.random() * 100
		}

		this.motions = {
			0: [Motions.basic.bind(Motions), Motions.snake.bind(Motions), Motions.circle.bind(Motions)]
		}

    this.changeMotion();
  }

  changeMotion(e){
		this.indexMotion++;
    this.motion = this.motions[this.state][this.indexMotion % this.motions[this.state].length];
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


	update(){
		this.motionOptions.time +=  .8;
		this.motion(this.motionOptions);

		if(this.targetPoint[1] < -.1) this.targetPoint[1] = -.1;
	}

	newPoints(line, force){
		var pt0 = line.points[0];

    pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4 * .25 * .1;
    pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4 * .25 * .1;
    pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * .25 * .1;

		let speed;

		if(this.state === STATES.wandering){
			speed = .3;
		}

		for (var i = 1; i < line.points.length; i++) {
			line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * speed * .6;
			line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * speed * .6;
			line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * speed * .6;
		}

		var pts = this.getPoints(line.points);

		return pts
	}

  render(){
		this.update();

    this.shader.bind();
    let pts = this.newPoints(this.line);

    this.line.render(pts, false);
    this.shader.uniform("alpha", "float", .6);
    this.shader.uniform("uTime", "float", 0);
    this.shader.uniform("u_position", "vec3", this.position);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    GL.draw(this.line);
  }
}

export default ViewLine;
