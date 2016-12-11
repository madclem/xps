import mcgl, {GL} from 'mcgl';
// import ViewSphere from './views/ViewSphere';
// import ViewIcosphere from './views/ViewIcosphere';
import ViewSim from './views/ViewSim';
import ViewSave from './views/ViewSave';
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

    this.orbitalControl = mcgl.orbitalControl;
    this.orbitalControl.radius = 100;
    // this.orbitalControl.setRy(-Math.PI/6);
    this.camera = mcgl.camera;


    window.addEventListener('resize', this.resize.bind(this));

    this.controller = new mcgl.Controller();

    // this._fbo = new mcgl.FBO(256, 256);
    this.xAxisPlane = new McglFloor();
    //
    this.rtt = new mcgl.FBO(256, 256);
    // create the view for the simulation w/ a very simple geometry
    // this.viewSim = new ViewSim(1024, 1024);
    this.viewSave = new ViewSave();
    // create the particles


    // create the view for the rendering, draw with POINTS
    // this.viewRenderer = new ViewRenderer(256,256);
  }

  update(){
    this.render();
  }

  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 10;
    this.orbitalControl.position[2] = -10;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 1, 6000);
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);
    let t = this.rtt.texture;
    this.xAxisPlane.render();
    // this.rtt.bind(window.innerWidth, window.innerHeight);
    this.viewSave.render(t);
    // this.rtt.unbind();


    // this.viewRenderer.render(t); // 2 I dont know why this is in this order
    // this.rtt.clear(); // 3 I dont know why this is in this order
  }

  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
