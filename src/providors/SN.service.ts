import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {  LoadingController, Loading, AlertController, Alert, NavController, ToastController  } from 'ionic-angular';


import {SessionNoteDB} from './common/db/SNDB.service'
import {IfspDBService} from './common/db/ifspDB.service'
import {CPTCodesDB} from './common/db/cptCodesDB.service'
import {ICDCodesDB} from './common/db/icd10CodesDB.service'
import {OutcomesDB} from './common/db/outcomesDB.service'
import {AdhocDB} from './common/db/adhocDB.service'
import {DBService} from './common/db/db.service'
import {SessionNote} from '../beans/sessionNote.bean';
import {Mandate} from '../beans/Mandate.bean';
import {WebSN} from '../beans/WebSN.bean';
import {Validation} from '../beans/Validation.bean';
import {EICallsService} from './common/EICalls.service'
import {SNMapper} from './common/SNMapper'
import {Constants} from './Constants'
import {Utils} from '../utils'
import {SqlBatch} from '../beans/sqlBatch.bean';


import {LoginPage} from '../pages/login/login'

@Injectable()
export class SNService{
    snDB: SessionNoteDB;
    ifspDB: IfspDBService;
    cptCodesDB: CPTCodesDB;
    icd10CodesDB: ICDCodesDB;
    outcomesDB: OutcomesDB;
    adhocDB: AdhocDB;
    eiCallsService : EICallsService;
    db: DBService;




    constructor(eiCallsService, snDB, ifspDB, cptCodesDB, icd10CodesDB, outcomesDB, adhocDB, db){
        this.snDB = snDB;
        this.ifspDB = ifspDB;
        this.cptCodesDB = cptCodesDB;
        this.icd10CodesDB = icd10CodesDB;
        this.outcomesDB = outcomesDB;
        this.eiCallsService = eiCallsService;
        this.adhocDB = adhocDB;
        this.db = db;

    }

    getSessionNote(sessionId){
        return this.snDB.getById(sessionId);
    }

    getIfsp(ifspId){
        return this.ifspDB.getById(ifspId);
    }

    getCPTCodes(serviceType, icd10code, icdcode2){
		return this.cptCodesDB.getcptCodes(serviceType, icd10code, icdcode2);
	}

    getAllCPTCodes(serviceType: string){
		return this.cptCodesDB.getAllcptCodes(serviceType);
	}

    getIcd10codes(serviceType: string){
    	// return this.icd10CodesDB.all();
    	return this.icd10CodesDB.getforIFSP(serviceType);
    }

    getOutcomes(studentId){
        return this.outcomesDB.getOutcomesByStudentId(studentId);
    }

    getObjectives(studentId, outcome){
        return this.outcomesDB.getObjectivesByStudentId(studentId, outcome);
    }


    getActivities(){
   	 return [
   	         {value: 'Activities of Daily Living (ADL)', label: 'Activities of Daily Living (ADL)'},
   	         {value: 'Play/Social', label: 'Play/Social'},
   	         {value: 'Community/Errand', label: 'Community/Errand'},
   	         {value: 'Family Routine', label: 'Family Routine'},
   	         {value: 'Song/Rhyme', label: 'Song/Rhyme'},
   	         {value: 'Book Routines', label: 'Book Routines'},
         	 {value: 'Positive Reinforcement', label: 'Positive Reinforcement'},
         	 {value: 'Modeling', label: 'Modeling'},
         	 {value: 'Cues', label: 'Cues'},
         	 {value: 'Prompts', label: 'Prompts'},
         	 {value: 'Positioning', label: 'Positioning'},
         	 {value: 'Assistive Technology', label: 'Assistive Technology'},
         	 {value: 'Discrete Trial Instructions', label: 'Discrete Trial Instructions'},
         	 {value: 'Other', label: 'Other'}
         	 ];
	}

   getParentCaregiver(){
			return [ 'Observed parent/caregiver child performing activities',
			         'Observed parent/caregiver child during routines',
			         'Parent/Caregiver tried activity, feedback exchanged',
			         'Demonstrated activity to parent/caregiver',
			         'Reiviewed communication tool with parent/caregiver',
			         'Discussed activity with parent/caregiver',
			         'Assisted parent/caregiver',
			         'Modeled explained strategy and provided feedback as parent/caregiver tried the activity with the child',
			         'Gave parent/caregiver a picture illustrating the way to position the child after demonstrating the method',
			         'Generalized strategy to other routines with parent',
			         'Identified methods and sequence of activity for parent/caregiver',
			         'Videotaped learning activity and reviewed with parent/caregiver',
			         'Other'];
    }


   

