import mcgl, {GLShader} from 'mcgl';
import glmatrix from 'gl-matrix';
import vs from '../../shaders/save.vert'
import fs from '../../shaders/save.frag'

class ViewSave {
  constructor(width, height){
    this.tick = 0;
    this.shader = new GLShader(vs, fs);
    // this.shader.bind();

    let positions = [];
		let coords = [];
		let indices = [];
		let extras = [];
		let count = 0;

		let numParticles = 200;
		let totalParticles = numParticles * numParticles;
		console.debug('Total Particles : ', totalParticles);
		let ux, uy;
		let range = 30;

		for(let j = 0; j < width; j++) {
			for(let i = 0; i < height; i++) {
				// positions.push([Math.random() * range  -range/2, Math.random() * range  -range/2, Math.random() * range  -range/2]);

				ux = (i / width * 2.0 - 1.0) + 0.5 / width;
				uy = (j / height * 2.0 - 1.0) + 0.5 / height;

        // if(i == 0)  {
        //   console.log(ux, uy);
        // }

				extras.push([Math.random(), Math.random(), Math.random()]);
				coords.push([ux, uy]);
				indices.push(count);
				count ++;

			}
		}

    // positions = this.getRandomData(width, height, range);


    console.log(mcgl.loadedResources, mcgl.loadedResources["../../assets/images/noise.jpg"]);
    positions = this.getImage(mcgl.loadedResources["../../assets/images/noise.jpg"].data, width, height, 100);
    // positions = this.getImage(ASSET_URL + "images/noise.jpg", width, height, 10);
    // console.log(positions);


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
    for ( var i = 0; i < l; i++ ) {

        var i3 = i * 3;
        var i4 = i * 4;
        let a      = ( ( i % width ) / width  -.5 ) * width;
        let b  = ( iData[i4] / 0xFF * 0.299 +iData[i4+1]/0xFF * 0.587 + iData[i4+2] / 0xFF * 0.114 ) * elevation;
        let c  = ( ( i / width ) / height -.5 ) * height;
        data.push([a, b, c]);
    }
    return data;
  }

  render(t){

    this.shader.bind();
    // GL.gl.bindTexture(mcgl.GL.gl.TEXTURE_2D, t);

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

export default ViewSave;
