import {Aurelia} from 'aurelia-framework'
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import { registerCorePlugins } from 'base/base-main';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));
  registerCorePlugins(aurelia);

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}

