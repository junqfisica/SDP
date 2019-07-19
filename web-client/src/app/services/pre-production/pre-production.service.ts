import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServerUrl } from '../../statics/server-url';
import { UploadDirStructure } from '../../model/model.upload-dir-structure';
import { UploadFile } from '../../model/model.upload-file';
import { FileTransferResult } from '../../model/model.file-transfer-result';


@Injectable()
export class PreProductionService {

  constructor(private http: HttpClient) { }

  scanUploadDir(): Observable<UploadDirStructure[]>{
    return this.http.get<UploadDirStructure[]>(ServerUrl.rootUrl + '/api/preProduction/scanUploadDir');
  }

  getFiles(path: string, progressId?: string): Observable<UploadFile[]> {
    progressId = progressId === undefined || progressId === null ? "" : progressId
    return this.http.get<UploadFile[]>(ServerUrl.rootUrl + '/api/preProduction/getFiles?dir_path=' + path + '&progress_id=' + progressId);
  }

  delete(path: string): Observable<boolean> {
    return this.http.delete<boolean>(ServerUrl.rootUrl + '/api/preProduction/delete/' + path);
  }

  deleteFile(file: UploadFile): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/preProduction/deleteFile', file);
  }

  transferFolderData(dir: UploadDirStructure): Observable<UploadDirStructure> {
    return this.http.post<UploadDirStructure>(ServerUrl.rootUrl + '/api/preProduction/transferFolderData', dir);
  }

}
