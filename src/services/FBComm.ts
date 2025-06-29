import { Utils } from "../JMGE/others/Utils";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseObject {
  __id: string;
  lastUpdater: string;
  reserved: boolean;
}

declare const firebase: {
  initializeApp: (e: FirebaseConfig) => void;
  firestore: () => ({
    collection: (collectionName: string) => any;
    doc: (docName: string) => any;
  });
  auth: () => ({
    signInAnonymously: () => void;
    onAuthStateChanged: (callback: (user: {uid: string}) => void) => void;
  });
}

export class FirebaseManager {
  // Initialize Firebase
  db;
  auth;
  uid: string;

  constructor(firebaseConfig: FirebaseConfig) {
      firebase.initializeApp(firebaseConfig);
      this.db = firebase.firestore();
      this.auth = firebase.auth();
  }

  dbFetchObjects<T extends FirebaseObject>(collectionName: string = 'Objects') {
    return new Promise(resolve => {
      let objects: T[] = [];
      this.db.collection(collectionName)
      .get().then((snapshot: {data: () => T, id: string}[]) => {
        snapshot.forEach(doc => {
          let obj = doc.data();
          obj.__id = doc.id;
          objects.push(obj);
        });

        resolve(objects);
      });
    });
  }

  dbRegisterObject<T extends FirebaseObject>(obj: T, docName: string = 'objects', onChangeCb: (e: T) => void) {
    this.db.doc(`${docName}/${obj.__id}`).onSnapshot((doc: {data: () => T, id: string, lastUpdater: string}) => {
      let data = doc.data();
      if (data.lastUpdater !== this.uid) {
        onChangeCb(data);
      }
    });
  }

  updateObjectInstant = <T extends FirebaseObject>(obj: T, docName: string = 'objects') => {
    obj.lastUpdater = this.uid;
    this.db.doc(`${docName}/${obj.__id}`).update(obj);

  }

  updateObject = Utils.throttle(30, this.updateObjectInstant);

  addObject<T> (obj: T, collectionName: string = 'Object') {
    this.db.collection(collectionName).add(obj);
  }

  dbRegister() {
    return new Promise<void>((resolve) => {
      this.auth.onAuthStateChanged((user: {uid: string}) => {
        this.uid = user.uid;

        this.db.doc("users/" + this.uid).set({
          lastLogin: new Date().getTime(),
        });

        resolve();
      });
      
      firebase.auth().signInAnonymously();
    });
  }
}
