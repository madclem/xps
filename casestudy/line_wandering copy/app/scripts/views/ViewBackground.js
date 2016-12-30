import mcgl, {GLShader} from 'mcgl'
import vs from '../../shaders/bg.vert'
import fs from '../../shaders/bg.frag'

class ViewBackground {

  constructor(){
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.bg = new mcgl.geom.BigTriangle(this.shader.shaderProgram);

    this.percentage = 0;
    // this.bg.position = [0, 0, 0]
  }

  render(){

    this.shader.bind(); // just to use propgram

    this.shader.uniform("u_percentage", "float", this.percentage);
    // this.shader.uniform("resolutions", "vec2", [window.innerWidth, window.innerHeight]);
  //   12.0/255.0, 98.0/255.0, 137.0/255.0
  // 239.0/255.0, 246.0/255.0, 247.0/255.0
    // this.shader.uniform("colorTop", "vec3", [239.0/255.0, 246.0/255.0, 247.0/255.0]);
    // this.shader.uniform("colorBottom", "vec3", [12.0/255.0, 98.0/255.0, 137.0/255.0]);
    GL.draw(this.bg);
  }
}

export default ViewBackground;
