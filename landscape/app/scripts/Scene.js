import glmatrix from 'gl-matrix';
import mcgl, {GL} from 'mcgl';
import ViewBackground from './views/ViewBackground';
import ViewPlane from './views/ViewPlane';
import Terrain from './Terrain';
import McglFloor from './views/McglFloor';

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
    this.controller.onTouchEnd.add(this.onKeyPressed, this);

    this.orbitalControl = mcgl.orbitalControl;
    this.orbitalControl.radius = 1800;
    // this.orbitalControl.setRy(-Math.PI/6);
    this.orbitalControl.radius = 2;


    // this.camera = new mcgl.camera.Camera();
    this.cameraControl = new mcgl.CameraControl();
    this.camera = new mcgl.camera.CameraPOV();

    this.viewBackground = new ViewBackground();

    this.terrain = new Terrain(5);
    this.terrain.generate(20);
    this.viewPlane = new ViewPlane(this.terrain.size - 1);

    var min_height = Infinity;
    var max_height = -Infinity;

    let radius = this.viewPlane.w / 2;

    for (var y = 0; y < this.terrain.size; y++) {
        for (var x = 0; x < this.terrain.size; x++) {
            var height_val = this.terrain.get(x, y);
            if ( height_val < min_height ) min_height = height_val;
            if ( height_val > max_height ) max_height = height_val;
            if ( height_val < 0 ) height_val = 0;
            if (y === 0 || y === this.terrain.size || x === 0 || x === this.terrain.size ) height_val = 0.0;
            if (y === 0 || y === this.terrain.size - 1 || x === 0 || x === this.terrain.size - 1) height_val = 0.0;

            var currentX = x * this.viewPlane.w / (this.terrain.size)// - this.viewPlane.w / 2;
            var currentY = y * this.viewPlane.depth / (this.terrain.size)// - this.viewPlane.w / 2;

            let d = Math.sqrt(Math.pow(this.viewPlane.w / 2 - currentX, 2) + Math.pow(this.viewPlane.depth / 2 - currentY, 2) ) / 6;
            d = 1 - Math.cos(d);
            height_val *= d;
            this.viewPlane.plane._vertices[y * this.terrain.size + x][0] += (Math.random() * .2 - .2/2);
            this.viewPlane.plane._vertices[y * this.terrain.size + x][2] += Math.random() * .2 - .2/2;
            this.viewPlane.plane._vertices[y * this.terrain.size + x][1] = height_val / 255;
        }
    }

    this.viewPlane.separateFaces();

    let normals = [];
    for (var i = 0; i < this.viewPlane.plane._vertices.length; i+=3) {
      let v1 = this.viewPlane.plane._vertices[i];
      let v2 = this.viewPlane.plane._vertices[i + 1];
      let v3 = this.viewPlane.plane._vertices[i + 2];

      let v = [];
      let w = [];
      glmatrix.vec3.sub(w, v1, v2);
      glmatrix.vec3.sub(v, v2, v3);


      let normal = [];
      glmatrix.vec3.cross(normal, v, w);

      let a = []

      a[0]=normal[0]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2]));
      a[1]=normal[1]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2]));
      a[2]=normal[2]/( Math.abs(normal[0]) + Math.abs(normal[1]) +Math.abs(normal[2]));

      normals.push(a, a, a);

      if(i < 1000){
        // console.log(normal);
      }
    }

    this.viewPlane.plane.bufferData(normals, "a_normal", 3, false);

  }

  onKeyPressed(key){
  }

  pause(){
  }

  update(){
    this.render();
  }

  render(){
    this.cameraControl.update();
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = .2;
    this.orbitalControl.position[2] = 0;

    this.orbitalControl.update();
    // this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 0.1, 60);
    this.camera.setPosition(0, -.5, 0);
    this.rx = this.cameraControl.rx;
    this.rz = this.cameraControl.ry;

    // console.log(this.rx);

    this.camera.rotateX(this.rx);
    this.camera.rotateY(this.rz);
    // this.camera.rotateZ(this.rz);


    var target = [0, 0, 0];
    var up = [0, .5, 0];

    // this.camera.lookAt(target, up);
    this.viewPlane.render();
  }



  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
