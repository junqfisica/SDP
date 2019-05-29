export class DateUtil {

    static convertDateToUTCStringWithoutShift(date: Date): string {
        /**
         * Convert local time to UTC string, however it keeps the time itself unchanged.
         */
        if (date) {
            const shift_utc = new Date(date.getTime() - date.getTimezoneOffset()*60000).toUTCString();             
            return shift_utc;
        }
        
        date = new Date();
        return new Date(date.getTime() - date.getTimezoneOffset()*60000).toUTCString();
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