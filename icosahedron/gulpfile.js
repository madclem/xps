// FIDO Gulp

var gulp        = require('gulp');
var gutil       = require('gulp-util')
var fs 		    = require('fs');
var buildNumber = require('./tasks/gulp-build-number');
var getAvailablePort     = require('./tasks/gulp-build-get-port');
var tinyPNG = require('./tasks/gulp-tiny-png');

var jshint      = require("gulp-jshint");
var clean       = require("gulp-clean");
var uglify      = require("gulp-uglify");
var requirejs   = require("gulp-requirejs-chain");
var handlebars  = require("gulp-compile-handlebars");
var rename      = require('gulp-rename');
var debug       = require('gulp-debug');
var notify      = require("gulp-notify");
var notifier    = require("node-notifier");
var zip         = require("gulp-zip");
var runSequence = require('run-sequence');
var packageJSON = require("./package");
var mcgl_template  = require("./mcglTemplate");

var tinypng     = require('gulp-tinypng-compress');

var webpack     = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var jsonminify = require('gulp-jsonminify');

var open = require('open');
/**
 * jshint that code and make sure it's squeaky clean!
 *
 */
gulp.task('lint', function()
{
    var jshintConfig = packageJSON.jshintConfig;

    gulp.src('./app/scripts/**/*.js')
        .pipe(jshint(jshintConfig))
        .pipe(notify(function(file)
        {
            if (file.jshint.success)
            {
                return false;
            }

            var errors = file.jshint.results.map(function (data)
            {
                if (data.error)
                {
                  return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join("\n");

            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;

        }));
});


/**
 * Compile the index.html file..
 *
 */
gulp.task('templates-dev', function(forBuild)
{
    generateTemplates('./', mcgl_template.dev);
});

gulp.task('templates-bin', function()
{
    generateTemplates('./bin', mcgl_template.bin);
});

var generateTemplates = function(destination, data)
{
    var options =
    {
        ignorePartials: true,
        partials :
        { },
        batch : ['handlebars/partials'],
        helpers :
        { }
    };

    gulp.src('handlebars/templates/**/*.hbs')
        .pipe(handlebars(data, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(destination));
}

/**
 * Builds the js folder into one big js file
 *
 */

gulp.task("webpack", function(callback) {

    var config = require('./webpack.config')

    config.output.path = './';
    config.output.filename = "js/"+ mcgl_template.meta.id +".js"



    // run webpack
    webpack(

        config

    , function(err, stats) {
        if(err) console.log("webpack error", err);

        console.log("webpack complete!")
        //console.log( stats.toString() );
            // output options
        callback();
    });
});

/**
 * Copys the assets in the debug folder over to the build folder
 *
 */
gulp.task('copy_assets', function()
{
    // copy over the url
    gulp.src('./' + mcgl_template.meta.id + '.js')
        .pipe(gulp.dest('./bin/'));

    gulp.src('./js/' + mcgl_template.meta.id + '.js')
        .pipe(gulp.dest('./bin/'));

    gulp.src('./bridge.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./bin/'));

    gulp.src('./bridge.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./bin/'));

    gulp.src('./configuration.json')
        .pipe(gulp.dest('./bin/'));
    // copy over all the assets
    return gulp.src('./assets/**/*')
        .pipe(gulp.dest('./bin/assets'))



});

gulp.task('validate_files', function(){

    var files = gulp.src('./media/**/*')
    console.log(files)
})

gulp.task('increment-build-number', function(){


    return gulp.src('./bin/js/' + mcgl_template.meta.id + ".js")
    .pipe( buildNumber() )
    .pipe(gulp.dest("./bin/js"))

})

gulp.task("sync", function(callback) {
    // Start a webpack-dev-server\

    getAvailablePort().then(function(port){
        var config = require('./webpack.config');
        config.output.path = '/';
        config.entry.app.unshift("webpack-dev-server/client?http://localhost:" + port, "webpack/hot/dev-server");
        var compiler = webpack(config);

        var server = new WebpackDevServer(compiler, {
          hot: true,
          watchOptions: {
            aggregateTimeout: 200,
            poll: true // this is the same as --watch-poll?
          },
          stats : {
            colors : true
          }
        });

        // server.use(require('fido-file-saver'))

        server.listen(port, "0.0.0.0", function(err) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);
            // Server listening
            gutil.log("[webpack-dev-server]", "http://localhost:"+port+"/index.html");

            // keep the server alive or continue?
            callback();

        });

    });

});

gulp.task('uglify', function()
{
    // drop console logs!
    // var options = { compress:{ drop_console: true }};
    var options = { compress:{ drop_console: true }, mangle:false};


    return gulp.src('./bin/game.js')
    .pipe(uglify(options).on('error', gutil.log))
    .pipe(gulp.dest("./bin/"))
});

gulp.task('test', function()
{
    var port = getAvailablePort();
});

gulp.task('compress', function()
{
    return gulp.src('./bin/**')
    .pipe(zip('release.zip'))
    .pipe(gulp.dest('./bin/'));
});


gulp.task('tinypng', function () {
    return tinyPNG();
});

gulp.task('clean_bin', function()
{
    // delete the bin..
    return gulp.src('./bin', {read: false})
        .pipe(clean({force:true}))
});

gulp.task('minifyJson', function () {
    return gulp.src(['./bin/assets/**/*.json', "!./bin/assets/**/levels.json"])
        .pipe(jsonminify())
        .pipe(gulp.dest('./bin/assets/'));
});

/**
 * do the whole lot!
 *
 */
gulp.task('build', function(cb){
    runSequence('webpack', 'clean_bin', 'templates-bin', 'copy_assets', cb);
});


gulp.task('deploy', function(cb){
    runSequence('webpack', 'clean_bin', 'templates-bin', 'copy_assets', 'uglify','increment-build-number', 'tinypng', 'minifyJson', cb);
});


gulp.task('deploy-test', function(cb){
    runSequence('webpack', 'clean_bin', 'templates-bin', 'copy_assets', 'increment-build-number', 'minifyJson', cb);
});


gulp.task('deploy-local', function(cb){
    runSequence('webpack', 'clean_bin', 'templates-bin', 'copy_assets', 'uglify', cb);
});

/**
 * Notifications
 *
 */

function notifySyncComplete()
{
    notifier.notify(
    {
        title : "Gulp :: Notification",
        message : "File saved & processed",
        templateOptions :
        {
        }
    });
};

function notifyBuildComplete()
{
    notifier.notify(
    {
        title : "Gulp :: Notification",
        message : "Build complete",
        templateOptions :
        {
        }
    });
};
