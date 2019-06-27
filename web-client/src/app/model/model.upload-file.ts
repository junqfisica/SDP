export class UploadFile {
    id: string = null;
    file_path: string;
    file_name: string;
    ch: string;
    start_time: string;
    end_time: string;
    isOverlap: boolean = null;

    // setup instanceOf check that. Assumes that anything with these atributtes is a UploadFile.
    static [Symbol.hasInstance](obj: UploadFile) {
        if (obj.file_path && obj.file_name && obj.start_time && obj.end_time) return true;
    }
}