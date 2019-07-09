import { FileTransferred } from './model.file-transferred';

export class SeismicData {
    id: string = null;
    filename: string;
    relative_path: string;
    target_folder_id: string;
    start_time: string;
    stop_time: string;
    channel_id: string;
    folder_path: string;
    files: FileTransferred[];

    // setup instanceOf check that. Assumes that anything with these atributtes is a Channel.
    static [Symbol.hasInstance](obj: SeismicData) {
        if (obj.id && obj.channel_id && obj.target_folder_id && obj.start_time) return true;
    }

}