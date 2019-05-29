import { Equipments } from './model.equipments';

export class Channel {
    id: string = null;
    station_id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    depth: number;
    gain: string;
    sample_rate:number;
    dl_no: string;
    sensor_number: string;
    start_time: string;
    stop_time: string;
    equipments: Equipments[];

}