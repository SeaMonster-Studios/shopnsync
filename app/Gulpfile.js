const gulp = require("gulp");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const eslint = require('gulp-eslint');
const rucksack = require("gulp-rucksack");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const stylelint = require("stylelint");
const reporter = require("postcss-reporter");
const syntaxScss = require("postcss-scss");
const stylelintConfig = require("./.stylelintrc.json");
const fs = require('fs')
const yaml = require('js-yaml')
const consolidate = require("gulp-consolidate");
const bust = require("gulp-cache-bust");
const babel = require('gulp-babel');
const eslintConfig = require('./.eslintrc.json');
const concat = require("gulp-concat");
const shell = require('gulp-shell')
const zip = require('gulp-zip')
const prompt = require('gulp-prompt')
let conf

gulp.task('config', () => {
	const confAll = yaml.load(fs.readFileSync('./config.yml', {encoding: 'utf-8'}))
	conf = confAll.development
	conf.watchViews = conf.views.map((view) => `${view}/**`)
	conf.vhost = `https://${conf.store}/?preview_theme_id=${conf.theme_id}`
})

gulp.task('package', ['config'], () => 
	gulp.src(conf.views)
		.pipe(prompt.prompt({
			type: 'input',
			name: 'themeName',
			message: 'What is the name of your theme?',
		}, (res) => 
			gulp.src(conf.views)
			.pipe(zip(`${res.themeName}.zip`))
			.pipe(gulp.dest('./'))
			.pipe(gutil.buffer(() => {
				gutil.log(gutil.colors.green(
					`\n\nYour theme, ${res.themeName}.zip has been created.\nNow you'll want to upload it to your Shopify store, and then look at the next steps in the README.md`
				))
			}))
		))
)

gulp.task("eslint", ['config'], () => {
	return gulp.src(conf.scriptsToLint)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(eslint(eslintConfig))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});


gulp.task("scripts", ['config', "eslint"], () => {
	return gulp.src(conf.scripts)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(babel({
			presets: ["es2015", "stage-0"]
		}))
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(concat("index.js"))
		.pipe(bust())
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(conf.dist))
		.pipe(browserSync.stream());
});

gulp.task("sass-lint", ['config'], () => {
	const processors = [
		stylelint(stylelintConfig),
		reporter({
			clearMessages: true,
			throwError: true,
		}),
	];

	return gulp.src(conf.sassFilesToLint)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(postcss(processors, { syntax: syntaxScss }));
});

gulp.task("styles", ['config', "sass-lint"], () => {
	return gulp.src(conf.sassIndex)
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit("end");
		}))
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(rucksack({ autoprefixer: true }))
		.pipe(cssnano())
		.pipe(rename((path) => path.basename += ".min"))
		.pipe(bust())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(conf.dist))
		.pipe(browserSync.stream());
});

gulp.task("start", ['config', "scripts", "styles"], () => {
	const queryStringComponents = []

	/**
   * Shopify sites with redirection enabled for custom domains force redirection
   * to that domain. `?_fd=0` prevents that forwarding. (Thanks Slate team!)
   */
  queryStringComponents.push('_fd=0');

	browserSync.init({
		files: [
			{
				options: {
					ignored: ".*",
				},
			},
		],
		port: 8181,
		notify: false,
		proxy: {
			target: conf.vhost,
      middleware: (req, res, next) => {
        const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
        req.url += prefix + queryStringComponents.join('&');
        next();
      },
		},
		logPrefix: conf.vhost,
	  serveStatic: ['assets'],
	  rewriteRules: [
      {
        match: new RegExp(conf.asset_url + '(.*)', 'g'),
        replace: "/$1",
      }
	  ],
		reloadOnRestart: true,
	});

	gulp.watch(["assets/**"], ['themekit:upload'])
	gulp.watch(["src/styles/**"], ["styles"]);
	gulp.watch(["src/scripts/**"], ["scripts"]).on('change', browserSync.reload);
	gulp.watch([conf.watchViews], ['upload']);
});

gulp.task('upload', ['themekit:upload'], () => {
	browserSync.reload()
})

gulp.task('themekit:upload', shell.task('theme upload'))

gulp.task("default", ["start"]);
