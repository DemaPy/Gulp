const { src,dest,watch,parallel } = require("gulp")
const scss = require("gulp-sass")(require('sass'))
const concat = require("gulp-concat")
const browserSync = require("browser-sync").create()
const uglify = require("gulp-uglify-es").default
const fileInclude = require("gulp-file-include")

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    })
}

function includeHtml() {
    return src('./app/index.html')
    .pipe(fileInclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(concat('main.min.html'))
    .pipe(dest('app/html'))
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({
            outputStyle: "compressed"
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function build () {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html',
    ], 
    {base: 'app'})
    .pipe(dest('dist'))
}

function observer() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/index.html'], includeHtml)

    watch(['app/*.html']).on('change', browserSync.reload)
}


exports.styles = styles
exports.observer = observer
exports.browsersync = browsersync
exports.scripts = scripts
exports.build = build
exports.includeHtml = includeHtml


exports.default = parallel(scripts, browsersync, observer)