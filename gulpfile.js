var gulp = require('gulp');
var config = require('./gulp.config')();
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');
var less = require('gulp-less');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var hbsfy = require('hbsfy');

// Load al the plugins installed as dev
var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('build', ['inject'], function() {
    return gulp
        // Selects the HTML file to use.
        .src(config.index)
        // Plumber prevents pipe breaking caused by errors from gulp plugins.
        .pipe($.plumber())
        // Parses build blocks in the HTML.
        .pipe($.useref())
        // Filters CSS files and applies csso to minify CSS.
        .pipe($.if('**/*.css', $.csso()))
        // Filters JS files and applies uglify to minify JS.
        .pipe($.if('**/*.js', $.uglify()))
        // Saves minified files.
        .pipe(gulp.dest('./src/build'));
});

gulp.task('inject', ['wiredep', 'compile-css', 'connect'], function() {
    log('Wire up the app css into the html, and call wiredep');

    return gulp
        // Selects the HTML file to use.
        .src(config.index)
        // Injects the CSS files into the HTML
        .pipe($.inject(gulp.src(config.temp + 'style.css')))
        // Saves the HTML file.
        .pipe(gulp.dest('./'));
});

gulp.task('compile-css', function(){
    log('=> Starting compile LESS');

    return gulp
        // Selects the source file to use.
        .src(config.less)
        .on('error', function(){console.log('error')})
        // Plumber prevents pipe breaking caused by errors from gulp plugins.
        .pipe($.plumber())
        // Compiles LESS files to CSS.
        .pipe(less())
        // Parses CSS and adds vendor prefixes to CSS rules.
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        // Saves the bundled JS into a directory.
        .pipe(gulp.dest(config.temp));
});

// Compiles browserify modules.
gulp.task('browserify', function() {
    log('=> Starting conversion');
    return browserify({
            // Sets the path where the main JS is.
            entries: [config.js + 'app.js']
        })
        // Applies hbsfy to include templates.
        .transform(hbsfy)
        // Creates the bundled JS.
        .bundle()
        // Converts the bundled JS into a gulp stream.
        .pipe(source('app.bundled.js'))
        // Saves the bundled JS into a directory.
        .pipe(gulp.dest(config.temp));
});

gulp.task('default', ['browserify','check-js'], function(){
});

gulp.task('wiredep', ['browserify'], function() {
    log('Wire up css and js into the html');

    var wiredep = require('gulp-wiredep').stream;

    return gulp
        // Selects the HTML file to use.
        .src(config.index)
        // Injects the JS files into the HTML
        .pipe($.inject(gulp.src(config.temp + 'app.bundled.js')))
        // Saves the HTML file.
        .pipe(gulp.dest('./'));
});

gulp.task('connect', function() {
	connect.server({
    	root: 'src',
    	livereload: true
  	});
});

gulp.task('index', function(){
	log('Wire up the app css into the html, and call wiredep');
    
    return gulp
        // Selects the HTML file to use.
        .src(config.index)
        // Injects the CSS files into the HTML
        .pipe($.inject(gulp.src(config.temp + 'style.css')))
        // Saves the HTML file.
        .pipe(gulp.dest('./'));
});

// Analizes JS files.
gulp.task('check-js', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        // Selects the source file to use.
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        // Executes jscs (code style linter/formatter).
        .pipe($.jscs())
        // Executes jshint (tool to detect errors and potential problems in JavaScript code).
        .pipe($.jshint('./.jshintrc'))
        // Logs errors using the stylish reporter.
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        // fail if JSHint was not a success.
        .pipe($.jshint.reporter('fail'));
});

// Functions 
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
};