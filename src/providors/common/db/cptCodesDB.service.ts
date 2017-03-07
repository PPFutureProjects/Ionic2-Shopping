import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class CPTCodesDB{

    constructor(public  dbService: DBService){

    }

    all() {
    	let query = 'SELECT * FROM cpt_codes';
    	return this.dbService.query(query,[]);
    };
    
   getByICD10Code(code1, code2) {
    	let query = 'SELECT serviceType, serviceSubType, icd10Code, group_concat(cptCode) as cptCodes FROM cpt_codes  where 1 = 1 ';
    	let params = [];
    	if(code1){
    		query += "and (icd10Code = ? and crosswalk = 'Y') ";
    		params[params.length] = code1;
    	}
    	if(code2){
    		query += "and (icd10Code = ? and crosswalk = 'Y') ";
    		params[params.length] = code2;
    	}
    	return this.dbService.query(query,params);
    };
    

	deleteAll(){
		let query = "delete from cpt_codes ";
		return this.dbService.query(query, []);
	}

	prepareInsert(data,cptCode): SqlBatch{
		return new SqlBatch(
			"insert  or replace into cpt_codes (serviceType, serviceSubType, icd10Code, cptCode,crosswalk) "+
    	    "values(?,?,?, ?,?)",[
    	     						data.serviceType,
    	    						data.serviceSubType,
    	    						data.icd10Code,
    	    						cptCode,
    	    						data.crosswalk]);
	}
	
	prepareSubAsMainInsert(data,cptCode): SqlBatch{
		return new SqlBatch(
			"insert  or replace into cpt_codes (serviceType, serviceSubType, icd10Code, cptCode,crosswalk) "+
    	    "values(?,?,?, ?,?)",[
    	     						data.serviceSubType,
    	    						'',
    	    						data.icd10Code,
    	    						cptCode,
    	    						data.crosswalk]);
	}
    
   insert(data,cptCode){
    	let insert = this.prepareInsert(data,cptCode);
    	
    	return this.dbService.query(insert.query, insert.params);
    };
    
   getICD10Codes(serviceType){
    	let query = "select icd10Code from cpt_codes where serviceType = ?";
    	return this.dbService.query(query,[serviceType]);
    }
    
   getcptCodes(serviceType, icd10code1, icdcode2){
    	let query = "select distinct cptCode from cpt_codes where  serviceType = ? ";
    	
    	let params = [serviceType];
    	if(icd10code1){
    		query += "and (icd10Code = ? and crosswalk = 'Y') ";
    		params[params.length] = icd10code1;
    	}
    	if(icdcode2){
    		query += "and (icd10Code = ? and crosswalk = 'Y') ";
    		params[params.length] = icdcode2;
    	}
    	return this.dbService.query(query,params);
    }
    
   getNoneCrosswalk() {
    	let query = "SELECT distinct cptCode where crosswalk = 'N' ";
    	let params = [];
    	return this.dbService.query(query,params);
    };
    
   getAllcptCodes(serviceType: string){
    	let query = "select distinct cptCode from cpt_codes where serviceType = ? and crosswalk = 'N' order by cptCode ";
    	return this.dbService.query(query,[serviceType]);
    }

}