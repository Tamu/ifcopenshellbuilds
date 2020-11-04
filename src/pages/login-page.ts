import { inject } from 'aurelia-framework'
import { Global } from 'global';
import settings from 'settings';
import { Redirect } from 'aurelia-router';

@inject(Global)
export class LoginPage {

  public routeNext: string = settings.defaultRoutes.authenticated;

  constructor(private global: Global) {
    
  }

  public canActivate(params) {
    if (params?.t) {
      this.routeNext = params.t;
    } else {
      this.routeNext = settings.defaultRoutes.authenticated;
    }
    if (this.global.state.swissdata.authenticated) {
      return new Redirect(this.routeNext);
    }
  }

  public activate(params: any) {
    if (params?.t) {
      this.routeNext = params.t;
    } else {
      this.routeNext = settings.defaultRoutes.authenticated;
    }
  }

}
