import { Container } from 'aurelia-framework';
import { AureliaUX } from '@aurelia-ux/core';
import { settings } from 'settings';

export class BaseApp {

  private ux: AureliaUX;

  constructor() {
    this.ux = Container.instance.get(AureliaUX);
    if (settings && settings.ux) {
      if (settings.ux.design) {
        for (let key in settings.ux.design) {
          this.ux.design[key] = settings.ux.design[key];
        }
      }
    }
  }
}
