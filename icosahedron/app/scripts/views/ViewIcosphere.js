import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/icosphere.vert'
import fs from '../../shaders/default.frag'

// import Sphere from '../helpers/gl_helpers/geometry/Sphere';

class ViewIcosphere {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.sphere = new mcgl.geom.IcoSphere(this.shader.shaderProgram);

    let displ = [];
    let d;

    for (var i = 0; i < this.sphere._vertices.length; i+=3) {
      let v = this.sphere._vertices;
      let p1 = v[i];// this.sphere._vertices[i];
      let p2 = v[i+1];// this.sphere._vertices[i];
      let p3 = v[i+2];// this.sphere._vertices[i];

      let centroid = [
        (p1[0] + p2[0] + p3[0])/3,
        (p1[1] + p2[1] + p3[1])/3,
        (p1[2] + p2[2] + p3[2])/3,
      ]

      // console.log(centroid);
      displ.push(centroid)
      displ.push(centroid)
      displ.push(centroid)
    }
    // console.log(displ);

    this.shader.uniform("time", "float", 0);
    this.sphere.bufferData(displ, 'a_displacement', 1, false);

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
