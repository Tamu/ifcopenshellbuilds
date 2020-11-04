import build from './build';
import * as gulp from 'gulp';
import * as rename from 'gulp-rename';
import * as del from 'del';
import {CLIOptions} from 'aurelia-cli';
import * as replace from 'gulp-replace';
import * as tap from 'gulp-tap';
var path = require('path');
import {fixux} from './fixux';
import * as version from '../../cordova/version.json';
import * as fs from 'fs';
import * as through from 'through2';

let jsFiles: Array<string> = [];
let cssFiles: Array<string> = [];

function copyToCordova (done) {
  del(['./cordova/www/**/*', '!./cordova/www'], {force:true});
  setTimeout(() => {
    gulp.src([
      'dist/**/*',
  
      '!dist/*.gz',
      //'!dist/*.map',
      '!dist/index.html',
      'cordova/index.html'
      ])
      .pipe(tap(function (file, t) {
        let filename = file.path.replace(file.base + '/', '');
        if (file.path.substr(-9) === 'bundle.js') {
          console.log('Found a JS file to include', filename);
          jsFiles.push(filename);
        }
        if (file.path.substr(-8) === 'chunk.js') {
          console.log('Found a JS file to include', filename);
          jsFiles.push(filename);
        }
        if (file.path.substr(-4) === '.css')
        {
          console.log('Found a CSS file to include', filename);
          cssFiles.push(filename);
        } 
      }))
      .pipe(gulp.dest('./cordova/www')).on('end', () => done());
  }, 1000);
}

function fixBundleNames (done) {

  let jsString = jsFiles.map(function(filename) {
    return '<script type="text/javascript" src="'+filename+'"></script>';
  }).join("\n");
  let cssString = cssFiles.map(function(filename) {
    return '<link rel="stylesheet" href="'+filename+'" type="text/css">';
  }).join("\n");

  gulp.src('cordova/www/index.html')
    .pipe(replace('%styles%', cssString))
    .pipe(replace('%scripts%', jsString))
    .pipe(gulp.dest('cordova/www')).on('end', () => done());
}

function setVersions (done) {
  console.log('Previous version', `${version.major}.${version.minor}.${version.patch} - ${version.build}`);)

  version.build += 1;
  if (version.build > 99) {
    version.patch += 1;
    version.build = 1;
  }
  if (version.patch > 99) {
    version.minor += 1;
    version.patch = 0;
  }

  let versionString = `${version.major}.${version.minor}.${version.patch}`;
  let iosBundleVersion = `${version.build}`;
  let androidVersionCode = version.major * 100000 + version.minor * 10000 + version.patch * 100 + version.build;

  console.log('** VERSION **');
  console.log('Major: ', version.major);
  console.log('Minor: ', version.minor);
  console.log('Patch: ', version.patch);
  console.log('Build: ', version.build);
  console.log('iosBundleVersion', iosBundleVersion);
  console.log('androidVersionCode', androidVersionCode);

  fs.writeFileSync('cordova/version.json', JSON.stringify(version, null, 2), 'utf8');
  
  gulp.src('cordova/config.xml')
    .pipe(replace(/^<widget(.*)version="([0-9.]*)"(.*)$/gm, '<widget$1version="'+versionString+'"$3'))
    .pipe(replace(/^<widget(.*)ios-CFBundleVersion="([0-9.]*)"(.*)$/gm, '<widget$1ios-CFBundleVersion="'+iosBundleVersion+'"$3'))
    .pipe(replace(/^<widget(.*)android-versionCode="([0-9]*)"(.*)$/gm, '<widget$1android-versionCode="'+androidVersionCode+'"$3'))
    .pipe(gulp.dest('cordova')).on('end', () => {
      done()
    });
}

function fakeIndexEdit(done) {
  return gulp.src(`cordova/www/index.html`)
    .pipe(gulp.dest(`cordova/www`))
    .pipe(through.obj(function (file, enc,  cb) {
      var now = Date.now() / 1000;
      var then = now;
      fs.utimes(file.path, then, then, function (err) { if (err) throw err });
      cb(null, file);
    })).on('end', () => done());
}

let doBuild = CLIOptions.hasFlag('sb') || CLIOptions.hasFlag('skip-build') ? false : true;
let cordova;
if (doBuild) {
  cordova = gulp.series(
    fixux,
    build,
    copyToCordova,
    fixBundleNames,
    setVersions,
    fakeIndexEdit
  );
} else {
  cordova = gulp.series(
    copyToCordova,
    fixBundleNames,
    setVersions,
    fakeIndexEdit
  );
}
export default cordova;


