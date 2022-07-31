import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DatetimeService } from 'src/app/core/services/datetime.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { IconService } from 'src/app/core/services/icon.service';
import { listStagger } from 'src/app/core/animations/list-stagger.animation';
import { element } from 'protractor';
import * as suncalc from 'suncalc';
import { isBuffer } from 'util';
// import Iconify from '@iconify/iconify';

@Component({
    selector: 'app-todays-summary',
    templateUrl: './todays-summary.component.html',
    styleUrls: ['./todays-summary.component.scss'],
    animations: [listStagger]
})
export class TodaysSummaryComponent implements OnInit, OnChanges {

    constructor(public datetime: DatetimeService, public weather: WeatherService, public icons: IconService) { }

    @Input() currentWeather: any;
    @Input() dailyWeather: any;
    @Input() hourlyWeather: any;
    @Input() weatherLocation: string;
    @Input() forecast: any;
    public currentDate: Date = new Date();
    public state: any;
    public sunrise: any;
    public sunset: any;
    public celsius: any;
    public apparentCelsius: any;
    public sunCalculation: any;
    public locationHours: any;
    public locationMinutes: any;
    public sunriseHours: any;
    public sunriseMin: any;
    public locationTime: any;
    public yesterdayDate: any;
    public tomorrowDate: any;
    public dateToday: any;
    public humidity: any;
    public dewPoint: any;
    public ozone: any;
    public precipProbability: any;
    public precipProbability2: any;
    public uvIndex: any;
    public windBearing: any;
    public windSpeed: any;
    public visibility: any;
    public temperatureMax: any;
    public temperatureMin: any;
    public latitude: any;
    public longitude: any;


    ngOnInit() {

        this.locationTime = this.currentDate.getTime();


    }

    // getLocation(): void {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             const location = position;
    //             const longitude = position.coords.longitude;
    //             const latitude = position.coords.latitude;

    //             const weatherParams = {
    //                 latitude: latitude,
    //                 longitude: longitude
    //             }
    //             this.getWeatherForecast(weatherParams);
    //             this.sunCalculation = suncalc.getTimes(new Date(), latitude, longitude);
    //             console.log(99999999999, position);
    //         });
    //     } else {
    //         console.log('No support for geolocation');
    //     }
    // }

    // displayLocation(latitude,longitude){
    //     var geocoder;
    //     geocoder = new google.maps.Geocoder();
    //     var latlng = new google.maps.LatLng(latitude, longitude);

    //     geocoder.geocode(
    //         {'latLng': latlng}, 
    //         function(results, status) {
    //             if (status == google.maps.GeocoderStatus.OK) {
    //                 if (results[0]) {
    //                     var add= results[0].formatted_address ;
    //                     var  value=add.split(",");

    //                     count=value.length;
    //                     country=value[count-1];
    //                     state=value[count-2];
    //                     city=value[count-3];
    //                     x.innerHTML = "city name is: " + city;
    //                 }
    //                 else  {
    //                     x.innerHTML = "address not found";
    //                 }
    //             }
    //             else {
    //                 x.innerHTML = "Geocoder failed due to: " + status;
    //             }
    //         }
    //     );
    // }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.currentWeather && changes.currentWeather.currentValue) {
            const currentWeather = changes.currentWeather.currentValue;
            const dailyWeather = changes.dailyWeather.currentValue;
            const hourlyWeather = changes.hourlyWeather.currentValue;
            const forecast = changes.forecast.currentValue;
            //thong tin thoi diem hien tai
            currentWeather.temperature = Math.round(currentWeather.temperature);
            currentWeather.apparentTemperature = Math.round(currentWeather.apparentTemperature);
            currentWeather.icon = this.icons.getIconFromMapping(currentWeather.icon);
            currentWeather.time = currentWeather.time;
            //thong tin forecast chung
            this.latitude = forecast.latitude;
            this.longitude = forecast.longitude;
            forecast.offset = Math.round(forecast.offset);
            //lay thong tin daily
            this.sunrise = dailyWeather.data[0].sunriseTime;
            this.sunset = dailyWeather.data[0].sunsetTime;
            this.temperatureMax = Math.round((dailyWeather.data[0].temperatureMax - 32) / 1.8);
            this.temperatureMin = Math.round((dailyWeather.data[0].temperatureMin - 32) / 1.8);
            //lay thong tin hourly
            this.dewPoint = hourlyWeather.data[0].dewPoint;
            this.humidity = hourlyWeather.data[0].humidity;
            this.ozone = hourlyWeather.data[0].ozone;
            this.precipProbability = hourlyWeather.data[0].precipProbability;
            this.precipProbability2 = Math.round(this.precipProbability*1000)/10;
            this.uvIndex = hourlyWeather.data[0].uvIndex;
            this.windBearing = hourlyWeather.data[0].windBearing;
            this.windSpeed = hourlyWeather.data[0].windSpeed;
            this.visibility = hourlyWeather.data[0].visibility;
            this.celsius = Math.round((currentWeather.temperature - 32) / 1.8);
            
            this.apparentCelsius = Math.round((currentWeather.apparentTemperature - 32) / 1.8);

            //thong tin mat troi/mat trang
            if (navigator.geolocation) {
                this.sunCalculation = suncalc.getTimes(new Date(), forecast.latitude, forecast.longitude);
            } else {
                console.log('No support for geolocation');
            }
            const today = new Date();
            const yesterday = new Date(today);
            const tomorrow = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setDate(tomorrow.getDate() + 1);
            today.toDateString();
            this.yesterdayDate = yesterday.toDateString();
            this.tomorrowDate = tomorrow.toDateString();
            this.state = (this.currentDate.getHours() - (7 - forecast.offset)) < 0 ? (this.currentDate.getHours() + 17 + forecast.offset) : (this.currentDate.getHours() - (7 - forecast.offset));
            this.dateToday = (this.currentDate.getHours() - (7 - forecast.offset)) < 0 ? this.yesterdayDate : this.tomorrowDate;
            if (this.state < 10) {
                this.locationHours = '0' + this.state;
            } else {
                this.locationHours = this.state;
            }
            this.locationMinutes = this.currentDate.getMinutes();
            if (this.currentDate && this.currentDate.getMinutes() < 10) {
                this.locationMinutes = '0' + this.currentDate.getMinutes();
            }
            //caculate Sunrise&Sunset
            this.sunriseHours = this.currentDate.getHours();
            this.sunriseMin = this.currentDate.getMinutes();

            console.log("logYesterday", this.yesterdayDate);
            console.log("logdateToday", this.dateToday);
            console.log("logCurrentDate", this.currentDate.getHours());
            console.log("logLatLongtitude", this.sunCalculation);
            console.log("logHours", this.state);
            console.log("logSunriseTime", this.sunrise);
            console.log("logCurrentTime", this.currentWeather.time);
            console.log("logSunsetTime", this.sunset);
            console.log("logTemperatureC", this.celsius);
            console.log("logTemperatureFF", currentWeather.apparentTemperature);
            console.log("logIcon", this.currentWeather.icon);
            console.log("logTemperatureLatitude", this.forecast);
        }
    }

}
