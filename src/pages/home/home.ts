
import {Component, ViewChild} from '@angular/core'
import { NavController, MenuController, LoadingController, AlertController, Loading } from 'ionic-angular';

import { SelectChildPage} from '../select-child/select-child'
import {AdhocService} from '../../providors/Adhoc.service'
import {Utils} from '../../utils'

@Component({
  templateUrl: 'home.html',
  providers: [AdhocService]
})
export class HomePage {
loading: Loading;
  constructor(public navCtrl: NavController, menu: MenuController, private adhocService: AdhocService, public alertCtrl: AlertController, private loadController: LoadingController) {

  }

  ngOnInit(){
      // if(!this.adhocService.alreadyCheckedForMissing()){
      //      this.loading = this.loadController.create({
      //         content: 'Checking for missing session notes. Please wait...'
      //      });
      //      this.loading.present();

      //      setTimeout(() => {
      //         this.thisisatest();
      //      }, 100);
      // }
  }

  thisisatest(){
     this.adhocService.firstTimeThisWeek().then(
       (data) =>{
         if(data.rows.length === 0){
           this.adhocService.setweek();
          //   setTimeout(() => {
          //    this.getMissing();
          //  }, 100);
         }else 
               this.loading.dismiss();
       },
       (error) =>{
           this.loading.dismiss();
           console.error(error);
       }
     );
  }

  firstTimeThisWeek(){
           this.adhocService.getLastWeekMissing().then(
             (d) => {
               let missing = 0;
               let approvedForWeek = 0;
               if(d.rows.length > 0){
                 for(let i =0 ; i < d.rows.length; i++){
                   let r = d.rows.item(i);
                   let miss = r.serviceDaysPerWeek - (r.sessionCountLastWeek + r.cancelledSessionCountThisWeek);
                   approvedForWeek += r.serviceDaysPerWeek;
                   missing += miss;
                 }
                //  if(missing > 0)
                //    this.alertMissing(missing, approvedForWeek);
               }
               this.loading.dismiss();
             },
             (e) => {
               this.loading.dismiss();
               console.error(e);
             }
           );
  }


  getMissing() {

    this.adhocService.getAllMissing().then(
      (data) => {
        this.loading.dismiss();
        if (data.rows.length > 0) {
          let message = "<table><tr style='padding:1px !important'><th>Student</th><th>Week</th><th>Missing</th></tr>";
          let missingCount = 0;
          for (let i = 0; i < data.rows.length; i++) {
            let d = data.rows.item(i);
            message += "<tr><td>" + d.lastName + ", " + d.firstName + "</td><td>" + Utils.getFormattedDateAndTime(new Date(d.WeekOf), "MM/DD/YYYY") + "</td><td align='center'>" + d.missing + "</td></tr>";
            missingCount += d.missing;
          }
          let subTitle = "You have " + missingCount + " missing sessions. Please enter cancelled notes for the missed sessions ";
          message += "</table>";
          let confirm = this.alertCtrl.create({
            title: 'Missing Session Notes',
            message: message,
            subTitle: subTitle,
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                }
              },
              {
                text: 'OK',
                handler: () => {
                  confirm.dismiss();
                  this.itemSelected('Cancelled');
                }
              }
            ]

          });

          confirm.present();


        }
      },
      (error) => {
        this.loading.dismiss();
        console.error(error);
      }
    );
  }




  alertMissing(missingCount, approvedForWeek){
    let message = "You have missed "+missingCount+" session(s) of "+approvedForWeek+" approved for last week. Please enter cancelled notes for the missed sessions";
    
    let confirm = this.alertCtrl.create({
        title: 'Missing session Notes',
        message: message,
        buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'OK',
          handler: () => {
            confirm.dismiss();
            this.itemSelected('Cancelled');
          }
        }
      ]

      });

      confirm.present();
  }


  itemSelected(item){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(SelectChildPage, {
     sessionType: item
   });
   
  }
}
