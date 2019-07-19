import { FileTransferResult } from './model.file-transfer-result';

export class UploadDirStructure {
    path: string;
    number_of_mseed_files: number;
    progressId = null;
    isTransfering = false;
    channel_id = null;
    transferResults: FileTransferResult[];
    status: string;
}