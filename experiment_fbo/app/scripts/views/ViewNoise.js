import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/noise.vert'
import fs from '../../shaders/noise.frag'

class ViewNoise {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    // this.shader.bind();

    this.tick = 0;
    this.position = [0, 0];

    let positions = [];
		let coords = [];
		let indices = [];
		let extras = [];
		let count = 0;

		let numParticles = 200;
		let totalParticles = numParticles * numParticles;
		// console.debug('Total Particles : ', totalParticles);
		let ux, uy;
		let range = 30;

		for(let j = 0; j < width; j++) {
			for(let i = 0; i < height; i++) {
				positions.push([Math.random() * range  -range/2, Math.random() * range  -range/2, Math.random() * range  -range/2]);

				ux = (i / width * 2.0 - 1.0) + 0.5 / width;
				uy = (j / height * 2.0 - 1.0) + 0.5 / height;

        // if(i == 0)  {
        //   console.log(ux, uy);
        // }
				coords.push([ux, uy]);
				indices.push(count);
				count ++;

			}
		}

    // positions = this.getRandomData(width, height, range);


    // console.log(mcgl.loadedResources, mcgl.loadedResources["../../assets/images/noise.jpg"]);
    // let data = this.getImage(mcgl.loadedResources["../../assets/images/noise.jpg"].data, 256, 256, 100);
    // positions = this.getImage(ASSET_URL + "images/noise.jpg", width, height, 10);
    // console.log(positions);

    let icosphere = new mcgl.geom.IcoSphere(null);
    // let data = this.parseMesh(icosphere);

    // console.log(icosphere);

    // console.log("here", GL);
		this.mesh = new mcgl.Mesh(this.shader.shaderProgram, GL.gl.POINTS);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoord(coords);
		this.mesh.bufferIndex(indices);

		// this.meshExtra = new alfrid.Mesh(GL.POINTS);
		// this.meshExtra.bufferVertex(extras);
		// this.meshExtra.bufferTexCoord(coords);
		// this.meshExtra.bufferIndex(indices);


  }


  parseMesh( g ){

    var vertices = g._vertices;
    var total = vertices.length;
    console.log(total);
    var size = parseInt( Math.sqrt( total * 3 ) + .5 );
    var data = []//new Float32Array( size*size );
    let index = 0;
    let coords = [];
    let uy, ux;
    let count = 0
    let indices = []

    for(let j = 0; j < size; j++) {
			for(let i = 0; i < size; i++) {

        ux = (i / size * 2.0 - 1.0) + 0.5 / size;
				uy = (j / size * 2.0 - 1.0) + 0.5 / size;
        coords.push([ux, uy]);
      }
    }

    for( var i = 0; i < total; i++ ) {
        data[index++] = [
          vertices[i][0],
          vertices[i][1],
          vertices[i][2]
        ]

        // ux = (i / total * 2.0 - 1.0) + 0.5 / total;
				// uy = (i/ total * 2.0 - 1.0) + 0.5 / total;

        indices.push(count)
        count++

        // data[i * 3] = vertices[i].x;
        // data[i * 3 + 1] = vertices[i].y;
        // data[i * 3 + 2] = vertices[i].z;
    }
    return {positions:g._vertices.slice(), coords: coords, indices: indices};

  }

  getRandomData( width, height, size ){
    var len = width * height;
    var data = [];//new Float32Array( len );
    while( len-- )data[len] = [( Math.random() * 2 - 1 ) * size , ( Math.random() * 2 - 1 ) * size , ( Math.random() * 2 - 1 ) * size ];
    return data;
  }

  getCanvas( w,h ){
      var canvas = document.createElement( "canvas");
      canvas.width = w || 512;
      canvas.height = h || 512;
      return canvas;
  }

  getContext( canvas, w,h ){
      canvas = canvas || this.getCanvas(w,h);
      canvas.width = w || canvas.width;
      canvas.height = h || canvas.height;
      return canvas.getContext("2d");
  }

  getImage( img, width, height, elevation ){

    var ctx = this.getContext( null, width, height );
    ctx.drawImage(img, 0, 0);

    var imgData = ctx.getImageData(0,0,width,height);
    var iData = imgData.data;

    var l = (width * height );
    var data = [];//new Float32Array( l * 3 );
    var indices = [];//new Float32Array( l * 3 );
    let count = 0;
    let coords = [];
    let ux, uy;

    for ( var i = 0; i < l; i++ ) {

        var i3 = i * 3;
        var i4 = i * 4;
        let a      = ( ( i % width ) / width  -.5 ) * width;
        let b  = ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
        let c  = ( ( i / width ) / height -.5 ) * height;
        data.push([a, b, c]);
        indices.push(count)

        // ux = (i / width * 2.0 - 1.0) + 0.5 / width;
				// uy = (j / height * 2.0 - 1.0) + 0.5 / height;

        // coords.push([ux, uy]);

        count++;
    }

    return {positions:data, indices:indices, coords: coords};
    // for(let j = 0; j < width; j++) {
		// 	for(let i = 0; i < height; i++) {
    //     var i4 = i * 4;
    //     let a      = ( ( j % width ) / width  -.5 ) * width;
    //     let b  =  ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
    //     let c  = ( ( i / height ) / height -.5 ) * height;
    //     data.push([a, b, c]);
    //     indices.push(count);
    //     count++;
    //
    //     ux = (i / width * 2.0 - 1.0) + 0.5 / width;
		// 		uy = (j / height * 2.0 - 1.0) + 0.5 / height;
    //
    //     coords.push([ux, uy]);
    //   }
    // }

    //     var i3 = i * 3;
    //     let a      = ( ( i % width ) / width  -.5 ) * width;
    //     let b  = ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
    //     let c  = ( ( i / width ) / height -.5 ) * height;
    //     indices.push(count)
    //     count++;
    // }

    // return {positions:data, indices:indices, coords: coords};
    // return {position: data, ;
  }

  render(t){

    this.shader.bind();
    // GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);
    this.tick  -= .01;
    this.shader.uniform("u_time", "float", this.tick)
    // this.shader.uniform("time", "float", this.tick)
    GL.draw(this.mesh);

    // this.shader.uniform("positions", "int", 1)
    // //
    // //
    // mcgl.GL.gl.generateMipmap(mcgl.GL.gl.TEXTURE_2D);
    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, null);

    // mcgl.GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, this.texture);
    // GL.draw(this.mesh);
  }
}

export default ViewNoise;
