import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';


import {SessionNoteDB} from './common/db/SNDB.service'
import {UserDB} from './common/db/userDB.service'
import {IfspDBService} from './common/db/ifspDB.service'
import {MissingDB} from './common/db/missingDB.service'
import {AdhocDB} from './common/db/adhocDB.service'
import {EICallsService} from './common/EICalls.service'
import {Utils} from '../utils'

@Injectable()
export class AdhocService{

    static checkedForMissing: boolean = false;

   constructor(@Inject(EICallsService) private eiCallsService : EICallsService, 
              @Inject(SessionNoteDB) private snDB: SessionNoteDB, 
              @Inject(UserDB) private userDB: UserDB,  
              @Inject(IfspDBService) private ifspDB: IfspDBService,
               @Inject(AdhocDB)   private adhocDB : AdhocDB,
               @Inject(MissingDB) private misssingDB : MissingDB){
       

    }

    alreadyCheckedForMissing(): boolean{
        let b = AdhocService.checkedForMissing;
        AdhocService.checkedForMissing = true;
        return b;
    }

    firstTimeThisWeek(){
        return this.userDB.isFirstTimeThisWeek(Utils.getWeekOfYear(new Date()));
    }

    setweek(){
        return this.userDB.setWeek(Utils.getWeekOfYear(new Date()));
    }


    getLastWeekMissing(){
        // return this.ifspDB.getPreviousWeekMissing();
        return this.ifspDB.getMissingDetails();
    }

    getAllMissing(){
        return this.adhocDB.getMissingSessions();
    }

    getAllIfsp(){
        return this.ifspDB.selectStar();
    }

    getAllIfspIds(){
        return this.ifspDB.getAllIfspIds();
    }

    getemployeeMandates(ifspIds: Array<any>){
        return this.eiCallsService.getemployeeMandates(ifspIds).map(res => res.json());
    }
}