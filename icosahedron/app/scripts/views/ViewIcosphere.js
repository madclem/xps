import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/default.vert'
import fs from '../../shaders/default.frag'

// import Sphere from '../helpers/gl_helpers/geometry/Sphere';

class ViewIcosphere {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.sphere = new mcgl.geom.IcoSphere(this.shader.shaderProgram);
    this.shader.uniform("time", "float", 0);

    this.texture = new mcgl.Texture(ASSET_URL + "images/earth.png");
  }

  render(){
    this.shader.bind(); // just to use propgram
    this.tick++;

    this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    this.shader.uniform("time", "float", this.time);

    GL.draw(this.sphere);
  }
}

export default ViewIcosphere;
