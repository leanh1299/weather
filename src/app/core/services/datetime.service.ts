import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DatetimeService {

    constructor() { }

    public dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    getHoursOfDay(timestamp) {
        const date = new Date(timestamp * 1000);
        let hour = date.getHours();
        return hour ;
    }

    getWeekDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const weekday = date.getDay();
        return this.dayNames[weekday];
    }

}

