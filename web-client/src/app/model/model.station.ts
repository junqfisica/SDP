export class Station {
    id: string = null;
    network_id: string;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    depth: number;
    creation_date: Date;
    removal_date: Date;
    public_data: boolean;
    site: string;
    geology: string;
    province: string;
    country: string;
}