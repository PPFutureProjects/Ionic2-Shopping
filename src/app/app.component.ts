import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform, AlertController, NavController, LoadingController, Loading  } from 'ionic-angular';


import { StatusBar, Network } from 'ionic-native';

import { DBService } from '../providors/common/db/db.service'

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';


import { CancelledSessionPage } from '../pages/cancelled-session/cancelled-session';
import { LoadPage } from '../pages/load/load';
import { MakeupSessionPage } from '../pages/makeup-session/makeup-session';
import { RegularSessionPage } from '../pages/regular-session/regular-session';
import { ReviewCompletedPage } from '../pages/review-completed/review-completed';
import { ReviewSavedPage } from '../pages/review-saved/review-saved';
import { SelectChildPage } from '../pages/select-child/select-child';
import { AdhocService } from '../providors/Adhoc.service';
import { HttpService } from '../providors/common/HttpService';
import { Utils } from '../utils';
import {Employee} from '../beans/employee.bean';
import {Mandate} from '../beans/Mandate.bean';
import {LoadService} from '../providors/Load.service'



@Component({
  templateUrl: 'app.html',
  providers: [LoadService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component?: any, icon?: string }>;


  constructor(platform: Platform, dbService: DBService, private adhocService: AdhocService, public alertCtrl: AlertController,
   private employee: Employee, private loadService  : LoadService, private loadController: LoadingController) {



    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'View/Edit Saved (Not Submitted) Session Notes', component: ReviewSavedPage },
      { title: 'Review Completed', component: ReviewCompletedPage },
      { title: 'Missing Cancelled Session Notes' },
      { title: 'FYI: IFSP Services - Approved & Provided' , icon:'information-circle'},
      { title: 'Refresh Data', icon: 'refresh' }
    ];



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      dbService.init();
      dbService.initTables();
      this.nav.setRoot(LoginPage)
    });
  }


  openPage(page) {
    if (page.title === 'Missing Cancelled Session Notes') {
      setTimeout(() => {
        this.getMissing();
      }, 100);
    } else if(page.title === 'Refresh Data'){
      if (this.checkForInternetConnection()) {
        let load =  new LoadPage(this.nav,this.employee, this.loadService,this.loadController, this.alertCtrl);
        load.loadData();
        load.dismissLoading();
      }
    }else if ((page.title as string).startsWith("FYI: IFSP Services")){
       if (this.checkForInternetConnection()) {
         this.getMandate();
       }
    }else{
      this.nav.setRoot(HomePage);
      this.nav.push(page.component);
    }
  }

  checkForInternetConnection(){
    if(!Network || !Network.type) return true;
    if (Network.type !== "unknown" && Network.type !== "none")
      return true;
    let alert = this.alertCtrl.create({
            title: 'No internet connection',
            message: "Please try again when your device is connected to the internet",
            buttons: ['OK']
          });
    alert.present();
  }

  getMandate(){
    this.adhocService.getAllIfspIds().then(
      (data) => {
        if(data.rows && data.rows.length && data.rows.length > 0){
          let ifspIds = [];
          for(let i =0;i < data.rows.length; i++ )
             ifspIds.push(data.rows.item(i).ifspId);
             let results;
             let error;
             let loading = this.loadController.create({
                      content: "Getting mandate status. Please wait..."
    });
    loading.present();
    this.adhocService.getemployeeMandates(ifspIds).subscribe(
      data => results = data,
      err => error = err,
      () => {
        loading.dismiss();
        if (results) {
          let man: Mandate = new Mandate();
          man.approvedForIfsp = 0;
          man.totalSessions = 0;
          man.approvedMonthly = 0;
          man.monthlySessions = 0;
          man.approvedWeekly = 0;
          man.weeklySessions = 0;
          man.approvedMakeups = 0;
          man.totalMakeupSessions = 0;
          man.todayIfspSessions = 0;
          for (let i = 0; i < results.length; i++) {
            let m: Mandate = results[i];
            man.approvedForIfsp += m.approvedForIfsp;
            man.totalSessions += m.totalSessions;
            man.approvedMonthly += m.approvedMonthly;
            man.monthlySessions += m.monthlySessions;
            man.approvedWeekly += m.approvedWeekly;
            man.weeklySessions += m.weeklySessions;
            man.approvedMakeups += m.approvedMakeups;
            man.totalMakeupSessions += m.totalMakeupSessions;
            man.todayIfspSessions += m.todayIfspSessions;
          }
          this.alertMandate(man);
        } else if (error)
          console.error(error);
      }
    );
        }
      },
      (e) => console.error(e)
    );
  }

  alertMandate(man: Mandate){
              let m = "<table><tr><th></th><th>Approved</th><th>Completed</th></tr>";
          m+= "<tr><td align='left'>IFSP Total</td><td align='right'>"+man.approvedForIfsp+"</td><td align='right'>"+ (man.totalSessions ? man.totalSessions  : 0) +"</td></tr>";
          if(man.approvedMonthly && man.approvedMonthly > 0)
            m+= "<tr><td align='left'>Monthly</td><td align='right'>"+man.approvedMonthly+"</td><td align='right'>"+(man.monthlySessions ? man.monthlySessions : "0") +"</td></tr>";
          if(man.approvedWeekly && man.approvedWeekly > 0)
            m+= "<tr><td align='left'>Weekly</td><td align='right'>"+man.approvedWeekly+"</td><td align='right'>"+(man.weeklySessions ? man.weeklySessions : "0") +"</td></tr>";
          m+= "<tr><td align='left'>Makeups</td><td align='right'>"+man.approvedMakeups+"</td><td align='right'>"+ (man.totalMakeupSessions ? man.totalMakeupSessions : "0") +"</td></tr>";
          m+= "<tr><td align='left'>Today</td><td align='right'> </td><td align='right'>"+(man.todayIfspSessions ? man.todayIfspSessions : "0") +"</td></tr>";
          //m+= "<tr><td align='left'>Child Today</td><td> </td><td>"+(man.todaysChildSessions ? man.todaysChildSessions : "0") +"</td></tr>";

          m +="</table></br>";
          console.log(m);
          let alert = this.alertCtrl.create({
              title: "Mandate Status",
              subTitle: "IFSP Mandate status",
              message: m,
             buttons: ['OK']
           });
            alert.present();
  }


  getMissing() {

    this.adhocService.getAllMissing().then(
      (data) => {
        if (data.rows.length > 0) {
          let message = "<table><tr><th>Student</th><th>Week</th><th>Missing</th></tr>";
          let missingCount = 0;
          for (let i = 0; i < data.rows.length; i++) {
            let d = data.rows.item(i);
            message += "<tr><td>" + d.lastName + ", " + d.firstName + "</td><td>" + Utils.getFormattedDateAndTime(new Date(d.WeekOf), "MM/DD/YYYY") + "</td><td align='center'>" + d.missing + "</td></tr>";
            missingCount += d.missing;
            console.log(d.lastName + ":" + d.WeekOf);
          }
          let subTitle = "You have " + missingCount + " missing sessions. Please enter cancelled notes for the missed sessions ";
          message += "</table>";
          let confirm = this.alertCtrl.create({
            title: 'Missing Session Notes',
            message: message,
            subTitle: subTitle,
            buttons: ['OK']

          });
          confirm.present();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
