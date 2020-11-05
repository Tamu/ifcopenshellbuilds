import { Global } from '../global';
import {  inject } from 'aurelia-framework';
import xml2js from 'xml2js';
import * as moment from 'moment';

@inject(Global)
export class Home {

  selectedFiles: any;
  selectedFile: string = "Select XML file";
  
  progress: number = 0;
  inProgress: string = "Reading in progress";
  urlFolder : string = "https://s3.amazonaws.com/ifcopenshell-builds/";
  ifcXML : string = "/images/ifc.xml";

  viewExport : boolean = false;
  corridor: number[] = [];
  curCorridor: string = "all";
  
  paintingInProgress: boolean = false;
  LibraryHide: boolean = false;
  testMode : boolean = true;  
  win32: boolean = true;
  linux32: boolean = true;
  win64: boolean = true;
  linux64: boolean = true;
  macos: boolean = true;
  libifcconvert: boolean = true;
  ifcgeomserver: boolean = true;
  
  
  inputbox: HTMLElement;
  xmlText : any = "";
  jsonText : string = "";
  ifcContents: Content[] = [];
  ifcFiles: IfcFile[] = [];
  ifcFilesAll: IfcFile[] = [];

  constructor(public global: Global) {
    
    let xmlDoc=new window.XMLHttpRequest();
    xmlDoc.open("GET",this.ifcXML,false);
    xmlDoc.send("");
    this.xmlText =  xmlDoc.response;
    this.TransXML();

  }

  updateFilter(){

    let ifcFilters: IfcFile[] = [];

    for (let ifc of this.ifcFilesAll) {
      let check : boolean = false;
      let checkLib : boolean = false;
      if (this.linux32 && ifc.platform == "linux32" ){
        check = true;
      }
      if (this.win32 && ifc.platform == "win32"){
        check = true;
      }
      if (this.linux64 && ifc.platform == "linux64" ){
        check = true;
      }
      if (this.win64 && ifc.platform == "win64"){
        check = true;
      }
      if (this.macos && ifc.platform == "macos64"){
        check = true;
      }
      if (this.libifcconvert && ifc.library == "IfcConvert"){
        checkLib = true;
      }
      if (this.ifcgeomserver && ifc.library == "IfcGeomServer"){
        checkLib = true;
      }
      if (check && checkLib) { ifcFilters.push(ifc);}
    }

   this.ifcFiles = ifcFilters;
   
  }
  
  TransXML(){

    let jsonResult : ifcbuilds;

    xml2js.parseString(this.xmlText, function (err, result) {
      jsonResult = result;
    });

    this.ifcContents = jsonResult.ListBucketResult.Contents;

    for (const content of this.ifcContents ) {      
      // IfcConvert-master-5aebfe9-win64.zip (2018-07-07T21:09:17.000Z)
      let ifc = {} as IfcFile;
      let today365 : Date = new Date();
      today365.setDate(today365.getDate() - 365);
      // if ( content.Key && content.Key.search('/\-/gi') != 0){
        ifc.filename = content.Key + '';
      if ( content.Key && ifc.filename != "<Short Repository Branch [master]>.json"){
        let name : string = ifc.filename;
        let comp : string[] = name.split('-');
        if (comp.length <= 4){
          ifc.library = comp[0];
          ifc.branch = comp[1];
          ifc.version = comp[2];
          ifc.platform = comp[3].replace(".zip","");
          let fileDate : Date = new Date(content.LastModified);
          ifc.lastModified = fileDate;
          if (fileDate > today365){
            this.ifcFiles.push(ifc);
          }
        }
        
      }
    }

    this.ifcFiles = this.ifcFiles.sort(function (a, b) { return b.lastModified.getTime() - a.lastModified.getTime(); });
    this.ifcFilesAll = this.ifcFiles;
    
  }

  scrollDown() {
    this.scrollingContainer() ;
  }

  scrollingContainer(): HTMLElement | null {
    return document.querySelector('body > .vscroll');
  }


}

export class DateFormatValueConverter {
  toView(value) {
    return moment(value).format('DD.MM.YYYY');
  }
}
  


// IfcConvert-master-5aebfe9-win64.zip (2018-07-07T21:09:17.000Z)

export interface IfcFile {
  filename: string;
  library: string;
  branch: string;
  version: string;
  platform: string;
  lastModified: Date;
}

export interface Content {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: string;
  StorageClass: string;
}

export interface ListBucketResult {
  xmlns: string;
  Name: string;
  MaxKeys: string;
  IsTruncated: string;
  Contents: Content[];
}

export interface ifcbuilds {
  ListBucketResult: ListBucketResult;
}
