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
	drawing: 1,
}

class ViewLine {
  constructor(isMainLine){

		this.perlin = new Perlin.Noise(Math.random());
		this.needsUpdate = false;
    this.position = [0,0,0];

		this.state = STATES.wandering;

    this.shader = new GLShader(vs, fs);
    this.shader.bind();

		this.indexMotion = Math.floor(Math.random() * 4);
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
    this.alpha = .5 + Math.random() * .5;


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

		this.motions = [Motions.basic.bind(Motions), Motions.snake.bind(Motions), Motions.circle.bind(Motions)]

    this.changeMotion();
  }

  changeMotion(e){
		this.indexMotion++;
    this.motion = this.motions[this.indexMotion % this.motions.length];
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

		if(this.state === STATES.wandering){
			this.motionOptions.time +=  .8;
			this.motion(this.motionOptions);

			if(this.targetPoint[1] < -.1) this.targetPoint[1] = -.1;
		}
		else if(this.state === STATES.drawing){
			this.targetPoint[0] = this.animal.shape.vertices[0][0];
			this.targetPoint[1] = this.animal.shape.vertices[0][1];
			this.targetPoint[2] = this.animal.shape.vertices[0][2];
		}
	}

	newPoints(line, force){

		// HERE IS THE DRAWING
		if(this.state === STATES.drawing){
			this.objectsToTween = [];
			let index = 0;

			/* this path is defined in the transformTo() method, it's composed to all the
			 points the line has to go through to create the shape
			 */

			for (var i = 0; i < line.vert.length; i++) {
				var startIndex = ( (line.vert.length -1 ) - i);
				var endIndex =  (this.path.length - 1) - i;

				var obj = { startIndex: startIndex, endIndex: endIndex, currentIndex: startIndex}
				var o = Easings.returnVariable(obj, 1, { currentIndex: endIndex }); // fake tween, just to get the info we want for the tween
				o.point = startIndex;
				this.objectsToTween[index++] = o;
			}
		}
		else if(this.state === STATES.wandering){
			var pt0 = line.points[0];

			pt0[0] += (this.targetPoint[0] - pt0[0]) * 0.4 * .25 * .1;
			pt0[2] += (this.targetPoint[2] - pt0[2]) * 0.4 * .25 * .1;
			pt0[1] += (this.targetPoint[1] - pt0[1]) * 0.2 * .25 * .1;

			let speed = .3;

			for (var i = 1; i < line.points.length; i++) {
				line.points[i][0] += (line.points[i-1][0] - line.points[i][0]) * speed * .6;
				line.points[i][1] += (line.points[i-1][1] - line.points[i][1]) * speed * .6;
				line.points[i][2] += (line.points[i-1][2] - line.points[i][2]) * speed * .6;
			}
		}

		var pts = this.getPoints(line.points);

		return pts
	}


	wander(){
		this.objectsToTween = [];
		for (var i = 0; i < this.line.points.length; i++) {
			this.points[this.points.length - 1- i] = this.line.vert[i*this.sub];
		}

		this._cutExtraPoints(20);
		this.state = STATES.wandering;
	}

	_cutExtraPoints(max) {

			let nbPtsToSlice = this.points.length - max;
			let offset = Math.ceil(this.points.length / max);

			let arr = [];
			let index = 0;
			for (var i = 0; i < this.points.length; i+=offset) {
				arr[index++] = this.points[i]
			}

			this.points = arr;
			this.line.points = this.points; // set the new points
			this.needsUpdate = true; // will need to uplad some new buffers
	}

