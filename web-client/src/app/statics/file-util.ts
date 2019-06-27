export class FileUtil {

    static getFileExtension(fileName: string): string {
        return fileName.split('.').pop();
    }

    static formatPath(path: string){
        const paths = path.split("/");
        let formatPath = paths.shift();
        if (formatPath === ""){
            formatPath = paths.shift() // removes second time when formmatPath is still blank.
        }
        for (let value of paths) {
            formatPath += "." + value;
        }
        return formatPath;
    }
}