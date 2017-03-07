import {Injectable, Inject} from '@angular/core';




import {DBService} from './db.service'

@Injectable()
export class EmployeeDB{

    constructor(public  dbService: DBService){

    }

       all = function() {
        let query = "SELECT * FROM employees";
    	return this.dbService.query(query, []);
    };
    
   getById = function(id) {
    	let query = "SELECT * FROM employees WHERE id = ? ";
    	return this.dbService.query(query,[id]);
    };

	deleteAll(){
		let query = "delete from employees ";
		return this.dbService.query(query, []);
	}
    
    
   insert = function(employee){
    	let query = "insert or replace into employees (id,title,firstName,lastName,licenseNumb,discipline,empLicense) values(?,?,?,?,?,?,?)";
    	//console.log("inserting:"+query);
    	return this.dbService.query(query, [
    	                                     employee.employeeId, 
    	                                     employee.title,   
    	                                     employee.firstName,  
    	                                     employee.lastName,
    	                                     employee.licenseNumb,  
    	                                     employee.discipline,
    	                                     employee.empLicense
    	                                     ]);
    };


}