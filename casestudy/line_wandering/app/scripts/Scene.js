import mcgl, {GL} from 'mcgl';
// import  glslify from 'glslify'
// var source = require('glslify!raw!../shaders/test.glsl')
// import ViewSphere from './views/ViewSphere';
// import ViewIcosphere from './views/ViewIcosphere';
import ViewBackground from './views/ViewBackground';
import ViewLine from './views/ViewLine';
import ViewSim from './views/ViewSim';
import ViewNoise from './views/ViewNoise';
import ViewRenderer from './views/ViewRenderer';
import ViewFXAA from './views/ViewFXAA';
import ViewCompositing from './views/ViewCompositing';
import McglFloor from './views/McglFloor';
import Sono from 'sono';

// import ViewFBO from './views/ViewFBO';
// import vs from '../shaders/default.vert'
// import fs from '../shaders/fbo.frag'

let gl;

class Scene {
  constructor(){
    gl = GL.gl;
    this.tick = 0;

    this.debug = true;
    this.delay = 120;
    this.isPaused = false;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    window.addEventListener('resize', this.resize.bind(this));

    this.controller = new mcgl.Controller();
    this.controller.onKeyPressed.add(this.onKeyPressed, this);
    this.xAxisPlane = new McglFloor();

    this.orbitalControl = mcgl.orbitalControl;
    this.orbitalControl.radius = 1800;
    this.orbitalControl.setRy(-Math.PI/6);
    this.orbitalControl.radius = 2;


    this.camera = new mcgl.camera.Camera();



    this.lines = [];

    for (var i = 0; i < 4; i++) {
      let l = new ViewLine(i === 0);
      this.lines.push(l);
    }

    this.viewBackground = new ViewBackground();
  }

  onKeyPressed(key){
    if(key === "space"){
      for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].changeMotion()
      }
    }
  }

  pause(){
  }

  update(){
    this.render();

    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].render()
    }
  }

  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 1;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 0.1, 60);
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);
    this.xAxisPlane.render();

    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].render()
    }
  }



  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
