import GLShader from '../helpers/gl_helpers/GLShader';
// import GL from './helpers/GLHelpers';
import Plane from '../helpers/gl_helpers/geometry/Plane';
import vs from '../../shaders/plane_bg.vert'
import fs from '../../shaders/plane_bg.frag'

class ViewBackground {

  constructor(){
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.plane = new Plane(this.shader.shaderProgram, 4000, 4000, 20, "xy");
    // this.plane.position = [0, 0, 0]
  }

  render(){

    this.shader.bind(); // just to use propgram
    this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
  //   12.0/255.0, 98.0/255.0, 137.0/255.0
  // 239.0/255.0, 246.0/255.0, 247.0/255.0
    this.shader.uniform("colorTop", "vec3", [239.0/255.0, 246.0/255.0, 247.0/255.0]);
    this.shader.uniform("colorBottom", "vec3", [12.0/255.0, 98.0/255.0, 137.0/255.0]);
    GL.draw(this.plane);
  }
}

export default ViewBackground;
