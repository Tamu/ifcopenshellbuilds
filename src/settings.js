var settings = {
  title: 'IFCopenShell Builds',
  description: 'Project description',
  keywords: "Project keywords",
  author: "Project Author",
  stateVersion: '1.0',
  stateLog: {
    dispatchedActions: 'debug',
    performanceLog: 'debug',
    devToolsStatus: 'debug'
  },
  language: 'fr',
  languages: ['fr', 'en', 'de', 'it'],
  country: 'CH',
  countries: ['CH'],
  stateStorageKey: 'appname-state',
  defaultRoutes: {
    unauthenticated: 'home',
    authenticated: 'account'
  },
  ux: {
    design: {
      primary: '#8cc63f',
      primaryForeground: '#fff',
      accent:  '#4CB8D4',
      accentForeground: '#fff',

      primaryLight: '#7BE0DD',
      primaryLightForeground: '#000',
      primaryDark: '#00989B',
      primaryDarkForeground: '#fff',

      accentLight: '#8bd5e3',
      accentLightForeground: '#000',
      accentDark: '#258CB1',
      accentDarkForeground: '#fff',

      appBackground: '#FAFAFA',
      appForeground: '#212121',

      surfaceBackground: '#FFFFFF',
      surfaceForeground: '212121',

      disabledBackground: '#EFEFEF',
      disabledForeground: '#BBBBBB',
      error: '#F44336',
      errorForeground: '#FFFFFF'

    }
  }
};

// auto detection of language
if (typeof window !== `undefined`) {
  var userLang = navigator.language || navigator.userLanguage; 
  for (var index in settings.languages) {
    var language = settings.languages[index];
    if (userLang.substr(0, 2) === language) {
      settings.language = language;
      break;
    }  
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.settings = settings;
exports.default = settings;


