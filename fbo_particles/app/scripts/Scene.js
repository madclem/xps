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
    this.orbitalControl.radius = 2;
    // this.orbitalControl.setRy(-Math.PI/6);
    this.camera = mcgl.camera;

    this._bCopy = new mcgl.BatchCopy();
    this._bCopy_move = new mcgl.BatchCopy();

    window.addEventListener('resize', this.resize.bind(this));

    this.controller = new mcgl.Controller();

    // this._fbo = new mcgl.FBO(256, 256);
    this.xAxisPlane = new McglFloor();
    //
    this._fboCurrent = new mcgl.FBO(256, 256);
    this._fboTarget = new mcgl.FBO(256, 256);
    // create the view for the simulation w/ a very simple geometry
    this.viewSave = new ViewSave(256, 256);
    this.viewSim = new ViewSim(256, 256);
    // create the particles


    // create the view for the rendering, draw with POINTS
    this.viewRender = new ViewRenderer(256,256);

    this._fboCurrent.bind(256, 256);
    mcgl.GL.gl.clear(0,0,0,0)
    this.viewSave.render();
    this._fboCurrent.unbind();

    this._fboTarget.bind(256, 256);
    mcgl.GL.gl.clear(0,0,0,0)
    this.viewSave.render();
    this._fboTarget.unbind();


    this._fboCurrent.clear();
    this._fboTarget.clear();
    // this._fboCurrent.bind(256, 256);
    // this.viewSim.render(this._fboCurrent.textures[0]);
    // this._fboCurrent.unbind();






  }

  updateFBO(){
    let t = this._fboCurrent.textures[0];

    this._fboTarget.bind(256, 256);
    mcgl.GL.gl.clear(0,0,0,0)
    this.viewSim.render(t);
    this._fboTarget.unbind();

    let tmp          = this._fboCurrent;
		this._fboCurrent = this._fboTarget;
		this._fboTarget  = tmp;

  }

  update(){
    this.updateFBO();
    this.render();
  }

  render(){
    GL.setMatrices(this.camera);

    this.tick++;
    this.orbitalControl.position[0] = 0;
    this.orbitalControl.position[1] = 2;
    // this.orbitalControl.position[2] = -10;

    this.orbitalControl.update();
    this.camera.position = this.orbitalControl._position;

    this.camera.perspective(60 * Math.PI / 180, GL.aspectRatio, 1, 6000);
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    this.camera.lookAt(target, up);
    let t = this._fboCurrent.textures[0];
    let t2 = this._fboTarget.textures[0];



    // this._fboCurrent.unbind();
    this.xAxisPlane.render();

    // this.viewSim.render(t);
    this.viewRender.render(t2); // 2 I dont know why this is in this order

    // this.viewSave.render();
    // GL.gl.viewport(0, 0, 256, 256);
    // GL.gl.disable(GL.gl.DEPTH_TEST);
    // this._bCopy.draw(t);
    // GL.gl.enable(GL.gl.DEPTH_TEST);
    // GL.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    //
    // GL.gl.viewport(256 + 10, 0, 256, 256);
    // GL.gl.disable(GL.gl.DEPTH_TEST);
    // this._bCopy_move.draw(t2);
    // GL.gl.enable(GL.gl.DEPTH_TEST);
    // GL.gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    this._fboTarget.clear();

     // 3 I dont know why this is in this order
  }

  resize(){
    GL.resize(window.innerWidth, window.innerHeight);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}


export default Scene;
