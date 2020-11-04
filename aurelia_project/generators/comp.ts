import { inject } from 'aurelia-dependency-injection';
import { Project, ProjectItem, CLIOptions, UI } from 'aurelia-cli';

var path = require('path');

@inject(Project, CLIOptions, UI)
export default class ElementGenerator {
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  execute() {
    let self = this;

    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call the component?')
      .then(name => {

        let subFolders = 'components';
        
        let fileName = this.project.makeFileName(name);
        let className = this.project.makeClassName(name);

        self.project.root.add(
          ProjectItem.text(path.join(subFolders, fileName + ".ts"), this.generateJSSource(className, fileName)),
          ProjectItem.text(path.join(subFolders, fileName + ".html"), this.generateHTMLSource(className, fileName)),
          ProjectItem.text(path.join(subFolders, fileName + ".css"), this.generateCSSSource(className, fileName))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log(`Created ${name} in the '${path.join(self.project.root.name, subFolders)}' folder. Don't forget to reference it now in /components/index.ts to make it available in the app without <require> tag.`));
      });
  }

  generateJSSource(className, fileName) {
    return `import {inject} from 'aurelia-framework';
import { Global } from 'global';
import { getLogger, Logger } from 'aurelia-logging';
//import { DOM } from 'aurelia-pal';

const log = getLogger('comp:${fileName}');

@inject(Global, Element)
export class ${className} {    
  
  constructor(private global: Global, private element: HTMLElement) {
  }

  //clickExemple(event) {
  //  event.stopPropagation();
  //  let event = DOM.createCustomEvent('click-item', {detail: this.element});
  //  this.element.dispatchEvent(event);
  //}
}`
  }

  generateHTMLSource(className, fileName) {
    return `<template>
  <require from="./${fileName}.css"></require>
</template>`
  }

  generateCSSSource(className, fileName) {
    return `/* Styles for comp ${className} */
${fileName} {
  display: block;
}`;
  }
}
