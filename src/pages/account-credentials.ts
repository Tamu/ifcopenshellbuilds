import {inject} from 'aurelia-framework';
import { Global } from 'global';
import { getLogger } from 'aurelia-logging';

const log = getLogger('page:account-credentials');

@inject(Global)
export class AccountCredentials {    
  
  constructor(private global: Global) {
  }
}
