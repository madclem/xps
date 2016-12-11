import mcgl, {GL} from 'mcgl';
// import ViewSphere from './views/ViewSphere';
// import ViewIcosphere from './views/ViewIcosphere';
import ViewCube from './views/ViewCube';
import ViewFBO from './views/ViewFBO';
import McglFloor from './views/McglFloor';
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
    this.orbitalControl.radius = 1800;
    this.orbitalControl.setRy(-Math.PI/6);
    this.camera = mcgl.camera;
    this.viewCube = new ViewCube();

    this.xAxisPlane = new McglFloor();

    window.addEventListener('resize', this.resize.bind(this));

    this.controller = new mcgl.Controller();


    this.fbo = new mcgl.FBO(1024, 1024);
    this.viewFBO = new ViewFBO(this.fbo.texture);
  }

  isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }

  onKeyPressed(key){
    if(key === "space"){
      // this.viewIcosphere.onPressed();
    }
  }

  update(){
    this.render();
  }


  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 450;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 1, 6000);
    var target = [0, 500, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);

    this.fbo.bind(window.innerWidth, window.innerHeight);
    this.viewCube.render(this.fbo.texture);
    this.fbo.unbind();

    this.xAxisPlane.render(); // 1 I dont know why this is in this order
    this.viewFBO.render(); // 2 I dont know why this is in this order
    this.fbo.clear(); // 3 I dont know why this is in this order
  }

  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
