import { SafeUrl } from '@angular/platform-browser';

export class StationInfoFile {
    id: string = null;
    filename: string;
    relative_path: string;
    target_folder_id: string;
    station_id: string;
    folder_path: string;
    url: SafeUrl;

}