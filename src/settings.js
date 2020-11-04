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
      primary: '#3F51B5',
      primaryForeground: '#FFFFFF',
      accent:  '#c0392b',
      accentForeground: '#FFFFFF',

      primaryLight: '#C5CAE9',
      primaryLightForeground: '#9E9E9E',
      primaryDark: '#303F9F',
      primaryDarkForeground: '#FFFFFF',

      accentLight: '#FF80AB',
      accentLightForeground: '#FFFFFF',
      accentDark: '#F50057',
      accentDarkForeground: '#FFFFFF',

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


