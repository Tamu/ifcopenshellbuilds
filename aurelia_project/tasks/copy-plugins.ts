import {CLIOptions} from 'aurelia-cli';
import * as gulp from 'gulp';
import * as fs from 'fs';

import * as replace from 'gulp-replace';
import * as del from 'del';
//import * as util from 'gulp-util';
import * as log from 'fancy-log';
import * as c from 'ansi-colors';

let pluginsToCopy = ['aurelia-deco', 'aurelia-resources', 'aurelia-swissdata'];

if (CLIOptions.hasFlag('ad')) {
  pluginsToCopy = ['aurelia-deco'];
}

if (CLIOptions.hasFlag('ar')) {
  pluginsToCopy = ['aurelia-resources'];
}

if (CLIOptions.hasFlag('as')) {
  pluginsToCopy = ['aurelia-swissdata'];
}

function getLastHash(pluginName: string) {
  let filename = `../${pluginName}/.git/refs/heads/master`;
  let hash = fs.readFileSync(filename, 'utf-8').trim();
  log(`Last commit hash for '${c.magenta(pluginName)}' is: '${c.cyan(hash)}'`);
  return hash;
}

function updatePackageJsonWithNewHash(pluginName: string, hash: string, done: Function) {
  let src = [`package.json`];
  let dest = `./`;
  let regexp = new RegExp(`"${pluginName}": "([^"]*)"`, 'gm')
  let stream = gulp.src(src, {base:`.`})
    .pipe(replace(regexp, `"${pluginName}": "git+https://git.mintello.com/platform5/${pluginName}.git#${hash}"`))
    .pipe(gulp.dest(dest))
    .on('end', () => {
      log(`Updated the plugin hash ref for '${c.magenta(pluginName)}' in package.json`);
      done();
    });
}

function copyPlugin(pluginName: string = 'aurelia-resources', destfolder: string = 'node_modules/', done: Function) {
  let src = [`../${pluginName}/dist/**/*`, `../${pluginName}/src/**/*`, `../${pluginName}/package.json`];
  let dest = `${destfolder}${pluginName}`;
  let stream = gulp.src(src, {base:`.`})
    .pipe(gulp.dest(dest));
  stream.on('end', function() {
    //run some code here
    let hash = getLastHash(pluginName);
    updatePackageJsonWithNewHash(pluginName, hash, done);
    //done();
  });
  stream.on('error', function(err) {
    done(err);
  });
}

function copyAll() {
  let tasks = [];
  for (let pluginName of pluginsToCopy) {
    gulp.task(pluginName, (done) => {
      del([`node_modules/${pluginName}/node_modules/aurelia-deco`], {force:true});
      del([`node_modules/${pluginName}/node_modules/aurelia-swissdata`], {force:true});
      del([`node_modules/${pluginName}/node_modules/aurelia-resources`], {force:true});
      copyPlugin(pluginName, 'node_modules/', done);
      /*if (pluginName === 'aurelia-resources') {
        copyPlugin(pluginName, 'node_modules/aurelia-deco/node_modules', done);
        copyPlugin(pluginName, 'node_modules/aurelia-swissdata/node_modules', done);
      }
      if (pluginName === 'aurelia-deco') {
        copyPlugin(pluginName, 'node_modules/aurelia-swissdata/node_modules', done);
      }*/
    });
    tasks.push(pluginName);
  }
  return tasks;
}

const copy = gulp.series(
  copyAll()
);

export { copy as default };
