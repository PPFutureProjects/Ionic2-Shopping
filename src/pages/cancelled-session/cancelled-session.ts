import { Component } from '@angular/core';
import { NavController, AlertController, NavParams,LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Student} from '../../beans/student.bean';
import {Employee} from '../../beans/employee.bean';
import {SessionNote} from '../../beans/sessionNote.bean';
import {Validation} from '../../beans/Validation.bean';
import {WebSN} from '../../beans/WebSN.bean';

import {CanceledSNService} from '../../providors/CanceledSN.service'
import {Utils} from '../../utils'
import {SignatureFieldComponent} from '../../app/signature-field/signature-field.component'


import {ReviewSavedPage}  from '../review-saved/review-saved';
import { HomePage } from '../home/home';

class CancelledDate{
  sessionDate: string;
  lastMakeupDate: string;
}

@Component({
  templateUrl: 'cancelled-session.html',
  providers: [CanceledSNService, SignatureFieldComponent]
})
export class CancelledSessionPage {

   pageTitle = "Cancelled Session";
   selectedSN = new WebSN();
   displayFields = true;
   displayTherapistSignature = false;
   displayFinishedButtons = false;
   serverValidation;
   reasons = ['Therapist Cancelled','Therapist Planned Cancelled','Child not Available','Child on Vacation', 'Other'];
   notified: boolean = false;
   notifiedValue: string;
   currentSN: Array<SessionNote> = new Array();
   webSNs: Array<WebSN> = new Array();

   amountOfNotes = [1];
   notesIndex = 0;
   cancelledDates: Array<CancelledDate> = new Array();
   sessionDate: Date;
   sessionNote: SessionNote;


   


  signatureField: SignatureFieldComponent;
  private sigForm: FormGroup;
  therapistSignedDate: Date;
   public signaturePadOptions: Object = {
    'minWidth': .5,
    'minHeight': .5,
    'canvasWidth': window.innerWidth - 50,
    'canvasHeight': (window.innerHeight / 2) + (window.innerHeight / 6)
  };

   constructor(private fb: FormBuilder, private selectedStudent: Student,private employee: Employee,private navCtrl: NavController, private navParams: NavParams,
     private canceledSN : CanceledSNService, public alertCtrl: AlertController, private loadController: LoadingController) {
       this.sessionNote = navParams.get("SessionNote");
       this.init();
        this.sigForm = this.fb.group({
          signatureField: '',
          therapistSignedDate: ''
        });
   }

   init(){
     this.populateSelected(this.sessionNote);
     this.setup();
   }

   setup(){
     let sn = this.selectedSN;
     if(sn.status || sn.status == null || sn.status === 'BEGIN' ||  sn.status === 'undefined'){

         this.canceledSN.getIfsp(this.sessionNote.ifspId).then(
           (ifspData) => {
             if(ifspData.rows.length > 0){ 
                let ifsp = ifspData.rows.item(0);
                  this.selectedSN.ifspId = ifsp.ifspId;
            		  this.selectedSN.serviceBegin = ifsp.serviceBegin;
            		  this.selectedSN.serviceEnd =  ifsp.serviceEnd;
            		  this.selectedSN.serviceType =  ifsp.serviceType;
            		  this.selectedSN.serviceMethodType =  ifsp.serviceMethodType;
            		  this.selectedSN.selectIcdCode =  ifsp.icd10Code.trim();
                  this.selectedSN.serviceDuration = ifsp.serviceMinutes;
            		  //sn.serviceMethodType = ifsp.serviceMethodType;
            		  this.selectedSN.ifspServiceLocation = ifsp.locationDesc;
                  this.selectedSN.license = this.employee.licenseNumb;
                  this.selectedSN.therapistCredentials = this.employee.title;
             }

           },
           (error) =>{
             console.log(error);
           }
         );
     }
   }

    populateSelected(sn: SessionNote){
          this.selectedSN.studentId = sn.studentId;
          this.selectedSN.status = sn.status;
          this.selectedSN.employeeId = this.employee.employeeId;
          this.sessionDate = new Date(sn.sessionDate);
          this.canceledSN.deleteSNById(sn.sessionId); //delete so that there are no duplicates
          this.selectedSN.ifspId = sn.ifspId;
          this.addAnother();
   }


    addAnother(){
     let c = new CancelledDate();
     c.sessionDate = Utils.getFormattedDate(this.sessionDate);
     c.lastMakeupDate = Utils.getFormattedDate(Utils.addDaysToDate(this.sessionDate, 14));
     this.cancelledDates[this.cancelledDates.length] = c;
   }

