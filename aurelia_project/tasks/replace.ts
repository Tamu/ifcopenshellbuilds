import * as gulp from 'gulp';
import * as through from 'through2';
import { CLIOptions } from 'aurelia-cli';
let Readable = require('stream').Readable;

export interface StringTMap<T> { [key: string]: T; };
export interface NumberTMap<T> { [key: number]: T; };

export interface StringAnyMap extends StringTMap<any> {};
export interface NumberAnyMap extends NumberTMap<any> {};

export interface StringStringMap extends StringTMap<string> {};
export interface NumberStringMap extends NumberTMap<string> {};

export interface StringNumberMap extends StringTMap<number> {};
export interface NumberNumberMap extends NumberTMap<number> {};

export interface StringBooleanMap extends StringTMap<boolean> {};
export interface NumberBooleanMap extends NumberTMap<boolean> {};

let projectTitle = CLIOptions.getFlagValue('projecttitle', 'pt');
projectTitle = projectTitle || 'Project Title Replaced';

export interface ReplaceOccurence {
  key: string;
  value: string;
}

let replaceSettings: StringTMap<Array<ReplaceOccurence>> = {
  'webpack.config.js': [
{
key: `const path = require('path');`, 
value: "const settings = require('./src/settings').default;\n"+
"const path = require('path');\n"+
"const plugins = ['aurelia-swissdata', 'aurelia-deco', 'aurelia-resources', 'aurelia-three', 'aurelia-shop', 'aurelia-shop-admin'];\n"+
"const useSrcFor = [];\n"+
"const pluginSrcConfig = plugins.reduce((map, packageName) => {\n"+
"  map[packageName] = useSrcFor.indexOf(packageName) === -1 ? require(`./node_modules/${packageName}/webpack.dev`).default : require(`../${packageName}/webpack.dev`).default;\n"+
"  return map;\n"+
"}, {});\n"+
"const aliases = ['aurelia-binding','aurelia-dialog','aurelia-framework','aurelia-store']\n"+
".concat(['aurelia-templating','aurelia-templating-resources','aurelia-router'])\n"+
".concat(['@aurelia-ux','whatwg-fetch','aurelia-dependency-injection','aurelia-event-aggregator'])\n"+
".concat(['aurelia-loader','aurelia-logging','aurelia-metadata','aurelia-pal','aurelia-path'])\n"+
".concat(['aurelia-task-queue','aurelia-validation','awesome-phonenumber','aurelia-i18n', 'safe-buffer'])\n"+
".concat(['aurelia-resources','aurelia-deco','aurelia-swissdata', 'aurelia-three', 'aurelia-shop'])\n"+
".concat(...(plugins.map(packageName => pluginSrcConfig[packageName].aliases)));"
},
{
key: `const CleanWebpackPlugin = require('clean-webpack-plugin');`,
value: `const { CleanWebpackPlugin } = require('clean-webpack-plugin');`
},
{
key: `const title = 'Aurelia Navigation Skeleton';`, 
value: `const title = settings.title;
const description = settings.description;
const keywords = settings.keywords;
const author = settings.author;`
},
{
key: "title, baseUrl", 
value: "title, description, keywords, author, baseUrl"
},
{
key: "({ production } = {}",
value: "({ environment, production } = {}"
},
{
key: `{loader: "app-settings-loader", options: {env: production ? 'production' : 'development' }}`,
value: `{loader: "app-settings-loader", options: {env: environment}}`
},
{
key: `alias: { 'aurelia-binding': path.resolve(__dirname, 'node_modules/aurelia-binding') }`,
value: `alias: { 
  ...(aliases.reduce(
    (map, packageName) => {
      const useSrc = useSrcFor.indexOf(packageName) !== -1;
      if (useSrc) {
        map[packageName] = path.resolve(__dirname, "../"+packageName+"/src");
      } else {
        map[packageName] = path.resolve(__dirname, "node_modules/"+packageName);
      }
      return map;
    },
    {}
  )),
 }`
},
{
key: `rules: [`,
value: `rules: [
  // this rule is necessary to load the .ts files in plugins in SRC mode
  {
    test: /\.ts$/,
    exclude: (path) => {
      for (let packageName of useSrcFor) {
        if (path.indexOf('/'+packageName+'/') !== -1) return false;
      }
      return true;
    },
    loader: 'ts-loader'
  },`
},
{
key: `loader: "ts-loader" },`,
value: `loader: "ts-loader", include: [srcDir] },`
},
{
key: `'aurelia-testing': ['./compile-spy', './view-spy']`,
value: `'aurelia-testing': ['./compile-spy', './view-spy'],
// list resources for plugins in SRC mode
  ...(useSrcFor.reduce(
    (map, packageName) => {
      map[packageName] = pluginSrcConfig[packageName].resources;
      return map;
    },
    {}
  )),`
},
{
key: `{ from: 'static', to: outDir, ignore: ['.*'] }])), // ignore dot (hidden) files`,
value: `{ from: 'static', to: outDir }])), // ignore dot (hidden) files`
}, 
{
key: `...when(!tests, new CopyWebpackPlugin([`,
value: `new CopyWebpackPlugin([
  { from: './images/**/*', to: './' },
]),
    ...when(!tests, new CopyWebpackPlugin([`
}
  ],
  'index.ejs': [
{
key: "<!-- imported CSS are concatenated and added automatically -->",
value: `<!-- imported CSS are concatenated and added automatically -->
<meta name="description" content="<%- htmlWebpackPlugin.options.metadata.description %>" />
<meta name="keywords" content="<%- htmlWebpackPlugin.options.metadata.keywords %>" />
<meta name="author" content="<%- htmlWebpackPlugin.options.metadata.author %>" />
<meta property="og:type" content="web application" />
<meta property="og:url" content="<%- htmlWebpackPlugin.options.metadata.baseUrl %>" />
<meta property="og:title" content="<%- htmlWebpackPlugin.options.metadata.title %>" />
<meta property="og:description" content="<%- htmlWebpackPlugin.options.metadata.description %>" />
<meta property="og:image" content="/images/favicons/apple-touch-icon.png" />
<meta property="og:image:secure_url" content="/images/favicons/apple-touch-icon.png" />
<meta property="og:image:url" content="/images/favicons/apple-touch-icon.png" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1024" />
<meta property="og:image:height" content="1024" />
<meta property="og:locale" content="fr_CH" />
<meta property="og:locale:alternate" content="fr_FR" />

<!-- Favicons -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="<%- htmlWebpackPlugin.options.metadata.title %>">
<link rel="apple-touch-startup-image" href="/images/favicons/launch.png">
<link rel="icon" type="image/png" size="256x256" href="/images/favicons/android-chrome-256x256.png">
<link rel="icon" type="image/png" size="192x192" href="/images/favicons/android-chrome-192x192.png">
<link rel="icon" type="image/png" size="150x150" href="/images/favicons/mstile-150x150.png">
<link rel="icon" type="image/png" size="48x48" href="/images/favicons/favicon.ico">
<link rel="apple-touch-icon" href="/images/favicons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon-180x180.png">
<link rel="icon" type="image/png" href="/images/favicons/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/images/favicons/favicon-16x16.png" sizes="16x16">
<!--<link rel="manifest" href="/images/favicons/manifest.json">-->
<meta name="theme-color" content="#ffffff">`
}
  ],
  'src/main.ts': [
{
key: `import {PLATFORM} from 'aurelia-pal';`,
value: `import {PLATFORM} from 'aurelia-pal';
import { registerCorePlugins } from 'base/base-main';`
},
{
key: `.feature(PLATFORM.moduleName('resources/index'));`,
value: `.feature(PLATFORM.moduleName('resources/index'));
  registerCorePlugins(aurelia);`
}
  ],
  'test/unit/app.spec.ts': [
{
key: 'expect',
value: `//expect`
}
  ],
  // 'aurelia_project/tasks/build.ts': [
  //   {
  //     key: `const production = CLIOptions.getEnvironment() === 'prod';`,
  //     value: `const production = CLIOptions.getEnvironment() === 'prod' || CLIOptions.getEnvironment() === 'stage';`
  //   }
  // ],
  'src/settings.js': [
    {
      key: `  title: 'Test Skeleton',`,
      value: `  title: '${projectTitle}',`
    }
  ],
  'package.json': [
    {
key: `"build": "webpack --env.production --extractCss"`,
value: `"build": "webpack --env.environment=production --env.production --extractCss",
  "build:dev": "webpack --extractCss",
  "build:dev:production": "webpack --env.environment=development --env.production --extractCss",
  "build:stage": "webpack --env.environment=staging --extractCss",
  "build:stage:production": "webpack --env.environment=staging --env.production --extractCss",
  "start": "webpack-dev-server --extractCss",
  "start:stage": "webpack-dev-server --env.environment=staging --extractCss",
  "start:prod": "webpack-dev-server --env.environment=production --extractCss",
  "analyze": "webpack --env.production --analyze",
  "test": "au test"`
    },
    {
key: `    "start": "webpack-dev-server --extractCss",`,
value: ''
    },
    {
key: `    "build:dev": "webpack --extractCss",`,
value: ''
    }
  ]
};

