// Finally change the main algo by the Three.js one, the one I had proved to be a bit scheisse

import mcgl, {GL} from 'mcgl';
// import Mesh from './Mesh';

let gl, pivotX, pivotY, axis;

class Plane extends mcgl.Mesh {
  constructor(program, w, h, widthSegments, heightSegments, drawMode){
    drawMode = drawMode || mcgl.GL.gl.POINTS;
    super(program, drawMode);
    gl = mcgl.GL.gl;

    // this.subdivision = subdivision;
    this.axis = axis || "xz";
    this.w = w;
    this.h = h;

    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;

    this.process()
  }

  process(){


    let widthHalf = this.w / 2;
	  let heightHalf = this.h / 2;

	  let gridX = Math.floor( this.widthSegments ) || 1;
	  let gridY = Math.floor( this.heightSegments ) || 1;

	  let gridX1 = gridX + 1;
	  let gridY1 = gridY + 1;

	  let segmentWidth = this.w / gridX;
	  let segmentHeight = this.h / gridY;

    let indices = [];

    let index = 0;

    let offset = 0;

    let vertices = [];
    let normals = [];
    let uvs = [];

    for (let iy = 0; iy < gridY1; iy ++ ) {

		  let y = iy * segmentHeight - heightHalf;
		  for (let ix = 0; ix < gridX1; ix ++ ) {

			  let x = ix * segmentWidth - widthHalf;

        if(this.axis === "xy"){
			    vertices.push([ x, - y, 0 ]);
          normals.push( 0, 0, 1 );
        }
        else
        {
          vertices.push([ x, 0, -y ]);
          normals.push( 0, 1, 0 );
        }

			  uvs.push( ix / gridX );
			  uvs.push( 1 - ( iy / gridY ) );

      }
    }

    for (let iy = 0; iy < gridY; iy ++ ) {

  		for (let ix = 0; ix < gridX; ix ++ ) {

  			let a = ix + gridX1 * iy;
  			let b = ix + gridX1 * ( iy + 1 );
  			let c = ( ix + 1 ) + gridX1 * ( iy + 1 );
  			let d = ( ix + 1 ) + gridX1 * iy;

  			// faces
  			indices.push( [a, b, d] );
  			indices.push( [b, c, d] );

  		}

	  }




    // console.log("vertices.length ", vertices.length);
    // let data = mcgl.utils.FacesSeparator.separate(indices, vertices);
    // let newVertices = data.vertices;
    // let triangles = data.faces;

    // console.log("data.vertices.length ", data.vertices.length);
    // console.log("triangles.length / 3 ", triangles.length / 3);
    // let ind = []
    // for (var i = 0; i < triangles.length; i+=3) {
    //   ind.push([triangles[i], triangles[i+1], triangles[i]])
    // }

    // this.bufferIndex(ind);
    // this.bufferVertex(newVertices, false);

    //
    this.bufferIndex(indices);
    this.bufferVertex(vertices);


    // for (var i = 0; i < subdivision; i++) {
    //   for (var j = 0; j < subdivision; j++) {
    //
    //     if(this.axis === "xy"){
    //       positions.push(this.getPos(i, j));
    //       positions.push(this.getPos(i+1, j));
    //       positions.push(this.getPos(i+1, j+1));
    //       positions.push(this.getPos(i, j+1));
    //     }
    //     else {
    //
    //       positions.push(this.getPos(i, j));
    //       positions.push(this.getPos(i + 1, j));
    //       positions.push(this.getPos(i + 1, j + 1));
    //       positions.push(this.getPos(i, j + 1));
    //     }
    //
    //
    //
    //     indices.push(index * 4 + 0);
    //     indices.push(index * 4 + 1);
    //     indices.push(index * 4 + 2);
    //     indices.push(index * 4 + 0);
    //     indices.push(index * 4 + 2);
    //     indices.push(index * 4 + 3);
    //
    //     index++;
    //   }
    //
    // }

    // this.bufferIndex(indices);
    // this.bufferVertex(positions, false, this.attribPositionName);
  }

  separateFaces(){
    let ind = []
    for (var i = 0; i < this._indices.length; i+=3) {
      ind.push([this._indices[i], this._indices[i+1], this._indices[i+2]])
    }
    let data = mcgl.utils.FacesSeparator.separate(ind, this._vertices);
    let newVertices = data.vertices;
    let triangles = data.faces;

    this.bufferIndex(triangles);
    this.bufferVertex(newVertices, false);

  }

  render(){
    // this.plane(this.w, this.h, this.subdivision, this.axis);
  }

  getPos(i, j){

    // var x = this.w / this.subdivision * i + pivotX + this.position[0];
    // var y = this.h / this.subdivision * j + pivotY + this.position[1];
    // var z = 0 + this.position[2];
    var x = this.w / this.subdivision * i + pivotX ;
    var y = this.h / this.subdivision * j + pivotY ;
    var z = 0 ;

    if(this.axis === "xy"){
      // return [x + this.position[0], y + this.position[0], z + this.position[0]];
      return [x, y, z];
    }
    else {
      // return [x + this.position[0], z + this.position[1], y + this.position[2]];
      return [x, 0, y];
    }
  }

  // bufferIndices(indices){
  //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  //   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  //
  // }
  //
  // bufferVertex(vertices){
  //   gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  //   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  //   // gl.enableVertexAttribArray(this.positionLocation);
  //   // gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0)
  // }

}

export default Plane;
