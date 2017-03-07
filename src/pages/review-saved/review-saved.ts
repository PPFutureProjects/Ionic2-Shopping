import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, ToastController  } from 'ionic-angular';

import { ReviewService } from '../../providors/Review.service';
import {SessionNote} from '../../beans/sessionNote.bean';
import {Validation} from '../../beans/Validation.bean';
import {Utils} from '../../utils';

import {CanceledSNService} from '../../providors/CanceledSN.service';
import {MakeupSNService} from '../../providors/MakeupSN.service';
import { RegularSessionPage} from '../regular-session/regular-session'
import { CancelledSessionPage} from '../cancelled-session/cancelled-session'
import { MakeupSessionPage} from '../makeup-session/makeup-session'
import {Employee} from '../../beans/employee.bean';
import {Constants} from '../../providors/Constants'

@Component({
  templateUrl: 'review-saved.html',
  providers: [ReviewService, CanceledSNService, MakeupSNService]
})
export class ReviewSavedPage {
  
  sessionNotes: Array<SessionNote> = new Array();

  currentIndex: number;

  constructor(private navCtrl: NavController, private reviewService: ReviewService, public alertCtrl: AlertController, private cancelledService: CanceledSNService, 
  private makeupSN : MakeupSNService, private loadController: LoadingController,private employee: Employee, private toastCtrl: ToastController) {

    this.init();

  }


  init(){
     
     this.reviewService.getAllSessionNotes().then(
       (data) => {
         for(let i = 0 ; i < data.rows.length; i++){
						  let session: SessionNote = data.rows.item(i);
              if(session.sessionDate && session.sessionDate > 0)
                 session.sessionDateDisplay = Utils.getFormattedDateAndTime(new Date(session.sessionDate));
              session.statusDisplay  = this.reviewService.getStatusDisplay(session.status);
              session.editable = this.reviewService.isEditable(session.status);
              session.employeeId = this.employee.employeeId;


						  this.sessionNotes.push(session);
				 }
       },
       (error) => {
         console.error(error); 

       }
     );
  }
 validationCount = 100;
  finalValidations: Array<Validation> = new Array();

  finalValidation(sessionNote: SessionNote){
    this.validationCount = this.reviewService.finalValidationBeforeSubmit(sessionNote, (validation) => this.finalValidationCallback(validation));
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
          this.sessionNotes[this.currentIndex].timecardStatus = "Pending Approval";
     this.reviewService.alertUserWithValidationResults(this.finalValidations,false, this.alertCtrl, () => {this.submitSN();});

  }
  finalValidationCallback(validation? : Validation){
     if(validation)
       this.finalValidations[this.finalValidations.length] = validation;
  }
  submitSelected(index: number){
    this.currentIndex = index;
    let sn = this.sessionNotes[this.currentIndex];
    Utils.removeAllEmpty(sn);
    this.finalValidation(sn);
    
  }

  submitSN(){

    let loading = this.loadController.create({
      content: 'Submitting Session Note to Challenge. Please wait...'
    });
    loading.present();
    let sn = this.sessionNotes[this.currentIndex];
    let serverValidation:any;
    let serverError: any;
    this.reviewService.submitToServer(sn, this.navCtrl).subscribe(
          data => serverValidation = data,
          err => serverError = err,
          () => {

            loading.dismiss();
            if (serverError) {
              let alert = this.alertCtrl.create({
                title: "Error",
                subTitle: "There was an error submitting the session note. Please try again later",
                buttons: ['OK']
              });
              alert.present();
              return;
            } else {
              if (serverValidation.hasError === true) {
                this.cancelledService.alertUserWithValidationResult(serverValidation, true, this.alertCtrl);
                return;
              } else if (serverValidation.hasWarning === true) {
                this.cancelledService.alertUserWithValidationResult(serverValidation, true, this.alertCtrl);
              }
              this.sessionNotes.splice(this.currentIndex, 1);
              if (sn.sessionType === 'Cancelled') {
                sn.absentCardId = serverValidation.timeCardId;
                sn.appSessionId = serverValidation.appSessionId;
                this.cancelledService.snSubmitted(sn, serverValidation.mandate);
                if(serverValidation.mandate)
                   this.cancelledService.updateMandate(sn.ifspId, serverValidation.mandate);

                let alert = this.alertCtrl.create(
                  {
                    title: "Session Note saved",
                    subTitle: "The session note was successfully submitted!",
                    buttons: ['OK']
                  });
                alert.present();
              } else {

                this.reviewService.presentSessionCompletedToast(this.toastCtrl);
                if (sn.sessionType === 'Makeup')
                  this.makeupSN.deleteMakeup(sn.absentCardId).then((d) => console.log(d), (e) => console.error(e));

                sn.cardId = serverValidation.timeCardId;
                sn.appSessionId = serverValidation.appSessionId;
                this.reviewService.insertHistory(sn);
                this.reviewService.deleteSNById(sn.sessionId);
                this.reviewService.updateCountsForIFSP(sn.ifspId, serverValidation.mandate).then(
                  (data) => {
                    this.reviewService.alertMandate(sn, this.alertCtrl);
                  }
                );
              }
            }
      }
    );
  }

  editSelected(index: number){
    let sn = this.sessionNotes[index];
    switch(sn.sessionType)
        {
            case Constants.REGULAR_SESSION:
               this.navCtrl.push(RegularSessionPage, {"SessionNote": sn});
               return;
             case Constants.MAKEUP_SESSION:
               this.navCtrl.push(MakeupSessionPage, {"SessionNote": sn});
               return;
        }
    this.navCtrl.push(RegularSessionPage, {"SessionNote": sn});
  }

  deleteClicked(index: number){
    this.reviewService.deleteSN(this.sessionNotes[index]);
    this.sessionNotes.splice(index, 1);
  }

}
