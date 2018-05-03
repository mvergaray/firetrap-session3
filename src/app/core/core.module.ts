import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RealTimeDatabaseService } from './real-time-database.service';



@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ],
  providers: [AuthService, RealTimeDatabaseService],
})
export class CoreModule { }