   sessionDateChanged(){
     for(let i =0 ; i < this.cancelledDates.length; i++){
       let c = this.cancelledDates[i];
       c.lastMakeupDate = Utils.getFormattedDate(Utils.addDaysToDate(Utils.getDateFromString(c.sessionDate), 14));
     }
   }

   removeSessionDate(i: number){
     this.cancelledDates.splice(i, 1);
   }


   validateSessionNote(): Validation{

     let validation = new Validation();

     if(Utils.isEmpty(this.selectedSN.cancelledReason))
         validation.errorList[validation.errorList.length] = "Cancellation reason is required";
     if(Utils.isEmpty(this.selectedSN.otherReason))
         validation.errorList[validation.errorList.length] = "Another reason is required";
     
      validation.hasError = validation.errorList.length > 0;
      validation.hasWarning = validation.warningList.length > 0;

     return validation;
   }

  ionViewLoaded() {

  }

   verifyForm(form){
     let validation = this.validateSessionNote();

      if(validation.hasError){
        this.canceledSN.alertUserWithValidationResult(validation, false, this.alertCtrl);
      }else{
        //if(validation.hasWarning){
        //   this.alertUserWithWarnings(validation, () => {
        //this.confirmNotifiedAndValidate(false);
        //  });

        // }else{
        //this.confirmNotifiedAndValidate(false);
        //}
        let alertMessage = "Session Note is valid. Please click on Save & Sign to continue";
        let title = "Session Note";

        let alert = this.alertCtrl.create({
          title: title,
          subTitle: alertMessage,
          buttons: ['OK']
        });
        alert.present()

     }
   } 
   
   displayServerValidation(){
     this.canceledSN.alertUserWithValidationResult(this.serverValidation, false, this.alertCtrl);
   }



   confirmNotified(callback?: Function){
     if(this.notified){
       if(callback)
         callback();
     }else{
        let alert = this.alertCtrl.create({
            title: 'Notification confirmation',
            message: "Did you notify the parent and the service coordinator?",
            buttons: [
            {
                text: 'No',
                handler:  () => {this.notifiedValue = ""+false; if(callback)callback()}
            },{
                text: 'Yes',
                handler:  () => {this.notifiedValue  = ""+true; if(callback)callback()}
             } 
          ]
         });
         alert.present();
         this.notified = true;
     }
   }






    setupAndSave(){
      for(let i = 0 ; i < this.cancelledDates.length; i++){
        this.webSNs[i] = Utils.clone(this.selectedSN, true);
        this.webSNs[i].sessionDate = this.cancelledDates[i].sessionDate;
        this.webSNs[i].lastMakeupDate = this.cancelledDates[i].lastMakeupDate;
        this.webSNs[i].notified = this.notifiedValue;
        this.webSNs[i].sessionId = 0;
        this.currentSN[i] = this.canceledSN.mapWebSNToSaveSN(this.webSNs[i]);
        this.currentSN[i].dateOfAbsent = this.currentSN[i].sessionDate;
        this.currentSN[i].firstName = this.sessionNote.firstName;
        this.currentSN[i].lastName  = this.sessionNote.lastName;
        this.currentSN[i].sessionType = this.sessionNote.sessionType;
        
        this.saveToDb(i);
      }
    }
 
   validateOnServer(sn: SessionNote){
        Utils.removeAllEmpty(sn);
        this.canceledSN.validateCancelledSNOnServer(sn, this.navCtrl, Utils.getAlertWithGenericSubmissionError(this.alertCtrl)).subscribe(
          data => this.serverValidation = data,
          err => this.serverValidation = err,
          () => this.displayServerValidation()
        );
   }



   saveAndSign(form){
     let validation = this.validateSessionNote();

      if(validation.hasError){
        this.canceledSN.alertUserWithValidationResult(validation, false, this.alertCtrl);
      }else{
        //if(validation.hasWarning)
          //this.alertUserWithWarnings(validation, () => {this.saveToDb()});
        //else
        if('Therapist Planned Cancelled' === this.selectedSN.cancelledReason)
          this.confirmNotified(() => {this.setupAndSave();});
        else{
          this.notifiedValue  = ""+true; 
          this.setupAndSave();
        }
      }
   }

   saveToDb(index: number){
     let webSN = this.webSNs[index];
     let sn = this.currentSN[index];
     //if(!sn)
      //  sn = this.canceledSN.mapWebSNToSaveSN(this.selectedSN);
     sn.status = 'NOT_SIGNED';
     //this.currentSN = sn;
     this.canceledSN.saveSessionNoteToDB(sn).then(
       (data) => {
         sn.sessionId = data.insertId;
         this.displayFields = false;
         this.displayTherapistSignature = true;
         this.displaySignature();
       },
       (error) => {
         console.log(error);
       });
   }

