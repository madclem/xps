// copy-assets.js


const ncp = require('ncp').ncp;
const path = require('path');

const src = path.resolve(__dirname, "../assets" );
const dst = path.resolve(__dirname, "../../bin/assets" );

ncp(src, dst, (err)=> {
	if(err) {
		console.log('Error copy file', err);
		return
	}
	console.log('Done copying files');
});