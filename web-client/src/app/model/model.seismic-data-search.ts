export class SeismicDataSearch {
    public searchParms = {
      "filename" : '',
      "network" : '',
      "station" :  '',
      "channel" : '',
      "startTime" : '',
      "stopTime" : '',
      "page" : null,
      "perPage" : null
    };
  
    constructor() {
      this.searchParms.perPage = 1000;
      this.searchParms.page = 1;
    };
}