function replaceFile(filePath: string, replaceKeyValues: Array<ReplaceOccurence>, done: Function) {
  let stream = new Readable();
  let dotIndex = filePath.lastIndexOf('.');
  let newFilePath = filePath.substr(0, dotIndex) + '-replaced-' + filePath.substr(dotIndex);

  let slashIndex = filePath.lastIndexOf('/');
  newFilePath = './' + filePath.substr(0, slashIndex);

  return gulp.src([filePath])
    .pipe(through.obj((chunk, enc, cb) => {
      let txt = chunk.contents.toString();
      let lines = txt.split('\n');

      for (let line of lines) {
        for (let occurence of replaceKeyValues) {
          line = line.replace(occurence.key, occurence.value);
        }

        stream.push(line);
        stream.push('\n');
      }

      stream.push(null);
      chunk.contents = stream;

      cb(null, chunk);
    })).pipe(gulp.dest(newFilePath)).on('end', () => done());
}

function replaceAll(settings) {
  let tasks = [];
  for (let filePath in settings) {
    gulp.task(filePath, (done) => {
      replaceFile(filePath, settings[filePath], done);
    });
    tasks.push(filePath);
  }
  return tasks;
}

const replace = gulp.series(
  replaceAll(replaceSettings)
);

export { replace as default };
