import {AfterViewInit, Component, NgZone, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { MapComponent as MapboxComponent } from 'ngx-mapbox-gl';
import {SidenavService} from '../../services/sidenav.service';
import {AnySourceData, Map} from 'mapbox-gl';
import {GeoJSON} from 'geojson';
import {CdkDragDrop} from '@angular/cdk/typings/drag-drop';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import * as turf from '@turf/turf';
// @ts-ignore
import MapboxDraw = require('@mapbox/mapbox-gl-draw');
import {DialogComponent} from '../dialog/dialog.component';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit {

  @ViewChild('map', {static: false})
  mapComponent: MapboxComponent;

  private map: Map;

  // @ts-ignore
  private mapDraw: any = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
    }
  });

  public isMapLoaded = false;

  public data: GeoJSON.FeatureCollection<GeoJSON.Geometry> = null;

  public dataLayers = [
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

  public mapLayers = [
    {
      name: 'Cluster',
      id: 'plastic-clusters',
      visible: true,
      layers: ['cluster-count']
    },
    {
      name: 'Heatmap',
      id: 'plastic-heat',
      visible: true,
      layers: []
    },
    {
      name: 'Points',
      id: 'plastic-points',
      visible: true,
      layers: []
    }
  ];

  public selectedProperty = 'CD4____KM_';

  constructor(
      private http: HttpClient,
      private sidenav: SidenavService,
      private dialog: MatDialog,
      private zone: NgZone
  ) {
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
    this.map = map;

    map.addControl(this.mapDraw);

    map.on('draw.create', (e) => this.updatePolygon(e));
    map.on('draw.update', (e) => this.updatePolygon(e));
    map.on('draw.delete', (e) => this.updatePolygon(e));

    map.addSource('points', {
      data: this.data,
      type: 'geojson',
    });

    map.addSource('points-cluster', {
      data: this.data,
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: 7, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      clusterProperties: {
        CD1____KM_: ['+', ['ceil', ['get', 'CD1____KM_']]],
        CD2____KM_: ['+', ['ceil', ['get', 'CD2____KM_']]],
        CD3____KM_: ['+', ['ceil', ['get', 'CD3____KM_']]],
        CD4____KM_: ['+', ['ceil', ['get', 'CD4____KM_']]],
      }
    } as AnySourceData);

    map.addLayer({
      id: 'plastic-points',
      source: 'points',
      type: 'circle',
    });

    this.updatePlasticPointsPaint();

    map.addLayer({
      id: 'plastic-heat',
      type: 'heatmap',
      source: 'points',
      maxzoom: 4,
      layout: {
        visibility: 'visible',
      }
    });

    this.updatePlasticHeatPaint();

    map.addLayer({
      id: 'plastic-clusters',
      type: 'circle',
      source: 'points-cluster',
      filter: ['has', 'point_count']
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'points-cluster',
      filter: ['has', 'point_count'],
      layout: {
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    });

    this.updatePlasticClusterPaint();

    this.updateFilters();

    this.isMapLoaded = true;
  }

  selectLayer(property: string) {
    this.selectedProperty = property;

    this.updatePlasticPointsPaint();
    this.updatePlasticHeatPaint();
    this.updatePlasticClusterPaint();

    this.updateFilters();
  }

  updateFilters() {
    this.mapLayers.forEach(layer => {
      [layer.id, ...layer.layers].forEach(l => {
        this.map.setFilter(l, ['>', ['get', this.selectedProperty], 0]);
      });
    });
  }

  private updatePlasticPointsPaint() {
    this.map.setPaintProperty('plastic-points', 'circle-radius', [
      'interpolate',
      ['linear'],
      ['get', this.selectedProperty],
      0, 3,
      100, 3,
      100000, 10,
    ]);
    this.map.setPaintProperty('plastic-points', 'circle-color', '#784fa8');
  }

  private updatePlasticHeatPaint() {
    this.map.setPaintProperty('plastic-heat', 'heatmap-weight', [
      'interpolate',
      ['linear'],
      ['get', this.selectedProperty],
      0, 0,
      100, 0.2,
      100000, 1,
    ]);
    this.map.setPaintProperty('plastic-heat', 'heatmap-color', [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0,0,0,0)',
      0.2, '#35a800',
      0.4, '#8bd101',
      0.6, '#ffff00',
      0.8, '#ff7f00',
      1, '#ff0100',
    ]);
  }

  private updatePlasticClusterPaint() {
    this.map.setPaintProperty('plastic-clusters', 'circle-color', [
      'interpolate',
      ['linear'],
      ['get', this.selectedProperty],
      0, '#d8f8ff',
      2000000, '#203dff',
    ]);
    this.map.setPaintProperty('plastic-clusters', 'circle-radius', [
      'interpolate',
      ['linear'],
      ['get', this.selectedProperty],
      0, 10,
      1000000, 50,
    ]);

    this.map.setLayoutProperty('cluster-count', 'text-field', `{${this.selectedProperty}}`);
  }

  private updatePolygon(e: any) {
    if (this.mapDraw.getAll().features.length > 0) {
      const multiPoly = turf.multiPolygon(this.mapDraw.getAll().features.map(f => {
        return f.geometry.coordinates;
      }));

      const data = this.data.features.filter(f => {
        return turf.inside(f as turf.Coord, multiPoly);
      });

      this.zone.run(() => {
        this.dialog.open(DialogComponent, {
          data,
          panelClass: 'map-dialog',
          height: '80vh',
          width: '60vw',
        }).beforeClosed().subscribe(() => {
          setTimeout(() => {
            this.mapDraw.deleteAll();
          });
        });
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.mapLayers, event.previousIndex, event.currentIndex);
    // this.mapLayers;
    for (let i = 1; i < this.mapLayers.length; i++) {
      this.map.moveLayer(this.mapLayers[i].id, this.mapLayers[i - 1].id);
    }
  }

  changeVisibility(event: MatCheckboxChange, layer: { visible: boolean; name: string; id: string, layers: string[] }) {
    layer.visible = event.checked;
    [layer.id, ...layer.layers].forEach(layerId => {
      this.map.setLayoutProperty(layerId, 'visibility', layer.visible ? 'visible' : 'none');
    });
  }
}
