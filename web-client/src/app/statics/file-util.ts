export class FileUtil {

    static getFileExtension(fileName: string): string {
        return fileName.split('.').pop();
    }
}