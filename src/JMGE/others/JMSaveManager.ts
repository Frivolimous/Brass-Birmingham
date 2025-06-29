import * as _ from 'lodash';
// import { T, dExtrinsicModel } from '../data/SaveData';

export interface ISaveOptions<T> {
  initReset: boolean;
  currentVersion: number;
  versionControl: (version: number, extrinsic: T) => T;
  defaultSave: T;
  saveLoc: 'virtual' | 'local' | 'online';
}

export class JMSaveManager<T> {
  private extrinsic: T;

  private virtualSave: {version: number, extrinsic: T};

  constructor(private saveOptions: ISaveOptions<T>) {
    this.virtualSave = {version: saveOptions.currentVersion, extrinsic: _.cloneDeep(saveOptions.defaultSave)};
  }

  public async init(): Promise<null> {
    return new Promise<null>((resolve) => {
      if (this.saveOptions.initReset) {
        console.log('--INITIALIZED WITH FRESH SAVE --');
        this.confirmReset();
        this.saveVersion(this.saveOptions.currentVersion);
        this.saveExtrinsic(this.getExtrinsic());
        resolve(null);
      } else {
        this.loadExtrinsic().then(extrinsic => {
          console.log('ext!', extrinsic);
          if (extrinsic) {
            console.log('has ext');
            this.loadVersion().then(version => {
              console.log('version loaded', version);
              if (version < this.saveOptions.currentVersion) {
                console.log('old V');
                extrinsic = this.saveOptions.versionControl(version, extrinsic);
                this.saveVersion(this.saveOptions.currentVersion);
                this.saveExtrinsic(extrinsic);
              }
              this.extrinsic = extrinsic;
              resolve(null);
            });
          } else {
            console.log('reset ext');
            this.confirmReset();
            this.saveVersion(this.saveOptions.currentVersion);
            this.saveExtrinsic(this.getExtrinsic());
            resolve(null);
          }
        });
      }
    });
  }

  public resetData(): () => void {
    // returns the confirmation function
    return this.confirmReset;
  }

  public getExtrinsic(): T {
    if (this.extrinsic) {
      return this.extrinsic;
    }
  }

  public async saveCurrent(): Promise<null> {
    return new Promise(resolve => {
      let processes = 1;
      this.saveExtrinsic().then(() => {
        processes--;
        if (processes === 0) {
          resolve(null);
        }
      });
    });
  }

  public async saveExtrinsic(extrinsic?: T): Promise<T> {
    return new Promise((resolve) => {
      extrinsic = extrinsic || this.extrinsic;

      switch (this.saveOptions.saveLoc) {
        case 'virtual': this.virtualSave.extrinsic = extrinsic; break;
        case 'local':
          if (typeof Storage !== undefined) {
            window.localStorage.setItem('Extrinsic', JSON.stringify(extrinsic));
          } else {
            console.log('NO STORAGE!');
          }
          break;
        case 'online': break;
      }

      resolve(extrinsic);
    });
  }

  public null = () => {
    return new Promise((resolve) => {
      switch (this.saveOptions.saveLoc) {
        case 'virtual':
        case 'local':
        case 'online':
      }
    });
  }

  private confirmReset = () => {
    this.extrinsic = _.cloneDeep(this.saveOptions.defaultSave);
  }

  private async loadExtrinsic(): Promise<T> {
    let extrinsic: T;
    return new Promise((resolve) => {
      switch (this.saveOptions.saveLoc) {
        case 'virtual': extrinsic = this.virtualSave.extrinsic; break;
        case 'local':
          if (typeof Storage !== undefined) {
            let extrinsicStr = window.localStorage.getItem('Extrinsic');
            if (extrinsicStr !== 'undefined') {
              extrinsic = JSON.parse(extrinsicStr);
            }
          } else {
            console.log('NO STORAGE!');
          }
          break;
        case 'online': break;
      }
      resolve(extrinsic);
    });
  }

  // == Version Controls == //

  private loadVersion(): Promise<number> {
    return new Promise((resolve) => {
      let version;
      switch (this.saveOptions.saveLoc) {
        case 'virtual': version = this.virtualSave.version; break;
        case 'local':
          if (typeof Storage !== undefined) {
            version = Number(window.localStorage.getItem('eq-Version'));
          } else {
            console.log('NO STORAGE!');
            resolve(0);
          }
          break;
        case 'online': break;
      }

      resolve(version);
    });
  }

  private saveVersion(version: number) {
    switch (this.saveOptions.saveLoc) {
      case 'virtual': this.virtualSave.version = version; break;
      case 'local':
        if (typeof Storage !== undefined) {
          window.localStorage.setItem('eq-Version', String(version));
        } else {
          console.log('NO STORAGE!');
        }
        break;
      case 'online': break;
    }
  }
}
