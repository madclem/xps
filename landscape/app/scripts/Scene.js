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


    this.camera = new mcgl.camera.Camera();

    this.viewBackground = new ViewBackground();

    this.terrain = new Terrain(6);
    this.terrain.generate(10);
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

            // console.log(x, y);

            var currentX = x * this.viewPlane.w / (this.terrain.size) - this.viewPlane.w / 2;
            var currentY = y * this.viewPlane.depth / (this.terrain.size) - this.viewPlane.w / 2;
            let d = Math.sqrt( currentX * currentX, currentY * currentY) / 6 ;

            // console.log(currentX);
            // console.log(d);

            // console.log(currentX);
            // console.log(currentY);
            // console.log(Math.cos(d));
            // console.log((1 - (d / 2) / radius));
            // console.log(d);
            // console.log(1 - (Math.cos(currentX / 6 * Math.PI * 2) * Math.cos(currentY / 6 * Math.PI * 2)));
            // height_val = 1 - Math.cos(currentX / 6) * Math.cos(currentY / 6) * 255 * 10;
            // height_val = (1 - Math.cos(d / 6 * Math.PI)) * 255 * 100;
            let coef = 1- Math.abs(Math.cos(currentX / 6 * Math.PI) + Math.cos(currentY / 6 * Math.PI)) / 2 ;
            console.log(coef);

            height_val *= coef


            // height_val = (1 - Math.cos(currentY / 6 * Math.PI)) * (1 - Math.cos(currentX / 6 * Math.PI)) * 255 ;
            // height_val = Math.sin(currentX / 6 * Math.PI) * Math.cos(currentY / 6 * Math.PI) * 255 ;
            // height_val *= d;
            this.viewPlane.plane._vertices[y * this.terrain.size + x][1] = height_val / 255;// * Math.sin(x * Math.PI) * Math.sin(y * Math.PI) * 800;
            // this.viewPlane.plane._vertices[y * this.terrain.size + x][1] = height_val / 255;
        }
    }

    // this.viewPlane.render(true);
    this.viewPlane.plane.bufferVertex(this.viewPlane.plane._vertices, false);

  }

  onKeyPressed(key){
  }

  pause(){
  }

  update(){
    this.render();
  }

  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 0;
    this.orbitalControl.position[2] = 0;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 0.1, 60);
    var target = [0, .5, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);
    this.viewPlane.render();
  }



  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