    validateRegSNOnServer(sn:SessionNote, nav: NavController, errorAlert: Alert){
        return this.eiCallsService.validateRegSN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage, errorAlert)).finally(() => {});
    }
    validateCancelledSNOnServer(sn:SessionNote, nav: NavController, errorAlert: Alert ){
        return this.eiCallsService.validateCancelledN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage, errorAlert));
    }
    validateMakeupSNOnServer(sn:SessionNote, nav: NavController, errorAlert: Alert ){
        return this.eiCallsService.validateMakeupSN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage, errorAlert));
    }

    mapWebSNToSaveSN(webSN: WebSN, sn?: SessionNote): SessionNote{
        return SNMapper.mapWebToSaved(webSN, sn);
    }


    saveSessionNoteToDB(sn: SessionNote){
       if(sn.sessionId > 0)
			return this.snDB.update(sn);//SessionNoteDB.update(sn);
   	   return this.snDB.insert(sn);
    }

    saveExtrasToDB(extras: any[]){
        this.snDB.insertExtra(extras);
    }

    saveAllExtrasToDB(extras: any[], sessionId){
        let batch = new Array<SqlBatch>();
         batch[0] = new SqlBatch("delete from sn_extra where sessionId = ? ",[sessionId]);
         for(let i =0 ;i < extras.length; i++){
             extras[i].sessionId = sessionId;
             batch[i + 1] = this.snDB.prepareExtraInsert(extras[i]);
         }
         return  this.db.sqlBatch(batch);
    }

    // deleteExtras(sessionID){
    //     return this.snDB.dele
    // }

    getSessionExtras(sessionId){
        return this.snDB.getSessionExtras(sessionId);
    }


    submitRegSNToServer(sn:SessionNote, nav: NavController ){
        return this.eiCallsService.sendRegSN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage));
    }
    submitCancelledSNToServer(sn:SessionNote, nav: NavController ){
        if(!sn.dateOfAbsent) sn.dateOfAbsent = sn.sessionDate;
        return this.eiCallsService.sendCancelledSN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage));
    }
    submitMakeupSNToServer(sn:SessionNote , nav: NavController){
        return this.eiCallsService.sendMakeupSN(sn).map(res => res.json()).catch((error) => Utils.handleError(error, nav, LoginPage));
    }

    deleteSN(session: SessionNote){
        this.snDB.deleteById(session.sessionId).then(
            (data) =>{
                //console.log(data);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    deleteSNById(sessionId: number){
        return this.snDB.deleteById(sessionId)
    }

    insertHistory(hist){
        return this.snDB.insertHistory(hist);
    }

    updateCanceledCount(count, ifspId){
        return this.ifspDB.updateCanceledCount(count, ifspId);
    }


   populateExtra(extra: any, sn: WebSN){
        switch (extra.fieldType){
          case "ACTIVITY": 
            if(!sn.activities)
               sn.activities = new Array();
            sn.activities[sn.activities.length] = extra.fieldValue;
            break;
          case "OBJECTIVE":
            if(!sn.objectives)
               sn.objectives = new Array();
            sn.objectives[sn.objectives.length] = extra.fieldValue;
            break;
          case "COACH_PARENT":
            if(!sn.parentCaregiver)
               sn.parentCaregiver = new Array();
            sn.parentCaregiver[sn.parentCaregiver.length] = extra.fieldValue;
            break;
          case "COACH_PARENT":
            if(!sn.parentCaregiver)
               sn.parentCaregiver = new Array();
            sn.parentCaregiver[sn.parentCaregiver.length] = extra.fieldValue;
            break;
        }
   }

  setValidationFunctions(sn: SessionNote, callback: Function){
       let sessionValidations: { (sn: SessionNote, callback: Function): void; } [] = [];

       switch(sn.sessionType){
           case Constants.REGULAR_SESSION:
               sessionValidations.push(() => {this.validateMissingSessions(sn, callback)});
               sessionValidations.push(() => {this.checkForMaxSessions(sn, callback)});
               //checkForMaxSessions
               break;
           case Constants.MAKEUP_SESSION:
               sessionValidations.push(() => {this.validateMissingSessions(sn, callback)});
               //sessionValidations.push(() => {this.validateMaxMakeupSessions(sn, callback)});
               
               break;
           case "Cancelled":
               sessionValidations.push(() => {this.checkForMaxSessions(sn, callback)});
           break;
       }
       return sessionValidations;
   }
   finalValidationBeforeSubmit(sn: SessionNote, callback: Function){

       let arr = this.setValidationFunctions(sn, callback);
      for(let i =0; i < arr.length; i++){
          let c = arr[i];
          c(sn, callback)
      }
      return arr.length;
   }

   validateMissingSessions(sn: SessionNote, callback: Function) {
       let validation: Validation =  new Validation();
       this.adhocDB.getMissingSessions(sn.ifspId).then (
         (data)=> {
             if(data.rows.length > 0){
                 let missingCount= 0;
                 validation.hasError = true;
                 console.log(data.rows);
                 for(let i =0; i < data.rows.length; i++){
                    let item = data.rows.item(i);
                    missingCount += item.missing;
                    validation.missingTotal += item.missing;
                    validation.errorList[validation.errorList.length] = "You have missed "+item.missing+" session(s) of "+item.serviceDaysPerWeek+" approved for the week of "+Utils.getFormattedDateAndTime(new Date(item.WeekOf), "MM/DD/YYYY")
                 }
             }
             callback(validation);
         },
         (error) => {console.error(error);callback(new Validation(true, ["An error occured while submitting the session note to Challenge. Please try again later"]));}
     );
   }



   checkForMaxSessions(sn: SessionNote, callback: Function){
         //this.ifspDB.all().then((d) => console.log(d.rows));
         this.adhocDB.getSelectStudents(sn.studentId).then(
             (data) => {
                 if(data.rows.length === 0){
                     //callback(new Validation(true, ["An error occured while submitting the session note to Challenge. Please try again later"]));
                     //return;
                     callback(new Validation());
                     return;
                 }
                   
                 let selectedStudent = data.rows.item(0);
                 let weekMax = selectedStudent.serviceDaysPerWeek;
                 let monthMax = selectedStudent.frequencyPerMonth;
                 let maxSessions = selectedStudent.totalBillingServiceUnits;

                 let monthCount = selectedStudent.sessionCountThisMonth;
                 let weekCount = selectedStudent.sessionCountThisWeek;
                 let sessionCountIfspId = selectedStudent.sessionCountIfspId;
                 let currentWeek = Utils.getWeekOfYear(new Date());
                 let currentMonth = Utils.getMonthOfYear(new Date());

                 let message = "You have already reached the mandate approved for this ";
                 let end = null;

                 let validation = new Validation();

                 if (weekMax > 0 && weekCount >= weekMax)
                     end = "Week";
                 else if (monthMax > 0 && monthCount >= monthMax)
                     end = "Month";
                 message = message + end;

                 if (sessionCountIfspId >= maxSessions) {
                     message = "You have already completed the mandate approved for this IFSP";
                     end = "Empty";
                 }

                 if (!Utils.isEmpty(end))
                 {
                     validation.hasWarning = true;
                     validation.warningList[0] = message + ". Click continue to create a session note. Please be aware that the Session Note will require approval";
                 }
                 callback(validation);
             },
             (error) => {console.error(error);callback(new Validation(true, ["An error occured while submitting the session note to Challenge. Please try again later"]));}
         );
  }

  validateMaxMakeupSessions(sn: SessionNote, callback: Function){
      this.adhocDB.getSelectStudents(sn.studentId).then(
             (data) => {
                 if(data.rows.length === 0){
                     callback(new Validation(true, ["An error occured while submitting the session note to Challenge. Please try again later"]));
                     return;
                 }
              let selectedStudent = data.rows.item(0);
              let validation = new Validation();
              if(selectedStudent.makeUps <= selectedStudent.makeupCount){
                     validation.hasWarning = true;
                     validation.warningList[0] ="You have already completed the maximum approved makeup sessions for this IFSP. Click continue to create a session note. Please be aware that the Session Note will require approval";
              }
              callback(validation);
          },
          (error) => {console.error(error);callback(new Validation(true, ["An error occured while submitting the session note to Challenge. Please try again later"]));}
      );
  }




   alertUserWithValidationResults(finalValidations: Array<Validation>,submitted: boolean, alertCtrl: AlertController, callback?: Function){
     console.log(finalValidations);
     let val = new Validation();
     for(let i =0;i < finalValidations.length; i++){
       let v = finalValidations[i];
       if(v.hasError && v.hasError === true){
           if(v.missingTotal && v.missingTotal > 0)
             val.missingTotal += v.missingTotal;
          val.hasError = v.hasError;
          for(let j =0; j < v.errorList.length; j++)
             val.errorList[val.errorList.length] = v.errorList[j];
       }
       if(v.hasWarning && v.hasWarning === true){
          val.hasWarning = v.hasWarning;
          for(let j =0; j < v.warningList.length; j++)
            val.warningList[val.warningList.length] = v.warningList[j];
       }
     }
     finalValidations.length = 0;
     this.alertUserWithValidationResult(val,submitted, alertCtrl, callback);
   }
   alertUserWithValidationResult(val: Validation,submitted: boolean, alertCtrl: AlertController, callback?: Function, noErrorAlert?: Alert){
      if(val.hasError){
          let alertMessage = "<ul type='circle'>", title = "Missing/Incomplete data";
          let subTitle = "The following item(s) need to be corrected prior to submitting the session note:";
          if (val.missingTotal && val.missingTotal > 0) {
              subTitle = "Sorry! You cannot submit new Session Notes now. You must first submit Cancelled Sessions Notes for "+val.missingTotal+" Missed Sessions, prior to submitting new notes";
              title = "Missing Session notes";
          }
          for (var i = 0; i < val.errorList.length; i++) {
              alertMessage += "<li>" + val.errorList[i] + "</li>";
          }
          alertMessage += "</ul>";

          let alert = alertCtrl.create({
              title: title,
              subTitle: subTitle,
              message: alertMessage,
              buttons: ['OK']
          });
          alert.present();
          return;
     }
     if(val.hasWarning){
          let alertMessage = "The following are issues you may want to correct in the session note: <ul type='circle'>";
          if(submitted)
             alertMessage = "The following are issues that caused the Session Note to need approval: <ul type='circle'>";
	    	  for(var i =0 ; i < val.warningList.length; i++){
	    		  alertMessage += "<li>"+val.warningList[i]+"</li>";
	    	  }
	    	  alertMessage += "</ul>";
         let alert = alertCtrl.create({
            title: 'Session Note warning',
            message: alertMessage,
            buttons: [
            {
                text: 'Fix',
                role: 'cancel'
            },{
                text: 'Ignore',
                handler:  () =>{if(callback)callback();}
             }
          ]
         });
         alert.present();
     }else if(noErrorAlert){
        noErrorAlert.present();
     }else
       if(callback)
         callback();
   }

   updateCountsForIFSP(ifspId, mandate: Mandate) {
    //    let date: Date = new Date(session.sessionType === 'Cancelled' ? session.dateOfAbsent : session.sessionDate);
    //    let sWeek = Utils.getWeekOfYear(date);
    //    let currentWeek: boolean = sWeek == Utils.getWeekOfYear(new Date());
       return this.adhocDB.updateCountsForIFSP(ifspId, mandate);
   }

   addOneForIfsp(ifspId){
       return this.adhocDB.addOneForIfsp(ifspId);
   }

   alertMandate(sn: SessionNote, alertCtrl: AlertController, callBack?: Function) {
       this.adhocDB.getSelectStudents(sn.studentId).then(
           (data) => {
               let selectedStudent = data.rows.length > 0 ? data.rows.item(0) : [];
               let approved = selectedStudent.serviceDaysPerWeek;
               let weekCount = selectedStudent.sessionCountThisWeek;
               let title = "Session Note Saved";
               let message = "";
               if (!approved || !weekCount || weekCount == null || sn.sessionType === Constants.MAKEUP_SESSION) {
                   message = "The session note was successfully submitted! Click ok to return to the home screen";
               } else if (weekCount < approved) {
                   message = "You have completed session " + weekCount + " of " + approved + " approved for this week.";
               } else if (weekCount >= approved)
                   message = "You have completed all the sessions approved for this week";
               try {
                   let alert = alertCtrl.create({
                       title: title,
                       message: message,
                       buttons: [{
                           text: 'OK',
                           handler: () => { if (callBack) callBack();}
                       }]
                   });
                   alert.present();
               } catch (e) { console.error(e); }
           }
       );
   }

   presentSessionCompletedToast(toastCtrl: ToastController){
     let toast = toastCtrl.create({
      message: 'Please be sure to go to the Webmaster to print your Session Notes',
      duration: 2000,
      position: "top"
    });
    toast.present();
   }



   submitToServer(session: SessionNote, nav: NavController): Observable<Response>{
       switch(session.sessionType)
        {
            case Constants.REGULAR_SESSION:
                return this.submitRegSNToServer(session, nav).catch((error) => Utils.handleError(error, nav, LoginPage));
            case Constants.CANCELLED_SESSION:
                return this.submitCancelledSNToServer(session, nav).catch((error) => Utils.handleError(error, nav, LoginPage));
            case Constants.MAKEUP_SESSION:
                return this.submitMakeupSNToServer(session, nav).catch((error) => Utils.handleError(error, nav, LoginPage));
        }
   }



}