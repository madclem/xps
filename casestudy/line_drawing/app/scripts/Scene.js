import mcgl, {GL} from 'mcgl';
import ViewBackground from './views/ViewBackground';
import ViewLine from './views/ViewLine';
import McglFloor from './views/McglFloor';
import ViewDear from './views/viewsAnimals/ViewDear'
import ViewBoar from './views/viewsAnimals/ViewBoar'
import ViewFox from './views/viewsAnimals/ViewFox'
import ViewBat from './views/viewsAnimals/ViewBat'
import ViewBear from './views/viewsAnimals/ViewBear'
import ViewWolf from './views/viewsAnimals/ViewWolf'
import ViewRabbit from './views/viewsAnimals/ViewRabbit'
import ViewWeasel from './views/viewsAnimals/ViewWeasel'

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
    this.xAxisPlane = new McglFloor();

    this.orbitalControl = mcgl.orbitalControl;
    this.orbitalControl.radius = 1800;
    this.orbitalControl.setRy(-Math.PI/6);
    this.orbitalControl.radius = 2;


    this.camera = new mcgl.camera.Camera();



    this.lines = [];

    for (var i = 0; i < 1; i++) {
      let l = new ViewLine();
      this.lines.push(l);
    }

    this.viewBackground = new ViewBackground();


    this.shapes = [
      ViewBear,
			ViewBoar,
			ViewBat,
			ViewFox,
			ViewDear,
			ViewWolf,
			ViewRabbit,
			ViewWeasel,
		];

    this.animalStep = 0;
  }

  onKeyPressed(key){
    if(key === "space" || window.isMobile){

      if(this.isDrawn){
        this.isDrawn = false;
        for (var i = 0; i < this.lines.length; i++) {
          this.lines[i].wander();
        }
      }
      else {
        this.isDrawn = true;
        for (var i = 0; i < this.lines.length; i++) {

          let animal = new this.shapes[this.animalStep % this.shapes.length]();
          animal.reset([0,.9,0]);
          this.lines[i].transformTo(animal);

          this.animalStep++;

          this.orbitalControl.setRy(-Math.PI/6);
          let obj = {
            ryT: this.orbitalControl.ryT
          }
          Easings.to(obj, .5, {
            ryT: 0,
            onUpdate: ()=> {
              this.orbitalControl.setRy(obj.ryT);
            }
          })
        }
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
    this.orbitalControl.position[2] = 2;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 0.1, 60);
    var target = [0, .5, 0];
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
