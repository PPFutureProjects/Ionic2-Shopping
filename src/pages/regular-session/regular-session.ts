import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, Loading, ToastController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dialogs, ScreenOrientation, Network } from 'ionic-native';



import {Student} from '../../beans/student.bean';
import {Employee} from '../../beans/employee.bean';
import {SessionNote} from '../../beans/sessionNote.bean';
import {WebSN} from '../../beans/WebSN.bean';
import {Validation} from '../../beans/Validation.bean';

import {RegularSNService} from '../../providors/RegularSN.service'
import {Utils} from '../../utils'
import {SignatureFieldComponent} from '../../app/signature-field/signature-field.component'
import {ReviewSavedPage}  from '../review-saved/review-saved';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'regular-session.html',
  providers: [RegularSNService, SignatureFieldComponent]
})
export class RegularSessionPage {
  @ViewChild('form') form;
	
	selectedIcd10Code;
  icd10Codes =  [];
	//selectedIcd10Code2 = {};
  cptCodes = [];
  hcpcsCodes = [];
  outcomes = [];
  objectives = [];
  activities = [];
  parentCaregiver = [];
  //sigWidth = $window.innerWidth - 15 ;
  //selectedSN: SessionNote = new SessionNote();ß
   sessionForm;
   serverValidation;
   displayFields = true;
   displayTherapistSignature = false;
   displayParentsSignature = false;
   displayFinishedButtons = false;
   pageTitle = "Regular Session";
   pageSubtitle = "";


   selectedSN = new WebSN();
   public signaturePadOptions: Object = {
    'minWidth': .5,
    'minHeight': .5,
    'canvasWidth': window.innerWidth - 100,
    'canvasHeight': (window.innerHeight / 3) //+ (window.innerHeight / 6)
  };

  signedRelationships = ["Parent", "Caregiver", "Other"];

  signatureField: SignatureFieldComponent;
  private sigForm: FormGroup;
  therapistSignedDate: Date;
  sessionNote: SessionNote;

  minDate: string = Utils.getFormattedDateAndTime(Utils.addDaysToDate(new Date(), -4), "YYYY-MM-DD");
  maxDate: string = Utils.getFormattedDateAndTime(new Date(), "YYYY-MM-DD");

  constructor(private fb: FormBuilder, private selectedStudent: Student,private employee: Employee, private navCtrl: NavController, private navParams: NavParams,
     private regularSN : RegularSNService, public alertCtrl: AlertController, private loadController: LoadingController,private toastCtrl: ToastController) {

       this.sessionNote = navParams.get("SessionNote");

        this.init();

        setTimeout(() => {
          this.setupFormValidators();
          this.form.control.valueChanges.subscribe(values => this.saveFormOnChange());
        }, 1500);


        this.sigForm = this.fb.group({
          signatureField: '',
          therapistSignedDate: ''
        });
  }



