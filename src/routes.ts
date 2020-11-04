import {PLATFORM} from 'aurelia-pal';
import {RouteConfig} from 'aurelia-router';

export let routes: Array<RouteConfig> = [
  { route: '',       name: 'home',       moduleId: PLATFORM.moduleName('pages/home') },
  { route: 'login',       name: 'login',       moduleId: PLATFORM.moduleName('pages/login-page') },
  { route: 'account',       name: 'account',       moduleId: PLATFORM.moduleName('pages/account'), settings: {auth: true} },
  { route: 'profile',       name: 'profile',       moduleId: PLATFORM.moduleName('pages/account-profile'), settings: {auth: true} },
  { route: 'credentials',       name: 'credentials',       moduleId: PLATFORM.moduleName('pages/account-credentials'), settings: {auth: true} },
  { route: 'dico',       name: 'dico',       moduleId: PLATFORM.moduleName('aurelia-swissdata/components/dico/dico', 'dico'), settings: { auth: true } }
];

export default routes;
