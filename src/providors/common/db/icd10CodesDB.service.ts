import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class ICDCodesDB{

    constructor(public  dbService: DBService){

    }

    all() {
    	let query = 'SELECT * FROM icd_codes';
    	return this.dbService.query(query,[]);
    };

    deleteAll(){
		let query = "delete from icd_codes ";
		return this.dbService.query(query, []);
	}

	prepareInsert(icd10Code, description): SqlBatch{
		return new SqlBatch(
			"insert  or replace into icd_codes (icd10Code, description) values(?,?)",
			[icd10Code, description ]
		);
	}
    
    insert(icd10Code, description){
		let insert = this.prepareInsert(icd10Code, description);
    	return this.dbService.query(insert.query, insert.params);
    };

	getforIFSP(serviceType: string){
		let query = "select * from icd_codes where icd10Code in (select icd10Code from cpt_codes where crosswalk = 'Y' and serviceType = ?) "+
		"or icd10Code not in  (select icd10Code from cpt_codes where crosswalk = 'Y' and serviceType <> ?)  ";

		return this.dbService.query(query, [serviceType,serviceType]);
	} 

}