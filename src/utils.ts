import * as moment from 'moment'; 
import { Observable }     from 'rxjs/Observable';
import {  LoadingController, Loading, AlertController, Alert, NavController  } from 'ionic-angular';

export class Utils {
	static removeAllEmpty(obj) {
		for (var i in obj) {
			if (obj[i] === null || obj[i] === undefined || obj[i] === 'undefined') {
				delete obj[i];
			}
		}
	}

	static getTimeWithMinutes = function (minutes): Date {
		var d = new Date();
		d.setMinutes(d.getMinutes() + minutes);
		var str = "" + d.getHours() + ":" + d.getMinutes();
		return moment(str, "HH:mm").toDate();
		//return str;
	}

	static getTimeWithMinutesAsString = function (minutes) {
		var d = new Date();
		d.setMinutes(d.getMinutes() + minutes);
		var str = "" + d.getHours() + ":" + d.getMinutes();
		d = new Date(new Date().toDateString() + ' ' + str);
		return "" + d.getTime();
	}


	static getFormattedDate(date: Date) {
		//var str = "" + date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear();
		return moment(date).format();
	}
    
	//returns a date with time in standard format
	static getFormattedDateAndTime(date: Date, format?: string): string{
		if(!format)
		   format = "YYYY-MM-DD hh:mm A";
		return moment(date).format( format);
		//return "" + date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear() +" "+date.getHours()+":"+date.getMinutes();
	}

	static getDateFromDateAndTime(str: string): Date{
		return moment(str, "YYYY-MM-DD HH:mm A").toDate();
	}

	static getDateFromString(date: string, format?: string): Date{
		if(Utils.isEmpty(date))
		   return new Date();

	    if(Utils.isEmpty(format)) //assuming ISO format
		   return moment(date).toDate();

	    return moment(date, format).toDate();
	}

	static getMinutesDiff(date1: Date, date2: Date): number{
		return moment(date1).diff(moment(date2), 'minutes');
	}

	static isNonBusinessHours(date: Date): boolean{
		var morning = moment("07:00", "HH:mm");
		var evening = moment("19:00", "HH:mm");
		var m = moment(date);
		return m.isBefore(morning) || m.isAfter(evening);
	}

	static addDaysToDate(date: Date, days: number): Date{
		return moment(date).add("days", days).toDate();
	}

	static isToday(date: Date): boolean{
		return moment(new Date()).isSame(moment(date), 'd');
	}

	static getWeekOfYear(date: Date){
		return moment(date).week();
	}

	static getMonthOfYear(date: Date){
		return moment(date).month();
	}

	static getSunday(date: Date){
		// return moment(date).startOf('week').valueOf();
		return moment(date).isoWeekday(0).hour(0).minute(0).second(0).millisecond(0).valueOf();
	}

	static isEmpty(str: string){
		return !str || str === null || (""+str).trim() === "";
	}


	static isEmptyArr(arr: Array<any>){
		return !arr ||arr == null || arr.length === 0;
	}

	static getTotal(...numb: number[]): number{
     let total: number = 0;
     for(let i =0; i < numb.length; i++){
       if(!numb[i] || numb[i] === null)continue;
        total += (1 * numb[i]);
     }
     return total;
   }




static isTrue(value): boolean{
	if(!value) return false;
    if (typeof(value) == 'string'){
        value = value.toLowerCase();
    }
    switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default: 
            return false;
    }
}


 static handleError (error: any, nav: NavController, LoginPage, errorAlert?: Alert) {

        if(error.status === 403 || error.status === 401){
            nav.setRoot(LoginPage);
        }
		if(errorAlert){
			errorAlert.present();
		}
       let errMsg = (error.message) ? error.message :
       error.status ? `${error.status} - ${error.statusText}` : 'Server error';
       return Observable.throw(errMsg);
    }

static getAlertWithGenericSubmissionError(alertCtrl: AlertController, loading?: Loading){
       return alertCtrl.create({
       subTitle: "An error occured while submitting to Challenge. Please try again later",
       title: "Error!",
       buttons: [{
                text: 'OK',
                handler:  (data) => {
                  if(loading)
                     try{loading.dismiss();}catch(e){}
                }
         }]})
   }


 static clone(originalObject, circular?: any) {
    // First create an empty object with
    // same prototype of our original source

    var propertyIndex,
        descriptor,
        keys,
        current,
        nextSource,
        indexOf,
        copies = [{
            source: originalObject,
            target: Object.create(Object.getPrototypeOf(originalObject))
        }],
        cloneObject = copies[0].target,
        sourceReferences = [originalObject],
        targetReferences = [cloneObject];

    // First in, first out
    while (current = copies.shift()) {
        keys = Object.getOwnPropertyNames(current.source);

        for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
            // Save the source's descriptor
            descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex]);

            if (!descriptor.value || typeof descriptor.value !== 'object') {
                Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                continue;
            }

            nextSource = descriptor.value;
            descriptor.value = Array.isArray(nextSource) ?
                [] :
                Object.create(Object.getPrototypeOf(nextSource));

            if (circular) {
                indexOf = sourceReferences.indexOf(nextSource);

                if (indexOf !== -1) {
                    // The source is already referenced, just assign reference
                    descriptor.value = targetReferences[indexOf];
                    Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                    continue;
                }

                sourceReferences.push(nextSource);
                targetReferences.push(descriptor.value);
            }

            Object.defineProperty(current.target, keys[propertyIndex], descriptor);

            copies.push({source: nextSource, target: descriptor.value});
        }
    }

    return cloneObject;
  }
}