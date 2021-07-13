import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'highchartsSample';
  highcharts = Highcharts;
  public chart;
  public sampleData = require('../assets/sample.json');
  public tempData = [];
  ngOnInit() {
    const format = 'YYYY/MM/DD/HH/mm/ss';
    this.sampleData.data.forEach(element => {
      const xxfrom = moment(element.site_time, format).format(format);
      const xfromarr = xxfrom.split('/');
      const xfrom = Date.UTC(parseInt(xfromarr[0], 10),
        parseInt(xfromarr[1], 10) - 1, parseInt(xfromarr[2], 10),
        parseInt(xfromarr[3], 10), parseInt(xfromarr[4], 10), parseInt(xfromarr[5], 10));
      this.tempData.push([(xfrom), element.tempreture]);
    });
    this.sampleData.data = this.tempData;
    this.displayHighCHarts()
  }

  displayHighCHarts() {
    let ser = [];
    let series = [{
      color: "#0043B7",
      data: this.sampleData.data,
      marker: { symbol: "round" },
      max: 94,
      min: 6,
      name: "Temperature"
    }];
    const serlength = 1;
    const data = series;
    const from = "2021-07-12 09:00:00";
    const to = "2021-07-13 09:00:00";
    const format = 'YYYY/MM/DD/HH/mm/ss';
    const xxfrom = moment(from, format).format(format);
    const xfromarr = xxfrom.split('/');
    const xfrom = Date.UTC(parseInt(xfromarr[0], 10),
      (parseInt(xfromarr[1], 10) - 1), parseInt(xfromarr[2], 10), parseInt(xfromarr[3], 10),
      parseInt(xfromarr[4], 10), parseInt(xfromarr[5], 10));
    const xxto = moment(to, format).format(format);
    const xtoarr = xxto.split('/');
    const xto = Date.UTC(parseInt(xtoarr[0], 10),
      (parseInt(xtoarr[1], 10) - 1), parseInt(xtoarr[2], 10), parseInt(xtoarr[3], 10),
      parseInt(xtoarr[4], 10), parseInt(xtoarr[5], 10));
    const int = 7200000;
    ser.push(series[0]);
    ser.push({
      name: series[0].name + ' ' + 'Min ' +
        series[0].min, color: '#000000', marker: { 'symbol': 'round' }, data: [], min: 0, max: 0
    });
    ser.push({
      name: series[0].name + ' ' + 'Max ' +
        series[0].max, color: '#000000', marker: { 'symbol': 'round' }, data: [], min: 0, max: 0
    });
    ser[1].data.push(([xfrom, series[0].min]), ([xto, series[0].min]));
    ser[2].data.push(([xfrom, series[0].max]), ([xto, series[0].max]));
    console.log(ser);

    const getUnits = function (name) {
      switch (name) {
        case 'Temperature':
          return '°C';
        default:
          return '';
      }
    };

    this.chart = Highcharts.chart({
      chart: {
        renderTo: 'container',
        zoomType: 'x',
        events: {
        }
      },
      tooltip: {
        formatter: function () {
          const x = new Date(this.x);
          const xformt = (x.toISOString());
          const xval = xformt.replace('T', ' ').replace('Z', '').split(/-|\s|:/);
          const xformat = xval[1] + '/' + xval[2] + '/' + xval[0] + ' ' + xval[3] + ':' + xval[4] + ':' + xval[5].substr(0, 2);
          let s = '<b>' + xformat + '</b>';
          if (serlength === 1) {
            if (this.points[0].series.name === ser[0].name) {
              s += '<br/>' + ser[0].name + ': ' +
                this.y + ' ' + getUnits(ser[0].name);
            }
            if (ser[1]) {
              s += '<br/>' + ser[0].name + ' Min' + ': ' +
                ser[1].data[0][1] + ' ' + getUnits(ser[0].name);
              s += '<br/>' + ser[0].name + ' Max' + ': ' +
                ser[2].data[0][1] + ' ' + getUnits(ser[0].name);
            }


          } else {
            this.points.forEach(element => {
              s += '<br/>' + element.series.name + ': ' +
                element.y + ' ' + getUnits(element.series.name);
            });
          }
          return s;
        },
        shared: true,
        backgroundColor: '#575756',
        style: {
          color: '#fff'
        }
      },
      exporting: {
        enabled: false,
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        min: xfrom,
        tickInterval: 7200000,
        type: 'datetime',
        'labels': {
          'format': '{value:%m/%d %H:%M}'
        },
        tickPositioner: function () {
          let min = this.min;
          const max = this.max;
          const tint = this.options.tickInterval;
          // tslint:disable-next-line: prefer-const
          let ticks: any = [],
            count = 0;
          while (min < max) {
            ticks.push(min);
            min += tint;
            count++;
          }
          ticks.info = {
            unitName: 'day',
            higherRanks: {},
            totalRange: 7200000
          };
          return ticks;
        }
      },
      yAxis: {
        title: {
          text: 'Sample',
          style: {
            interval: 5000,
            fontSize: '13px',
            fontFamily: 'alber-normal, Arial',
            color: '#666666'
          },
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#7d7575',
          'cursor': 'default'
        },
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              return false;
            },
          },
          pointStart: xfrom,
          pointInterval: 7200000,
          connectNulls: true
        }
      },
      series: ser,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    }
    );
  }
}
