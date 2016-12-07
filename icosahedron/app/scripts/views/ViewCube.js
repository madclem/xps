import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/cube.vert'
import fs from '../../shaders/cube.frag'
// import vs from '../../shaders/cdv_2_cube.vert'
// import fs from '../../shaders/cdv_2_cube.frag'

class ViewCube {
  constructor(){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    this.shader.bind();
    this.cube = new mcgl.geom.Cube(this.shader.shaderProgram, 100, 100, 100, true);

    let gl = mcgl.GL.gl;

    this.texture = new mcgl.Texture(ASSET_URL + "images/cube.png");
    this.dirLight = null;
    this.pointLight = null;

    this.angle = 0;
  }

  attachLights(directionalLight, pointLight){
    this.dirLight = directionalLight;
    this.pointLight = pointLight;
  }

  render(){

    this.shader.bind(); // just to use propgram
    this.texture.bind(0);
    if(this.dirLight){
      // this.shader.uniform("u_lightDir", 'vec3', this.dirLight.dir);
      // this.shader.uniform("u_colorLightDir", 'vec4', this.dirLight.color);
    }

    if(this.pointLight){
      // this.shader.uniform("u_pointLightPos", 'vec3', this.pointLight.pos);
      // this.shader.uniform("u_colorLightPoint", 'vec3', this.pointLight.color);
    }

    this.angle += 0.02;
    // this.baseMatrix = Matrices.identity(this.baseMatrix);
    // this.baseMatrix = Matrices.translate(this.baseMatrix, -25, -25, -25);
    // this.baseMatrix = Matrices.yRotate(this.baseMatrix, this.angle);

    // Matrices.yRotation(this.angle, this.cubeRotationMatrix), this.cubeTranslationMatrix);
    // this.baseMatrix = Matrices.translate(Matrices.yRotation(this.angle, this.cubeRotationMatrix), this.cubeTranslationMatrix);
    // this.shader.uniform("u_matrix", 'mat4', this.baseMatrix);

    this.tick++;

    this.time = Math.cos(this.tick / 200 + Math.PI / 2) * 10
    GL.draw(this.cube);
  }
}

export default ViewCube;
