import { Injectable, Inject } from '@angular/core';

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
import {DBService} from './common/db/db.service'

@Injectable()
export class MakeupSNService extends SNService{


   constructor(@Inject(EICallsService) public eiCallsService : EICallsService,@Inject(SessionNoteDB)public snDB: SessionNoteDB, @Inject(IfspDBService)public ifspDB: IfspDBService,
               @Inject(CPTCodesDB)public cptCodesDB: CPTCodesDB, @Inject(ICDCodesDB)public icd10CodesDB: ICDCodesDB, @Inject(OutcomesDB) public outcomesDB: OutcomesDB,
            @Inject(MakeupDtDB) public makeupDB: MakeupDtDB, @Inject(AdhocDB) public adhocDB,
               @Inject(DBService) public db : DBService){
       super(eiCallsService,snDB, ifspDB, cptCodesDB, icd10CodesDB,outcomesDB, adhocDB, db);
    }


    getMakeupDates(studentId: string){
        // return this.makeupDB.all();
        return this.makeupDB.getByIfspId(studentId);
    }


   deleteMakeup(absentCardId){
       console.log("deleteing absentCardId:"+absentCardId);
       return this.makeupDB.deleteByCardId(absentCardId);
   }


}