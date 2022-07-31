import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { DatetimeService } from 'src/app/core/services/datetime.service';
import { IconService } from 'src/app/core/services/icon.service';
import { items, list, listStagger } from 'src/app/core/animations/list-stagger.animation';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-weekly-glance',
    templateUrl: './weekly-glance.component.html',
    styleUrls: ['./weekly-glance.component.scss'],
    animations: [list, items, listStagger]
})
export class WeeklyGlanceComponent implements OnInit, OnChanges {

    constructor(public weather: WeatherService, public datetime: DatetimeService, public icons: IconService, private titlecasePipe:TitleCasePipe) { }

    @Input() dailyWeather: any;
    @Input() weatherLocation: string;

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.dailyWeather && changes.dailyWeather.currentValue) {
            changes.dailyWeather.currentValue.data.forEach((day) => {
                day.weekdayName = this.datetime.getWeekDate(day.time);
                day.temperatureHigh = this.weather.getTemperatureFormat((day.temperatureHigh - 32)/1.8);
                day.temperatureLow = this.weather.getTemperatureFormat((day.temperatureLow - 32)/1.8);
                day.icon = this.icons.getIconFromMapping(day.icon);
            });
        }
    }

    getSummaryFromIconName(iconName: string) {
        return this.titlecasePipe.transform(iconName.replace('-', ' '));
    }

}
