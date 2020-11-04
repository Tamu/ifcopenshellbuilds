import { inject } from 'aurelia-framework';
import { AppState, initAppState, initialState, setFullState } from 'state';
import { SwissdataGlobal, ProfileHelper } from 'aurelia-swissdata';
import { Store } from 'aurelia-store';
import settings from 'settings';

@inject(Store)
export class Global extends SwissdataGlobal {

  public ready = false;

  constructor(public store: Store<AppState>) {
    super();
    //let store = Container.instance.get(Store);
    this.store.registerAction('initAppState', initAppState);
    this.store.registerAction('setFullState', setFullState);
    this.bootstrap({
      stateStorageKey: settings.stateStorageKey,
      language: 'fr',
      languages: ['fr', 'en'],
      country: 'CH',
      countries: ['CH'],
      dynamicModelSlugsForAutoLoading: [],
      initialState: initialState,
      stateVersion: settings.stateVersion
    }).then(() => {
      this.ready = true;
    });
  }

  public async logout() {
    await this.swissdataApi.logout();
    this.navigateToRoute(settings.defaultRoutes.unauthenticated);
  }

  public registerActions() {
    super.registerActions();
    ProfileHelper.registerActions();
  }

  //
  // Possible methods to overwrite
  // * start() - called before anything else in the bootstrap method
  // * beforeEnsuringAuthentication()
  // * afterEnsuringAuthentication()
  // * onAnyLoad() - by default: if config.useDynamicModels is true => 
  //    => load the dynamic models settings and 
  //    => autload dynamic data from dynamicModelSlugsForAutoLoading
  // * onAuthenticatedLoad() - calls onAnyLoad by default
  // * onUnauthenticatedLoad - calls onAnyLoad by default
  // * onLogin() - calls onAuthenticatedLoad by default
  // * onLogout()
  // * registerActions() - make sure to call super.registerActions() inside
  // 

}

