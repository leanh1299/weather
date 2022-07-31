import { Component, OnInit, Renderer2 } from '@angular/core';
import { WeatherService } from './core/services/weather.service';
import { MapsService } from './core/services/maps.service';
import { StorageService } from './core/services/storage.service';
import { Subject } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchComponent } from './shared/components/search/search.component';
import { MatDialog } from '@angular/material/dialog';
import { listStagger } from './core/animations/list-stagger.animation';
import * as suncalc from 'suncalc';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        listStagger
    ],
})
export class AppComponent implements OnInit {
    public title = 'weather';
    public loadingMessage = 'Try searching for a location!';
    public forecast: any;
    public locations: any = [];
    public selectedLocation: string;
    public sunCalculation: any;
    subject: Subject<any> = new Subject();
    constructor(
        public weather: WeatherService,
        public maps: MapsService,
        public storage: StorageService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private renderer: Renderer2
    ) {}
    public darkMode: boolean = false;
    public searchForm: FormGroup;
    public loading = false;

    ngOnInit() {
        // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        // if(prefersDark) {
        this.toggleDarkMode();
        // }
        this.getRecentHistory();
        this.searchForm = this.fb.group({
            searchInput: null,
        });

        this.searchForm
            .get('searchInput')
            .valueChanges.pipe(debounceTime(300))
            .subscribe((value) => {
                if (value) {
                    this.getPlacesAutocompleteByLocationKeyword(value);
                } else {
                    this.getRecentHistory();
                }
            });
        this.getLocation();
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.darkMode ? this.renderer.addClass(document.body, 'dark') : this.renderer.removeClass(document.body, 'dark');
    }

    getLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = position;
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;

                const weatherParams = {
                    latitude: latitude,
                    longitude: longitude
                }
                this.getWeatherForecast(weatherParams);
                this.sunCalculation = suncalc.getTimes(new Date(), latitude, longitude);
                console.log(99999999999,position);
            });
        } else {
            console.log('No support for geolocation');
        }
    }

    getWeather(location) {
        this.searchForm.patchValue({
            searchInput: location,
        });
        this.addLocationToRecentHistory(location);
        this.selectedLocation = location.name;
        this.loading = true;
        this.loadingMessage = `Finding weather in ${this.selectedLocation}`;

        const geocodeParams = {
            address: this.selectedLocation,
        };
        this.maps.getOpenCageGeocodeByAddress(geocodeParams).subscribe(
            (address) => {
                const coordinates = address.results[0].geometry;
                const weatherParams = {
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                };
                this.getWeatherForecast(weatherParams);
            },
            (error) => {
                console.error(error);
            }
        );
    }

    getWeatherForecast(weatherParams) {
        this.weather.getDarkyWeather(weatherParams).subscribe(
            (data) => {
                if (data) {
                    this.forecast = [];
                    this.loading = false;
                    this.forecast = data;
                    this.sunCalculation = suncalc.getTimes(
                        new Date(),
                        weatherParams.latitude,
                        weatherParams.longitude
                    );
                    if(this.sunCalculation) {
                        this.forecast.currently.sunCalculation = this.sunCalculation;
                    }
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }

    getPlacesAutocompleteByLocationKeyword(location: string) {
        this.locations = [];
        const params = {
            address: location,
            types: '(cities)',
        };
        this.maps.getPlacesAutocomplete(params).subscribe(
            (data) => {
                if (data) {
                    console.log(22222222222,data);
                    data.predictions.forEach((prediction) => {
                        this.locations.push({
                            name: prediction.description,
                            type: 'search_query',
                            
                        });
                    });
                }
                // this.forecast = data;
            },
            (error) => {
                console.error(error);
            }
        );
    }

    addLocationToRecentHistory(location) {
        location.type = 'recent';
        if (this.storage.getStorageItemByKey('search_history')) {
            let searchHistory = JSON.parse(this.storage.getStorageItemByKey('search_history'));
            searchHistory.push(location);
            searchHistory = searchHistory.reduce((acc, current) => {
                const x = acc.find((item) => item.name === current.name);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            this.storage.setStorageItem('search_history', JSON.stringify(searchHistory));
        } else {
            const searchHistory = [];
            searchHistory.push(location);
            this.storage.setStorageItem('search_history', JSON.stringify(searchHistory));
        }
    }

    searchFieldDisplay(locationName) {
        return locationName ? locationName.name : undefined;
    }

    clearSearchField() {
        this.searchForm.reset();
    }

    getRecentHistory() {
        if (this.storage.getStorageItemByKey('search_history')) {
            this.locations = JSON.parse(this.storage.getStorageItemByKey('search_history'));
        }
    }

    clearSearchHistory() {
        this.locations = [];
        this.storage.setStorageItem('search_history', JSON.stringify([]));
    }

    openSearchDialog() {
        const dialogRef = this.dialog.open(SearchComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'search-dialog',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getWeather(result);
            }
            console.log(result);
        });
    }
}
