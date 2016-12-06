var Transform = require('stream').Transform;
var spawnSync = require('child_process').spawnSync;


function TransformPlugin(options){
    Transform.call(this, options);

    //this.versionNumber = options.versionNumber;
}

TransformPlugin.prototype = Object.create(Transform.prototype);

// Encoding argument in this case serves no purpose
TransformPlugin.prototype._transform = function(file, encoding, done) {


    var command = spawnSync('git', ['rev-parse', '--short', 'HEAD'] );

    if(command.stderr.length === 0)
    {
    	var commitHash = command.stdout.toString();

    	str = commitHash.trim();

    	this.versionNumber = str;

	    var log = "\n \n console.log(' BUILD VERSION: "+ this.versionNumber + "' );";

	    // file.contents is a node Buffer
	    var contents = file.contents.toString('utf8');

	   	contents += log;

	    file.contents = new Buffer(contents, 'utf8');
    }
    else{
    	console.log(command.stderr.toString()) 
    }



    this.push(file);

    
    return done();
};

function replaceNumbers(string) {


    var letters = {
    	'0' : 'a',
    	'1' : 'e',
    	'2' : 'i',
    	'3' : 'o',
    	'4' : 'u',
    	'5' : 'y',
    	'6' : 'd',
    	'7' : 's',
    	'8' : 'v',
    	'9' : 'l',
    }

	function replacer(match){
		return letters[match]
	}

	var str = string.split('');

	for (var i = 0; i < str.length; i++) {
	    var ch = str[i];
	    str[i] = ch.replace(/[0-9]/g,replacer.bind(this))
	};

	return str;

}

// Factory for creating new object mode noop streams
function gulpPlugin(customArg){

	// if we want to retrieve some arguments
    //return new TransformPlugin({ objectMode: true,customArg: customArg});
    return new TransformPlugin({ objectMode: true});
}

module.exports = gulpPlugin;