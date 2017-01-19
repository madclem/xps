import mcgl, {GL} from "mcgl";
// import GL from './helpers/GLHelpers';
// import PlaneSquare from '../helpers/gl_helpers/geometry/PlaneSquare';
import Plane from '../geom/Plane'
import vs from '../../shaders/terrain.vert'
import fs from '../../shaders/terrain.frag'

class ViewPlane {

  constructor(size){
    this.shader = new mcgl.GLShader(vs, fs);
    this.shader.bind();

    this.w = 20;
    this.depth = 20;
    this.plane = new mcgl.geom.Plane(this.shader.shaderProgram, this.w, this.depth, size, size, mcgl.GL.gl.TRIANGLES);
    this.plane.position = [100, 0, 0]
  }


  separateFaces(){
    this.plane.separateFaces();
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
