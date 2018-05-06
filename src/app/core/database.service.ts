import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class DatabaseService {
  constructor (private rtdb: AngularFireDatabase) {

  }

  setObject(path: string, data: object) {
    return this.rtdb.object(path).set(data);
  }

  getObject(path: string) {
    return this.rtdb.object(path).valueChanges();
  }
}