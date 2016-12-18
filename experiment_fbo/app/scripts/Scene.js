import mcgl, {GL} from 'mcgl';
// import ViewSphere from './views/ViewSphere';
// import ViewIcosphere from './views/ViewIcosphere';
import ViewLine from './views/ViewLine';
import ViewSim from './views/ViewSim';
import ViewNoise from './views/ViewNoise';
import ViewRenderer from './views/ViewRenderer';
import McglFloor from './views/McglFloor';

// import ViewFBO from './views/ViewFBO';
// import vs from '../shaders/default.vert'
// import fs from '../shaders/fbo.frag'

let gl;

class Scene {
  constructor(){
    gl = GL.gl;
    this.tick = 0;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // this.orbitalControl = mcgl.orbitalControl;
    // this.orbitalControl.radius = .1;

    this._bCopy = new mcgl.BatchCopy();
    window.addEventListener('resize', this.resize.bind(this));

    this.controller = new mcgl.Controller();
    this.xAxisPlane = new McglFloor();

    this.cameraControl = new mcgl.CameraControl();
    this.cameraControl.setRy(Math.PI/2)

    this.camera = new mcgl.camera.CameraPOV();


    this._fboNoise = new mcgl.FBO(256, 256);
    this.viewNoise = new ViewNoise(256, 256);

    this.lines = [];

    for (var i = 0; i < 4; i++) {
      let l = new ViewLine(i === 0);
      // l.position[0] = -1.;
      this.lines.push(l);
    }

    this.viewRender = new ViewRenderer(256,256);
    // this.viewRender.position[1] = -.5;
    // this.viewRender.position = [-206, -120, 0];

    // this.orbitalControl.setRy(Math.PI/2)
    this._fboNoise.bind(256, 256);
    mcgl.GL.gl.clear(0,0,0,0)
    this.viewNoise.render();
    this._fboNoise.unbind();
    this.targetPoint = [0,0,0];

    this.height = {
      noise: .2,
      lines: .2
    }

    this._fboNoise.clear();

    window.addEventListener("mousemove", (e)=>{
      this.onMouseMove(e);
    }, false);

    // this.positionObj = {
    //   x: -.1,
    //   y: 0,
    //   z: 0
    // }

    this.x = .77
    this.y = .0
    this.z = .2

    gui.add(this, "x", -2, 2);
    gui.add(this, "y", -2, 2);
    gui.add(this, "z", -2, 2);

    this.z = -.32

  }

  onMouseMove(e){
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].onMouseMove(e);
    }
  }
  updateFBO(){
    this._fboNoise.bind(256, 256);
    mcgl.GL.gl.clear(0,0,0,0)
    this.viewNoise.render();
    this._fboNoise.unbind();
  }

  update(){
    this.updateFBO();
    this.render();
  }

  render(){
    this.cameraControl.update();
    this.tick++;
    GL.setMatrices(this.camera);

    var target = [0,0,0];
    var up = [0, 1, 0];

    this.camera.perspective(60 * Math.PI/180, GL.aspectRatio, .1, 60);
    this.camera.setPosition(this.x, this.y, this.z);
    this.camera.rotateX(this.cameraControl.rx);
    this.camera.rotateY(this.cameraControl.ry);

    // this.camera.lookAt(target);
    let t = this._fboNoise.textures[0];

    this.xAxisPlane.render();

    // for (var i = 0; i < this.lines.length; i++) {
      // this.lines[i].render(t, this.height.lines);
    // }

    this.viewRender.render(t, this.height.noise); // 2 I dont know why this is in this order

    // GL.gl.viewport(0, 0, 256, 256);
    // GL.gl.disable(GL.gl.DEPTH_TEST);
    // this._bCopy.draw(t);
    // GL.gl.enable(GL.gl.DEPTH_TEST);
    // GL.gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    this._fboNoise.clear();
  }

  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
