import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SearchResult } from '../../model/model.search-result';
import { ServerUrl } from '../../statics/server-url';
import { SeismicData } from '../../model/model.seismic-data';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  searchData(params: HttpParams): Observable<SearchResult<SeismicData>> {
    return this.http.get<SearchResult<SeismicData>>(ServerUrl.rootUrl + '/api/data/searchData', { params });
  }

  downloadFile(seismicData: SeismicData):  Observable<Blob> {
    return this.http.post(ServerUrl.rootUrl + '/api/data/downloadFile', seismicData, {responseType: 'blob'});
  }
}
