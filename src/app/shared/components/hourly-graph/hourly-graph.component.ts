import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import {curveBasis, curveNatural} from 'd3-shape';
import { DatetimeService } from 'src/app/core/services/datetime.service';
import { IconService } from 'src/app/core/services/icon.service';

@Component({
    selector: 'app-hourly-graph',
    templateUrl: './hourly-graph.component.html',
    styleUrls: ['./hourly-graph.component.scss']
})
export class HourlyGraphComponent implements OnInit, OnChanges {

    constructor( ) {}

    multi: any[];

    // options
    legend= false;
    showLabels= false;
    animations= true;
    xAxis=  true;
    yAxis= true;
    showYAxisLabel= false;
    showXAxisLabel= false;
    xAxisLabel= 'Year';
    yAxisLabel= 'Population';
    timeline= false;
    curve: any= curveNatural;
    showRefLabels= true;
    yScaleMin= 0;
    yScaleMax= 150;
    showGridLines= false;
    @Input() hourlyWeather: any;

    colorScheme= {
        domain: ['#2196f3']
    };
    ngOnChanges(changes: SimpleChanges) {
        let lowestTemp= 125;
        let maxTemp= -55;

        if (changes.hourlyWeather.currentValue) {
            this.multi= [
                {
                    name: 'Hourly forecast at a glance',
                    series: []
                },
            ];
            for (let i= 0; i < 24; i++) {
                const hour=  changes.hourlyWeather.currentValue.data[i];
                lowestTemp= lowestTemp < hour.ogTemperature ? lowestTemp : hour.ogTemperature;
                maxTemp= maxTemp > hour.ogTemperature ? maxTemp : hour.ogTemperature;
                this.multi[0].series.push({
                    name: new Date(hour.ogDate * 1000),
                    value: hour.ogTemperature,
                    icon: hour.icon
                });
            }
            this.yScaleMin= lowestTemp - 5;
            this.yScaleMax= maxTemp + 5;
        }
    }
    ngOnInit() {}

    getXAxisTickFormatting(val) {
        // console.log(val);
        return val;
    }

    onSelect(data): void {
        // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

}
