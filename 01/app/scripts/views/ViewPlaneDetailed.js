import GLShader from '../helpers/gl_helpers/GLShader';
// import GL from './helpers/GLHelpers';
import Plane from '../helpers/gl_helpers/geometry/Plane';
import PlaneSquare from '../helpers/gl_helpers/geometry/PlaneSquare';
import vs from '../../shaders/plane.vert'
import fs from '../../shaders/plane_opacity_less.frag'

class ViewPlaneDetailed {

  constructor(){
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.plane = new Plane(this.shader.shaderProgram, 3000, 3000, 60, "xz", undefined, GL.gl.POINTS);
    // this.plane = new PlaneSquare(this.shader.shaderProgram, 3000, 3000, 60, "xz");
    // this.plane.position = [0, 0, 0]

    // this.drawPlane();
  }

  drawPlane(){
  }

  render(){
    this.shader.bind(); // just to use propgram
    GL.draw(this.plane);
    // this.plane.render();
  }
}

export default ViewPlaneDetailed;
