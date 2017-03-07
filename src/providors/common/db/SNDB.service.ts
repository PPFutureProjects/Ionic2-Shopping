import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {SessionNote} from '../../../beans/sessionNote.bean';
import {SqlBatch} from '../../../beans/sqlBatch.bean';
import {Utils} from '../../../utils'

@Injectable()
export class SessionNoteDB{


    allColumns = "coalesce(sessionId, -1) as sessionId, sessionType, serviceType,serviceMethodType, studentId, firstName, lastName, status, ifspId, coalesce(sessionDate, -1) as sessionDate,  "+
    "coalesce(timeIn, -1) as  timeIn, coalesce(timeOut, -1) as  timeOut,coalesce(ifspServiceDuration, -1) as ifspServiceDuration, "+
	"coalesce(dateNoteWritten, -1) as dateNoteWritten, icdCode1, otherIcdCode2,coalesce(serviceBegin, -1) as serviceBegin,coalesce(serviceEnd, -1) as serviceEnd, location, "+
	"cptCode1, cptUnit1, cptCode2, cptUnit2, cptCode3, cptUnit3, cptCode4, cptUnit4,hcpcsCode,hcpcsUnit, sessionParticipantsChild, "+
	"sessionParticipantsParent, sessionParticipantsOther, sessionParticipantsOtherName, additionalInfo, outcomeAndObjectives, activity, coachParentCaregiver, ifspServiceLocation, sessionParticipants, "+
	"parentUnavailable, ifspProgress, activities, strategiesBetweenVisits, therapistSignature,coalesce(therapistSignatureDate, -1) as therapistSignatureDate, "+
	"therapistCredentials, parentSignature,coalesce(parentSignatureDate, -1) as parentSignatureDate, signedRelationship, license, coalesce(serviceMinutes, -1) as serviceMinutes,reason,otherReason,notified,  "+
	"coalesce(lastMakeupDate, -1) as  lastMakeupDate, absentCardId, signedRelationshipOther, sessionCode ";

    constructor(public  dbService: DBService){

    }

  all() {
    	let query = 'SELECT '+this.allColumns+' FROM session_note';
    	return this.dbService.query(query,[]);
    };
    
    getById(id) {
    	let query = 'SELECT '+this.allColumns+' FROM session_note WHERE sessionId = ?';
    	return this.dbService.query(query,[id]);
    };
    
    getByStudentId(id) {
    	let query = 'SELECT '+this.allColumns+' FROM session_note WHERE studentId = ?';
    	return this.dbService.query(query,[id]);
    };
    
