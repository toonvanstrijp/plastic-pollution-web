import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent {

  public data = null;

  public layers = [
    {
      name: 'over 200mm',
      property: 'CD4____KM_',
    },
    {
      name: '4.76 - 200 mm',
      property: 'CD3____KM_',
    },
    {
      name: '1.01 - 4.75 mm',
      property: 'CD2____KM_',
    },
    {
      name: '0.33 - 1.00 mm',
      property: 'CD1____KM_',
    }
  ];

  public selectedProperty = 'CD4____KM_';

  constructor(private http: HttpClient) {
    this.http.get('/assets/0.json').subscribe(res => {
      this.data = res;
      console.log(this.data);
    });
  }

}
