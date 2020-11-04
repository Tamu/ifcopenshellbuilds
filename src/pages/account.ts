import { inject} from 'aurelia-framework';
import { Global } from 'global';
import { getLogger } from 'aurelia-logging';

const log = getLogger('account');

@inject(Global)
export class Account {    

  constructor(private global: Global) {

  }

  activate() {
    
  }


}
