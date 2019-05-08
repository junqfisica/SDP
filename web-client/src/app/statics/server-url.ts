export class ServerUrl {
    private static API_URL = 'http://localhost:5000';

    static get rootUrl(): string {
        return this.API_URL;
    }
}