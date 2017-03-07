import { Injectable, Inject } from '@angular/core';


import {AdhocDB} from './common/db/adhocDB.service'
import {SessionNoteDB} from './common/db/SNDB.service'
import {EICallsService} from './common/EICalls.service'
import {Mandate} from '../beans/Mandate.bean';


@Injectable()
export class SelectChildService {

    constructor(@Inject(EICallsService) private eiCallsService : EICallsService, @Inject(AdhocDB)   private adhocDB : AdhocDB, @Inject(SessionNoteDB)private snDB: SessionNoteDB){

    }



    getAllStudents(){
        return this.adhocDB.getSelectStudents();
    }

    saveSN(sn){
        return this.snDB.insert(sn);
    }

    getServiceMethodCount(serviceMethodType){
        return this.adhocDB.checkForServiceMethodType(serviceMethodType);
    }

    getNotesOnPhone(ifspId){
        return this.adhocDB.getNotesOnPhone(ifspId);
    }

    getTodaysSessionCount(studentId){
        return this.adhocDB.getTodaysSessionCount(studentId);
    }

    getIfspMandate(ifspId){
        return this.eiCallsService.getIfspMandate(ifspId).map(res => res.json())
    }
    
    updateCountsForIFSP(mandate: Mandate) {
       return this.adhocDB.updateCountsForIFSP(mandate.ifspId, mandate);
   }


}