	transformTo(animal){

		this.currentPointToFollowIndex = 0;
		this.mainSpeed = .3;
		this.state = STATES.drawing;
		let index = 0;


		this.animal = animal;

		var ptsAnimal = this.animal.finalP;


		let nbPointsTarget = ptsAnimal.length/ this.sub ;

		/*
			get the same number of points
		*/
		if(this.line.points.length < nbPointsTarget){

			let diff = nbPointsTarget - this.line.points.length;

			// get the last two points to have a direction
			let lastP1 = this.line.points[this.line.points.length-1];
			let lastP2 = this.line.points[this.line.points.length-2];


			let sub = [];
			// direction
			glmatrix.vec3.subtract(sub, lastP2, lastP1)
			let dir = [];
			// between 0 and 1
			glmatrix.vec3.normalize(dir, sub);
			let dist = glmatrix.vec3.distance(lastP1, lastP2)

			// add
			for (var i = 0; i < diff; i++) {
				var addPt = [];
				var mult = [];

				var direction = [
					dir[0] * dist/diff * i,
					dir[1] * dist/diff * i,
					dir[2] * dist/diff * i,
				]

				glmatrix.vec3.add(addPt, lastP1, direction);

				this.line.points.push(addPt);
				this.needsUpdate = true;
			}
		}
		else if(this.line.points.length > nbPointsTarget) {
			this.line.points.slice(0, nbPointsTarget-1);
			this.needsUpdate = true;
		}
		else {
			this.needsUpdate = false;
		}

		// no we have the same amount of points between the line and the shape to draw
		this.path = [];
		this.line.vert = this.getPoints(this.line.points)

		let pathLine = this.line.vert.slice();
		let firstPointLine = this.line.points[0];
		let firstPointTarget = ptsAnimal[0];
		let secondPointTarget = ptsAnimal[1];

		/*
			create a path to the shape to draw
		*/
		let dist = glmatrix.vec3.distance(firstPointLine, firstPointTarget);
		let midPoint = [(firstPointLine[0] + firstPointTarget[0])/2, (firstPointLine[1] + firstPointTarget[1])/2, (firstPointLine[2] + firstPointTarget[2])/2];
		let ptsToTarget = [firstPointLine];
		for (var i = 0; i < 2; i++) {
			let pt = this.getRandomPos(Math.random() * dist/5, Math.random() * Math.PI*2, Math.random() * Math.PI*2)
			pt[0] += midPoint[0];
			pt[1] += midPoint[1];
			pt[2] +=midPoint[2];

			ptsToTarget[ptsToTarget.length] = pt;
		}

		// get a point just before the target entry point, same direction
		let sub2 = [];
		glmatrix.vec3.subtract(sub2, firstPointTarget, secondPointTarget)
		let dir2 = [];
		glmatrix.vec3.normalize(dir2, sub2);

		let pointJustBeforeEntryPoint = [
			firstPointTarget[0] + dir2[0] * dist/5,
			firstPointTarget[1] + dir2[1] * dist/5,
			firstPointTarget[2] + dir2[2] * dist/5,
		]

		ptsToTarget[ptsToTarget.length] = pointJustBeforeEntryPoint;
		ptsToTarget[ptsToTarget.length] = firstPointTarget;

		// this is the curved line of everything we did just before
		let pathToTarget = this.getPoints(ptsToTarget);
		let pathTarget = ptsAnimal;

		/*
			create the full path we will tween now
		*/
		index = 0;
		// the line itself
		for (var i = pathLine.length-1; i > -1; i--) {
			this.path[index++] = pathLine[i];
		}

		// the path between the line and the target
		for (var i = 0; i < pathToTarget.length; i++) {
			this.path[index++] = pathToTarget[i];
		}

		// the target itself
		for (var i = 0; i < pathTarget.length; i++) {
			this.path[index++] = pathTarget[i];
		}

		this.newPoints(this.line, true)
	}

	getRandomPos(r, s, t){
		let x = r * Math.cos(s) * Math.sin(t)
		let y = r * Math.sin(s) * Math.sin(t)
		let z = r * Math.cos(t)

		return [x, y, z];
	}

	splice(arr, index) {
     var len=arr.length;
     if (!len) { return }
     while (index<len) {
       arr[index] = arr[index+1];
			 index++
		 }

     arr.length--;
  };

  render(){
		// if we are drawing an animal
		if(Easings.tweens.length){
			Easings.update();
		}

		this.update();

    this.shader.bind();

		if(this.state === STATES.wandering){
			let pts = this.newPoints(this.line);
			this.line.render(pts, this.needsUpdate);
		}
		else if(this.state === STATES.drawing){
			for (var i = 0; i < this.objectsToTween.length; i++) {
				let o = this.objectsToTween[i]
				if(!o.delete){
					for (var k = 0; k < o.props.length; k++) {
						var e = o.props[k];
						o.obj[e.var] = Easings.easeOutCirc(o.currentIteration, e.value, e.toValue - e.value, o.duration);

						let indexFloor = Math.floor(o.obj[e.var]);
						this.line.vert[o.point][0] = this.path[indexFloor][0];
						this.line.vert[o.point][1] = this.path[indexFloor][1];
						this.line.vert[o.point][2] = this.path[indexFloor][2];
					}

					o.currentIteration += 1;
					if(o.currentIteration > o.duration){
						o.delete = true;
					}
				}
				else {
					this.splice(this.objectsToTween, i);
					i--;
				}
			}

			if(this.objectsToTween.length){
				this.line.render(this.line.vert, this.needsUpdate);
			}
		}



    this.shader.uniform("alpha", "float", 1);
    this.shader.uniform("uTime", "float", 0);
    this.shader.uniform("u_position", "vec3", this.position);
		this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
		this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    GL.draw(this.line);

		this.needsUpdate = false;
  }
}

export default ViewLine;
