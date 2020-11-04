import { inject, bindable, BindingEngine } from 'aurelia-framework'
import { Global } from 'global';
import { getLogger } from 'aurelia-logging';
import { GettingStarted } from 'aurelia-swissdata';
import { pluck } from 'rxjs/operators';
import settings from 'settings';
const log = getLogger('login');

@inject(Global, BindingEngine)
export class Login {

  @bindable public routeNext: string = settings.defaultRoutes.authenticated;

  private gs: GettingStarted;
  private subscriptions: any[] = [];

  constructor(private global: Global, private bindingEngine: BindingEngine) {
    
  }

  public async attached() {
    await this.checkStatus();

    const pluckOperator = pluck(`swissdata`) as any;
    this.subscriptions.push(this.global.store.state.pipe(pluckOperator).subscribe((state) => {
      this.checkStatus();
    }));

    return;
  }

  public detached() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  public async checkStatus() {
    const user = this.global.state.swissdata.user as any;
    const emailOk = user?.emailValidated;
    const mobileOk = user?.mobileValidated;
    if (emailOk && mobileOk) {
      this.global.navigateToRoute(this.routeNext);
    }
  }

  public mobileChanged() {
    if (this.global.state.swissdata.user.mobile && (this.global.state.swissdata.user as any).mobileValidated) {
      this.checkStatus();
      this.gs.arNextStart.to('address');
    }
  }

  public emailChanged() {
    if (this.global.state.swissdata.user.mobile && (this.global.state.swissdata.user as any).mobileValidated) {
      this.checkStatus();
      this.gs.arNextStart.to('address');
    }
  }
}
