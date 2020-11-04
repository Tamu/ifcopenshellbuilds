import { inject } from 'aurelia-dependency-injection';
import { Project, ProjectItem, CLIOptions, UI } from 'aurelia-cli';

var path = require('path');

@inject(Project, CLIOptions, UI)
export default class ElementGenerator {
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  execute() {
    let self = this;

    return this.ui
      .ensureAnswer(this.options.args[0], 'What would you like to call the page?')
      .then(name => {

        let subFolders = 'pages';
        
        let fileName = this.project.makeFileName(name);
        let className = this.project.makeClassName(name);

        self.project.root.add(
          ProjectItem.text(path.join(subFolders, fileName + ".ts"), this.generateJSSource(className, fileName)),
          ProjectItem.text(path.join(subFolders, fileName + ".html"), this.generateHTMLSource(className, fileName)),
          ProjectItem.text(path.join(subFolders, fileName + ".css"), this.generateCSSSource(className))
        );

        return this.project.commitChanges()
          .then(() => this.ui.log(`Created ${name} in the '${path.join(self.project.root.name, subFolders)}' folder. Don't forget to update your routes to enable this new page.`));
      });
  }

  generateJSSource(className, fileName) {
    return `import {inject} from 'aurelia-framework';
import { Global } from 'global';
import { getLogger } from 'aurelia-logging';

const log = getLogger('page:${fileName}');

@inject(Global)
export class ${className} {    
  
  constructor(private global: Global) {
    
  }
}`
  }

  generateHTMLSource(className, fileName) {
    return `<template>
  <require from="./${fileName}.css"></require>
  <section>
    <h1>${className}</h1>
  </section>
</template>`
  }

  generateCSSSource(className) {
    return `/* Styles for page ${className} */`;
  }
}
