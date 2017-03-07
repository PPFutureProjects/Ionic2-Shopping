import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {EICallsService} from './common/EICalls.service'
import { Injectable, Inject } from '@angular/core';

import {AdhocDB} from './common/db/adhocDB.service'
import {CPTCodesDB} from './common/db/cptCodesDB.service'
import {EmployeeDB} from './common/db/employeeDB.service'
import {ICDCodesDB} from './common/db/icd10CodesDB.service'
import {IfspDBService} from './common/db/ifspDB.service'
import {MakeupDtDB} from './common/db/makeupDB.service'
import {OutcomesDB} from './common/db/outcomesDB.service'
import {SessionNoteDB} from './common/db/SNDB.service'
import {UserDB} from './common/db/userDB.service'
import {StudentDB} from './common/db/studentDB.service'
import {DBService} from './common/db/db.service'
import {MissingDB} from './common/db/missingDB.service'

import {SqlBatch} from '../beans/sqlBatch.bean';
import {Mandate} from '../beans/Mandate.bean';
import {Utils} from '../utils'

@Injectable()
export class LoadService {

    constructor(@Inject(EICallsService) private eiCallsService : EICallsService,
                @Inject(AdhocDB)   private adhocDB : AdhocDB, 
                @Inject(CPTCodesDB) private cptCodesDB : CPTCodesDB, 
                @Inject(EmployeeDB) private employeeDB : EmployeeDB, 
                @Inject(ICDCodesDB) private icdCodesDB : ICDCodesDB, 
                @Inject(IfspDBService) private ifspDb : IfspDBService, 
                @Inject(MakeupDtDB) private makeupDb : MakeupDtDB, 
                @Inject(OutcomesDB) private outcomesDb : OutcomesDB, 
                @Inject(SessionNoteDB) private snDB : SessionNoteDB, 
                @Inject(UserDB) private userDB : UserDB,
                @Inject(StudentDB) private studentDb : StudentDB,
                @Inject(DBService) private db : DBService,
                @Inject(MissingDB) private misssingDB : MissingDB){

    }


    getEmployeeStudents(id){
        return this.eiCallsService.getEmployeeStudents(id).map(res => res.json())
    }



      getEmployeeIFSPs(id){
        return this.eiCallsService.getEmployeeIFSPs(id).map(res => res.json())
     }


     getEmployeeOutcomes(id){
        return this.eiCallsService.getEmployeeOutcomes(id).map(res => res.json())
     }


     getCPTCodes(){
        return this.eiCallsService.getCPTCodes().map(res => res.json())
     }


     getICD10Codes(){
        return this.eiCallsService.getICD10Codes().map(res => res.json())
     }


     getMakeupDates(id){
        return this.eiCallsService.getMakeupDates(id).map(res => res.json())
     }

     getGapcount(id){
         return this.eiCallsService.getGapCount(id).map(res => res.json());
     }

     getEmployeeRates(id){
         return this.eiCallsService.getEmployeeRates(id).map(res => res.json());
     }

     getMissingSessions(id){
         return this.eiCallsService.getMissingSessions(id).map(res => res.json());
     }

     getLastTimeDataLoaded(){
         return this.userDB.lastDataLoaded();
     }

     setDataLoaded(){
         return this.userDB.setDataLoaded(new Date().getTime());
     }

     saveStudents(students): Promise<any>{

        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from student ");
         for(let i =0 ;i < students.length; i++){
             batch[i + 1] = this.studentDb.prepareInsert(students[i]);
         }
         return  this.db.sqlBatch(batch);
     }


     saveIfsps(ifsps): Promise<any> {
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from ifsp ");
         for(let i =0 ;i < ifsps.length; i++){
             batch[i + 1] = this.ifspDb.prepareInsert(ifsps[i]);
         }
         return  this.db.sqlBatch(batch);
     }
     saveOutcomes(outcomes): Promise<any> {
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from outcomes ");
         for(let i =0 ;i < outcomes.length; i++){
             batch[i + 1] = this.outcomesDb.prepareInsert(outcomes[i]);
         }
         return  this.db.sqlBatch(batch);
     }
     saveCPTCodes(data): Promise<any> {
         let batch = new Array<SqlBatch>();
         let batchIndex = 0;
         batch[batchIndex++] = new SqlBatch("delete from cpt_codes ");

         for (let i = 0; i < data.length; i++) {
             for (let j = 0; j < data[i].cptCodes.length; j++) {
                 batch[batchIndex++] = this.cptCodesDB.prepareInsert(
                     data[i],
                     data[i].cptCodes[j]
                 );
                 if (!Utils.isEmpty(data[i].serviceSubType)) {
                     batch[batchIndex++] = this.cptCodesDB.prepareSubAsMainInsert(
                         data[i],
                         data[i].cptCodes[j]
                     );
                 }
             }
         }
         return this.db.sqlBatch(batch);
     }

     saveIcd10Codes(data): Promise<any> {
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from icd_codes ");
         for(let i =0 ;i < data.length; i++){
             batch[i + 1] = this.icdCodesDB.prepareInsert(data[i].icd10Code, data[i].description);
         }
         return  this.db.sqlBatch(batch);
     }


     saveMakeups(makeupdates): Promise<any> {
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from makeup_dates ");
         for(let i =0 ;i < makeupdates.length; i++){
             batch[i + 1] = this.makeupDb.prepareInsert(makeupdates[i]);
         }
         return  this.db.sqlBatch(batch);
     }

     saveGapCount(count: number): Promise<any> {
         return this.userDB.setGapCount(count);
     }


     saveMissingSessions(data): Promise<any> {
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch(this.misssingDB.getDeleteStatement());
         for(let i =0 ;i < data.length; i++){
             batch[i + 1] = this.misssingDB.prepareInsert(data[i]);
         }
         return  this.db.sqlBatch(batch);
     }


    getIfspMandate(ifspId){
        return this.eiCallsService.getIfspMandate(ifspId).map(res => res.json())
    }
    
    updateCountsForIFSP(mandate: Mandate) {
       return this.adhocDB.updateCountsForIFSP(mandate.ifspId, mandate);
   }

     restartDB(){
         this.db.restartDB();
     }
}