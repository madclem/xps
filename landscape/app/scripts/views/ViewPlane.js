import mcgl, {GL} from "mcgl";
// import GL from './helpers/GLHelpers';
// import PlaneSquare from '../helpers/gl_helpers/geometry/PlaneSquare';
import vs from '../../shaders/plane.vert'
import fs from '../../shaders/terrain.frag'

class ViewPlane {

  constructor(size){
    this.shader = new mcgl.GLShader(vs, fs);
    this.shader.bind();

    this.w = 12;
    this.depth = 12;
    this.plane = new mcgl.geom.Plane(this.shader.shaderProgram, this.w, this.depth, size, size, mcgl.GL.gl.LINES);
    this.plane.position = [100, 0, 0]
  }


  render(needsUpdate){
    this.shader.bind(); // just to use propgram
    // this.plane.render();
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);

    // if(needsUpdate){
      // this.plane.render();
    // }
    mcgl.GL.draw(this.plane);
  }
}

export default ViewPlane;
