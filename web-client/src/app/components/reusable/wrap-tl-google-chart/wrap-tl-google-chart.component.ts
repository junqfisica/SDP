import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent, GoogleChartComponent } from 'ng2-google-charts';

import { DataTable } from '../../../auxiliary-classes/data-table';
import { Station } from '../../../model/model.station';
import { Channel } from '../../../model/model.channel';
import { DateUtil } from '../../../statics/date-util';
import { UploadFile } from '../../../model/model.upload-file';
import { SeismicData } from '../../../model/model.seismic-data';

@Component({
  selector: 'app-wrap-tl-google-chart',
  templateUrl: './wrap-tl-google-chart.component.html',
  styleUrls: ['./wrap-tl-google-chart.component.css']
})
export class WrapTlGoogleChartComponent implements OnInit {

  @Input() height: number;
  
  @Input() set dataSet (value: any) {
    this._dataSet = value;
    this.dataChanged();
  }
  
  
  @Output()
  onSelectChart = new EventEmitter<ChartSelectEvent>();
  
  @Output()
  onChangeDataSet = new EventEmitter<WrapTlGoogleChartComponent>();
  
  
  isDataLoaded = false;
  private _dataSet: any;
  private _chart: GoogleChartComponent

  @ViewChild('chart', { static: false }) set content(content: GoogleChartComponent) {
    // Called everytime the isDataLoaded change status.
    this._chart = content;
  }
  
  timelineChart: GoogleChartInterface =  {
    chartType: 'Timeline',
    options: {
      height: this.height,
      timeline: { 
        showRowLabels: true,
        showBarLabels: true
      },
      avoidOverlappingGridLines: false
    },
    dataTable: {
      cols:[],
      rows: []
    }
  };

  constructor() { }

  ngOnInit() {
  }

  get dataSet(): any {
    return this._dataSet;
  }

  loadChartData(dataSet :any) {
    
    this.isDataLoaded = false;

    if (dataSet && dataSet.length > 0) {
      const dataTable = new DataTable();
      // add columns
      dataTable.addColumn("Name","string");
      dataTable.addColumn("Label","string");
      dataTable.addColumn("From","date");
      dataTable.addColumn("To","date");
  
      let count =0;
      for (const data of dataSet) {
        count++;        
        if (data instanceof Station){
          const createDate = new Date(data.creation_date);
          const removalDate = data.removal_date ? new Date(data.removal_date) : new Date();
          dataTable.addRow([data.network_id + "-" + data.name, data.name, createDate,  removalDate]);
        
        } else if (data instanceof Channel) {
          dataTable.addRow(
            [data.name, data.name + "-" + count, DateUtil.convertUTCStringToDate(data.start_time),  
            DateUtil.convertUTCStringToDate(data.stop_time)]);
        
        } else if (data instanceof UploadFile) {
          const startTime = DateUtil.convertUTCStringToDate(data.start_time);          
          dataTable.addRow(
            [data.ch + " at " + startTime.toLocaleDateString() , 
              data.file_name, startTime, DateUtil.convertUTCStringToDate(data.end_time)]);
        
        } else if (data instanceof SeismicData) {
          const startTime = DateUtil.convertUTCStringToDate(data.start_time);          
          dataTable.addRow(
            ["File at " + startTime.toLocaleDateString() , 
              data.filename, startTime, DateUtil.convertUTCStringToDate(data.stop_time)]);
        } else {
          console.error("Data must be instance of [Station, Channel, UploadFile].");
        }
      };
      
      this.setDataTable(dataTable);
      
      // Only shows chart if there is data
      if (this.timelineChart.dataTable.rows.length > 0){  
        this.isDataLoaded = true;
      }
    }
    
  }

  setDataTable(dataTable: DataTable){
    this.timelineChart.dataTable = dataTable;
  }

  dataChanged(){
    this.timelineChart.options = {
      height: this.height,
      timeline: { 
        showRowLabels: true,
        showBarLabels: true
      }
    };
    
    this.loadChartData(this.dataSet);
    DataTable.reDrawGoogleChart(this._chart);

    if (this.onChangeDataSet) {
      this.onChangeDataSet.emit(this);
    }
  }

}
