import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/observable";

@Injectable()
export class RealTimeDatabaseService {
    constructor (private rtdb: AngularFireDatabase, ) {

    }
    getObject(path: string): Observable<{}> {
        return this.rtdb.object(path).valueChanges();
    }
}