   init(){
     console.log("in init: "+this.sessionNote.status );
   
  
     if(this.sessionNote.status === 'BEGIN'){
     this.regularSN.getSessionNote(this.sessionNote.sessionId).then(
       (data) =>{
         if(data.rows.length > 0){
           //this.selectedSN = data.rows.item(0);
           let sn: SessionNote = data.rows.item(0);
           this.populateSelected(sn);
           this.setup();
         }else{
          console.log("not found!!!");
        }

       },
       (error) => {

       }
     );
     }else{
       let sn = this.sessionNote;
       let s = this.selectedSN;
       this.regularSN.getSessionExtras(sn.sessionId).then(
         (data) => {
           for(let i =0 ; i < data.rows.length; i++){
             let a = data.rows.item(i);
             this.regularSN.populateExtra(a, this.selectedSN);
           }
           s.serviceType = this.sessionNote.serviceType;
           s.ifspProgress = sn.ifspProgress;
           s.additionalInfo = sn.additionalInfo;
           s.cpt1Unit = Number(sn.cptUnit1);
           s.cpt2Unit = Number(sn.cptUnit2);
           s.cpt3Unit = Number(sn.cptUnit3);
           s.cpt4Unit = Number(sn.cptUnit4);
           s.cptCode1 = sn.cptCode1;
           s.cptCode2 = sn.cptCode2;
           s.cptCode3 = sn.cptCode3;
           s.cptCode4 = sn.cptCode4;
           s.outcomeAndObjectives = sn.outcomeAndObjectives;
           s.status = sn.status;
           console.log(sn);
           s.strategiesBetweenVisits = sn.strategiesBetweenVisits;
           if(!Utils.isEmpty(sn.sessionParticipantsChild))
           s.sessionParticipantsChild = Utils.isTrue(sn.sessionParticipantsChild);
           if(!Utils.isEmpty(sn.sessionParticipantsOther))
           s.sessionParticipantsOther = Utils.isTrue(sn.sessionParticipantsOther);
          if(!Utils.isEmpty(sn.sessionParticipantsParent))
           s.sessionParticipantsParent = Utils.isTrue(sn.sessionParticipantsParent);
           s.sessionParticipantsOtherName = sn.sessionParticipantsOtherName;
           if(sn.timeIn && sn.timeIn > 0)
              s.timeIn = Utils.getFormattedDateAndTime( new Date(sn.timeIn), "HH:mm");
           if(sn.timeOut && sn.timeOut > 0)
              s.timeOut = Utils.getFormattedDateAndTime( new Date(sn.timeOut), "HH:mm");
          s.selectIcdCode = sn.icdCode1;
          s.selectIcdCode2 = sn.otherIcdCode2;
          s.sessionCode = sn.sessionCode;
          s.ifspId = sn.ifspId;
          s.license = this.employee.licenseNumb;
          s.therapistCredentials = this.employee.title;
          
           
          s.studentId = sn.studentId;
          s.status = sn.status;
          s.employeeId = this.employee.employeeId;
          s.sessionDate = Utils.getFormattedDate(new Date(sn.sessionDate));
          s.sessionId = sn.sessionId;
          s.ifspServiceLocation = sn.location;
          this.pageSubtitle = sn.lastName+", "+sn.firstName;
          this.pageTitle += " "+this.pageSubtitle;
          s.serviceDuration = sn.ifspServiceDuration;
          s.dateNoteWritten = Utils.getFormattedDate( new Date(sn.dateNoteWritten));
           Utils.removeAllEmpty(s);
           this.loadOutcomes();
           this.loadActivities();
           this.loadParentCaregiver();
           this.loadIcd10Codes(); //(sn.icdCode1, sn.otherIcdCode2);
           this.loadCptCodes();
           if(!Utils.isEmpty(s.outcomeAndObjectives))
              this.outcomeSelected(s.outcomeAndObjectives);
           console.log(this.selectedSN);
         },
         (error) => console.error(error)
       );

     }
   }


   populateSelected(sn: SessionNote){
          this.selectedSN.studentId = sn.studentId;
          this.selectedSN.status = sn.status;
          this.selectedSN.employeeId = this.employee.employeeId;
          this.selectedSN.sessionDate = Utils.getFormattedDate(new Date(sn.sessionDate));
          this.selectedSN.sessionId = sn.sessionId;
          this.pageSubtitle = sn.lastName+", "+sn.firstName;
          this.pageTitle += " "+this.pageSubtitle;
          this.selectedSN.ifspId = sn.ifspId;
          
   }



