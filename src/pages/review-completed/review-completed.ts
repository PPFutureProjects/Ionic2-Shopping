import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ReviewService } from '../../providors/Review.service';
import {SessionNote} from '../../beans/sessionNote.bean';
import {Utils} from '../../utils';
import {CanceledSNService} from '../../providors/CanceledSN.service';


@Component({
  templateUrl: 'review-completed.html',
  providers: [ReviewService, CanceledSNService]
})
export class ReviewCompletedPage {
  
  sessionNotes: Array<SessionNote> = new Array();
  showRates;


  constructor(private navCtrl: NavController, private reviewService: ReviewService) {

    this.init();

  }


  init(){
     
     this.reviewService.getAllSubmitted().then(
       (data) => {
         for(let i = 0 ; i < data.rows.length; i++){
						  let session = data.rows.item(i);
              if(session.sessionDate && session.sessionDate > 0)
                 session.sessionDateDisplay = Utils.getFormattedDateAndTime(new Date(session.sessionDate));
						  this.sessionNotes.push(session);
				 }
       },
       (error) => {
         console.log(error);

       }
     );
  }

  deleteClicked(index: number){
    let serverValidation:any;
    let sn = this.sessionNotes[index];
    this.reviewService.deleteSNOnServer(this.sessionNotes[index].appSessionId).subscribe(
          data => serverValidation = data,
          err => serverValidation = err,
          () => {
            this.reviewService.deleteSN(this.sessionNotes[index]);
            this.sessionNotes.splice(index, 1);
          }
    );
  }

}
