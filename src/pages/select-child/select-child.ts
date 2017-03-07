import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, Toast } from 'ionic-angular';


import { RegularSessionPage} from '../regular-session/regular-session'
import { CancelledSessionPage} from '../cancelled-session/cancelled-session'
import { MakeupSessionPage} from '../makeup-session/makeup-session'
import { SelectChildService } from '../../providors/SelectChild.service'
import { Constants } from '../../providors/Constants'
import {Student} from '../../beans/student.bean';
import {Employee} from '../../beans/employee.bean';
import {SessionNote} from '../../beans/sessionNote.bean';
import {Utils} from '../../utils';
import {Mandate} from '../../beans/Mandate.bean';


@Component({
  templateUrl: 'select-child.html',
  providers: [SelectChildService]
})
export class SelectChildPage {

  sessionType: string;
  allStudents = [];

  studentChosen = false;
  sessionNote: SessionNote;

  noteOnPhone: Array<any> = new Array<any>();

  // validations: Array<Function>;
   selectedStudent: any;

  constructor(private employee: Employee,private navCtrl: NavController, navParams: NavParams, 
  private selectChildService : SelectChildService, public alertCtrl: AlertController,private toastCtrl: ToastController, private loadController: LoadingController) {
    this.sessionType = navParams.get('sessionType');
    this.getAllStudents();
    // this.validations = new Array<Function>();
    // this.validations[0] = this.checkForCoVisit;
    // this.validations[1] = this.checkForMaxMethodType;
  }


  getAllStudents(){
    this.selectChildService.getAllStudents().then(
				  (data) => {
            this.allStudents = [];
					  for(let i = 0 ; i < data.rows.length; i++){
						  let student = data.rows.item(i);
               console.log("creating object on the fly....");
						  this.allStudents.push({
                serviceBegin: Utils.getFormattedDateAndTime(new Date(student.serviceBegin), "MM/DD/YYYY"),
                serviceEnd: Utils.getFormattedDateAndTime(new Date(student.serviceEnd), "MM/DD/YYYY"),
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth,
                male: student.male,
                female: student.female,
                office: student.office,
                serviceType: student.serviceType,
                sessionCode: student.sessionCode,
                serviceMethodType: student.serviceMethodType,
                moreSame: student.moreSame,
                more3hb: student.more3hb,
                ifspId: student.ifspId,
                sessionCountToday: student.sessionCountToday,
                sessionCountLastWeek: student.sessionCountLastWeek,
                sessionCountLastMonth: student.sessionCountLastMonth,
                sessionCountThisMonth: student.sessionCountThisMonth,
                sessionCountThisWeek: student.sessionCountThisWeek,
                sessionCountIfspId: student.sessionCountIfspId,
                serviceDaysPerWeek: student.serviceDaysPerWeek,
                frequencyPerMonth: student.frequencyPerMonth,
                totalBillingServiceUnits: student.totalBillingServiceUnits,
                gapCount: student.gapCount,
                makeUps: student.makeUps,
                makeupCount: student.makeupCount,
                cancelledSessionCountToday: student.cancelledSessionCountToday,
                cancelledSessionCountLastWeek: student.cancelledSessionCountLastWeek,
                cancelledSessionCountLastMonth: student.cancelledSessionCountLastMonth,
                cancelledSessionCountThisMonth: student.cancelledSessionCountThisMonth,
                cancelledSessionCountThisWeek: student.cancelledSessionCountThisWeek,
                cancelledSessionCountIfspId: student.cancelledSessionCountIfspId
                });
              // student.serviceBegin = Utils.getFormattedDateAndTime(new Date(student.serviceBegin), "MM/DD/YYYY");
              // student.serviceEnd = Utils.getFormattedDateAndTime(new Date(student.serviceEnd), "MM/DD/YYYY");
					  }
            this.presentToast();
				  }, (error) => {
            console.log(error);
        });
  }

  studentSelected(student){
    try{this.toast.dismiss();}catch(e){}
    this.selectedStudent = student;
    this.studentChosen = true;
  }
   toast: Toast;
   presentToast() {
    this.toast = this.toastCtrl.create({
      message: 'Please select the child you want to create a '+this.sessionType+ ' Session Note and then click on Begin',
      duration: 8000,
      position: "middle",
      showCloseButton: true
    });
    this.toast.present();
  }


  childconfirmed(){

    if(!this.studentChosen){

      let alert = this.alertCtrl.create({

        title: 'Error',
        subTitle: 'Please select a student!',
        buttons: ['OK']
      });
      alert.present();

      return;
    }
    let confirm = this.alertCtrl.create({
        title: 'Student Selected',
        message: 'You have selected '+this.selectedStudent.lastName+', '+this.selectedStudent.firstName+' ('+this.selectedStudent.studentId+'). Are you sure?',
        buttons: [
        {
          text: 'Cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.checkForCoVisit();
          }
        }
      ]

      });

