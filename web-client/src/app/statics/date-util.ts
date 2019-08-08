import { formatDate } from '@angular/common';

export class DateUtil {

    static convertDateToUTCStringWithoutShift(date?: Date, fullPrecision=false): string {
        /**
         * Convert local time to UTC string, however it keeps the time itself unchanged.
         */

        const format = "EEE, dd MMM yyyy HH:mm:ss.SSSSSS ZZZZ"; 
        if (date) {
            let shift_utc: string;
            if (fullPrecision){
                shift_utc = formatDate(date.getTime() - date.getTimezoneOffset()*60000, format, 'en-US', 'GMT+00:00');
                // remove +, parse to request.args is not working with the +
                shift_utc = shift_utc.replace("GMT+","GMT");             
            } else {
                shift_utc = new Date(date.getTime() - date.getTimezoneOffset()*60000).toUTCString();
            }
            return shift_utc;
        }
        
        date = new Date();
        if (fullPrecision){ 
            let shift_utc = formatDate(date.getTime() - date.getTimezoneOffset()*60000, format, 'en-US', 'GMT+00:00');
            return shift_utc.replace("GMT+","GMT") 
        } else {
            return new Date(date.getTime() - date.getTimezoneOffset()*60000).toUTCString();
        }
    }

    static convertUTCStringToDate(utcStringDate: string): Date {
        /**
         * This method shifts the UTC string to local Date keeping the same date and time.
         * Import!! It doesn't convert to UTC, the time will still be displayed with timezone.
         */
        const date = new Date(utcStringDate);
        return new Date(date.getTime() + date.getTimezoneOffset()*60000);
    }
}