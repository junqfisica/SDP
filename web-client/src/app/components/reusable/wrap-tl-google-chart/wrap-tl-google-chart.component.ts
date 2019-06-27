import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent, GoogleChartComponent } from 'ng2-google-charts';

import { DataTable } from '../../../auxiliary-classes/data-table';
import { Station } from '../../../model/model.station';
import { Channel } from '../../../model/model.channel';
import { DateUtil } from '../../../statics/date-util';
import { UploadFile } from '../../../model/model.upload-file';

@Component({
  selector: 'app-wrap-tl-google-chart',
  templateUrl: './wrap-tl-google-chart.component.html',
  styleUrls: ['./wrap-tl-google-chart.component.css']
})
export class WrapTlGoogleChartComponent implements OnInit {

  
  @Input() set dataSet (value: Station[] | Channel[]) {
    this._dataSet = value;
    this.dataChanged();
  } 
  
  @Output()
  onSelectChart = new EventEmitter<ChartSelectEvent>();
  
  @Output()
  onChangeDataSet = new EventEmitter<WrapTlGoogleChartComponent>();
  
  
  isDataLoaded = false;
  private _dataSet: Station[] | Channel[];
  private _chart: GoogleChartComponent

  @ViewChild('chart', { static: false }) set content(content: GoogleChartComponent) {
    // Called everytime the isDataLoaded change status.
    this._chart = content;
  }
  
  timelineChart: GoogleChartInterface =  {
    chartType: 'Timeline',
    options: {
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

  constructor() {}

  ngOnInit() {
  }

  get dataSet(): Station[] | Channel[] {
    return this._dataSet;
  }

  loadChartData(dataSet :Station[] | Channel[] | UploadFile[]) {
    
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
    
    this.loadChartData(this.dataSet);
    DataTable.reDrawGoogleChart(this._chart);

    if (this.onChangeDataSet) {
      this.onChangeDataSet.emit(this);
    }
  }

}
