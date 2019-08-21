export class ServerUrl {
    private static API_URL = 'http://localhost:5000';
    // private static API_URL = 'http://141.89.111.115'

    static get rootUrl(): string {
        return this.API_URL;
    }
}