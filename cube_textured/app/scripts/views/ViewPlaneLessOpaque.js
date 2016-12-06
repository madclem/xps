import GLShader from '../helpers/gl_helpers/GLShader';
// import GL from './helpers/GLHelpers';
import PlaneSquare from '../helpers/gl_helpers/geometry/PlaneSquare';
import vs from '../../shaders/plane.vert'
import fs from '../../shaders/plane.frag'

class ViewPlane {

  constructor(){
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.plane = new PlaneSquare(this.shader.shaderProgram, 2000, 2000, 20, "xz");
    this.plane.position = [0, 0, 100]
  }

  render(){
    this.shader.bind(); // just to use propgram
    this.plane.render();
  }
}

export default ViewPlane;