      confirm.present();

  }
  validationIndex: number = 0;

  // runNextValidation(){
  //     if(this.validationIndex < this.validations.length){
  //       this.validations[this.validationIndex]();
  //     }else
  //       this.createSN();
         
  // }

  checkForCoVisit(){
    console.log(this.selectedStudent);
    this.validationIndex++;
    if(this.sessionType === 'Cancelled')
       this.createSN();
    else if(this.selectedStudent.sessionCode && this.selectedStudent.sessionCode === 3 && this.selectedStudent.serviceType !== 'T'){
       let confirm = this.alertCtrl.create({
        title: 'Co-visit',
        message: 'You have selected a co-visit. Are you sure?',
        buttons: [
        {
          text: 'Cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.checkForServiceGap();
          }
        }
      ]

      });
      confirm.present();
    }else this.checkForServiceGap();
  }

  checkForServiceGap(){

    if(this.sessionType !== Constants.MAKEUP_SESSION)
      this.checkForMaxTodaysSessions();
      else this.createSN();
       

    //this.checkForMaxMethodType();
    // if(this.selectedStudent.gapCount === 0){
    //   this.selectChildService.getNotesOnPhone(this.selectedStudent.ifspId).then(
    //     (data) => {
    //         let notesOnPhone = 0;
    //         for (let i = 0; i < data.rows.length; i++) {
    //            this.noteOnPhone.push(data.rows.item(i));
    //            notesOnPhone++;
    //         }
    //         if(notesOnPhone > 0)
    //           this.checkForMaxMethodType();
    //         else{
    //           let alert = this.alertCtrl.create({
    //           title: "14 Day Gap",
    //           subTitle: "There is a 14 day gap in sessions provided, please submit a Gap Report to Challenge",
    //           buttons: [{
    //              text: 'OK',
    //              handler: () => {
    //                  console.log(this);
    //                  this.checkForMaxMethodType();
    //              }
    //            }]
    //           });
    //          alert.present();
    //         }
    //     }
    //   );
    // }else
    //         this.checkForMaxMethodType();
  }


