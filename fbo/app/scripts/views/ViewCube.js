import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/cube.vert'
import fs from '../../shaders/cube.frag'
// import vs from '../../shaders/cdv_2_cube.vert'
// import fs from '../../shaders/cdv_2_cube.frag'

class ViewCube {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.shader.uniform("u_position", 'vec3', [0, 500, 0]);

    this.cube = new mcgl.geom.Cube(this.shader.shaderProgram, 1000, 1000, 500, true, 0, 2);

    let gl = mcgl.GL.gl;

    // this.texture = new mcgl.Texture(ASSET_URL + "images/cube.png");
    this.dirLight = null;
    this.pointLight = null;
    this.subdivision = 0;

    this.indexD = 1;
    this.drawModes = [0, 2, 4];
    this.drawMode = 2;
    let controller = gui.add(this, "subdivision").min(0).max(4).step(1);
    controller.onFinishChange((value) =>{
      this.redraw(this.subdivision, this.drawMode);
    });

    let controllerDrawMode = gui.add(this, "drawType");
    controllerDrawMode.onFinishChange((value) =>{
      this.redraw(this.subdivision, this.drawMode);
    });

    this.angle = 0;
  }

  attachLights(directionalLight, pointLight){
    this.dirLight = directionalLight;
    this.pointLight = pointLight;
  }

  drawType(){
    this.indexD++;
    this.drawModes = [0, 2, 4];
    this.drawMode = this.drawModes[this.indexD % this.drawModes.length];

    this.redraw(this.subdivision, this.drawMode);
  }

  redraw(sub, drawType){
    // console.log(drawType);
    this.cube.render(sub, drawType)
  }

  render(t){

    this.shader.bind(); // just to use propgram
    // this.texture.bind(0);

    this.angle += 0.02;
    this.tick++;

    this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    GL.draw(this.cube);
    
    mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);
  }
}

export default ViewCube;
