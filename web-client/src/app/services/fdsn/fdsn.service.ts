import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServerUrl } from '../../statics/server-url';
import { Network } from '../../model/model.network';
import { EquipmentType } from '../../model/model.equipmentTypes';
import { Equipments } from '../../model/model.equipments';
import { Location } from '../../model/model.location';
import { Station } from '../../model/model.station';
import { Channel } from '../../model/model.channel';

@Injectable()
export class FdsnService {

  constructor(private http: HttpClient) { }

  createNetwork(network: Network): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/createNetwork', network);
  }

  createEquipment(eq: Equipments): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/createEquipment', eq);
  }

  createStation(st: Station): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/createStation', st);
  }

  createChannel(ch: Channel): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/createChannel', ch);
  }

  getStation(id: string): Observable<Station>{
    return this.http.get<Station>(ServerUrl.rootUrl + '/api/fdsn/getStation?station_id=' + id);
  }

  isNetworkTaken(id: string): Observable<boolean>{
    return this.http.get<boolean>(ServerUrl.rootUrl + '/api/fdsn/networkIsTaken/' + id);
  }

  getNetworks(): Observable<Network[]>{
    return this.http.get<Network[]>(ServerUrl.rootUrl + '/api/fdsn/getNetworks');
  }

  getEquipmentTypes(): Observable<EquipmentType[]>{
    return this.http.get<EquipmentType[]>(ServerUrl.rootUrl + '/api/fdsn/getEquipmentsTypes');
  }
  
  getLocation(lat: number, long: number): Observable<Location>{
    return this.http.get<Location>(ServerUrl.rootUrl + '/api/fdsn/getLocation?lat=' + lat + '&long=' + long);
  }

  getNRLManufacturers(instrumentType: string): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getNRLManufacturers?instrument_type=' + instrumentType);
  }

  getNRLInstrument(instrumentType: string, manufactory: string): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getNRLInstrument?instrument_type=' + 
      instrumentType + '&manufactory=' + manufactory);
  }

  getDataloggers(): Observable<Equipments[]>{
    return this.http.get<Equipments[]>(ServerUrl.rootUrl + '/api/fdsn/getDataloggers');
  }

  getSensors(): Observable<Equipments[]>{
    return this.http.get<Equipments[]>(ServerUrl.rootUrl + '/api/fdsn/getSensors');
  }

  getGains(manufactory, instrument): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getGains?manufactory=' + manufactory + '&instrument=' + instrument);
  }

  getSampleRates(manufactory, instrument, gain): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getSampleRates?manufactory=' + 
      manufactory + '&instrument=' + instrument + '&gain=' + gain);
  }

}
