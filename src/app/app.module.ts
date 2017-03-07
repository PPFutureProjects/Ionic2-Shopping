import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, NavController, IonicErrorHandler } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { SignaturePadModule } from 'angular2-signaturepad';
import { SignatureFieldComponent } from './signature-field/signature-field.component';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage}  from '../pages/login/login';
import {CancelledSessionPage}  from '../pages/cancelled-session/cancelled-session';
import {LoadPage}  from '../pages/load/load';
import {MakeupSessionPage}  from '../pages/makeup-session/makeup-session';
import {RegularSessionPage}  from '../pages/regular-session/regular-session';
import {ReviewCompletedPage}  from '../pages/review-completed/review-completed';
import {ReviewSavedPage}  from '../pages/review-saved/review-saved';
import {SelectChildPage}  from '../pages/select-child/select-child';

import {Employee} from '../beans/employee.bean';
import {Student} from '../beans/student.bean';
import {SessionNote} from '../beans/sessionNote.bean';

import {EICallsService} from '../providors/common/EICalls.service'
import {DBService} from '../providors/common/db/db.service'
import {AdhocDB} from '../providors/common/db/adhocDB.service'
import {CPTCodesDB} from '../providors/common/db/cptCodesDB.service'
import {EmployeeDB} from '../providors/common/db/employeeDB.service'
import {ICDCodesDB} from '../providors/common/db/icd10CodesDB.service'
import {IfspDBService}     from '../providors/common/db/ifspDB.service'
import {MakeupDtDB} from '../providors/common/db/makeupDB.service'
import {OutcomesDB} from '../providors/common/db/outcomesDB.service'
import {SessionNoteDB} from '../providors/common/db/SNDB.service'
import {UserDB} from '../providors/common/db/userDB.service'
import {MissingDB} from '../providors/common/db/missingDB.service'
import {StudentDB} from '../providors/common/db/studentDB.service'
import {MyDB} from '../providors/common/db/my.service'
import {LoginService} from '../providors/Login.service'
import {AdhocService} from '../providors/Adhoc.service';
import {HttpService} from '../providors/common/HttpService';
import { HttpModule } from '@angular/http';
import {OrderBy} from '../orderBy';


@NgModule({
  declarations: [
    MyApp, HomePage, LoginPage,CancelledSessionPage,LoadPage,MakeupSessionPage,RegularSessionPage,CancelledSessionPage,ReviewCompletedPage,ReviewSavedPage,SelectChildPage, SignatureFieldComponent, OrderBy
  ],
  imports: [
    IonicModule.forRoot(MyApp), SignaturePadModule, HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, HomePage, LoginPage,CancelledSessionPage,LoadPage,MakeupSessionPage,RegularSessionPage,CancelledSessionPage,ReviewCompletedPage,ReviewSavedPage,SelectChildPage
  ],
  providers: [
    EICallsService, Employee, Student, SessionNote,IfspDBService, AdhocService,
    DBService,AdhocDB,CPTCodesDB,EmployeeDB,ICDCodesDB, MakeupDtDB,OutcomesDB,SessionNoteDB,UserDB, StudentDB, MyDB,LoginService,MissingDB,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
