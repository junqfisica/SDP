export class TargetFolder {
    id: string;
    path: string;
    active: boolean;
    online: boolean;
    diskInfo: number[]; // 0 - total, 1 - used, 2 - free
    editPath: string = null;
}