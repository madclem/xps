// images.js

"use strict"

// const imagemin = require('imagemin');
// const imageminWebp = require('imagemin-webp');

// imagemin(['assets/img/**/*.{jpg,png}'], 'build/images', {
//     use: [
//         imageminWebp({quality: 50})
//     ]
// }).then(() => {
//     console.log('Images optimized');
// });


// const ncp = require('ncp').ncp;



// const dst = path.resolve(__dirname, "../../bin/assets/img" );

// ncp(src, dst, (err)=> {
//  if(err) {
//      console.log('Error copy file', err);
//      return
//  }
//  console.log('Done copying files');
// });

const path = require('path');
const im = require('imagemagick');
const fs = require('fs');

const dirImgGame = path.resolve(__dirname, "../assets/img/game/");
const dirDist = path.resolve(__dirname, "../assets/img/game/mobile");

const getExtension = function(mFileName) {
	const ext = mFileName.split('.')[1];
	return ext;
}

const isDirectory = function(mPath) {
	return fs.lstatSync(mPath).isDirectory();
}

const excludedList = ['mobile']

const resizeImage = (mFileName, mPath, mDist, mWidth) => {
	im.resize({
		srcPath: mPath,
		dstPath: `${mDist}/${mFileName}`,
		width:   mWidth
	}, function(err, stdout, stderr){
	  if (err) throw err;
	  console.log(`resized ${mPath} to fit within ${mWidth}px`);
	});
}

const getImages = (mPath, mDist, mCallback) => {
	fs.readdir(mPath, (err, ary) => {
		ary.map( (fileName) => {
			const filePath = `${mPath}/${fileName}`;
			if(filePath === mDist) {
				return;
			}
			// console.log(filePath === mDist);
			const ext = getExtension(fileName);
			if(ext === 'jpg' || ext === 'png') {
				console.log('Image Found :', fileName);
				im.identify(filePath, (err, features)=> {
					// console.log('File :', fileName , features.width, features.height);
					resizeImage(fileName, filePath, mDist, features.width/2);
				});
			} else if(ext === undefined) {
				const newPath = `${mPath}/${fileName}`;
				const newDist = `${mDist}/${fileName}`;

				console.log('Directory : ', newPath);
				console.log('Directory : ', newDist);
				getImages(newPath, newDist);
			}
		});
	});
}

getImages(dirImgGame, dirDist);

