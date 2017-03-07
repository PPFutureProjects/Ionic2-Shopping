import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SqlBatch} from '../../../beans/sqlBatch.bean';

@Injectable()
export class StudentDB{

    allColumns = "studentId,firstName,lastName,dateOfBirth ,male,female,office";

    constructor(public  dbService: DBService){

    }
    
    all(){
        let query = 'SELECT '+this.allColumns+' FROM student';
        return this.dbService.query(query, []);
    }


    getById(id) {
    	let query = 'SELECT '+this.allColumns+' FROM student WHERE studentId = ?';
    	return this.dbService.query(query,[id]);
    }
    
	deleteAll(){
		let query = "delete from student ";
		return this.dbService.query(query, []);
	}

	prepareInsert(student: any): SqlBatch{
       return  new SqlBatch(
		   "insert  or replace into student (studentId,firstName,lastName,dateOfBirth,male,female,office) values(?,?,?,?,?,?,?)",
		   [student.studentId,
    	                                     student.firstName,
    	                                     student.lastName,
    	                                     student.dateOfBirth,
    	                                     student.male,
    	                                     student.female,
    	                                     student.office
    	                                     ]
	   );
	}
    
    insert(student){
    	let insert = this.prepareInsert(student);
    	
    	return this.dbService.query(insert.query, insert.params);
    }

}