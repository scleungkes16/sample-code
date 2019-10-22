import {Injectable} from "@angular/core";

// MonmentJS
import * as moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022';

@Injectable()
export class Helper {
   constructor() {

   }

  formatTimestamp(timpstamp) {
  	return moment.tz(timpstamp, 'Asia/Hong_Kong').format('HH:mm:ss [(HKT)] DD-MMM-YYYY');
  }

  parseDropdownDate(inputDate, inputTime) {
  	if(inputDate != null && inputDate != undefined && inputDate != ''){
  		console.log("inputDate:" + inputDate.year + "-" + this.checkValidDatefomat(inputDate.month) + "-" + this.checkValidDatefomat(inputDate.day) + inputTime);
	  	//var date = JSON.parse(inputDate);
	  	return inputDate.year + "-" + this.checkValidDatefomat(inputDate.month) + "-" + this.checkValidDatefomat(inputDate.day) + inputTime;
	  } else {
	  	return "";
	  }
  }

	checkValidDatefomat(value:number){
		if(value < 10){
			return "0" + value;
		}
		return value;
	}

}