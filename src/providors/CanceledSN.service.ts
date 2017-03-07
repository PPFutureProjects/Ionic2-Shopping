import { Injectable, Inject } from '@angular/core';
import { AlertController } from 'ionic-angular';

import {SNService} from './SN.service'

import {AdhocDB} from './common/db/adhocDB.service'
import {SessionNoteDB} from './common/db/SNDB.service'
import {IfspDBService} from './common/db/ifspDB.service'
import {CPTCodesDB} from './common/db/cptCodesDB.service'
import {ICDCodesDB} from './common/db/icd10CodesDB.service'
import {MyDB} from './common/db/my.service'
import {OutcomesDB} from './common/db/outcomesDB.service'
import {MakeupDtDB} from './common/db/makeupDB.service'
import {EICallsService} from './common/EICalls.service'
import {Utils} from '../utils'
import {SessionNote} from '../beans/sessionNote.bean';
import {MissingDB} from './common/db/missingDB.service'
import {DBService} from './common/db/db.service'

@Injectable()
export class CanceledSNService extends SNService{

 
   constructor(@Inject(EICallsService) public eiCallsService : EICallsService,@Inject(SessionNoteDB)public snDB: SessionNoteDB, @Inject(IfspDBService)public ifspDB: IfspDBService,
               @Inject(CPTCodesDB)public cptCodesDB: CPTCodesDB, @Inject(ICDCodesDB)public icd10CodesDB: ICDCodesDB, @Inject(OutcomesDB) public outcomesDB: OutcomesDB, @Inject(AdhocDB) public adhocDB,
               @Inject(MakeupDtDB)public makeupDB: MakeupDtDB,
               @Inject(MissingDB) private misssingDB : MissingDB,
               @Inject(DBService) public db : DBService){
       super(eiCallsService,snDB, ifspDB, cptCodesDB, icd10CodesDB,outcomesDB, adhocDB, db);
    }


  //   submitSN(sn){
  //         Utils.removeAllEmpty(sn);
  //         let serverValidation;
  //         return this.submitCancelledSNToServer(sn);
  // }

  snSubmitted(sn: SessionNote, mandate){
    if(!mandate) return;
            this.insertHistory(sn);
            this.deleteSNById(sn.sessionId);
            this.deleteMissing(sn);
            if(sn.reason !== 'Child on Vacation')
            this.makeupDB.insert({
              studentId: sn.studentId,
    	        dateOfAbsent: sn.dateOfAbsent,
    	        absentCardId: null,
              ifspId: sn.ifspId
            });
  }

  deleteMissing(sn: SessionNote){
    console.log(sn.sessionDate);
    console.log(Utils.getSunday(new Date(sn.sessionDate)));
    this.misssingDB.deleteByDate(sn.ifspId, Utils.getSunday(new Date(sn.sessionDate)));
  }

  alertSubmitted(submitted, alertCtrl: AlertController){
          let title = submitted > 1 ? "Session Notes saved" : "Session Note saved";
          let subTitle =  submitted > 1 ? submitted + " Session Notes were succefully submitted!" : "The session note was succefully submitted!";
             let alert = alertCtrl.create(
             {
               title: title,
               subTitle: subTitle,
               buttons: ['OK']
             });
             return alert.present();
  }

  updateMandate(ifspId, mandate){
    return this.adhocDB.updateCountsForIFSP(ifspId, mandate);
  }
}