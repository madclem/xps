import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/icosphere.vert'
import fs from '../../shaders/icosphere.frag'
import DoubleSpring from '../../libs/DoubleSpring'

// import Sphere from '../helpers/gl_helpers/geometry/Sphere';

class ViewIcosphere {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.sphere = new mcgl.geom.IcoSphere(this.shader.shaderProgram, 4, 400);
    this.animating = false;
    this.speedAnimating = false;
    this.isActive = false;
    this.percentage = 1;

    let displ = [];
    let d;

    for (var i = 0; i < this.sphere._vertices.length; i+=3) {
      let v = this.sphere._vertices;
      let p1 = v[i];
      let p2 = v[i+1];
      let p3 = v[i+2];

      let randx = Math.random();
      let randy = Math.random();
      let randz = Math.random();

      let centroid = [
        (p1[0] + p2[0] + p3[0])/3,
        (p1[1] + p2[1] + p3[1])/3,
        (p1[2] + p2[2] + p3[2])/3,
      ]

      displ.push(centroid)
      displ.push(centroid)
      displ.push(centroid)
    }

    this.shader.uniform("time", "float", 0);

    this.sphere.bufferData(displ, 'a_displacement', 3, false);

    // this.texture = new mcgl.Texture(ASSET_URL + "images/earth.png");

    this.speed = 0;
    this.offset = 0;
    this.percentage = 1;

  }

  onPressed(){
    if(this.animating) return;
    this.animating = true;

    this.isActive = !this.isActive;
    let val = this.isActive ? 0:1;

    this.speed = .05;

    Easings.to(this, 1, {
      percentage: val,
      ease: Easings.easeOutCirc,
      onComplete: ()=> {
        this.animating = false;
      }
    })
  }

  render(){
    this.shader.bind(); // just to use propgram
    this.tick++;

    this.speed *= .98;

    this.offset -= this.speed;

    this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    this.shader.uniform("time", "float", this.time);
    this.shader.uniform("percentage", "float", this.percentage);
    this.shader.uniform("offset", "float", this.offset);

    GL.draw(this.sphere);
  }
}

export default ViewIcosphere;
