import { inject,bindable } from 'aurelia-framework';
import { ArDrawer } from 'aurelia-resources';
import { Global } from 'global';

@inject(Global)
export class Menu {
  @bindable public drawer: ArDrawer;
  constructor(private global: Global) {

  }

  logout() {
    this.drawer.close();
    this.global.logout();
  }

  gotoRoute(route, params?) {
    this.drawer.close();
    this.global.navigateToRoute(route, params);
  }
}
