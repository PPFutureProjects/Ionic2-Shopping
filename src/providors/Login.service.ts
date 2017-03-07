import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {EICallsService} from './common/EICalls.service'
import { Injectable, Inject } from '@angular/core';
import {Employee} from '../beans/employee.bean';
import {UserDB} from './common/db/userDB.service'
import {EmployeeDB} from './common/db/employeeDB.service'

@Injectable()
export class LoginService{

    userDB: UserDB;
    employeeDB: EmployeeDB;
    constructor(@Inject(EICallsService) private eiCallsService : EICallsService, @Inject(UserDB) userDB: UserDB, @Inject(EmployeeDB) employeeDB: EmployeeDB){
        this.userDB = userDB;
        this.employeeDB = employeeDB;
    }

    login(username, password): Observable<Employee>{
        return this.eiCallsService.login(username, password)
                    .map(this.extractData)
                    .catch(this.handleError);
    }


    private extractData(res: Response) {
    let body = res.json();
    return body.data || body;
    }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(error);
  }


  saveUser(user){
    return this.userDB.insert(user);
  }

  getUser(){
    return this.userDB.all();
  }

  saveEmployee(employee: Employee){
    return this.employeeDB.insert(employee);
  }

  getEmployee(){
    return this.employeeDB.all();
  }
}