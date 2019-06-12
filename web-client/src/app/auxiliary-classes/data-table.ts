import { GoogleChartComponent } from 'ng2-google-charts';

interface IColStruct  {
    id: string
    label: string
    type: string
}

interface IRowStruct  {
    c:  {}
}

export class DataTable {

    private cols: IColStruct[] = [];
    private rows: IRowStruct[] = [];
    
    constructor(){}

    public addRow(listValues: any[]){
        const c = []
        listValues.forEach (value => {
          c.push({ v: value });
        });
        
        this.rows.push({c});
    }

    public addColumn(id: string, type: string, label?: string) {
        const col: IColStruct = {
            id: id,
            label: label,
            type: type
        };
        this.cols.push(col);
    }

    static reDrawGoogleChart(googleChart: GoogleChartComponent): void {
        if (googleChart) {
            if (googleChart.wrapper) {
              googleChart.draw();
            };
        };
    };
}