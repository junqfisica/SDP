import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SearchResult } from '../../model/model.search-result';
import { ServerUrl } from '../../statics/server-url';
import { SeismicData } from '../../model/model.seismic-data';
import { Channel } from '../../model/model.channel';

@Injectable()
export class PublicService {

  constructor(private http: HttpClient) { }

  searchData(params: HttpParams): Observable<SearchResult<SeismicData>> {
    return this.http.get<SearchResult<SeismicData>>(ServerUrl.rootUrl + '/api/public/searchData', { params });
  }

  downloadFileList(seismicDataList: SeismicData[]):  Observable<Blob> {
    return this.http.post(ServerUrl.rootUrl + '/api/public/downloadFileList', seismicDataList, {responseType: 'blob'});
  }

  downloadFile(seismicData: SeismicData):  Observable<Blob> {
    return this.http.post(ServerUrl.rootUrl + '/api/public/downloadFile', seismicData, {responseType: 'blob'});
  }
}
