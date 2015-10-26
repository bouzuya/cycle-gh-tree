babel = require 'gulp-babel'
bHtml = require 'gulp-b-html'
browserify = require 'browserify'
browserSync = require 'browser-sync'
buffer = require 'vinyl-buffer'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
del = require 'del'
espower = require 'gulp-espower'
gulp = require 'gulp'
gutil = require 'gulp-util'
mocha = require 'gulp-mocha'
run = require 'run-sequence'
source = require 'vinyl-source-stream'
sourcemaps = require 'gulp-sourcemaps'
stylus = require 'gulp-stylus'
uglify = require 'gulp-uglify'
watch = require 'gulp-watch'
watchify = require 'watchify'

onError = (stream) ->
  stream.on 'error', gutil.log

gulp.task 'build', (done) ->
  run.apply run, [
    'build:src/js'
    'build:tmp/js'
    'build:bhtmls/bhtml'
    'build:styles/styl'
    done
  ]

gulp.task 'build:bhtmls/bhtml', ->
  gulp.src './bhtmls/**/*.bhtml'
  .pipe bHtml()
  .pipe gulp.dest './dist'

gulp.task 'build:src/js', ->
  gulp.src './src/**/*.js'
  .pipe babel()
  .pipe gulp.dest './.tmp/src'

gulp.task 'build:styles/styl', ->
  gulp.src './styles/**/*.styl'
  .pipe stylus()
  .pipe gulp.dest './dist'

gulp.task 'build:test/coffee', ->
  gulp.src './test/**/*-test.coffee'
  .pipe sourcemaps.init()
  .pipe onError coffee(bare: true)
  .pipe onError espower()
  .pipe sourcemaps.write()
  .pipe gulp.dest './.tmp/test'

gulp.task 'build:tmp/js', ->
  b = browserify
    entries: ['./.tmp/src/index.js']
  b.bundle()
  .pipe source 'main.js'
  .pipe buffer()
  .pipe uglify()
  .pipe gulp.dest './dist'

gulp.task 'clean', (done) ->
  del [
    './.tmp'
    './dist'
  ], done
  null

gulp.task 'default', (done) ->
  run.apply run, [
    'clean'
    'build'
    done
  ]
  null

gulp.task 'test', (done) ->
  run.apply run, [
    'build'
    'build:test/coffee'
    ->
      gulp.src './.tmp/test/**/*-test.js'
      .pipe mocha()
      .on 'end', done
  ]
  null

gulp.task 'test(dev)', (done) ->
  run.apply run, [
    'build:test/coffee'
    ->
      gulp.src './.tmp/test/**/*-test.js'
      .pipe mocha().on 'error', (e) ->
        gutil.log e
        @emit 'end'
      .once 'end', done
  ]
  null

gulp.task 'watch', ['build'], ->
  browserSync.init
    server:
      baseDir: './dist'

  watch ['./bhtmls/**/*.bhtml'], ->
    run 'build:bhtmls/bhtml'

  watch ['./styles/**/*.styl'], ->
    run 'build:styles/styl'

  watch ['./src/**/*.js'], ->
    gulp.src './src/**/*.js'
    .pipe sourcemaps.init()
    .pipe onError babel()
    .pipe sourcemaps.write()
    .pipe gulp.dest './.tmp/src'

  watch ['./test/**/*-test.coffee'], ->
    run 'test(dev)'

  b = watchify browserify
    entries: ['./.tmp/src/index.js']
    debug: true

  bundle = ->
    onError b.bundle()
    .pipe source 'main.js'
    .pipe buffer()
    .pipe sourcemaps.init loadMaps: true
    .pipe sourcemaps.write()
    .pipe gulp.dest './dist'
    browserSync.reload()

  b.on 'log', gutil.log
  b.on 'update', bundle
  bundle()
