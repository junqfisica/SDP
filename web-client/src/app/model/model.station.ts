import { Channel } from './model.channel';

export class Station {
    id: string = null;
    network_id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    depth: number;
    creation_date: string;
    removal_date: string;
    public_data: boolean;
    site: string;
    geology: string;
    province: string;
    country: string;
    channels: Channel[];

    // setup instanceOf check that. Assumes that anything with these atributtes is a Station.
    static [Symbol.hasInstance](obj: Station) {
        if (obj.id && obj.network_id && obj.channels && obj.creation_date) return true;
    }
}