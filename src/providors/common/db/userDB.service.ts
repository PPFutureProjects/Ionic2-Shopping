import {Injectable, Inject} from '@angular/core';


import {DBService} from './db.service'

@Injectable()
export class UserDB{

    constructor(public  dbService: DBService){

    }


    all () {
        let query = 'SELECT * FROM user_table';
    	return this.dbService.query(query, []);
    }
    
    getByusername (username) {
    	let query = 'SELECT * FROM user_table WHERE username = ?';
    	return this.dbService.query(query, [username]);
    }
    
    lastLoggedIn (){
    	let query = "select (case when date(lastLoggedIn,'localtime','start of day') = date('now','localtime','start of day') then 1 else 0 end)  as lastLoggedIn from user_table  where userId = 1";
    	return this.dbService.query(query, []);
    }
    
    setLoggenIn (){
    	let update = "update user_table set lastLoggedIn= DateTime('now')  where userId = 1";
    	return this.dbService.query(update,[]);
    }
    

    lastDataLoaded (){
    	let query = "select lastTimeDataLoaded from user_table ";
    	return this.dbService.query(query, []);
    }
    
    setDataLoaded (t: number){
		console.log(t);
    	let update = "update user_table set lastTimeDataLoaded= ? ";
    	return this.dbService.query(update,[t]);
    }
    
    isFirstTimeThisWeek (week){
    	let query = "select week from user_table where  week = "+week+" and userId = 1";
    	return this.dbService.query(query, []);
    }
    
    adhoc (){
    	let query = "select week, strftime('%W', week) strfweek, strftime('%W', 'now') strfnow from user_table where userId = 1";
    	return this.dbService.query(query, []);
    }
    
    setWeek (week){
        console.log("week:"+week);
    	let update = "update user_table set week= "+week+" where userId = 1";
    	return this.dbService.query(update,[]);
    }


	deleteAll(){
		let query = "delete from user_table ";
		return this.dbService.query(query, []);
	}
    
    insert (user){
    	let query = "insert or replace into user_table (userId,username,pass,employeeId, lastTimeDataLoaded) values(?,?,?,?,?)";
    	return this.dbService.query(query, [1, user.username,user.pass,user.employeeId, user.lastTimeDataLoaded]);
    }


	setGapCount(gap){
		let query = "update user_table set gapCount = ?";
        return this.dbService.query(query, [gap]);
	}


}