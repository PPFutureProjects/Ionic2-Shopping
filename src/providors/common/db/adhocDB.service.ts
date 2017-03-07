import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'
import {Mandate} from '../../../beans/Mandate.bean';

@Injectable()
export class AdhocDB{

    constructor(public  dbService: DBService){

    }

		getSelectStudents(studentId?: string) {
			let query = "select student.studentId,firstName,lastName,dateOfBirth,male,female,office, " +
				"  serviceBegin,  serviceEnd," +
				"serviceTypeDefinition as serviceType, sessionCode, serviceMethodType, moreSame,more3hb, ifspId, sessionCountToday, sessionCountLastWeek, sessionCountLastMonth, sessionCountThisMonth, " +
				"sessionCountThisWeek, sessionCountIfspId,serviceDaysPerWeek,frequencyPerMonth, totalBillingServiceUnits, gapCount,makeUps,  makeupCount " +
				" cancelledSessionCountToday, cancelledSessionCountLastWeek, cancelledSessionCountLastMonth, cancelledSessionCountThisMonth, cancelledSessionCountThisWeek, cancelledSessionCountIfspId " +
				"from student, ifsp where student.studentId = ifsp.studentId ";
			if (studentId)
				query += " and trim(ifsp.studentId) = '" + studentId + "'";
			query += " order by lastName, firstName";
			console.log(query);
			return this.dbService.query(query,[]);
    }

		// updateCountsForIFSP(ifspId, sessionType: string, thisWeek: boolean, today: boolean) {
		// 	let query = "update ifsp set ";
		// 	if (sessionType === 'Regular' || sessionType === 'Makeup') {
		// 		query += "gapCount =0,  sessionCountThisMonth = sessionCountThisMonth + 1, sessionCountIfspId = sessionCountIfspId +1, ";
		// 		if (today)
		// 			query += "sessionCountToday = sessionCountToday +1,";
		// 		if (sessionType === 'Makeup')
		// 			query += "makeupCount = makeupCount + 1, "
		// 		else if (thisWeek)
		// 			query += " sessionCountThisWeek = sessionCountThisWeek +1, ";
		// 	} else if (sessionType === 'Cancelled') {
		// 		//     query+= "cancelledSessionCountToday = cancelledSessionCountToday +1, cancelledSessionCountThisMonth = cancelledSessionCountThisMonth + 1,cancelledSessionCountIfspId = cancelledSessionCountIfspId +1, "
		// 		if (thisWeek) {
		// 			query += "cancelledSessionCountThisWeek = cancelledSessionCountThisWeek +1, sessionCountThisWeek = sessionCountThisWeek +1,"
		// 			if (today)
		// 				query += "cancelledSessionCountToday = cancelledSessionCountToday +1, sessionCountToday = sessionCountToday +1, "
		// 		}
		// 		query += "cancelledSessionCountIfspId = cancelledSessionCountIfspId +1, "
		// 	}
			
		// 	query = query.substring(0, query.lastIndexOf(",")) + " where ifspId = ? ";
		// 	console.log(query);
		// 	return this.dbService.query(query, [ifspId]);
		// }


		updateCountsForIFSP(ifspId:number, mandate: Mandate){
			let query = "update ifsp set sessionCountToday = "+mandate.todayIfspSessions+", sessionCountThisMonth ="+mandate.monthlySessions+", sessionCountThisWeek = "+mandate.weeklySessions+
			", sessionCountIfspId="+mandate.todayIfspSessions+" where ifspId = ? ";		
		    console.log(query);
			return this.dbService.query(query, [ifspId]);
		}

		addOneForIfsp(ifspId:number){
			let query = "update ifsp set sessionCountToday = sessionCountToday +1, sessionCountThisMonth =sessionCountThisMonth + 1, sessionCountThisWeek = sessionCountThisWeek + 1 "+
			", sessionCountIfspId=sessionCountIfspId + 1 where ifspId = ? ";		
		    console.log(query);
			return this.dbService.query(query, [ifspId]);
		}


	checkForServiceMethodType(serviceMethodType){
		let query = "select sum(sessionCount) as sessionCount from (select sum(sessionCountToday) as sessionCount "+
		"from ifsp where serviceMethodType = ? ";

		return this.dbService.query(query,[serviceMethodType,serviceMethodType]);
	}

	//WHERE myDate >= date('now','-1 day')

	getTodaysSessionCount(studentId){
		let query = "select count(*) from sn_history where studentId = ? and sessionType <> 'Makeup' ";
		return this.dbService.query(query,[studentId]);
	}


	getNotesOnPhone(ifspId){
		let query = "select sessionDate from session_note where ifspId = ? and status in ('THERAPIST_SIGNED','PARENT_SIGNED')";

		return this.dbService.query(query,[ifspId]);
	}


	getMissingSessions(ifspId?){
		let query = "select distinct ifsp.ifspId, WeekOf, missing, student.studentId,firstName,lastName, serviceDaysPerWeek "+
		            "from missing_count as miss, ifsp, student "+
					"where miss.ifspId = ifsp.ifspId and student.studentId = ifsp.studentId ";
	    if(ifspId)
		   query += "and ifsp.ifspId = ? ";
		query += "order by lastName, firstName, WeekOf";
		if(ifspId)
		  return this.dbService.query(query,[ifspId]);
		return this.dbService.query(query,[]);
	}


}