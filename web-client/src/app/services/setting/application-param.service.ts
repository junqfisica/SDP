import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServerUrl } from '../../statics/server-url';
import { AppParams } from '../../model/model.app-param';

@Injectable()
export class ApplicationParamService {

  constructor(private http: HttpClient) { }

  getAllParams(): Observable<AppParams[]> {
    return this.http.get<AppParams[]>(ServerUrl.rootUrl + '/api/setting/appParams');
  }

  get(param_id: string): Observable<AppParams> {    
    return this.http.get<AppParams>(ServerUrl.rootUrl + '/api/setting/get/' + param_id);
  }

  updateAppParam(appParams: AppParams): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/setting/updateAppParams', appParams);
  }

  isUploadFolderOnline(): Observable<boolean> {
    const uploadFolderId = "uploadFolder"
    return this.http.get<boolean>(ServerUrl.rootUrl + '/api/setting/isFolderOnline?param_id=' + uploadFolderId);
  }
}
