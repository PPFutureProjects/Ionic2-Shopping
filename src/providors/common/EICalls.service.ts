import {Injectable, Inject} from '@angular/core';
import {Http, Headers, RequestOptions, URLSearchParams, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {SERVER_URL} from './config';
import {SessionNote} from '../beans/sessionNote.bean';
import {HttpService} from './HttpService';


@Injectable()
export class EICallsService{

     constructor(@Inject(Http) private http:HttpService){ 

     }


     login (username, password) {
          let url = SERVER_URL+"/getEmp";
          let authdata = btoa(username + ':' + password); 
          let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization':   'Basic ' + authdata});
          let options = new RequestOptions({ headers: headers });
          return this.http.get(url, options);
     }


     getEmployeeStudents(id){
          let url = SERVER_URL+"/getStudentsByEmpId";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }


     getEmployeeIFSPs(id){
          let url = SERVER_URL+"/getIfspByEmpId";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }

     getGapCount(id){
          let url = SERVER_URL+"/getGapReport";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }

      getEmployeeRates(id){
          let url = SERVER_URL+"/getEmployeeRates";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }


     getEmployeeOutcomes(id){
          let url = SERVER_URL+"/getIfspOutcomesByEmpId";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }


     getCPTCodes(){
          let url = SERVER_URL+"/getCptCodeBeanList";
          return this.http.get(url);
     }


     getICD10Codes(){
          let url = SERVER_URL+"/getICD10Codes";
          return this.http.get(url);
     }


     getMakeupDates(id){
          let url = SERVER_URL+"/getMakeupDates";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }

     getMissingSessions(id){
          let url = SERVER_URL+"/getMissing";
           let params: URLSearchParams = new URLSearchParams();
           params.set('employeeId', id)
          return this.http.get(url, {search: params});
     }

     validateSN(sn, url){
        let data = sn;
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
     }

     validateRegSN( sn ){
        let url = SERVER_URL+"/validateAppSessionNotes";
        return this.validateSN(sn,url);
    }
     validateCancelledN( sn ){
        let url = SERVER_URL+"/validateCancelledSessionNotes";
        return this.validateSN(sn,url);
    }
     validateMakeupSN( sn ){
        let url = SERVER_URL+"/validateMakeupSessionNotes";
        return this.validateSN(sn,url);
    }

    sendSN(sn, url){
        let data = sn;
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
    }

     sendRegSN( sn ){
        let url = SERVER_URL+"/saveAppSessionNotes";
        return this.sendSN(sn, url);
    }
     sendCancelledSN( sn ){
        let url = SERVER_URL+"/saveCancelledSessionNotes";
        return this.sendSN(sn, url);
    }
     sendMakeupSN( sn ){
        let url = SERVER_URL+"/saveMakeupSessionNotes";
        return this.sendSN(sn, url);
    }

    deleteSessionNote(sessionId: number){
          let url = SERVER_URL+"/deleteAppSessionNote";
           let params: URLSearchParams = new URLSearchParams();
           params.set('id', ""+sessionId)
          return this.http.get(url, {search: params});
    }

    getIfspMandate(ifspId){
          let url = SERVER_URL+"/getIfspMandate";
           let params: URLSearchParams = new URLSearchParams();
           params.set('ifspId', ""+ifspId)
          return this.http.get(url, {search: params});

    }

    getemployeeMandates(ifspIds: Array<any>){
          let url = SERVER_URL+"/getEmployeeMandates";
           let params: URLSearchParams = new URLSearchParams();
           params.set('ifspIds', ""+ifspIds)
          return this.http.get(url, {search: params});
    }
}