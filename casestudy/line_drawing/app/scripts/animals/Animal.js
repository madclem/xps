import glmatrix from 'gl-matrix';

class Animal {
  constructor(vertices, pos, eyes, offsetEyes){

    this.vertices = vertices || []

    this.position = pos || [0, 0, 0];

    // the matrices
    this.m = glmatrix.mat4.create();
    this.mRY = glmatrix.mat4.create();
    this.mT = glmatrix.mat4.create();
    this.mTAnchor = glmatrix.mat4.create();

    this.remapVertices();
  }

  remapVertices(){

    let minX = 10000;
    let maxX = 0;

    let minY = 10000;
    let maxY = 0;

    // get the dimensions of the drawing
    for (var i = 0; i < this.vertices.length; i++) {
      let v = this.vertices[i];
      if(v[0] < minX) minX = v[0]
      if(v[0] > maxX) maxX = v[0]

      if(v[1] < minY) minY = v[1]
      if(v[1] > maxY) maxY = v[1]
    }

    this.wX = maxX - minX; // width x
    this.wY = maxY - minY; // width width y
    let w = Math.max(this.wX, this.wY);

    this.tick = 0;

    let xMin = null;
    let xMax = null;
    let yMin = null;
    let yMax = null;
    let zMin = null;
    let zMax = null;

    for (var i = 0; i < this.vertices.length; i++) {

			this.tick++;

			this.vertices[i][0] /= (w/2);
			this.vertices[i][1] /= -(w/2); // minus because drawing from 2d although y is inversed
			this.vertices[i][2] = Math.cos(this.tick/10) * .4; // cos the depth to make it look good


      if(this.vertices[i][0] < xMin || xMin === null) xMin = this.vertices[i][0];
      if(this.vertices[i][0] > xMax || xMax === null) xMax = this.vertices[i][0];

      if(this.vertices[i][1] < yMin || yMin === null) yMin = this.vertices[i][1];
      if(this.vertices[i][1] > yMax || yMax === null) yMax = this.vertices[i][1];

      if(this.vertices[i][2] < zMin || zMin === null) zMin = this.vertices[i][2];
      if(this.vertices[i][2] > zMax || zMax === null) zMax = this.vertices[i][2];
		}


    this.centerX = (xMax + xMin) /2;
    this.centerY = (yMax + yMin) /2;
    this.centerZ = (zMax + zMin) /2;

    var translation = [
      this.position[0] ,
      this.position[1],
      this.position[2]
    ]

    // the pivot point of the animal
    this.translationAnchor = [
      -this.centerX,
      -this.centerY,
      -this.centerZ
    ]

    glmatrix.mat4.identity(this.mT, this.mT);
    glmatrix.mat4.identity(this.mTAnchor, this.mTAnchor);

    glmatrix.mat4.translate(this.mTAnchor, this.mTAnchor, this.translationAnchor);
    glmatrix.mat4.translate(this.mT, this.mT, translation);
  }

  rotateX(){
	}

	rotateY(ry){
    glmatrix.mat4.identity(this.mRY);
    glmatrix.mat4.fromYRotation(this.mRY, ry);
	}

  // to get the points correctly translated, rotated (useful in the main experiment, not so much this one)
  // as the animal position is always the same
  getPoints(){
    let v = this.vertices.slice();
    glmatrix.mat4.identity(this.m);

    glmatrix.mat4.multiply(this.m, this.m, this.mT);
    glmatrix.mat4.multiply(this.m, this.m, this.mRY);
    glmatrix.mat4.multiply(this.m, this.m, this.mTAnchor);


    let verts = [];
    for (var i = 0; i < v.length; i++) {
      glmatrix.vec3.transformMat4(v[i], v[i], this.m);
    }

    return v;
  }
}

export default Animal;
