import mcgl, {GL} from 'mcgl';
import ViewSphere from './views/ViewSphere';
import ViewCube from './views/ViewCube';
import McglFloor from './views/McglFloor';

let gl;

class Scene {
  constructor(){
    gl = GL.gl;
    this.tick = 0;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.orbitalControl = mcgl.orbitalControl;
    this.camera = mcgl.camera;
    this.viewSphere = new ViewSphere();
    this.viewCube = new ViewCube();
    this.xAxisPlane = new McglFloor();

    window.addEventListener('resize', this.resize.bind(this));
  }

  update(){
    this.render();
  }


  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 450;
    // this.orbitalControl.radius = 800// + Math.cos(this.tick/100) * 100;
    // this.orbitalControl.angleA = Math.PI/2 + Math.cos(this.tick/200) * Math.PI/8;
    // this.orbitalControl.angleA += 0.004;

    // console.log(this.orbitalControl.radius);
    // this.orbitalControl.angleA = Math.PI /2;
    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 1, 2000);
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);

    gl.disable(gl.DEPTH_TEST);
    // this.viewBackground.render();
    gl.enable(gl.DEPTH_TEST);

    this.xAxisPlane.render();
    // this.viewSphere.render();
    this.viewCube.render();
    // this.viewFloor.render();
  }

  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
