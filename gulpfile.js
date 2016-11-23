'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')(); //lazy load some of gulp plugins

const fs = require('fs');
const spritesmith = require('gulp.spritesmith');
const revHash = require('rev-hash');
const del = require('del');

const devMode = process.env.NODE_ENV || 'development';

const destFolder = devMode === 'development' ? 'development' : 'production';


// STYLES
gulp.task('sass', function () {

	return gulp.src('src/sass/style.scss')
		.pipe($.if(devMode !== 'production', $.sourcemaps.init())) 
		.pipe($.sass({outputStyle: 'expanded'})) 
		.on('error', $.notify.onError())
		.pipe($.autoprefixer({
			browsers: ['ie 10-11', '> 1%'],
			cascade: false
		}))
		.pipe($.cssImageDimensions())
		.on('error', $.notify.onError())
		.pipe($.if(devMode !== 'production', $.sourcemaps.write())) 
		.pipe(gulp.dest(destFolder + '/assets/css'));  
});

// image urls
gulp.task('modifyCssUrls', function () {

	return gulp.src(destFolder + '/assets/css/style.css')
		.pipe($.modifyCssUrls({
			modify: function (url, filePath) {
				const buffer = fs.readFileSync(url.replace('../', destFolder + '/assets/'));				
				return url + '?_v=' + revHash(buffer);
			},
		}))		
		.pipe($.minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest(destFolder + '/assets/css'));

});

// ASSETS
gulp.task('assets-files', function(){
	return gulp.src(['src/assets/**/*.*', '!src/assets/sprite/*.*', '!src/assets/favicon.ico'], {since: gulp.lastRun('assets-files')})
		.pipe($.newer(destFolder + '/assets'))
		.pipe(gulp.dest(destFolder + '/assets'))
});

gulp.task('sprite', function(callback) {

	const spriteData = 
		gulp.src('src/assets/sprite/*.png') // путь, откуда берем картинки для спрайта
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprites.scss',
			imgPath: '../images/sprite.png'
		}))
		.on('error', $.notify.onError())
		

	spriteData.img
		.pipe(gulp.dest(destFolder + '/assets/images/'))

	spriteData.css.pipe(gulp.dest('src/sass/'))	
	.on('end', callback);

});
gulp.task('assets', gulp.parallel('assets-files', 'sprite'));


// HTML
gulp.task('html', function(callback){

	const servers = {
		development: [
			'local',
		],
		production: [
			'dnevnik',
			'mosreg',
			'staging',
		],
	}

	const currentServers = servers[devMode];
	
	if (!currentServers){
		callback();
		return false;
	}

	currentServers.map( (server, i) => {
		html(server, () => {
			if (i === currentServers.length - 1){
				callback();
			}
		});
	});

	function html(server, callback) {

		let newDestFolder = destFolder;

		if (server !== 'local'){
			newDestFolder += '/' + server;
		}

		const files = [
			'src/html/*.html'
		];

		if (server !== 'local'){
			files.push('!src/html/oauth.html');
		}

		return gulp.src(files)
		.pipe($.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: {
				server: server,
			},
			indent: true
		}))
		.on('error', $.notify.onError())
		.pipe($.if(devMode === 'production', $.htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(newDestFolder))
		.on('end', callback);
	};

});


gulp.task('js', function(){
	return gulp.src(['src/js/**/*.*'], {since: gulp.lastRun('js')})
		.pipe($.newer(destFolder + '/assets/js'))
		.pipe(gulp.dest(destFolder + '/assets/js'))
});


// BUILD
gulp.task('server', function () {
	gulp.src(destFolder)
	.pipe($.serverLivereload({
		livereload: true,
		directoryListing: false,
		open: false,
		port: 9000
	}));
})

gulp.task('watch', function(){
	gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('src/assets/**/*', gulp.series('assets'));
	gulp.watch('src/js/**/*', gulp.series('js'));
	gulp.watch('src/html/**/*.html', gulp.series('html'));
});

gulp.task('clean', function() {
	return del([destFolder]);
});

gulp.task('build', gulp.series('assets', 'sass', 'html'));


// gulp start - very first start to build the project and run server in 'development' folder
gulp.task('start', gulp.series('clean', 'build', gulp.parallel('server', 'watch')));

// gulp - just run server in 'development' folder
gulp.task('default', gulp.parallel('server', 'watch'));



