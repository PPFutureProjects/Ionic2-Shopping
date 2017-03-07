import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class MakeupDtDB{

    constructor(public  dbService: DBService){

    }
    all() {
    	let query = 'SELECT * FROM makeup_dates';
    	return this.dbService.query(query,[]);
    };
    
    getByStudentId (id) {
    	let query = 'SELECT * FROM makeup_dates WHERE studentId = ?';
  	    let i = ""+id;
    	return this.dbService.query(query,[i]);
    };

	getByIfspId (id) {
    	let query = 'SELECT * FROM makeup_dates WHERE ifspId = ?';
    	return this.dbService.query(query,[id]);
    };
 

	deleteAll(){
		let query = "delete from makeup_dates ";
		return this.dbService.query(query, []);
	}

	deleteByDate(makeupDate, ifspId){
		let query = "delete from makeup_dates where makeupDate = ? and ifspId = ?";
		return this.dbService.query(query, [makeupDate, ifspId]);
	}

	deleteByCardId(absentCardId){
		let query = "delete from makeup_dates where absentCardId = ? ";
		return this.dbService.query(query, [absentCardId]);
	}
    
    prepareInsert(mk): SqlBatch{
		return new SqlBatch(
			"insert  or replace into makeup_dates (studentId, makeupDate, absentCardId, ifspId) values(?,?,?, ?)",
			[
    	             mk.studentId,
    	             mk.dateOfAbsent,
    	             mk.absentCardId,
					 mk.ifspId
          ]
		);
	}

    insert(mk){
		let insert = this.prepareInsert(mk);
    	return this.dbService.query(insert.query, insert.params);
    };
}