   setup(){
    Utils.removeAllEmpty(this.sessionNote);
     let sn = this.selectedSN;
     if(sn.status || sn.status == null || sn.status === 'BEGIN' ||  sn.status === 'undefined'){
         sn.status = 'EDITING';
         sn.dateNoteWritten = Utils.getFormattedDate(new Date());
         
         this.regularSN.getIfsp(this.sessionNote.ifspId).then(
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
console.log(ifsp);                  
                  this.selectedSN.timeIn =  Utils.getFormattedDateAndTime( Utils.getTimeWithMinutes( ifsp.serviceMinutes *  -1), "HH:mm");
                  this.selectedSN.timeOut =  Utils.getFormattedDateAndTime( Utils.getTimeWithMinutes(0), "HH:mm");
            		  //sn.serviceMethodType = ifsp.serviceMethodType;
            		  this.selectedSN.ifspServiceLocation = ifsp.locationDesc;
                  this.selectedSN.license = this.employee.licenseNumb;
                  this.selectedSN.therapistCredentials = this.employee.title;
                  this.selectedSN.sessionCode = ifsp.sessionCode;

            		  this.loadIcd10Codes(); //(sn.icdCode1, sn.otherIcdCode2);
            		  this.loadCptCodes();

                  //this.regularSN.setupDatesForDisplay(sn);
             }

           },
           (error) =>{
             console.error(error);
           }
         );
     }
     this.loadOutcomes();
     this.loadActivities();
     this.loadParentCaregiver();
   }

   loadIcd10Codes(){
     this.regularSN.getIcd10codes(this.selectedSN.serviceType).then(
       (data) =>{
         if(data.rows.length > 0){
           for(let i =0 ; i < data.rows.length; i++){
             this.icd10Codes.push(data.rows.item(i));
           }
         }
       },
       (error) => {
         console.error(error);
       }
     );
   }


   loadCptCodes(){
    //  this.selectedSN.cptCode1 = "";
    //  this.selectedSN.cptCode2 = "";
    //  this.selectedSN.cptCode3 = "";
    //  this.selectedSN.cptCode4 = "";

     this.regularSN.getCPTCodes(this.selectedSN.serviceType, this.selectedSN.selectIcdCode, this.selectedSN.selectIcdCode2).then(
       (data) => {
         console.log(data);
			  if(data.rows.length > 0){
				 this.setCPTResults(data);
			  }else{
				   this.regularSN.getAllCPTCodes(this.selectedSN.serviceType).then(
           (data1) => {
					  if(data1.rows.length > 0)
						   this.setCPTResults(data1);
				    },
            (error) => {
              console.error(error);
            });
			   }
       },
       (error) => {
         console.error(error);
       }
     );

   }



   setCPTResults(res){
      this.cptCodes = [];
		  for(let i = 0; i < res.rows.length; i++){
	    	this.cptCodes.push(res.rows.item(i).cptCode);
		  }
    }


   icd10Selected(){
     this.loadCptCodes();
   }

   cptSelected(cpt){

   }

   loadOutcomes(){
     this.regularSN.getOutcomes(this.selectedSN.studentId).then(
       (data) => {
         for(let i = 0; i < data.rows.length; i++){
	    	   this.outcomes.push(data.rows.item(i));
		     }
       },
       (error) => {
         console.log(error);
       });
     
 
   }

   outcomeSelected(outcome){
     this.regularSN.getObjectives(this.selectedSN.studentId, outcome).then(
       (data) => {
         for(let i = 0; i < data.rows.length; i++){
           var item = data.rows.item(i);
           if(item.objective1)
             this.objectives.push(item.objective1);
           if(item.objective2)
             this.objectives.push(item.objective2);
           if(item.objective3)
             this.objectives.push(item.objective3);
           if(item.objective4)
             this.objectives.push(item.objective4);
           if(item.objective5)
             this.objectives.push(item.objective5);
		     }
       },
       (error) => {
         console.log(error);
       }
     );
   }

   objectivesSelected(){
   }

   loadActivities(){
     this.activities = this.regularSN.getActivities();
   }

   loadParentCaregiver(){
     this.parentCaregiver = this.regularSN.getParentCaregiver();
   }

   saveAndSign(form){
     let validation = this.validateSessionNote();

      if(validation.hasError){
        this.regularSN.alertUserWithValidationResult(validation,false, this.alertCtrl);
      }else{
        if(validation.hasWarning)
          this.regularSN.alertUserWithValidationResult(validation,false, this.alertCtrl, () => {this.saveToDb()});
        else
          this.saveToDb();
      }
   }

   saveToDb(){
     this.regularSN.mapWebSNToSaveSN(this.selectedSN, this.sessionNote);
     //this.currentSN = sn;
     this.sessionNote.status = 'NOT_SIGNED';
     Utils.removeAllEmpty(this.sessionNote);
     this.regularSN.saveSessionNoteToDB(this.sessionNote).then(
       (data) => {
         this.sessionNote.sessionId = data.insertId;
         for(let extra of this.sessionNote.extraValues){
           extra.sessionId = this.sessionNote.sessionId;
           this.regularSN.saveExtrasToDB(extra);
         }
         this.displayFields = false;
         this.displayTherapistSignature = true;
         this.displaySignature();
       },
       (error) => {
         console.log(error);
       });


   }

   setupFormValidators(){
      let fg = (this.form.form as FormGroup);
      fg.get("ifspProgress").setValidators(Validators.required);
   }
   
   validateSessionNote(): Validation{

      let fg = (this.form.form as FormGroup)
      

     let validation = new Validation();
      let errCount = 0;
      let sn = this.selectedSN;
      if(Utils.isEmptyArr(sn.activities)){
         validation.errorList[validation.errorList.length] = "At least 1 activity should be selected";
         fg.get("activties").setErrors({"At least 1 activity should be selected": true});
      }

      if(!sn.sessionParticipantsChild && !sn.sessionParticipantsParent && !sn.sessionParticipantsOther)
         validation.errorList[validation.errorList.length] = "At least 1 session participants should be selected";
      else if(sn.sessionParticipantsOther && Utils.isEmpty(sn.sessionParticipantsOtherName))
         validation.errorList[validation.errorList.length] = "Session Participants Other Name is required when the participants other is selected";

      if((!sn.selectIcdCode || sn.selectIcdCode.trim() == '') && (!sn.selectIcdCode2 || sn.selectIcdCode2.trim() == '')){
   			validation.errorList[validation.errorList.length] = "At lease 1 ICD10 Code must be selected";
   		 }
		  var duration = sn.serviceDuration;
		  if(duration && duration > 0){
			  let totalUnits: number = Utils.getTotal(sn.cpt1Unit,sn.cpt2Unit, sn.cpt3Unit ,sn.cpt4Unit  ,sn.hcpcsUnit );
			  var requiredUnits = Math.floor(duration / 15);
			  if(totalUnits < requiredUnits){
		   			validation.errorList[validation.errorList.length] = requiredUnits+ " CPT units are required for a "+ duration+" minute session";
			  }
		  }
      
      if(((sn.cpt1Unit > 0 && Utils.isEmpty(sn.cptCode1)) || (!Utils.isEmpty(sn.cptCode1) && sn.cpt1Unit == 0) ) ||
         ((sn.cpt2Unit > 0 && Utils.isEmpty(sn.cptCode2)) || (!Utils.isEmpty(sn.cptCode2) && sn.cpt2Unit == 0) ) ||
         ((sn.cpt3Unit > 0 && Utils.isEmpty(sn.cptCode3)) || (!Utils.isEmpty(sn.cptCode3) && sn.cpt3Unit == 0) ) ||
         ((sn.cpt4Unit > 0 && Utils.isEmpty(sn.cptCode4)) || (!Utils.isEmpty(sn.cptCode4) && sn.cpt4Unit == 0) ) ){
        validation.errorList[validation.errorList.length] = "Please enter both the CPT code and Unit";
      }

      if(Utils.isEmpty(sn.ifspProgress))
        validation.errorList[validation.errorList.length] = "IFSP Progress is required";

      if(Utils.isEmpty(sn.strategiesBetweenVisits))
        validation.errorList[validation.errorList.length] = "Strategies Between Visits is required";

      if(Utils.isEmpty(sn.outcomeAndObjectives))
        validation.errorList[validation.errorList.length] = "Outcomes is required";

      if(Utils.isEmptyArr(sn.objectives))
        validation.errorList[validation.errorList.length] = "At least 1 objective is required";
      
      if(Utils.isEmptyArr(sn.parentCaregiver))
        validation.errorList[validation.errorList.length] = "At least 1 Coach Parent/Caregiver is required";


      var timeIn = Utils.getDateFromString(sn.timeIn, "HH:mm");
      var timeOut = Utils.getDateFromString(sn.timeOut, "HH:mm");

      var diff = Utils.getMinutesDiff(timeOut, timeIn);
      if(diff < duration){
		   			validation.hasError = true;
		   			validation.errorList[validation.errorList.length] = " Session needs to be at least "+ duration+" minutes";
      }

      if(Utils.isNonBusinessHours(timeIn) || Utils.isNonBusinessHours(timeOut)){
		   			validation.warningList[validation.warningList.length] = "Session is not between 7AM and 9 PM. Are you sure?";
      }
      validation.hasError = validation.errorList.length > 0;
      validation.hasWarning = validation.warningList.length > 0;
      return validation;
   }

   verifyForm(form){
     let validation = this.validateSessionNote();
     console.log(validation);
      if(validation.hasError){
        this.regularSN.alertUserWithValidationResult(validation,false, this.alertCtrl);
      }else{
        if(validation.hasWarning){
          this.regularSN.alertUserWithValidationResult(validation,false, this.alertCtrl, () => {
                  let s = this.regularSN.mapWebSNToSaveSN(this.selectedSN);
                  this.validateOnServer(s);
          });

        }else{
          if (this.checkForInternetConnection('You are not connected to the internet. Please click Save & Sign to save your session note now. Your session will be verified when you Submit')) {
            let s = this.regularSN.mapWebSNToSaveSN(this.selectedSN);
            this.validateOnServer(s);
          }
      }

     }
   }



   validateOnServer(sn: SessionNote) {
     let loading = this.loadController.create({
       content: 'Submitting Session Note to Challenge for validation. Please wait...'
     });
     loading.present();
     Utils.removeAllEmpty(sn);
     this.regularSN.validateRegSNOnServer(sn, this.navCtrl, Utils.getAlertWithGenericSubmissionError(this.alertCtrl, loading)).subscribe(
       data => this.serverValidation = data,
       err => this.serverValidation = err,
       () => {
         console.log(this.serverValidation);
         loading.dismiss();
         this.displayServerValidation();
       }
       );
   }

   displayServerValidation(){
     this.regularSN.alertUserWithValidationResult(this.serverValidation,false, this.alertCtrl, null, 
        this.alertCtrl.create({
           subTitle: "Session Note is valid. Please click on Save & Sign to continue",
           title: "Session Note",
           buttons: ['OK']
        }));
   }

   saveCount = 0;


   saveFormOnChange(){ 
      this.saveCount++;
      let count = this.saveCount;
      setTimeout(() => {
          if(count === this.saveCount){
            this.timeSaveOnchange();
          }
      }, 200);
   }

   isValid(field: string) {
      if(!this.form) return true;
      let fg = (this.form.form as FormGroup)
      
      let formField = fg.get(field)
      return formField.valid || formField.pristine;
    }

   timeSaveOnchange(){
     this.regularSN.mapWebSNToSaveSN(this.selectedSN, this.sessionNote);
     this.sessionNote.status = 'EDITING';
     Utils.removeAllEmpty(this.sessionNote);
     this.regularSN.saveSessionNoteToDB(this.sessionNote).then( (d)=> {
       this.regularSN.saveAllExtrasToDB(this.sessionNote.extraValues, this.sessionNote.sessionId ).then((d)=>{}, (e)=> console.error(e));
     }, (e) => console.error(e));

   }


   displaySignature(){
     this.checkForInternetConnection('You are not connected to the internet. Please remember to Submit your Session Note when your device is connected to the internet.')
     let endTime = Utils.getDateFromString(this.selectedSN.timeOut, "HH:mm");
     endTime.setMinutes(endTime.getMinutes() + 1);
     this.selectedSN.therapistSignatureDate = Utils.getFormattedDateAndTime(endTime, "MM/DD/YY");
     this.pageTitle = "Therapist Signature";
     this.lockOrientation();
   }

  public setSignatureFieldComponent(signatureField: SignatureFieldComponent){
    this.signatureField = signatureField;
  }

  lockOrientation(){
    try{
      ScreenOrientation.lockOrientation('landscape');
    }catch(e){}
  }
  unLockOrientation(){
    try{
      ScreenOrientation.unlockOrientation();
    }catch(e){}
  }

  public clearSignature(){
    if(this.signatureField)
      this.signatureField.clearSignature();
  }


  public saveSignature(){
    
    if(this.signatureField){
     if(this.signatureField.signaturePad.isEmpty()){
          this.regularSN.alertUserWithValidationResult(new Validation(true, ["Signature cannot be empty"]),false,this.alertCtrl);
          return;
      }
      if(this.displayTherapistSignature){
        this.selectedSN.therapistSignature = this.signatureField.signature;
        this.displayTherapistSignature = false;
        this.displayParentsSignature = true;
        this.clearSignature();
        this.selectedSN.parentSignatureDate = Utils.getFormattedDateAndTime(new Date(), "MM/DD/YY");
        this.pageTitle = "Parent/Caregiver Signature";
      }else{
        this.selectedSN.parentSignature  = this.signatureField.signature;
        let sn = this.sessionNote; //for quicker typing
        let wsn = this.selectedSN;//^^
        if(Utils.isEmpty(wsn.signedRelationship)){
          this.regularSN.alertUserWithValidationResult(new Validation(true, ["Relationship to child must be selected"]),false,this.alertCtrl);
          return;
        }else if(wsn.signedRelationship === 'Other' && Utils.isEmpty(wsn.signedRelationshipOther)){
          this.regularSN.alertUserWithValidationResult(new Validation(true, ["Other Relationship to child must be entered"]),false,this.alertCtrl);
          return;
        }
        sn.therapistSignature = wsn.therapistSignature;
        sn.therapistSignatureDate = Utils.getDateFromDateAndTime(wsn.therapistSignatureDate).getTime();
        sn.parentSignatureDate = Utils.getDateFromDateAndTime(wsn.parentSignatureDate).getTime();
        sn.parentSignature = wsn.parentSignature;
        sn.signedRelationship = wsn.signedRelationship;
        sn.signedRelationshipOther = wsn.signedRelationshipOther;
        sn.status = 'PARENT_SIGNED';

        this.unLockOrientation();

        this.regularSN.saveSessionNoteToDB(this.sessionNote).then(
          (data) => {
             this.displayParentsSignature = false;
             this.displayFinishedButtons = true;
          }
        );
      }
    }
  }

  backSignature(){
    this.clearSignature();
    if(this.displayParentsSignature){
      this.displayParentsSignature = false;
      this.displayTherapistSignature = true;
      this.selectedSN.parentSignature = null;
      this.selectedSN.parentSignatureDate = null;
     this.pageTitle = "Therapist Signature";
      this.selectedSN.signedRelationship = null;
    }else if(this.displayTherapistSignature){
      this.displayTherapistSignature = false;
      this.selectedSN.therapistSignature = null;
      this.selectedSN.therapistSignatureDate = null;
      this.displayFields = true;
      this.pageTitle  = "Regular Session "+this.pageSubtitle;
      this.unLockOrientation();
    }
  }

  validationCount = 100;
  finalValidations: Array<Validation> = new Array();

  finalValidation(){
    console.log("In finalValidation 0");
    this.validationCount = this.regularSN.finalValidationBeforeSubmit(this.sessionNote, (validation) => this.finalValidationCallback(validation));
    setTimeout(() => {
        this.checkForFinalValidation();
      }, 200);
  }

  checkForFinalValidation(){
     console.log("in checkForFinalValidation: "+this.validationCount+", >>"+this.finalValidations.length)
     if(this.validationCount > this.finalValidations.length){
    setTimeout(() => {
        this.checkForFinalValidation();
      }, 200);
      return;
     }
     for(let i =0 ;i < this.finalValidations.length; i++)
        if(this.finalValidations[i].hasWarning)
          this.sessionNote.timecardStatus = "Pending Approval";
     this.regularSN.alertUserWithValidationResults(this.finalValidations,false, this.alertCtrl, () => {this.submitSN();});

  }
  finalValidationCallback(validation? : Validation){
     if(validation)
       this.finalValidations[this.finalValidations.length] = validation;
  }

  submitSN() {
    if(!this.checkForInternetConnection('You are not connected to the internet. Please remember to Submit your Session Note when your phone is connected to the internet.')) 
      return;
    let loading = this.loadController.create({
      content: 'Submitting Session Note to Challenge. Please wait...'
    });
    loading.present();



    this.regularSN.submitRegSNToServer(this.sessionNote, this.navCtrl).subscribe(
      data => this.serverValidation = data,
      err => this.serverValidation = err,
      () => {
        loading.dismiss();
              if(this.serverValidation.hasError === true){
                this.regularSN.alertUserWithValidationResult(this.serverValidation, true, this.alertCtrl);
                return;
              }else if(this.serverValidation.hasWarning === true){
                this.regularSN.alertUserWithValidationResult(this.serverValidation,true, this.alertCtrl);
              }
            this.regularSN.presentSessionCompletedToast(this.toastCtrl);
            this.sessionNote.cardId =  this.serverValidation.timeCardId;
            this.sessionNote.appSessionId =  this.serverValidation.appSessionId;
            this.sessionNote.rate = this.serverValidation.mandate.rate;
            this.regularSN.insertHistory(this.sessionNote).then((d)=>{}, (e)=>console.log(e));
            this.regularSN.deleteSNById(this.sessionNote.sessionId).then((d)=>console.log("deleted"), (e)=>console.log(e));
            this.regularSN.updateCountsForIFSP(this.sessionNote.ifspId, this.serverValidation.mandate).then(
          (data) => {
            this.regularSN.alertMandate(this.sessionNote, this.alertCtrl, ()=> {this.navCtrl.popToRoot();});
          }
        );
      }
    );
  }


  reviewAll(){
    this.navCtrl.push(ReviewSavedPage);
  }

  startNew(){
    this.navCtrl.push(HomePage);
  }



   onSubmit(){
     console.log("Submitted.....");
   }

   confirmSessionnoteToday(callBack?: Function){
     let d = this.selectedSN.sessionDate;
     if(!Utils.isToday(Utils.getDateFromString(d)) && Utils.isEmpty(this.selectedSN.delayReason)){
        let alert = this.alertCtrl.create({
            title: 'Session Date',
            message: "Please enter a reason for delay ",
            inputs: [{
              name: 'delayReason',
              placeholder: 'Was delayed because...'
            }],
            buttons: [
              {
                text: 'OK',
                handler:  (data) => {
                  if(Utils.isEmpty(data.delayReason))
                    this.confirmSessionnoteToday(callBack);
                    else{
                      this.selectedSN.delayReason = data.delayReason; 
                      if(callBack)callBack();
                    }
                }
             } 
          ]
         });
         alert.present();
     }else if(callBack)callBack();
   }

   checkForInternetConnection(message: string){
    if(!Network || !Network.type) return true;
    if (Network.type !== "unknown" && Network.type !== "none")
      return true;
    let alert = this.alertCtrl.create({
            title: 'No internet connection',
            message: message,
            buttons: ['OK']
          });
    alert.present();
  }

}