    insert(sn){
    	let query = "insert  or replace into session_note(sessionType, serviceType,serviceMethodType, studentId, firstName, lastName, status, ifspId, sessionDate, timeIn, timeOut, ifspServiceDuration, "+
    	"dateNoteWritten, icdCode1, otherIcdCode2, serviceBegin, serviceEnd, location, cptCode1, cptUnit1, cptCode2, cptUnit2, cptCode3, cptUnit3, cptCode4, cptUnit4,hcpcsCode,hcpcsUnit, sessionParticipantsChild, "+
    	"sessionParticipantsParent, sessionParticipantsOther, sessionParticipantsOtherName, additionalInfo, outcomeAndObjectives, activity, coachParentCaregiver, ifspServiceLocation, sessionParticipants, "+
    	"parentUnavailable, ifspProgress, activities, strategiesBetweenVisits, therapistSignature, therapistSignatureDate, therapistCredentials, parentSignature, parentSignatureDate, signedRelationship, license, serviceMinutes,"+
    	"reason,otherReason,notified,lastMakeupDate,absentCardId, signedRelationshipOther, sessionCode) "+
    	"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    	
    	return this.dbService.query(query, [sn.sessionType,
    	                             sn.serviceType,
    	                             sn.serviceMethodType,
    	                             ""+sn.studentId,
    	                             sn.firstName,
    	                             sn.lastName,
    	                             sn.status,
    	                             sn.ifspId,
    	                             sn.sessionDate,
    	                             sn.timeIn,
    	                             sn.timeOut,
    	                             sn.ifspServiceDuration,
    	                             sn.dateNoteWritten,
    	                             sn.icdCode1,
    	                             sn.otherIcdCode2,
    	                             sn.serviceBegin,
    	                             sn.serviceEnd,
    	                             sn.location,
    	                             sn.cptCode1,
    	                             sn.cptUnit1,
    	                             sn.cptCode2,
    	                             sn.cptUnit2,
    	                             sn.cptCode3,
    	                             sn.cptUnit3,
    	                             sn.cptCode4,
    	                             sn.cptUnit4,
    	                             sn.hcpcsCode,
    	                             sn.hcpcsUnit,
    	                             sn.sessionParticipantsChild,
    	                             sn.sessionParticipantsParent,
    	                             sn.sessionParticipantsOther,
    	                             sn.sessionParticipantsOtherName,
    	                             sn.additionalInfo,
    	                             sn.outcomeAndObjectives,
    	                             sn.activity,
    	                             sn.coachParentCaregiver,
    	                             sn.ifspServiceLocation,
    	                             sn.sessionParticipants,
    	                             sn.parentUnavailable,
    	                             sn.ifspProgress,
    	                             sn.activities,
    	                             sn.strategiesBetweenVisits,
    	                             sn.therapistSignature,
    	                             sn.therapistSignatureDate,
    	                             sn.therapistCredentials,
    	                             sn.parentSignature,
    	                             sn.parentSignatureDate,
    	                             sn.signedRelationship,
    	                             sn.license,
    	                             sn.serviceMinutes,
    	                             sn.reason,
    	                             sn.otherReason,
    	                             sn.notified,
    	                             sn.lastMakeupDate,
    	                             sn.absentCardId,
									 sn.signedRelationshipOther,
									 sn.sessionCode]);
    };
    
    update(sn){
    	let query = "insert  or replace into session_note(sessionId, sessionType, serviceType,serviceMethodType, studentId, firstName, lastName, status, ifspId, sessionDate, timeIn, timeOut, ifspServiceDuration, "+
    	"dateNoteWritten, icdCode1, otherIcdCode2, serviceBegin, serviceEnd, location, cptCode1, cptUnit1, cptCode2, cptUnit2, cptCode3, cptUnit3, cptCode4, cptUnit4, hcpcsCode, hcpcsUnit, sessionParticipantsChild, "+
    	"sessionParticipantsParent, sessionParticipantsOther, sessionParticipantsOtherName, additionalInfo, outcomeAndObjectives, activity, coachParentCaregiver, ifspServiceLocation, sessionParticipants, "+
    	"parentUnavailable, ifspProgress, activities, strategiesBetweenVisits, therapistSignature, therapistSignatureDate, therapistCredentials, parentSignature, parentSignatureDate, signedRelationship, license, serviceMinutes,"+
    	"reason,otherReason,notified,lastMakeupDate,absentCardId,signedRelationshipOther, sessionCode) "+
    	"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    	
    	return this.dbService.query(query, [sn.sessionId,
    	                             sn.sessionType,
    	                             sn.serviceType,
    	                             sn.serviceMethodType,
    	                             ""+sn.studentId,
    	                             sn.firstName,
    	                             sn.lastName,
    	                             sn.status,
    	                             sn.ifspId,
    	                             sn.sessionDate,
    	                             sn.timeIn,
    	                             sn.timeOut,
    	                             sn.ifspServiceDuration,
    	                             sn.dateNoteWritten,
    	                             sn.icdCode1,
    	                             sn.otherIcdCode2,
    	                             sn.serviceBegin,
    	                             sn.serviceEnd,
    	                             sn.location,
    	                             sn.cptCode1,
    	                             sn.cptUnit1,
    	                             sn.cptCode2,
    	                             sn.cptUnit2,
    	                             sn.cptCode3,
    	                             sn.cptUnit3,
    	                             sn.cptCode4,
    	                             sn.cptUnit4,
    	                             sn.hcpcsCode,
    	                             sn.hcpcsUnit,
    	                             sn.sessionParticipantsChild,
    	                             sn.sessionParticipantsParent,
    	                             sn.sessionParticipantsOther,
    	                             sn.sessionParticipantsOtherName,
    	                             sn.additionalInfo,
    	                             sn.outcomeAndObjectives,
    	                             sn.activity,
    	                             sn.coachParentCaregiver,
    	                             sn.ifspServiceLocation,
    	                             sn.sessionParticipants,
    	                             sn.parentUnavailable,
    	                             sn.ifspProgress,
    	                             sn.activities,
    	                             sn.strategiesBetweenVisits,
    	                             sn.therapistSignature,
    	                             sn.therapistSignatureDate,
    	                             sn.therapistCredentials,
    	                             sn.parentSignature,
    	                             sn.parentSignatureDate,
    	                             sn.signedRelationship,
    	                             sn.license,
    	                             sn.serviceMinutes,
    	                             sn.reason,
    	                             sn.otherReason,
    	                             sn.notified,
    	                             sn.lastMakeupDate,
    	                             sn.absentCardId,
									 sn.signedRelationshipOther,
									 sn.sessionCode]);
    };
    
