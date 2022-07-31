import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    constructor(private http: HttpClient) { }

    getDarkyWeather(params): Observable<any> {
        const url = `https://api.samuelhinkhouse.com/forecast/?latitude=${params.latitude}&longitude=${params.longitude}`;

        return this.http.get(url)
            .pipe(
                tap(weather => weather),
                catchError(this.handleError('getWeather', []))
            );
    }

    getTemperatureFormat(temp) {
        return `${Math.round(temp)}°C`;
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
