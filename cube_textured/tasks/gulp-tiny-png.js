var gulp = require('gulp');
var tinypng = require('gulp-tinypng-compress');

module.exports = function(list)
{
    return gulp.src('../bin/assets/img/**/*.png')
    .pipe(tinypng({
        key: 'M0LS2eL1dNsu2mbkZwnuZtYCX-En-IVL',
        checkSigs: true,
        sameDest:true,
        summarize:true,
        sigFile: '.tinypng-sigs',
        log: true
    }))
    .pipe(gulp.dest('../bin/assets/img/'));

}
