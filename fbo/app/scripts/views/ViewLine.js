import GLShader from '../helpers/gl_helpers/GLShader';
import Line from '../helpers/gl_helpers/geometry/Line';
import Bezier from '../../libs/bezier';
import CatmullRomSpline from '../../libs/CatmullRomSpline';
// import Perlin from '../../libs/perlin';
import CurvePoints from '../../libs/CurvePoints';
import Matrices from '../helpers/gl_helpers/Matrices';
import RDP from '../../libs/RamerDouglasPeucker';

import vs from '../../shaders/line.vert'
import fs from '../../shaders/line.frag'

let tempArray = []
let tempArray2 = []
let tempArray3 = []
// tempa = new Float32Array
class ViewLine {

  constructor(){
    this.previousTime = false;
    // this.perlin = new Perlin.Noise(Math.random());

    this.speed = 0;
    this.spline = new CurvePoints([]);
    this.binomialCoefficients = [];

    // this.shader = new GLShader(vs, fs);
    // this.shader.bind();

    this.currentPos = [0,0];
    this.previousPos = [0,0];
    // this.rdp = RDP.instance;
    this.tick = 0;

    this.points = []


    var pts = [];
    // for (var i = 0; i < 20; i++) {
    //   var angle = Math.PI / 20 * i;
    //   pts.push([Math.cos(angle) * 100, 0, Math.sin(angle) * 100]);
    // }

    for (var i = 0; i < 25; i++) {
      this.points.push([Math.random() * 100,Math.random() * 100,Math.random() * 100]);
    }



    this.finalP = this.getPoints(this.points);



    // this.shader = new GLShader(vs, fs);
    // this.shader.bind();
    // this.line = new Line(this.shader.shaderProgram, this.finalP);


    // window.onnouse

    window.addEventListener('mousemove', (e) => {
      this.mouseMove((e.clientX - window.innerWidth/2), (e.clientY - window.innerHeight/2));
  	});

    window.addEventListener("touchmove", (e)=> {
      this.mouseMove((e.touches[0].clientX - window.innerWidth/2), (e.touches[0].clientY - window.innerHeight/2));
    });

    this.pool = [];
    this.lines = [];

    this.createLine();
  }


  map(val, inputMin, inputMax, outputMin, outputMax){
        return ((outputMax - outputMin) * ((val - inputMin)/(inputMax - inputMin))) + outputMin;
    }

  createPoints(line) {

    // var speedMax = 10;
    // var speedMin = 60;

    // var v = Math.abs(line.y)
    // if(Math.abs(line.y) > 50) v = 50;
    //
    // var speed = this.map(v, 0, 50, 60, 5);
    // var radius = this.map(Math.abs(line.y), 0, 200, 2, 300);
    //
    // var pts = [];
    // for (var i = 0; i < 20; i++) {
    //   var angle = Math.PI / 20 * i + line.tick / speed;
    //   pts.push([Math.cos(angle) * radius, line.y, Math.sin(angle) * radius]);
    // }
    //
    // return this.getPoints(pts);

    var pt0 = line.points[0];

    // line.xoff+= 0.01;
    // line.yoff+= 0.01;
    // line.zoff+= 0.01;

    // var p = this.perlin.perlin2(line.xoff, line.yoff);
    // var p2 = this.perlin.perlin2(line.xoff, line.zoff);

    pt0[0] = this.currentPos[0];
    pt0[1] = this.currentPos[1];
    // pt0[0] += 1//Math.random() * 15 + 150;
    // pt0[1] = Math.sin(pt0[0]/100) * 1//Math.random() * 15 + .5;
    pt0[2] = this.z;// p2 * 1//Math.random() * 20 + 1;

    for (var i = 1; i < line.points.length; i++) {
      var dir = Matrices.normalize(Matrices.subtractVectors(line.points[i], line.points[i-1]));

      // line.points[i][0] = line.points[i-1][0] + dir[0]// * 20;
      line.points[i][0] = line.points[i-1][0] + dir[0] * 20;
      line.points[i][1] = line.points[i-1][1] + dir[1] * 20;
      line.points[i][2] = line.points[i-1][2] + dir[2] * 20;
    }

    return this.getPoints(line.points)

  }

  createLine() {

    var l = this.pool.pop();

    if(!l){

      var shader = new GLShader(vs, fs);
      shader.bind();
      l = new Line(shader.shaderProgram, this.finalP);
      l.points = this.points;
      l.shader = shader;
    }

    l.xoff = Math.random() * 100;
    l.yoff = Math.random() * 100;
    l.zoff = Math.random() * 100;
    l.speed = .5;
    l.y = 0;
    l.tick = Math.random() * 2;

    this.lines.push(l);
  }

  mouseMove(x, y) {
    this.currentPos = [x, y];

    this.speed = this.getSpeed();
    this.previousTime = Date.now();
    this.previousPos[0] = this.currentPos[0];
    this.previousPos[1] = this.currentPos[1];
    this.tick++;

    this.z = Math.cos(this.tick/25) * 1000 - 700;
  }

  getPoints(pts){
    this.spline.points = pts;
    tempArray.length = 0;
    let index, n_sub = 2;

    var array = []
    for (let i = 0; i < pts.length * n_sub; i ++ ) {
			index = i / ( pts.length * n_sub );
      array.push(this.spline.getPoint( index ));
		}

    return array;
  }
  render(){

    // this.shader.bind(); // just to use propgram
    // this.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);

    // this.tick++;

    // if(this.tick % 60 === 0){
      // this.createLine();
    // }

    for (var i = 0; i < this.lines.length; i++) {
      let l = this.lines[i];
      l.tick++;

      l.shader.bind(); // just to use propgram
      l.shader.uniform("aspect", "float", window.innerWidth / window.innerHeight);
      l.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

      // l.y -= l.speed;

      // l.speed *= 1.01;

      // if(l.tick > 10){

        l.tick = 0;

        // console.log("here");
        var pts = this.createPoints(l);
        l.render(pts);
      // }
      GL.draw(l);

      // if(l.y < -100){
      //   this.lines.splice(i, 1);
      //   i--;
      //   this.pool.push(l);
      // }

    }
    // var pts = [];
    // for (var i = 0; i < 20; i++) {
    //   var angle = Math.PI / 20 * i + this.tick / 20;
    //   pts.push([Math.cos(angle) * 100, 0, Math.sin(angle) * 100]);
    // }
    //
    // var finalP = this.getPoints(pts);
    // this.line.render(finalP);
    //
    // GL.draw(this.line);

  }

  getSpeed() {
        var x = this.currentPos[0];
        var y = this.currentPos[1];
        var new_x;
        var new_y;
        var new_t;

        var x_dist;
        var y_dist, interval,velocity, t;

        if (this.previousTime === false) {return 0;}
        t = this.previousTime;
         new_x = this.previousPos[0];
         new_y = this.previousPos[1];
         new_t = Date.now();

        x_dist = new_x - x;

        // console.log(x_dist);
        y_dist = new_y - y;
        interval = new_t - t;
          // update values:
        x = new_x;
        y = new_y;

          velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/ (interval/10);

          if(isNaN(velocity)) velocity = 0;
          return velocity;

    }
}

export default ViewLine;
