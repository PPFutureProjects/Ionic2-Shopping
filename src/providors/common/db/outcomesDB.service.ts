import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class OutcomesDB{

    allColumns = "studentId,firstName,lastName,dateOfBirth ,male,female,office";

    constructor(public  dbService: DBService){

    }
    all() {
    	let query = 'SELECT * FROM outcomes';
    	return this.dbService.query(query,[]);
    };
    
    getById(id) {
    	let query = 'SELECT * FROM outcomes WHERE outcomeId = ?';
    	return this.dbService.query(query,[id]);
    };
    
    getByStudentId(id) {
    	let query = 'SELECT * FROM outcomes WHERE studentId = ?';
    	return this.dbService.query(query,[id]);
    };

	getOutcomesByStudentId(studentId){
		let query = "select distinct outcomeNumber,outcome FROM outcomes WHERE studentId = ? order by outcomeNumber ";
		var st = (""+studentId).trim();
    	return this.dbService.query(query,[st]);
	}

	getObjectivesByStudentId(studentId, outcome){
		let query = "select distinct objective1,objective2,objective3,objective4,objective5,sortNumber FROM outcomes WHERE studentId = ? and outcome = ? ";
		var st = (""+studentId).trim();
    	return this.dbService.query(query,[st, outcome]);
	}
    
    
	deleteAll(){
		let query = "delete from outcomes ";
		return this.dbService.query(query, []);
	}

	prepareInsert(out): SqlBatch{
		return new SqlBatch(
			"insert  or replace into outcomes (outcomeId,dateEntered,studentId, ifspOutcomeNumber,outcomeNumber,outcome,objective1,objective2,objective3,objective4,objective5,sortNumber) "+
    	    "values(?,?,?,?,?,?,?,?,?,?,?,?)",
            [
    	                             out.outcomeId,
    	                             out.dateEntered,
    	                             out.studentId,
    	                             out.ifspOutcomeNumber,
    	                             out.outcomeNumber,
    	                             out.outcome,
    	                             out.objective1,
    	                             out.objective2,
    	                             out.objective3,
    	                             out.objective4,
    	                             out.objective5,
    	                             out.sortNumber
               ]
		);
	}
    insert(out){
    	let insert = this.prepareInsert(out);

    	return this.dbService.query(insert.query,insert.params );
    };
}
