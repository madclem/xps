import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/default.vert'
import fs from '../../shaders/default.frag'

// import Sphere from '../helpers/gl_helpers/geometry/Sphere';

class ViewSphere {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    console.log("here--0", this.shader, GL.gl.TRIANGLES);
    this.sphere = new mcgl.geom.Sphere(this.shader.shaderProgram, 128, 150);
    console.log("here--1");
    this.sphere.position = [0, 200, 100]

    this.back = false;
    var rot = [];
    glmatrix.mat4.identity(rot);

    glmatrix.mat4.rotateY(rot, rot, Math.PI);
    this.shader.uniform("back", "float", 1);
    this.shader.uniform("time", "float", 0);
    this.shader.uniform("u_matrix", "mat4", rot);

    this.backValue = 0;
    this.targetValue = 0;
  }

  render(){
    this.shader.bind(); // just to use propgram
    this.tick++;

    this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    this.shader.uniform("time", "float", this.time);

    GL.draw(this.sphere);
  }
}

export default ViewSphere;
