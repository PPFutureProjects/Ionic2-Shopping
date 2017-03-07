import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'

@Injectable()
export class MyDB{

   allColumns = "ifspId,studentId, employeeId,serviceBegin as serviceBegin, serviceEnd as serviceEnd, serviceType,serviceTypeDefinition,serviceMethodType, locationType,locationDesc, serviceMinutes, serviceDaysPerWeek, "+
                         " frequencyPerMonth, serviceWeeks, totalBillingServiceUnits, billingServiceUnitsRem, division, cptCode, cptCode2, "+
    	"cptCode3, cptCode4, icd10Code, icd10Code2, more3hb, moreSame, makeUps, insertedAt, datetime(updatedAt,'unixepoch') as updatedAt";

    constructor(public  dbService: DBService){

    }


    all() {
    	
    	let query = 'SELECT '+this.allColumns+' FROM ifsp';
    	return this.dbService.query(query, []);
    };
    
    getById(id) {
    	let query = 'SELECT '+this.allColumns+' FROM ifsp WHERE ifspId = ?';
    	return this.dbService.query(query,[id]);
    };
    
    getByStudentId(id) {
    	let i = ""+id;
    	let query = 'SELECT '+this.allColumns+' FROM ifsp WHERE studentId = ?';
    	return this.dbService.query(query,[i]);
    };
    
    getPreviousWeekMissing(){
    	let query = "select serviceDaysPerWeek - (sessionCountLastWeek + cancelledSessionCountThisWeek) as missing, serviceDaysPerWeek approved,studentId from ifsp where (serviceDaysPerWeek - (sessionCountLastWeek + cancelledSessionCountThisWeek) ) > 0";
    	return this.dbService.query(query, []);
    }

	deleteAll(){
		let query = "delete from ifsp ";
		return this.dbService.query(query, []);
	}
    
    
    
    insert(ifsp){
    	//console.log(ifsp);
    	let query = "insert  or replace into ifsp (ifspId,studentId, employeeId, serviceBegin, serviceEnd, serviceType,serviceTypeDefinition,serviceMethodType, locationType,locationDesc, serviceMinutes, serviceDaysPerWeek, "+
    	"frequencyPerMonth, serviceWeeks, totalBillingServiceUnits, billingServiceUnitsRem, division, cptCode, cptCode2, "+
    	"cptCode3, cptCode4, icd10Code, icd10Code2, more3hb, moreSame, makeUps," +
    	"sessionCode, sessionCountToday, sessionCountLastWeek, sessionCountLastMonth, sessionCountThisMonth, "+
    	"sessionCountThisWeek, sessionCountIfspId, cancelledSessionCountToday, cancelledSessionCountLastWeek, "+
    	"cancelledSessionCountLastMonth, cancelledSessionCountThisMonth, cancelledSessionCountThisWeek, "+
    	"cancelledSessionCountIfspId, timeCardsEiConflictCount) "+
    	"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    	return this.dbService.query(query, [
    	                     		ifsp.ifspId,
    	                    		ifsp.studentId,
    	                    		ifsp.employeeId,
    	                    		ifsp.serviceBegin,
    	                    		ifsp.serviceEnd,
    	                    		ifsp.serviceType,
    	                    		ifsp.serviceTypeDefinition,
    	                    		ifsp.serviceMethodType,
    	                    		ifsp.locationType,
    	                    		ifsp.locationDesc,
    	                    		ifsp.serviceMinutes,
    	                    		ifsp.serviceDaysPerWeek,
    	                    		ifsp.frequencyPerMonth,
    	                    		ifsp.serviceWeeks,
    	                    		ifsp.totalBillingServiceUnits,
    	                    		ifsp.billingServiceUnitsRem,
    	                    		ifsp.division,
    	                    		ifsp.cptCode,
    	                    		ifsp.cptCode2,
    	                    		ifsp.cptCode3,
    	                    		ifsp.cptCode4,
    	                    		ifsp.icd10Code,
    	                    		ifsp.icd10Code2,
    	                    		ifsp.more3hb,
    	                    		ifsp.moreSame,
    	                    		ifsp.makeUps,
    	                    		ifsp.sessionCode,
    	                    		ifsp.sessionCountToday,
    	                    		ifsp.sessionCountLastWeek,
    	                    		ifsp.sessionCountLastMonth,
    	                    		ifsp.sessionCountThisMonth,
    	                    		ifsp.sessionCountThisWeek,
    	                    		ifsp.sessionCountIfspId,
    	                    		ifsp.cancelledSessionCountToday,
    	                    		ifsp.cancelledSessionCountLastWeek,
    	                    		ifsp.cancelledSessionCountLastMonth,
    	                    		ifsp.cancelledSessionCountThisMonth,
    	                    		ifsp.cancelledSessionCountThisWeek,
    	                    		ifsp.cancelledSessionCountIfspId,
    	                    		ifsp.timeCardsEiConflictCount
    	                                     ]);
    };
}