// a.	EI Rule: A child may not receive more than 1 session of the same service Method/Type per day.
// Waiver Exception: IF “IFSP.MoreSame > 3 – allow the number of sessions per day in that field

  checkForMaxMethodType(){

    if(this.sessionType !== Constants.REGULAR_SESSION){
      this.createSN();
      return;
    }
    this.validationIndex++;

    this.selectChildService.getServiceMethodCount(this.selectedStudent.serviceMethodType).then(
        (data) => {
          console.log(data);
          let count = data.rows.item(0).sessionCount;
          if(count && count > 0 && (!this.selectedStudent.moreSame || this.selectedStudent.moreSame >= count)){
             let alert = this.alertCtrl.create({
              title: "Max Sessions Reached",
              subTitle: "Already exceeded the maximum "+this.selectedStudent.serviceMethodType+" type sessions allowed for "+this.selectedStudent.lastName+", "+this.selectedStudent.firstName,
              message: "Click continue to create a session note. Note that the Session Note will require approval",
             buttons: [{
                text: 'Cancel',
                handler: () => {}
             },{
                 text: 'Continue',
                 handler: () => {
                     this.createSN();
                 }
            }]
           });
            alert.present();
            return;
          }else
            this.checkForMaxTodaysSessions();
        },
        (error) => console.error(error)
    );
  }


  checkForMaxTodaysSessions(){
      
    this.selectChildService.getTodaysSessionCount(this.selectedStudent.studentId).then(
      (data) =>{
        let count = data.rows.item(0).sessionCountToday;
        if(count >= 3 && count >= this.selectedStudent.more3hb){
           
             let alert = this.alertCtrl.create({
              title: "Max Sessions Reached",
              subTitle: "Already exceeded the maximum sessions allowed for "+this.selectedStudent.lastName+", "+this.selectedStudent.firstName,
             buttons: ['OK']
           });
            alert.present();
            return;
        }else
            this.checkForMaxSessions();
      },
      (error) => console.error(error)
    );
  }


  checkForMaxSessions(){
          let weekMax = this.selectedStudent.serviceDaysPerWeek;
          let monthMax = this.selectedStudent.frequencyPerMonth;
          let maxSessions = this.selectedStudent.totalBillingServiceUnits;

          let monthCount = this.selectedStudent.sessionCountThisMonth;
          let weekCount = this.selectedStudent.sessionCountThisWeek;
          let sessionCountIfspId = this.selectedStudent.sessionCountIfspId;
          let currentWeek = Utils.getWeekOfYear(new Date());
          let currentMonth = Utils.getMonthOfYear(new Date());
          if(this.noteOnPhone.length > 0){
            for (let i = 0; i < this.noteOnPhone.length; i++) {
              sessionCountIfspId++;
              let week = Utils.getWeekOfYear(new Date(this.noteOnPhone[i].sessionDate));
              if (week === currentWeek)
                weekCount++;
              let month = Utils.getMonthOfYear(new Date(this.noteOnPhone[i].sessionDate));
              if (month === currentMonth)
                monthCount++;
            }
          }

          let message = "You have already reached the mandate approved for this ";
          let end = null;
          
          if(weekMax > 0 && weekCount>= weekMax)
            end = "Week";
          else if(monthMax > 0 && monthCount >= monthMax)
            end = "Month";
          message = message + end;

          if(sessionCountIfspId >= maxSessions){
            message = "You have already completed the mandate approved for this IFSP";
            end = "Empty";
          }

          if(Utils.isEmpty(end))
            this.createSN()
          else{
             let alert = this.alertCtrl.create({
              title: "Max Sessions Reached",
              subTitle: message+ ". Click continue to create a session note. Note that the Session Note will require approval",
              buttons: [{
                text: 'Cancel',
                handler: () => {}
             },{
                 text: 'Continue',
                 handler: () => {
                     this.createSN();
                 }
            }]
           });
            alert.present();
            return;
          }
  }


  createSN(){


      let session = new SessionNote();
      session.status='BEGIN';
      session.studentId=this.selectedStudent.studentId;
      session.employeeId=this.employee.employeeId;
      session.sessionType=this.sessionType;
      session.license=this.employee.licenseNumb;
      session.timeIn=null;
      session.timeOut=null;
      session.sessionDate= new Date().getTime();  //date of the session
      session.dateNoteWritten= new Date().getTime();    //date note was written; theoretically should be the same but doesn't have to be
      
      session.firstName=this.selectedStudent.firstName;
      session.lastName=this.selectedStudent.lastName;
      session.ifspId = this.selectedStudent.ifspId;
      this.sessionNote = session;

      this.selectChildService.saveSN(session).then(
           (data) => {
             this.sessionNote.sessionId =  data.insertId;
             this.sessionNote.sessionType = session.sessionType;
             this.sessionNote.studentId = session.studentId;
             this.navigate();
           },
           (error) => {

             console.log(error);

           }
      );
     
  }

  navigate(){
             if(this.sessionType === Constants.REGULAR_SESSION)
              this.navCtrl.push(RegularSessionPage, {"SessionNote": this.sessionNote});
             else if(this.sessionType === Constants.CANCELLED_SESSION)
               this.navCtrl.push(CancelledSessionPage, {"SessionNote": this.sessionNote});
             else if(this.sessionType === Constants.MAKEUP_SESSION)
               this.navCtrl.push(MakeupSessionPage, {"SessionNote": this.sessionNote});

  }

  getMandate(){
    let serverValidation, serverErr;

    let loading = this.loadController.create({
      content: "Getting mandate status for "+this.selectedStudent.lastName+", "+this.selectedStudent.firstName +". Please wait..."
    });
    loading.present();
    this.selectChildService.getIfspMandate(this.selectedStudent.ifspId).subscribe(
      data => serverValidation = data,
      err => serverErr = err,
      () => {
        loading.dismiss();
        if(!serverErr){
          this.selectChildService.updateCountsForIFSP(serverValidation);
          let man: Mandate = serverValidation;
          let m = "<table><tr><th></th><th>Approved</th><th>Completed</th></tr>";
          m+= "<tr><td align='left'>IFSP Total</td><td align='right'>"+man.approvedForIfsp+"</td><td align='right'>"+ (man.totalSessions ? man.totalSessions  : 0) +"</td></tr>";
          if(man.approvedMonthly && man.approvedMonthly > 0)
            m+= "<tr><td align='left'>Monthly</td><td align='right'>"+man.approvedMonthly+"</td><td align='right'>"+(man.monthlySessions ? man.monthlySessions : "0") +"</td></tr>";
          else if(man.approvedWeekly && man.approvedWeekly > 0)
            m+= "<tr><td align='left'>Weekly</td><td align='right'>"+man.approvedWeekly+"</td><td align='right'>"+(man.weeklySessions ? man.weeklySessions : "0") +"</td></tr>";
          m+= "<tr><td align='left'>Makeups</td><td align='right'>"+man.approvedMakeups+"</td><td align='right'>"+ (man.totalMakeupSessions ? man.totalMakeupSessions : "0") +"</td></tr>";
          m+= "<tr><td align='left'>Today</td><td align='right'> </td><td align='right'>"+(man.todayIfspSessions ? man.todayIfspSessions : "0") +"</td></tr>";
          //m+= "<tr><td align='left'>Child Today</td><td> </td><td>"+(man.todaysChildSessions ? man.todaysChildSessions : "0") +"</td></tr>";

          m +="</table></br>";
          console.log(m);
          let alert = this.alertCtrl.create({
              title: "Mandate Status",
              subTitle: "IFSP Mandate status for "+this.selectedStudent.lastName+", "+this.selectedStudent.firstName,
              message: m,
             buttons: ['OK']
           });
            alert.present();

        }else{
          console.error(serverErr);
        }
      });
  }

}
