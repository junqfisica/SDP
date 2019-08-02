import { Equipments } from './model.equipments';

export class Channel {
    id: string = null;
    station_id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    depth: number;
    azimuth: number;
    dip: number;
    gain: string;
    sample_rate: number;
    dl_no: string;
    sensor_number: string;
    start_time: string;
    stop_time: string;
    equipments: Equipments[];
    number_of_files: number;

    // setup instanceOf check that. Assumes that anything with these atributtes is a Channel.
    static [Symbol.hasInstance](obj: Channel) {
        if (obj.id && obj.station_id && obj.equipments && obj.start_time) return true;
    }

}