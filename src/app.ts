import { Global } from './global';
import { inject } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { ArDrawer, addNotifyContainerAlias, setNotifyDefaults } from 'aurelia-resources';
import routes from './routes';
import { AuthorizeStep } from 'aurelia-swissdata';
import { BaseApp } from 'base/base-app';
import * as FastClick from 'fastclick';

@inject(Global, Router)
export class App extends BaseApp {

  menuDrawer: ArDrawer;

  public toolbarTopOpened: boolean = false;

  constructor(private global: Global, private router: Router) {
    super();
    addNotifyContainerAlias('top', '.notify-top-host');
    addNotifyContainerAlias('bottom', '.notify-bottom-host');
    setNotifyDefaults({
      containerSelector: '.notify-top-host'
    });
  }

  public attached() {
    (FastClick as any).attach(document.body);
  }

  public detached() {
  }

  public configureRouter(config: RouterConfiguration) {
    AuthorizeStep.redirectUnauthenticatedTo = 'login';
    if (!(window as any).cordova) config.options.pushState = true;
    config.addAuthorizeStep(AuthorizeStep);
    config.map(routes);
  }

}
 