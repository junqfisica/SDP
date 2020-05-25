import { Channel } from './model.channel';


export class LocationModel {
    id: string = null;
    station_id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    depth: number;
    channels: Channel[];

    // setup instanceOf check that. Assumes that anything with these atributtes is a Station.
    static [Symbol.hasInstance](obj: LocationModel) {
        if (obj.id && obj.station_id && obj.channels) return true;
    }
}