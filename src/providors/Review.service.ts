import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response} from '@angular/http';
import { AlertController } from 'ionic-angular';


import {AdhocDB} from './common/db/adhocDB.service'
import {SessionNoteDB} from './common/db/SNDB.service'
import {IfspDBService} from './common/db/ifspDB.service'
import {CPTCodesDB} from './common/db/cptCodesDB.service'
import {ICDCodesDB} from './common/db/icd10CodesDB.service'
import {MyDB} from './common/db/my.service'
import {OutcomesDB} from './common/db/outcomesDB.service'
import {EICallsService} from './common/EICalls.service'
import {SessionNote} from '../beans/sessionNote.bean';
import {CanceledSNService} from './CanceledSN.service';
import {DBService} from './common/db/db.service'

import {SNService} from './SN.service'



@Injectable()
export class ReviewService  extends SNService {

    // constructor(@Inject(EICallsService) public eiCallsService : EICallsService, @Inject(AdhocDB)   private adhocDB : AdhocDB, @Inject(SessionNoteDB)private snDB: SessionNoteDB
    // , @Inject(CanceledSNService)private cancelledSN: CanceledSNService){

    // }

   constructor(@Inject(EICallsService) public eiCallsService : EICallsService,@Inject(SessionNoteDB)public snDB: SessionNoteDB, @Inject(IfspDBService)public ifspDB: IfspDBService,
               @Inject(CPTCodesDB)public cptCodesDB: CPTCodesDB, @Inject(ICDCodesDB)public icd10CodesDB: ICDCodesDB, @Inject(OutcomesDB) public outcomesDB: OutcomesDB, @Inject(AdhocDB) public adhocDB,
               @Inject(DBService) public db : DBService){
       super(eiCallsService,snDB, ifspDB, cptCodesDB, icd10CodesDB,outcomesDB, adhocDB, db);
    }

    getAllSessionNotes(){
        return this.snDB.all();
    }


    getAllSubmitted(){
        return this.snDB.getAllHistory();
    }


    deleteSN(session: SessionNote){
        this.snDB.deleteById(session.sessionId).then(
            (data) =>{
            },
            (error) => {
                console.error(error);
            }
        );
    }

    deleteSNOnServer(sessionId: number){
        return this.eiCallsService.deleteSessionNote(sessionId);
    }



    moveToHistory(session: SessionNote){
        return this.snDB.insertHistory(session);
    }


    getStatusDisplay(status: string): string{ 
        
        switch(status){
            case "BEGIN":
            case "NOT_SIGNED":
            case "EDITING":
              return  "Started"; 
            case "PARENT_SIGNED":
              return   "Parent Signed"; 
            case "NOT_SIGNED":
              return "Pending Signature"; 
            case "THERAPIST_SIGNED":
             return  "Therapist Signed";
            
        }
        return status;
    }

    isEditable(status: string){
        if(status === 'PARENT_SIGNED' || status === 'THERAPIST_SIGNED')
          return false;
        return true;
    }



}