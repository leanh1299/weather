import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatetimeService } from 'src/app/core/services/datetime.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { IconService } from 'src/app/core/services/icon.service';
import { listStagger } from 'src/app/core/animations/list-stagger.animation';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
@Component({
    selector: 'app-hourly-view',
    templateUrl: './hourly-view.component.html',
    styleUrls: ['./hourly-view.component.scss'],
    animations: [
        listStagger,
        trigger('list', [transition(':enter', [query('@items', stagger(30, animateChild()))])]),
        trigger('items', [
            transition(':enter', [
                style({ transform: 'scale(0.5)', opacity: 0 }), // initial
                animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', style({ transform: 'scale(1)', opacity: 1 })), // final
            ]),
        ]),
    ],
})
export class HourlyViewComponent implements OnInit, OnChanges {
    constructor(public datetime: DatetimeService, public weather: WeatherService, public icons: IconService) { }

    @Input() hourlyWeather: any;
    @Input() weatherLocation: string;
    @Input() currentWeather: any;
    @Input() forecast: any;

    public offSet: any;
    public realHour: any;
    public temperatureC: any;


    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hourlyWeather && changes.hourlyWeather.currentValue) {
            changes.hourlyWeather.currentValue.data.forEach((hour) => {
                hour.ogTemperature= Math.round(hour.temperature);
                hour.ogDate= hour.time;
                if (changes.currentWeather && changes.currentWeather.currentValue) {
                    const forecast= changes.forecast.currentValue;
                    this.offSet= forecast.offset;
                    console.log("logOffset", this.offSet);
                    hour.time= this.getTimeOfDay(hour.time);
                    hour.temperature= this.weather.getTemperatureFormat((hour.temperature- 32) / 1.8);
                    hour.icon= this.icons.getIconFromMapping(hour.icon);
                    hour.precipProbability= Math.round(hour.precipProbability*1000)/10;
                    // hour.
                }
            });
        }
    }
    getTimeOfDay(timestamp) {
        const date= new Date(timestamp * 1000);
        let hour= date.getHours();
        if (this.offSet && hour - (7 - this.offSet) > 0 || hour - (7 - this.offSet) == 0) {
            this.realHour= hour - (7 - this.offSet);
        } else {
            this.realHour= hour + 17 + this.offSet;
        }
        const ampm= this.realHour >= 12 ? 'pm' : 'am';
        this.realHour= this.realHour % 12;
        this.realHour= this.realHour ? this.realHour : 12;
        return this.realHour + ' ' + ampm;
    }
}
