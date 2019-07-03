import { FileTransferResult } from './model.file-transfer-result';

export class UploadDirStructure {
    path: string;
    number_of_mseed_files: number;
    channel_id = null;
    isTransfering = false;
    transferResults: FileTransferResult[];
    status: string;
}