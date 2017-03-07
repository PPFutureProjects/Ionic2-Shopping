import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, Loading, ToastController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dialogs } from 'ionic-native';



import {Student} from '../../beans/student.bean';
import {Employee} from '../../beans/employee.bean';
import {SessionNote} from '../../beans/sessionNote.bean';
import {Validation} from '../../beans/Validation.bean';
import {WebSN} from '../../beans/WebSN.bean';

import {MakeupSNService} from '../../providors/MakeupSN.service'
import {Utils} from '../../utils'
import {SignatureFieldComponent} from '../../app/signature-field/signature-field.component'


import {ReviewSavedPage}  from '../review-saved/review-saved';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'makeup-session.html',
  providers: [MakeupSNService, SignatureFieldComponent]
})
export class MakeupSessionPage {
  @ViewChild('form') form;

	public static readonly DEFAULT_TITLE: string  = "Makeup Session";
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
   pageTitle = MakeupSessionPage.DEFAULT_TITLE;
   pageSubtitle = "";
   makeupDTChosen = false;
   makeupForList = [];
   selectedMakeup;



   selectedSN = new WebSN();
   public signaturePadOptions: Object = {
    'minWidth': .5,
    'minHeight': .5,
    'canvasWidth': window.innerWidth - 50,
    'canvasHeight': (window.innerHeight / 2) + (window.innerHeight / 6)
  };

  signedRelationships = ["Parent", "Caregiver", "Other"];

  signatureField: SignatureFieldComponent;
  private sigForm: FormGroup;
  therapistSignedDate: Date;
  sessionNote: SessionNote;

  minDate: string = Utils.getFormattedDateAndTime(Utils.addDaysToDate(new Date(), -4), "YYYY-MM-DD");
  maxDate: string = Utils.getFormattedDateAndTime(new Date(), "YYYY-MM-DD");

  constructor(private fb: FormBuilder, private selectedStudent: Student,private employee: Employee, private navCtrl: NavController, private navParams: NavParams,
     private makeupSN : MakeupSNService, public alertCtrl: AlertController, private loadController: LoadingController, private toastCtrl: ToastController) {

       this.sessionNote = navParams.get("SessionNote");
        this.init();

        this.sigForm = this.fb.group({
          signatureField: '',
          therapistSignedDate: ''
        });
  }

  ionViewLoaded() {

  }


