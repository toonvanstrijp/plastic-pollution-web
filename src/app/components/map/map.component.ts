import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MapComponent as MapboxComponent } from 'ngx-mapbox-gl';
import {SidenavService} from '../../services/sidenav.service';
import {Map} from 'mapbox-gl';
import {GeoJSON} from 'geojson';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map', {static: false})
  mapComponent: MapboxComponent;

  public data: GeoJSON.FeatureCollection<GeoJSON.Geometry> = null;

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

  public selectedProperty = 'CD1____KM_';

  constructor(private http: HttpClient, private sidenav: SidenavService) {
    this.http.get('/assets/0.json').subscribe(res => {
      this.data = res as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    });
  }

  ngAfterViewInit() {
    this.sidenav.sidebarOpened$.subscribe(() => {
      if (this.mapComponent.mapInstance) {
        this.mapComponent.mapInstance.resize();
      }
    });
  }

  mapLoaded(map: Map) {
    // <mgl-geojson-source
    // id="points"
    //     [data]="data"
    //     >
    //     </mgl-geojson-source>

    map.addSource('points', {data: this.data, type: 'geojson'});

    map.addLayer({
      id: 'plastic-points',
      source: 'points',
      type: 'circle',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', this.selectedProperty],
          0, 3,
          100, 3,
          100000, 10,
        ],
        'circle-color': [
          'step',
          ['get', this.selectedProperty],
          '#35a800',
          100,
          '#8bd101',
          1000,
          '#ffff00',
          10000,
          '#ff7f00',
          100000,
          '#ff0100'
        ]
      }
    });

    map.addLayer({
      id: 'plastic-heat',
      type: 'heatmap',
      source: 'points',
      maxzoom: 10,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', this.selectedProperty],
          0, 0,
          100, 0.2,
          100000, 1,
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,0,0)',
          0.2, '#35a800',
          0.4, '#8bd101',
          0.6, '#ffff00',
          0.8, '#ff7f00',
          1, '#ff0100',
        ],
      },
      layout: {
        visibility: 'visible'
      }
    });
  }
}
