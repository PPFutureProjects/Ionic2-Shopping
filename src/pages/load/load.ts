import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import {  Network } from 'ionic-native';
import { HomePage } from '../home/home'
import { Employee } from '../../beans/employee.bean';
import { LoadService } from '../../providors/Load.service'
import {Utils} from '../../utils'


@Component({
  templateUrl: 'load.html',
  providers: [LoadService]
})
export class LoadPage {
  studentLoaded = false; ifspLoaded = false; outcomesLoaded = false; cptLoaded = false; makeupDatesLoaded = false; icd10CodesLoaded = false; missingLoaded = false;
  students;
  ifsps;
  outcomes;
  cptcodes;
  icd10Codes;
  makeupDates;
  gapCount;
  loading: Loading;
  missing;
  alreadyLoadedData = false;
  constructor(private navCtrl: NavController, private employee: Employee, private loadService: LoadService, private loadController: LoadingController,public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {

    setTimeout(() => {
      this.goToHomePage();
    }, 1000);

    this.loadService.getLastTimeDataLoaded().then(
      (data) => {
        let lastTimeDataLoaded: number = data.rows.item(0).lastTimeDataLoaded;
        if (!lastTimeDataLoaded || lastTimeDataLoaded == 0 || !Utils.isToday(new Date(lastTimeDataLoaded))) {
          if (!this.checkForInternetConnection('No intenet connection was detected. Please click on "Refresh Data" once you have internet connection to refresh data from Challenge.')) {
            this.alreadyLoadedData = true;
          }else
            this.loadData();
        } else {
          this.alreadyLoadedData = true;
        }
      },
      (error) => {
        this.loadData();
      }
    );




  }

  goToHomePage() {
    if(this.alreadyLoadedData){
      this.navCtrl.push(HomePage);
      return;
    }
    if (this.studentLoaded && this.ifspLoaded && this.outcomesLoaded && this.cptLoaded && this.makeupDatesLoaded && this.icd10CodesLoaded && this.missingLoaded) {
      this.loading.dismiss();
      this.loadService.restartDB();
      this.loadService.setDataLoaded().then((d)=>console.log(d),(e)=>console.error(e));
      this.navCtrl.push(HomePage);
    } else {
      setTimeout(() => {
        this.goToHomePage();
      }, 500);
    }

  }

  dismissLoading() {
    if (this.studentLoaded && this.ifspLoaded && this.outcomesLoaded && this.cptLoaded && this.makeupDatesLoaded && this.icd10CodesLoaded && this.missingLoaded)
      this.loading.dismiss();
    else
      setTimeout(() => {
        this.dismissLoading();
      }, 500);
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


  loadData() {

    this.loading = this.loadController.create({
      content: 'Retrieving data from Challenge. Please wait...'
    });

    this.loading.present();

    this.loadService.getEmployeeIFSPs(this.employee.employeeId)
      .subscribe(
      data => this.ifsps = data,
      err => console.log(err),
      () => this.saveIFSPsToDB()
      );

    this.loadService.getEmployeeStudents(this.employee.employeeId)
      .subscribe(
      data => this.students = data,
      err => console.log(err),
      () => this.saveStudentsToDB()
      );


    this.loadService.getMakeupDates(this.employee.employeeId)
      .subscribe(
      data => this.makeupDates = data,
      err => console.log(err),
      () => this.saveMakeupDatesToDB()
      );


    this.loadService.getMissingSessions(this.employee.employeeId)
      .subscribe(
      data => this.missing = data,
      err => console.log(err),
      () => this.saveMissingSessions()
      );


    this.loadService.getEmployeeOutcomes(this.employee.employeeId)
      .subscribe(
      data => this.outcomes = data,
      err => console.log(err),
      () => this.saveOutcomesToDB()
      );

    this.loadService.getCPTCodes()
      .subscribe(
      data => this.cptcodes = data,
      err => console.log(err),
      () => this.saveCPTCodesToDB()
      );

    this.loadService.getICD10Codes()
      .subscribe(
      data => this.icd10Codes = data,
      err => console.log(err),
      () => this.saveICD10CodesToDB()
      );



    // this.loadService.getGapcount(this.employee.employeeId)
    // .subscribe(
    //   data => this.gapCount = data,
    //   err => console.log(err),
    //   () => this.saveGapCount()
    // );
  }

  // saveGapCount(){
  //   this.loadService.saveGapCount(this.gapCount).then(
  //     (d) => this.gotGapCount = true,
  //     (e) => {console.error(e); this.gotGapCount = true;}
  //   );
  // }

  saveStudentsToDB() {
    console.log(this.students)
    this.loadService.saveStudents(this.students).then(
      (d) => this.studentLoaded = true,
      (e) => { console.error(e); this.studentLoaded = true; }
    );
  }

  saveIFSPsToDB() {
    this.loadService.saveIfsps(this.ifsps).then(
      (d) => this.ifspLoaded = true,
      (e) => { console.error(e); this.ifspLoaded = true; });

    for (let i = 0; i < this.ifsps.length; i++) {
      this.loadService.getIfspMandate(this.ifsps[i].ifspId).subscribe(

        data => { this.loadService.updateCountsForIFSP(data); },
        err => { console.log(err); },
        () => {
        });
    }
  }

  saveOutcomesToDB() {
    this.loadService.saveOutcomes(this.outcomes).then(
      (d) => this.outcomesLoaded = true,
      (e) => { console.error(e); this.outcomesLoaded = true; });
  }

  saveCPTCodesToDB() {
    this.loadService.saveCPTCodes(this.cptcodes).then(
      (d) => this.cptLoaded = true,
      (e) => { console.error(e); this.cptLoaded = true; });
  }

  saveICD10CodesToDB() {

    this.loadService.saveIcd10Codes(this.icd10Codes).then(
      (d) => this.icd10CodesLoaded = true,
      (e) => { console.error(e); this.icd10CodesLoaded = true; });
  }

  saveMakeupDatesToDB() {
    this.makeupDatesLoaded = true;
    this.loadService.saveMakeups(this.makeupDates).then(
      (d) => this.makeupDatesLoaded = true,
      (e) => { console.error(e); this.makeupDatesLoaded = true; });
  }

  saveMissingSessions() {
    console.log(this.missing);
    this.missingLoaded = true;
    this.loadService.saveMissingSessions(this.missing).then(
      (d) => this.missingLoaded = true,
      (e) => { console.error(e); this.missingLoaded = true; });
  }

}