    deleteSN(sn){
    	return this.deleteById(sn.sessionId);
    }
    
    deleteById(id){
    	let query = "delete from session_note where sessionId = ?";
    	return this.dbService.query(query, [id]);
    }
    
    getLastSNId(){
    	let query = "SELECT last_insert_rowid() FROM session_note ";
    	return this.dbService.query(query, []);
    }
    
    saveError(sessionId, error){
    	let query = "insert into sn_errors(sessionId, errorMessage)values(?,?)";
    	return this.dbService.query(query, [sessionId, error]);
    }
    
    deleteErrors(sessionId){
    	let query = "delete from sn_errors where sessionId = ?";
    	return this.dbService.query(query, [sessionId]);
    }
    
    insertHistory(sn: SessionNote){
    	let query = "insert into sn_history (studentId,firstName,lastName,sessionType,sessionDate,timeIn,timeOut,ifspServiceDuration,dateNoteWritten,absentCardId,cardId,appSessionId, rate)"+
    	" values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        console.log(sn);
    	return this.dbService.query(query, [
    	          sn.studentId,
    	          sn.firstName,
    	          sn.lastName,
                  sn.sessionType,
                  sn.sessionDate,
                  sn.timeIn,
                  sn.timeOut,
                  sn.ifspServiceDuration,
                  sn.dateNoteWritten,
				  sn.absentCardId,
				  sn.cardId,
				  sn.appSessionId,
				  !sn.rate || Utils.isEmpty(String(sn.rate)) ? null : sn.rate
         ]);
    }
    
    getAllHistory(){
    	let query = "select * from sn_history";
    	return this.dbService.query(query, []);
    }
    
    getSessionExtras(sessionId){
    	let query = "select * from sn_extra where sessionId = ?";
    	return this.dbService.query(query,[sessionId]);
    }
    
    deleteAllSessionExtras (sessionId){
    	let query = "delete from sn_extra where sessionId = ?";
    	return this.dbService.query(query, [sessionId]);
    }
    
    deleteSpecificExtraType(sessionId, extraType){
    	let query = "delete from sn_extra where sessionId = ? and fieldType = ?";
    	return this.dbService.query(query, [sessionId,extraType]);
    }
    
    insertExtra(extra){
    	let insert = "insert into sn_extra(sessionId, fieldType, fieldValue, valueSequence, dataType)"+
    	" values(?,?,?,?,?)";
    	return this.dbService.query(insert, [
    	                             extra.sessionId,
    	                             extra.fieldType, 
    	                             extra.fieldValue, 
    	                             extra.valueSequence, 
    	                             extra.dataType]);
    }

    prepareExtraInsert(extra): SqlBatch{
		return new SqlBatch(
			"insert into sn_extra(sessionId, fieldType, fieldValue, valueSequence, dataType)"+
    	" values(?,?,?,?,?)",[
    	                             extra.sessionId,
    	                             extra.fieldType, 
    	                             extra.fieldValue, 
    	                             extra.valueSequence, 
    	                             extra.dataType]);
	}
    
}