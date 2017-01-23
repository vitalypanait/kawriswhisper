'use strict';

const gulp        = require('gulp');
const del         = require('del');
const plumber     = require('gulp-plumber');
const notify      = require('gulp-notify');
const gulpif      = require('gulp-if');
const browserSync = require('browser-sync').create();
const isDev       = ! process.env.NODE_ENV && process.env.NODE_ENV === 'dev';

gulp.task('styles', () => {
	const stylus       = require('gulp-stylus');
	const autoprefixer = require('gulp-autoprefixer');
	const csso         = require('gulp-csso');
	const rename       = require('gulp-rename');

	return gulp.src('./src/css/index.styl')
		.pipe(plumber({
			errorHandler : notify.onError(err => {
				return {
					title   : 'Styles',
					message : err.message
				}
			})
		}))
		.pipe(stylus())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulpif(! isDev, csso()))
		.pipe(rename({basename: 'styles'}))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
	const uglify  = require('gulp-uglify');
	const include = require('gulp-include');

	return gulp.src('./src/js/main.js')
		.pipe(plumber({
			errorHandler : notify.onError(err => {
				return {
					title   : 'Js',
					message : err.message
				}
			})
		}))
		.pipe(include())
		.pipe(gulpif(! isDev, uglify()))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('assets', () => {
	return gulp.src('./src/{fonts,images}/**/*.*')
		.pipe(plumber({
			errorHandler : notify.onError(err => {
				return {
					title   : 'Assets',
					message : err.message
				}
			})
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
	return del('dist');
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'assets', 'js')));

gulp.task('watch', () => {
	gulp.watch('./src/css/**/*.*', gulp.series('styles'));
	gulp.watch('./src/js/**/*.*', gulp.series('js'));
	gulp.watch('./src/{fonts,images}/**/*.*', gulp.series('assets'));
});

gulp.task('serve', () => {
	browserSync.init({
		server: './'
	});

	browserSync.watch(['./dist/**/*.*', './**/*.html', './js/**/*.*']).on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch', 'serve'));