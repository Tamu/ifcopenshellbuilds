import { inject } from 'aurelia-framework';
import { Global } from 'global';
import { AppState } from 'state';

@inject(Global)
export class Home {

  constructor(private global: Global) {

  }

  hideSurprise() {
    this.global.store.registerAction('hideSurprise', hideSurprise);
    this.global.store.dispatch(hideSurprise);
  }
}

function hideSurprise(state: AppState) {
  const newState = Object.assign({}, state);
  newState.surpriseHidden = true;
  return newState;
}
