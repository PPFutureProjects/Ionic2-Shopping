import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class MissingDB{

    constructor(public  dbService: DBService){

    }
    all() {
    	let query = 'SELECT * FROM missing_count';
    	return this.dbService.query(query,[]);
    };
    
    getByIfspId(id) {
    	let query = 'SELECT * FROM missing_count WHERE ifspId = ?';
  	    let i = ""+id;
    	return this.dbService.query(query,[i]);
    };

	getDeleteStatement(): string{
		return "delete from missing_count ";
	}
 

	deleteAll(){
		return this.dbService.query(this.getDeleteStatement(), []);
	}

	deleteByDate(ifspId, missingDate){
		let query = "delete from missing_count where ifspId = ? and WeekOf = ?  and missing = 1 ";
		console.log("In delete, ifspId = "+ifspId+", missingDate;"+missingDate);
		let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from missing_count where ifspId = ? and WeekOf = ?  and missing = 1",[ifspId, missingDate]);
         batch[1] = new SqlBatch("update missing_count set missing = missing - 1 where ifspId = ? and WeekOf = ? ",[ifspId, missingDate]);
		return this.dbService.sqlBatch(batch);
	}
    
    prepareInsert(missing: any): SqlBatch{
		return new SqlBatch(
			"insert  or replace into missing_count (ifspId, WeekOf, missing) values(?,?,?)",
			[
    	             missing.ifspId,
    	             missing.weekOf,
    	             missing.missing
          ]
		);
	}

    insert(missing){
		let insert = this.prepareInsert(missing);
    	return this.dbService.query(insert.query, insert.params);
    };
}