   init(){
     this.loadMakeupForList();
     if(this.sessionNote.status === 'BEGIN'){
     this.makeupSN.getSessionNote(this.sessionNote.sessionId).then(
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
     );}else{
       this.makeupDTChosen = true;
       let sn = this.sessionNote;
       let s = this.selectedSN;
       this.makeupSN.getSessionExtras(sn.sessionId).then(
         (data) => {
           for(let i =0 ; i < data.rows.length; i++){
             let a = data.rows.item(i);
             this.makeupSN.populateExtra(a, this.selectedSN);
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
          s.absentCardId = sn.absentCardId;
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
          s.lastMakeupDate = Utils.getFormattedDate( new Date(sn.lastMakeupDate));
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


   loadMakeupForList(){
    	//$scope.makeupForList = 
    	this.makeupSN.getMakeupDates(this.sessionNote.ifspId).then(
    		(data) =>{
          if(data.rows.length > 0){console.log(data);
    	 				for(var i = 0; i < data.rows.length; i++){
    	 					var mk = data.rows.item(i);
    	 					mk.makeupDate = new Date(mk.makeupDate);
                 mk.makeupDateDisplay = Utils.getFormattedDateAndTime(mk.makeupDate, "MM/DD/YYYY")
    	 			    this.makeupForList.push(mk);
    	 				}
    	 			}else 
             console.log("No makeupdates found....");
    			},(error) => {
    		   		  console.log("loadMakeupForList error:");
    		   		  console.error(error);
    	    }
    	);
    }

    makeupDateSelected(mk){
      console.log(mk);
      this.selectedMakeup = mk;
      this.makeupDTChosen = true;
      this.selectedSN.makeupDate = (mk.makeupDate as Date).toISOString(); //Utils.getDateFromString(date, "MM/DD/YYYY").toISOString();
      this.selectedSN.absentCardId = mk.absentCardId;

        setTimeout(() => {
          this.setupFormValidators();
          this.form.control.valueChanges.subscribe(values => this.saveFormOnChange());
        }, 1500);
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
          this.selectedSN.absentCardId = sn.absentCardId;
   }



   setup(){
    Utils.removeAllEmpty(this.sessionNote);
     let sn = this.selectedSN;
     if(sn.status || sn.status == null || sn.status === 'BEGIN' ||  sn.status === 'undefined'){
         sn.status = 'EDITING';
         sn.dateNoteWritten = Utils.getFormattedDate(new Date());

         this.makeupSN.getIfsp(this.sessionNote.ifspId).then(
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
                  this.selectedSN.timeIn =  Utils.getFormattedDateAndTime( Utils.getTimeWithMinutes( ifsp.serviceMinutes *  -1), "HH:mm");
            		  //sn.serviceMethodType = ifsp.serviceMethodType;
            		  this.selectedSN.ifspServiceLocation = ifsp.locationDesc;
                  this.selectedSN.license = this.employee.licenseNumb;
                  this.selectedSN.therapistCredentials = this.employee.title;
                  this.selectedSN.sessionCode = ifsp.sessionCode;

            		  this.loadIcd10Codes(); //(sn.icdCode1, sn.otherIcdCode2);
            		  this.loadCptCodes();
                  //this.makeupSN.setupDatesForDisplay(sn);
             }

           },
           (error) =>{
             console.log(error);
           }
         );
     }
     this.loadOutcomes();
     this.loadActivities();
     this.loadParentCaregiver();
   }

   loadIcd10Codes(){
     this.makeupSN.getIcd10codes(this.selectedSN.serviceType).then(
       (data) =>{
         if(data.rows.length > 0){
           for(let i =0 ; i < data.rows.length; i++){
             this.icd10Codes.push(data.rows.item(i));
           }
         }
       },
       (error) => {
         console.log(error);
       }
     );
   }


   loadCptCodes(){
     this.makeupSN.getCPTCodes(this.selectedSN.serviceMethodType, this.selectedSN.selectIcdCode, this.selectedSN.selectIcdCode2).then(
       (data) => {
			  if(data.rows.length > 0){
				 this.setCPTResults(data);
			  }else{
				   this.makeupSN.getAllCPTCodes(this.selectedSN.serviceType).then(
           (data1) => {
					  if(data1.rows.length > 0)
						   this.setCPTResults(data1);
				    },
            (error) => {
              console.log(error);
            });
			   }
       },
       (error) => {
         console.log(error);
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
     this.makeupSN.getOutcomes(this.selectedSN.studentId).then(
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
     this.makeupSN.getObjectives(this.selectedSN.studentId, outcome).then(
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
     this.activities = this.makeupSN.getActivities();
   }

   loadParentCaregiver(){
     this.parentCaregiver = this.makeupSN.getParentCaregiver();
   }

   saveAndSign(form){
     let validation = this.validateSessionNote(form);

      if(validation.hasError){
        this.makeupSN.alertUserWithValidationResult(validation, false, this.alertCtrl);
      }else{
        if(validation.hasWarning)
          this.makeupSN.alertUserWithValidationResult(validation,false, this.alertCtrl, () => {this.saveToDb()});
        else
          this.saveToDb();
      }
   }

   saveToDb(){

     this.makeupSN.mapWebSNToSaveSN(this.selectedSN, this.sessionNote);
     this.sessionNote.status = 'NOT_SIGNED';
     this.makeupSN.saveSessionNoteToDB(this.sessionNote).then(
       (data) => {
         this.sessionNote.sessionId = data.insertId;
         for(let extra of this.sessionNote.extraValues){
           extra.sessionId = this.sessionNote.sessionId;
           this.makeupSN.saveExtrasToDB(extra);
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
      fg.get("activties").setValidators(Validators.required);
      // fg.get("ifspProgress").setValidators(Validators.required);
   }
   

   
   validateSessionNote(form): Validation{

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
		   			validation.errorList[validation.errorList.length] = requiredUnits+ " 2 units are required for a "+ duration+" minute session";
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
     let validation = this.validateSessionNote(form);

      if(validation.hasError){
        this.makeupSN.alertUserWithValidationResult(validation, false, this.alertCtrl);
      }else{
        if(validation.hasWarning){
          this.makeupSN.alertUserWithValidationResult(validation, false, this.alertCtrl, () => {
                  let s = this.makeupSN.mapWebSNToSaveSN(this.selectedSN);
                  this.validateOnServer(s);
          });

        }else{
        let s = this.makeupSN.mapWebSNToSaveSN(this.selectedSN);
        this.validateOnServer(s);
      }

     }
   }

   validateOnServer(sn: SessionNote){

        let loading = this.loadController.create({
           content: 'Submitting Session Note to Challenge for validation. Please wait...'
        });
        loading.present();

        Utils.removeAllEmpty(sn);

        this.makeupSN.validateMakeupSNOnServer(sn, this.navCtrl, Utils.getAlertWithGenericSubmissionError(this.alertCtrl, loading)).subscribe(
          data => this.serverValidation = data,
          err => this.serverValidation = err,
          () => {loading.dismiss();this.displayServerValidation();}
        );
   }

   displayServerValidation(){
     this.makeupSN.alertUserWithValidationResult(this.serverValidation, false, this.alertCtrl, null, 
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


   timeSaveOnchange(){
     this.makeupSN.mapWebSNToSaveSN(this.selectedSN, this.sessionNote);
     this.sessionNote.status = 'EDITING';
     Utils.removeAllEmpty(this.sessionNote);
     this.makeupSN.saveSessionNoteToDB(this.sessionNote).then( (d)=> {
       this.makeupSN.saveAllExtrasToDB(this.sessionNote.extraValues, this.sessionNote.sessionId ).then((d)=>{}, (e)=> console.error(e));
     }, (e) => console.error(e));

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


  public saveSignature(){
    if(this.signatureField){
     if(this.signatureField.signaturePad.isEmpty()){
          this.makeupSN.alertUserWithValidationResult(new Validation(true, ["Signature cannot be empty"]), false, this.alertCtrl);
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
          this.makeupSN.alertUserWithValidationResult(new Validation(true, ["Relationship to child must be selected"]), false, this.alertCtrl);
          return;
        }else if(wsn.signedRelationship === 'Other' && Utils.isEmpty(wsn.signedRelationshipOther)){
          this.makeupSN.alertUserWithValidationResult(new Validation(true, ["Other Relationship to child must be entered"]), false, this.alertCtrl);
          return;
        }
        sn.therapistSignature = wsn.therapistSignature;
        sn.therapistSignatureDate = Utils.getDateFromDateAndTime(wsn.therapistSignatureDate).getTime();
        sn.parentSignatureDate = Utils.getDateFromDateAndTime(wsn.parentSignatureDate).getTime();
        sn.parentSignature = wsn.parentSignature;
        sn.signedRelationship = wsn.signedRelationship;
        sn.signedRelationshipOther = wsn.signedRelationshipOther;
        sn.status = 'PARENT_SIGNED';

        this.makeupSN.saveSessionNoteToDB(this.sessionNote).then(
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
      this.pageTitle  = MakeupSessionPage.DEFAULT_TITLE+" "+this.pageSubtitle;
    }
  }

  validationCount = 100;
  finalValidations: Array<Validation> = new Array();

  finalValidation(){
    this.validationCount = this.makeupSN.finalValidationBeforeSubmit(this.sessionNote, (validation) => this.finalValidationCallback(validation));
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
     this.makeupSN.alertUserWithValidationResults(this.finalValidations,false, this.alertCtrl, () => {this.submitSN();});

  }
  finalValidationCallback(validation? : Validation){
     if(validation)
       this.finalValidations[this.finalValidations.length] = validation;
  }

  submitSN(){


        let loading = this.loadController.create({
           content: 'Submitting Session Note to Challenge. Please wait...'
        });
        loading.present();

        Utils.removeAllEmpty(this.sessionNote);
        this.makeupSN.submitMakeupSNToServer(this.sessionNote, this.navCtrl).subscribe(
          data => this.serverValidation = data,
          err => this.serverValidation = err,
          () => {
            loading.dismiss();

              if(this.serverValidation.hasError === true){
                this.makeupSN.alertUserWithValidationResult(this.serverValidation,true, this.alertCtrl);
                return;
              }else if(this.serverValidation.hasWarning === true){
                this.makeupSN.alertUserWithValidationResult(this.serverValidation,true, this.alertCtrl);
              }
            this.makeupSN.presentSessionCompletedToast(this.toastCtrl);
            this.sessionNote.cardId =  this.serverValidation.timeCardId;
            this.sessionNote.appSessionId =  this.serverValidation.appSessionId;
            this.sessionNote.rate = this.serverValidation.mandate.rate;

            this.makeupSN.insertHistory(this.sessionNote);
            this.makeupSN.deleteSNById(this.sessionNote.sessionId);
            //this.makeupSN.updateCountsForIFSP(this.sessionNote);
            this.makeupSN.deleteMakeup(this.sessionNote.absentCardId).then((d) => console.log(d), (e) => console.error(e));
            this.makeupSN.updateCountsForIFSP(this.sessionNote.ifspId, this.serverValidation.mandate).then(
              (data) => {
                this.makeupSN.alertMandate(this.sessionNote, this.alertCtrl, ()=> {this.navCtrl.popToRoot();});
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

   onSubmit(){
     console.log("Submitted.....");
   }

   

}
