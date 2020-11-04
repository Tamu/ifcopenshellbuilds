import { inject } from 'aurelia-framework';
import { Global } from 'global';
import { getLogger } from 'aurelia-logging';
import { UserModel, errorHandler, ProfileHelper, ProfileModel } from 'aurelia-swissdata';
import { countries } from 'aurelia-resources';

const log = getLogger('page:account-profile');

@inject(Global)
export class AccountProfile {    

  editingUserInstance: UserModel;
  editingProfileInstance: ProfileModel;
  countries = countries;
  
  constructor(private global: Global) {
  }

  public logout() {
    this.global.logout();
    this.global.navigateToRoute('home');
  }

  public activate() {
    log.debug('activate');
    return ProfileHelper.getCurrentProfile().then(() => {
      log.debug('here', this.global.state.swissdata.profile?.id);
      log.debug('here', this.global.state.swissdata.user?.id);
      this.editingProfileInstance = ProfileHelper.getEditingInstance();
      log.debug('here2');
      this.editingUserInstance = ProfileHelper.getEditingUserInstance();
      log.debug('this', this);
      if (!this.editingProfileInstance || !this.editingUserInstance) return false;
    });
  }

  public updateProfile() {
    let promises: Array<Promise<any>> = [];
    promises.push(this.editingProfileInstance.updateProperties('', ['picture', 'street', 'zip', 'city', 'country']));
    promises.push(this.editingUserInstance.updateProperties('', ['firstname', 'lastname']));
    Promise.all(promises).then(() => {
      let promises2: Array<Promise<any>> = [];
      promises2.push(this.global.swissdataApi.setCurrentUser());
      promises2.push(ProfileHelper.getCurrentProfile())
      return Promise.all(promises);
    }).catch(errorHandler('main'));
  }
}
