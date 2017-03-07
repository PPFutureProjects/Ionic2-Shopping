import {Injectable, Inject} from '@angular/core';
import {SessionNote} from '../../beans/sessionNote.bean';
import {WebSN} from '../../beans/WebSN.bean';
import {Utils} from '../../utils'

//map from session note bean used to display in phone to service note bean saved to a) DB and b) challenge
export  class SNMapper{



    static mapWebToSaved(webSN: WebSN, sn?:SessionNote ): SessionNote {
         

         if(!sn)
           sn = new SessionNote();

        sn.studentId = webSN.studentId;
        sn.activity = "Test";
        sn.status = webSN.status;
        sn.sessionId = webSN.sessionId;
        if(this.ne(webSN.sessionDate))
          sn.sessionDate = new Date(webSN.sessionDate).getTime();
        if(this.ne(webSN.timeIn))
          sn.timeIn = Utils.getDateFromString(webSN.timeIn, "HH:mm").getTime();
        if(this.ne(webSN.timeOut))
          sn.timeOut = Utils.getDateFromString(webSN.timeOut, "HH:mm").getTime();
        
        if(this.ne(webSN.dateNoteWritten))
           sn.dateNoteWritten = new Date(webSN.dateNoteWritten).getTime();
        sn.ifspId = webSN.ifspId;
        sn.icdCode1 = webSN.selectIcdCode;
        sn.otherIcdCode2 = webSN.selectIcdCode2;
        if(this.ne(webSN.serviceBegin))
           sn.serviceBegin = new Date(webSN.serviceBegin).getTime();
        if(this.ne(webSN.serviceEnd))
           sn.serviceEnd = new Date(webSN.serviceEnd).getTime();
        sn.ifspServiceDuration = webSN.serviceDuration;
        sn.serviceMinutes = webSN.serviceDuration;
        sn.serviceType = webSN.serviceType;
        sn.serviceMethodType = webSN.serviceMethodType;
        sn.ifspServiceLocation = webSN.ifspServiceLocation;
        sn.cptCode1 = webSN.cptCode1;
        sn.cptCode2 = webSN.cptCode2;
        sn.cptCode3 = webSN.cptCode3;
        sn.cptCode4 = webSN.cptCode4;
        sn.cptUnit1 = ""+webSN.cpt1Unit;
        sn.cptUnit2 = ""+(webSN.cpt2Unit ? webSN.cpt2Unit : 0);
        sn.cptUnit3 = ""+(webSN.cpt3Unit ? webSN.cpt3Unit : 0);
        sn.cptUnit4 = ""+(webSN.cpt4Unit ? webSN.cpt4Unit : 0);
        sn.hcpcsCode = webSN.hcpcsCode;
        sn.hcpcsUnit = ""+(webSN.hcpcsUnit ? webSN.hcpcsUnit : 0);
        sn.sessionParticipantsChild = ""+(webSN.sessionParticipantsChild ? webSN.sessionParticipantsChild : false);
        sn.sessionParticipantsParent = ""+(webSN.sessionParticipantsParent ? webSN.sessionParticipantsParent : false);
        sn.sessionParticipantsOther  = ""+(webSN.sessionParticipantsOther ? webSN.sessionParticipantsOther : false);
        sn.sessionParticipantsOtherName = webSN.sessionParticipantsOtherName ? webSN.sessionParticipantsOtherName: "";
        sn.parentUnavailable = webSN.parentUnavailable;
        sn.ifspProgress = webSN.ifspProgress;
        sn.additionalInfo = webSN.additionalInfo;
        sn.outcomeAndObjectives = webSN.outcomeAndObjectives;
        sn.strategiesBetweenVisits = webSN.strategiesBetweenVisits;
        sn.employeeId = webSN.employeeId;
        sn.reason = webSN.cancelledReason;
        sn.otherReason = webSN.otherReason;
        sn.lastMakeupDate = Utils.isEmpty(webSN.lastMakeupDate)? null : Utils.getDateFromString(webSN.lastMakeupDate).getTime();
        sn.notified = webSN.notified;
        sn.delayReason = webSN.delayReason;
        sn.signedRelationshipOther = webSN.signedRelationshipOther;
        sn.sessionCode = webSN.sessionCode;
        sn.absentCardId = webSN.absentCardId;

        //if(!sn.extraValues)
          sn.extraValues = new Array();
        if(webSN.activities && webSN.activities.length > 0)
          this.addExtra(sn.extraValues, webSN.activities, 'ACTIVITY', 'VARCHAR');

        if(webSN.objectives && webSN.objectives.length > 0)
          this.addExtra(sn.extraValues, webSN.objectives, 'OBJECTIVE', 'VARCHAR');

        if(webSN.parentCaregiver && webSN.parentCaregiver.length > 0)
          this.addExtra(sn.extraValues, webSN.parentCaregiver, 'COACH_PARENT', 'VARCHAR');



        return sn;

    }

    static addExtra(extras: any[], sourceArray: string[], fieldType: string, dataType: string){
      let seq = 0;
      for(let value of sourceArray){
        let a = {
        				  fieldType: fieldType,
        				  fieldValue: value,
        				  valueSequence: seq++,
        				  dataType: dataType
        			  };
        extras.push(a);
      }
    }

    //Not empty
    static ne(str: string): Boolean{
        return str && str.length > 0;
    }
}