import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ServerUrl } from '../../statics/server-url';
import { Network } from '../../model/model.network';
import { EquipmentType } from '../../model/model.equipmentTypes';
import { Equipments } from '../../model/model.equipments';
import { Location } from '../../model/model.location';
import { Station } from '../../model/model.station';
import { Channel } from '../../model/model.channel';
import { SearchResult } from '../../model/model.search-result';

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

  updateStation(st: Station): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/updateStation', st);
  }

  updateChannel(ch: Channel): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/updateChannel', ch);
  }

  createChannel(ch: Channel): Observable<boolean> {
    return this.http.post<boolean>(ServerUrl.rootUrl + '/api/fdsn/createChannel', ch);
  }

  getStation(id: string): Observable<Station>{
    return this.http.get<Station>(ServerUrl.rootUrl + '/api/fdsn/getStation?station_id=' + id);
  }

  getChannel(id: string): Observable<Channel>{
    return this.http.get<Channel>(ServerUrl.rootUrl + '/api/fdsn/getChannel?channel_id=' + id);
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

  getGains(manufactory: string, instrument: string): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getGains?manufactory=' + manufactory + '&instrument=' + instrument);
  }

  getSensorExtraInfo(manufactory: string, instrument: string): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getSensorExtraInfo?manufactory=' + manufactory + '&instrument=' + instrument);
  }

  getSampleRates(manufactory: string, instrument: string, gain: string): Observable<string[]>{
    return this.http.get<string[]>(ServerUrl.rootUrl + '/api/fdsn/getSampleRates?manufactory=' + 
      manufactory + '&instrument=' + instrument + '&gain=' + gain);
  }

  searchStations(params: HttpParams): Observable<SearchResult<Station>> {
    return this.http.get<SearchResult<Station>>(ServerUrl.rootUrl + '/api/fdsn/searchStations', { params });
  }

  searchChannels(params: HttpParams): Observable<SearchResult<Channel>> {
    return this.http.get<SearchResult<Channel>>(ServerUrl.rootUrl + '/api/fdsn/searchChannels', { params });
  }

  deleteStation(station: Station): Observable<boolean> {
    return this.http.delete<boolean>(ServerUrl.rootUrl + '/api/fdsn/deleteStation/' + station.id);
  }

  deleteChannel(channel: Channel): Observable<boolean> {
    return this.http.delete<boolean>(ServerUrl.rootUrl + '/api/fdsn/deleteChannel/' + channel.id);
  }

}