  displaySignature(){
     let endTime = Utils.getDateFromString(this.selectedSN.timeOut, "HH:mm");
     endTime.setMinutes(endTime.getMinutes() + 1);
     this.selectedSN.therapistSignatureDate = Utils.getFormattedDateAndTime(endTime, "MM/DD/YY");
     this.pageTitle = "Therapist Signature";
   }

  public setSignatureFieldComponent(signatureField: SignatureFieldComponent){
    this.signatureField = signatureField;
  }

  public clearSignature(){
    if(this.signatureField)
      this.signatureField.clearSignature();
  }

  backSignature(){
    this.clearSignature();
    if(this.displayTherapistSignature){
      this.displayTherapistSignature = false;
      this.selectedSN.therapistSignature = null;
      this.selectedSN.therapistSignatureDate = null;
      this.displayFields = true;
      this.pageTitle  = "Cancelled Session"
    }
  }

  public saveSignature(){
    if (this.signatureField) {

      if (this.signatureField.signaturePad.isEmpty()) {
        this.canceledSN.alertUserWithValidationResult(new Validation(true, ["Signature cannot be empty"]), false, this.alertCtrl);
      }
      if (this.displayTherapistSignature) {
        this.selectedSN.therapistSignature = this.signatureField.signature;
        for (let i = 0; i < this.cancelledDates.length; i++) {
          let sn = this.currentSN[i];
          let wsn = this.webSNs[i];
          sn.therapistSignature = this.selectedSN.therapistSignature;
          sn.therapistSignatureDate = Utils.getDateFromDateAndTime(this.selectedSN.therapistSignatureDate).getTime();
          wsn.status = 'THERAPIST_SIGNED';
          sn.status = 'THERAPIST_SIGNED';
          this.canceledSN.saveSessionNoteToDB(sn).then(
            (data) => {
              this.displayTherapistSignature = false;
              this.displayFinishedButtons = true;
            }
          );
        }
      }
    }
  }

  submitted = 0;
  loading;
  errors:Array<any> = new Array();

  submitSN(){

    this.loading = this.loadController.create({
      content: 'Submitting Session Note to Challenge. Please wait...'
    });
    this.loading.present();
       for(let i = 0 ; i < this.cancelledDates.length; i++){
         let sn = this.currentSN[i];

         Utils.removeAllEmpty(sn);
         let serverValidation;
          this.canceledSN.submitCancelledSNToServer(sn, this.navCtrl).subscribe(
            data => serverValidation = data,
            err => serverValidation = err,
            () => {
              this.submitted++;
              console.log(serverValidation);
              if(serverValidation.hasError === true){
                this.errors.push({
                  sn: sn,
                  validation: serverValidation
                });
              }else{
                sn.absentCardId =  serverValidation.timeCardId;
                sn.appSessionId =  serverValidation.appSessionId;
              }
              this.alertSubmitted(sn.ifspId, serverValidation.mandate);
              this.canceledSN.snSubmitted(sn, serverValidation.mandate);
              //this.canceledSN.deleteSN(sn);
            }
          );
       }
  }

  alertSubmitted(ifspId, mandate){
    if (this.submitted >= this.currentSN.length) {
        this.loading.dismiss();
      if (Utils.isEmptyArr(this.errors)) {
        if (mandate)
          this.canceledSN.updateMandate(ifspId, mandate);
        this.canceledSN.alertSubmitted(this.submitted, this.alertCtrl)
          .then(() => this.navCtrl.popToRoot());
      } else {
        console.log(this.errors);
        let title =  "Missing/Incomplete data";
        let subTitle = "There was an error while submitting the Session Note(s). Once the error is corrected you could go to the Review Saved screen and resubmit the session.";
        let message = "<br />";
        for(let i =0 ; i < this.errors.length; i++){
          let err = this.errors[i];
          message += "<div style='font-weight:bold !important'>Cancelled Note submitted for "+Utils.getFormattedDateAndTime(new Date(err.sn.sessionDate), "MM/DD/YYYY")+" had the following error(s):</div> <ul type='circle'>";
          for(let j =0 ; j < err.validation.errorList.length; j++){
	    		  message += "<li>"+err.validation.errorList[j]+"</li>";
	    	  }
	    	  message += "</ul>";
        }
        let alert = this.alertCtrl.create({
           title: title,
           subTitle: subTitle,
           message: message,
           buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  

  reviewAll(){
    this.navCtrl.push(ReviewSavedPage);
  }

  startNew(){
    this.navCtrl.setRoot(HomePage);
  }

}
