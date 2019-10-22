import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

function toMonth(value: any): String {
    if (isNumber(value)) {
        switch(value) {
            case "01":
                return "Jun";
            case "02":
                return "Feb"; 
            case "03":
                return "Mar";
            case "04":
                return "Apr";    
            case "05":
                return "May";
            case "06":
                return "Jun"; 
            case "07":
                return "Jul";
            case "08":
                return "Aug"; 
            case "09":
                return "Sep";
            case "10":
                return "Oct"; 
            case "11":
                return "Nov";
            case "12":
                return "Dec"; 
            default:  
                return "";                      
        }
    } else {
        return "";
    }
}

function parseMonth(value: any): String {
    switch(value) {
        case "Jun":
            return "01";
        case "Feb":
            return "02"; 
        case "Mar":
            return "03";
        case "Apr":
            return "04";    
        case "May":
            return "05";
        case "Jun":
            return "06"; 
        case "Jul":
            return "07";
        case "Aug":
            return "08"; 
        case "Sep":
            return "09";
        case "Oct":
            return "10"; 
        case "Nov":
            return "11";
        case "Dec":
            return "12"; 
        default:  
            return "";                      
    }
}


@Injectable()
export class CustomNgbDateFormatter extends NgbDateParserFormatter {
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return {year: toInteger(dateParts[0]), month: null, day: null};
            } else if (dateParts.length === 2 && isNumber(parseMonth(dateParts[0])) && isNumber(dateParts[1])) {
                return {year: toInteger(dateParts[1]), month: toInteger(parseMonth(dateParts[0])), day: null};
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(parseMonth(dateParts[1])) && isNumber(dateParts[2])) {
                return {year: toInteger(dateParts[2]), month: toInteger(parseMonth(dateParts[1])), day: toInteger(dateParts[0])};
            }
        }   
        return null;
    }

    format(date: NgbDateStruct): string {
        let stringDate: string = ""; 
        if(date) {
            stringDate += isNumber(date.day) ? padNumber(date.day) + "-" : "";
            stringDate += isNumber(date.month) ? toMonth(padNumber(date.month)) + "-" : "";
            stringDate += date.year;
        }
        return stringDate;
    }
}